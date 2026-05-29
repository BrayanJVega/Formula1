import { describe, it, expect } from 'vitest';
import { SCORING_DEFAULT } from '../../server/src/shared/constants.js';

describe('Scoring Configuration', () => {
  it('should have POLE default of 10', () => {
    expect(SCORING_DEFAULT.POLE).toBe(10);
  });

  it('should have WINNER default of 25', () => {
    expect(SCORING_DEFAULT.WINNER).toBe(25);
  });

  it('should have PODIUM_EXACT default of 50', () => {
    expect(SCORING_DEFAULT.PODIUM_EXACT).toBe(50);
  });

  it('should have TOP10_EXACT default of 100', () => {
    expect(SCORING_DEFAULT.TOP10_EXACT).toBe(100);
  });

  it('should have FASTEST_LAP default of 15', () => {
    expect(SCORING_DEFAULT.FASTEST_LAP).toBe(15);
  });

  it('should have SAFETY_CAR default of 10', () => {
    expect(SCORING_DEFAULT.SAFETY_CAR).toBe(10);
  });

  it('should have RED_FLAG default of 10', () => {
    expect(SCORING_DEFAULT.RED_FLAG).toBe(10);
  });

  it('should have DNF_RANGE default of 15', () => {
    expect(SCORING_DEFAULT.DNF_RANGE).toBe(15);
  });

  it('should have WINNER_TOP3 default of 10', () => {
    expect(SCORING_DEFAULT.WINNER_TOP3).toBe(10);
  });

  it('should have PODIUM_ANY default of 5', () => {
    expect(SCORING_DEFAULT.PODIUM_ANY).toBe(5);
  });

  it('should have TOP10_ANY default of 3', () => {
    expect(SCORING_DEFAULT.TOP10_ANY).toBe(3);
  });

  it('should contain all required scoring keys', () => {
    const requiredKeys = [
      'POLE',
      'WINNER',
      'PODIUM_EXACT',
      'TOP10_EXACT',
      'FASTEST_LAP',
      'SAFETY_CAR',
      'RED_FLAG',
      'DNF_RANGE',
      'WINNER_TOP3',
      'PODIUM_ANY',
      'TOP10_ANY',
    ];
    for (const key of requiredKeys) {
      expect(SCORING_DEFAULT).toHaveProperty(key);
    }
  });

  it('should have all values as positive numbers', () => {
    const values = Object.values(SCORING_DEFAULT);
    for (const value of values) {
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThan(0);
    }
  });

  describe('scoring combinations', () => {
    it('max qualifying score should be POLE + PODIUM_EXACT + TOP10_EXACT', () => {
      const maxQualifying = SCORING_DEFAULT.POLE + SCORING_DEFAULT.PODIUM_EXACT + SCORING_DEFAULT.TOP10_EXACT;
      expect(maxQualifying).toBe(160);
    });

    it('max race score should be WINNER + PODIUM_EXACT + FASTEST_LAP + SAFETY_CAR + RED_FLAG + DNF_RANGE', () => {
      const maxRace = SCORING_DEFAULT.WINNER + SCORING_DEFAULT.PODIUM_EXACT + SCORING_DEFAULT.FASTEST_LAP + SCORING_DEFAULT.SAFETY_CAR + SCORING_DEFAULT.RED_FLAG + SCORING_DEFAULT.DNF_RANGE;
      expect(maxRace).toBe(125);
    });

    it('TOP10_EXACT should be greater than sum of TOP10_ANY for 10 drivers', () => {
      const top10AnyTotal = SCORING_DEFAULT.TOP10_ANY * 10;
      expect(SCORING_DEFAULT.TOP10_EXACT).toBeGreaterThan(top10AnyTotal);
    });

    it('PODIUM_EXACT should be greater than sum of PODIUM_ANY for 3 drivers', () => {
      const podiumAnyTotal = SCORING_DEFAULT.PODIUM_ANY * 3;
      expect(SCORING_DEFAULT.PODIUM_EXACT).toBeGreaterThan(podiumAnyTotal);
    });

    it('WINNER should be greater than WINNER_TOP3', () => {
      expect(SCORING_DEFAULT.WINNER).toBeGreaterThan(SCORING_DEFAULT.WINNER_TOP3);
    });
  });
});
