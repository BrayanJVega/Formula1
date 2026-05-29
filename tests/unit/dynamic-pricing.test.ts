import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DynamicPricingService } from '../../server/src/core/services/DynamicPricingService.js';
import type { FantasyRepository } from '../../server/src/infrastructure/persistence/repositories/FantasyRepository.js';

describe('DynamicPricingService', () => {
  let mockRepo: Partial<FantasyRepository>;
  let service: DynamicPricingService;

  beforeEach(() => {
    mockRepo = {
      getAllDriverMarketValues: vi.fn(),
      getDriverTotalScore: vi.fn(),
      upsertDriverMarketValue: vi.fn(),
    };
    service = new DynamicPricingService(mockRepo as FantasyRepository);
  });

  const mockMarketValue = (driverId: string, currentValue: number) => ({
    id: `${driverId}-mv`,
    driverId,
    seasonId: 'season1',
    currentValue,
    priceChange: 0,
    lastUpdated: new Date(),
  });

  describe('recalculatePrices', () => {
    it('should increase price after good performance (high points)', async () => {
      vi.mocked(mockRepo.getAllDriverMarketValues!).mockResolvedValue([
        mockMarketValue('d1', 10.0),
      ]);
      vi.mocked(mockRepo.getDriverTotalScore!).mockResolvedValue(200);

      const adjustments = await service.recalculatePrices('season1');
      expect(adjustments.length).toBe(1);
      expect(adjustments[0].newValue).toBeGreaterThan(adjustments[0].oldValue);
    });

    it('should decrease price after poor performance (low points)', async () => {
      vi.mocked(mockRepo.getAllDriverMarketValues!).mockResolvedValue([
        mockMarketValue('d1', 20.0),
      ]);
      vi.mocked(mockRepo.getDriverTotalScore!).mockResolvedValue(5);

      const adjustments = await service.recalculatePrices('season1');
      expect(adjustments[0].newValue).toBeLessThan(adjustments[0].oldValue);
    });

    it('should clamp price to minimum 5.0', async () => {
      vi.mocked(mockRepo.getAllDriverMarketValues!).mockResolvedValue([
        mockMarketValue('d1', 5.0),
      ]);
      vi.mocked(mockRepo.getDriverTotalScore!).mockResolvedValue(0);

      const adjustments = await service.recalculatePrices('season1');
      expect(adjustments[0].newValue).toBeGreaterThanOrEqual(5.0);
    });

    it('should clamp price to maximum 35.0', async () => {
      vi.mocked(mockRepo.getAllDriverMarketValues!).mockResolvedValue([
        mockMarketValue('d1', 30.0),
      ]);
      vi.mocked(mockRepo.getDriverTotalScore!).mockResolvedValue(500);

      const adjustments = await service.recalculatePrices('season1');
      expect(adjustments[0].newValue).toBeLessThanOrEqual(35.0);
    });

    it('should give higher price increase for higher points', async () => {
      vi.mocked(mockRepo.getAllDriverMarketValues!).mockResolvedValue([
        mockMarketValue('d1', 10.0),
        mockMarketValue('d2', 10.0),
      ]);

      vi.mocked(mockRepo.getDriverTotalScore!)
        .mockResolvedValueOnce(200)
        .mockResolvedValueOnce(50);

      const adjustments = await service.recalculatePrices('season1');
      const d1 = adjustments.find((a) => a.driverId === 'd1')!;
      const d2 = adjustments.find((a) => a.driverId === 'd2')!;
      expect(d1.newValue).toBeGreaterThan(d2.newValue);
    });

    it('should round price to 1 decimal place', async () => {
      vi.mocked(mockRepo.getAllDriverMarketValues!).mockResolvedValue([
        mockMarketValue('d1', 10.0),
      ]);
      vi.mocked(mockRepo.getDriverTotalScore!).mockResolvedValue(100);

      const adjustments = await service.recalculatePrices('season1');
      const decimalParts = adjustments[0].newValue.toString().split('.');
      if (decimalParts.length > 1) {
        expect(decimalParts[1].length).toBeLessThanOrEqual(1);
      }
    });

    it('should upsert each driver market value', async () => {
      vi.mocked(mockRepo.getAllDriverMarketValues!).mockResolvedValue([
        mockMarketValue('d1', 10.0),
        mockMarketValue('d2', 15.0),
      ]);
      vi.mocked(mockRepo.getDriverTotalScore!).mockResolvedValue(100);

      await service.recalculatePrices('season1');
      expect(mockRepo.upsertDriverMarketValue).toHaveBeenCalledTimes(2);
    });
  });

  describe('initializeDriverValues', () => {
    it('should initialize driver value to 10.0 with 0 price change', async () => {
      await service.initializeDriverValues('d1', 'season1');
      expect(mockRepo.upsertDriverMarketValue).toHaveBeenCalledWith('d1', 'season1', 10.0, 0);
    });
  });
});
