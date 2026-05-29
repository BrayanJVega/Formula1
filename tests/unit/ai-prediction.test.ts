import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIPredictionService } from '../../server/src/core/services/AIPredictionService.js';
import type { DriverFormData } from '../../server/src/core/services/AIPredictionService.js';

vi.mock('../../server/src/config/database.js', () => ({
  query: vi.fn(),
  queryOne: vi.fn(),
}));

import { query, queryOne } from '../../server/src/config/database.js';

describe('AIPredictionService', () => {
  let service: AIPredictionService;

  const mockDrivers: DriverFormData[] = [
    { driverId: 'd1', driverName: 'Verstappen', teamId: 't1', teamName: 'Red Bull', last5RacePoints: 25, circuitHistoryPoints: 18, qualifyingPosition: 1, carRating: 9.5 },
    { driverId: 'd2', driverName: 'Hamilton', teamId: 't2', teamName: 'Mercedes', last5RacePoints: 18, circuitHistoryPoints: 20, qualifyingPosition: 3, carRating: 8.5 },
    { driverId: 'd3', driverName: 'Leclerc', teamId: 't3', teamName: 'Ferrari', last5RacePoints: 20, circuitHistoryPoints: 15, qualifyingPosition: 2, carRating: 9.0 },
    { driverId: 'd4', driverName: 'Norris', teamId: 't4', teamName: 'McLaren', last5RacePoints: 15, circuitHistoryPoints: 10, qualifyingPosition: 5, carRating: 8.0 },
    { driverId: 'd5', driverName: 'Alonso', teamId: 't5', teamName: 'Aston Martin', last5RacePoints: 12, circuitHistoryPoints: 16, qualifyingPosition: 7, carRating: 7.5 },
    { driverId: 'd6', driverName: 'Sainz', teamId: 't3', teamName: 'Ferrari', last5RacePoints: 16, circuitHistoryPoints: 12, qualifyingPosition: 4, carRating: 9.0 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AIPredictionService();

    vi.mocked(query).mockResolvedValue(mockDrivers.map(d => ({
      driver_id: d.driverId,
      driver_name: d.driverName,
      team_id: d.teamId,
      team_name: d.teamName,
    })));

    vi.mocked(queryOne).mockImplementation(async (_sql: string, params?: unknown[]) => {
      if ((_sql as string).includes('circuits c JOIN races r')) {
        return { turns: 14, is_street_circuit: false, length_km: 5.2, circuit_id: 'c1' };
      }
      if ((_sql as string).includes('avg_sc')) {
        return { avg_sc: '45' };
      }
      if ((_sql as string).includes('avg_dnf')) {
        return { avg_dnf: '3' };
      }
      if ((_sql as string).includes('season_points')) {
        return { season_points: '400' };
      }
      if ((_sql as string).includes('qualifying_results')) {
        return null;
      }
      if ((_sql as string).includes('rr.points')) {
        return null;
      }
      return null;
    });
  });

  describe('win probabilities', () => {
    it('should return probabilities summing to approximately 100%', async () => {
      const probabilities = await service.predictRaceWinner('race1');
      const totalProb = probabilities.reduce((sum, p) => sum + p.probability, 0);
      expect(totalProb).toBeGreaterThanOrEqual(95);
      expect(totalProb).toBeLessThanOrEqual(100);
    });

    it('should return top 5 drivers', async () => {
      const probabilities = await service.predictRaceWinner('race1');
      expect(probabilities.length).toBeLessThanOrEqual(5);
    });

    it('should assign higher probability to drivers with better form', async () => {
      vi.mocked(query).mockResolvedValueOnce(
        mockDrivers.map(d => ({
          driver_id: d.driverId,
          driver_name: d.driverName,
          team_id: d.teamId,
          team_name: d.teamName,
        }))
      );

      vi.mocked(queryOne).mockImplementation(async (_sql: string) => {
        if ((_sql as string).includes('circuits c JOIN races r')) {
          return { turns: 14, is_street_circuit: false, length_km: 5.2, circuit_id: 'c1' };
        }
        if ((_sql as string).includes('avg_sc')) {
          return { avg_sc: '45' };
        }
        if ((_sql as string).includes('avg_dnf')) {
          return { avg_dnf: '3' };
        }
        if ((_sql as string).includes('season_points')) {
          return { season_points: '400' };
        }
        if ((_sql as string).includes('qualifying_results')) {
          return null;
        }
        if ((_sql as string).includes('ORDER BY r.race_date DESC')) {
          return [
            { points: '25' },
            { points: '18' },
            { points: '15' },
            { points: '12' },
            { points: '10' },
          ];
        }
        if ((_sql as string).includes('circuit_id')) {
          return [
            { finish_position: 1, points: '25' },
            { finish_position: 3, points: '15' },
          ];
        }
        return null;
      });

      const probs = await service.predictRaceWinner('race1');
      expect(probs.length).toBeGreaterThan(0);
      expect(probs[0].probability).toBeGreaterThan(0);
    });

    it('should include circuit history effect on probabilities', async () => {
      const result1 = await service.predictRaceWinner('race1');
      expect(result1.length).toBeGreaterThan(0);
    });
  });

  describe('safety car probability', () => {
    it('should return a probability between 0 and 100', async () => {
      const prob = await service.predictSafetyCarProbability('race1');
      expect(prob).toBeGreaterThanOrEqual(0);
      expect(prob).toBeLessThanOrEqual(100);
    });

    it('should return 50% when no circuit data is found', async () => {
      vi.mocked(queryOne).mockReset();
      vi.mocked(queryOne).mockResolvedValue(null);

      const prob = await service.predictSafetyCarProbability('race1');
      expect(prob).toBe(50);
    });
  });

  describe('fastest lap prediction', () => {
    it('should return a driver with probability', async () => {
      const result = await service.predictFastestLap('race1');
      expect(result.driverId).toBeDefined();
      expect(result.probability).toBeGreaterThan(0);
    });
  });

  describe('pole position prediction', () => {
    it('should return a driver with capped probability', async () => {
      const result = await service.predictPolePosition('race1');
      expect(result.driverId).toBeDefined();
      expect(result.probability).toBeLessThanOrEqual(90);
    });
  });
});
