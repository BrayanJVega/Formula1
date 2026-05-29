import { FantasyRepository } from '../../infrastructure/persistence/repositories/FantasyRepository.js';

const MIN_VALUE = 5.0;
const MAX_VALUE = 35.0;
const PRICE_CHANGE_RATE = 0.15;
const MARKET_FACTOR = 0.05;

export interface PriceAdjustment {
  driverId: string;
  oldValue: number;
  newValue: number;
  priceChange: number;
}

export class DynamicPricingService {
  constructor(private readonly fantasyRepository: FantasyRepository) {}

  async recalculatePrices(seasonId: string): Promise<PriceAdjustment[]> {
    const marketValues = await this.fantasyRepository.getAllDriverMarketValues(seasonId);
    const adjustments: PriceAdjustment[] = [];

    for (const mv of marketValues) {
      const totalPoints = await this.fantasyRepository.getDriverTotalScore(mv.driverId, seasonId);
      const popularity = 0.5;

      const adjustment = (totalPoints * PRICE_CHANGE_RATE) + (popularity * MARKET_FACTOR);
      let newValue = mv.currentValue + adjustment;

      newValue = Math.max(MIN_VALUE, Math.min(MAX_VALUE, newValue));
      newValue = Math.round(newValue * 10) / 10;

      const priceChange = Math.round((newValue - mv.currentValue) * 10) / 10;

      await this.fantasyRepository.upsertDriverMarketValue(
        mv.driverId, seasonId, newValue, priceChange,
      );

      adjustments.push({
        driverId: mv.driverId,
        oldValue: mv.currentValue,
        newValue,
        priceChange,
      });
    }

    return adjustments;
  }

  async initializeDriverValues(driverId: string, seasonId: string): Promise<void> {
    await this.fantasyRepository.upsertDriverMarketValue(driverId, seasonId, 10.0, 0);
  }
}
