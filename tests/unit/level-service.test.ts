import { describe, it, expect } from 'vitest';
import { LevelService } from '../../server/src/core/services/LevelService.js';

describe('LevelService', () => {
  const service = new LevelService();

  describe('calculateLevel', () => {
    it('should return Rookie at 0 XP', () => {
      const level = service.calculateLevel(0);
      expect(level.levelNumber).toBe(1);
      expect(level.name).toBe('Rookie');
    });

    it('should return Rookie II at 50 XP', () => {
      const level = service.calculateLevel(50);
      expect(level.levelNumber).toBe(2);
      expect(level.name).toBe('Rookie II');
    });

    it('should return Rookie III at 100 XP', () => {
      const level = service.calculateLevel(100);
      expect(level.levelNumber).toBe(3);
      expect(level.name).toBe('Rookie III');
    });

    it('should return Amateur at 200 XP', () => {
      const level = service.calculateLevel(200);
      expect(level.levelNumber).toBe(4);
      expect(level.name).toBe('Amateur');
    });

    it('should return Amateur II at 350 XP', () => {
      const level = service.calculateLevel(350);
      expect(level.levelNumber).toBe(5);
      expect(level.name).toBe('Amateur II');
    });

    it('should return Amateur III at 500 XP', () => {
      const level = service.calculateLevel(500);
      expect(level.levelNumber).toBe(6);
      expect(level.name).toBe('Amateur III');
    });

    it('should return Professional at 750 XP', () => {
      const level = service.calculateLevel(750);
      expect(level.levelNumber).toBe(7);
      expect(level.name).toBe('Professional');
    });

    it('should return Professional II at 1000 XP', () => {
      const level = service.calculateLevel(1000);
      expect(level.levelNumber).toBe(8);
      expect(level.name).toBe('Professional II');
    });

    it('should return Professional III at 1500 XP', () => {
      const level = service.calculateLevel(1500);
      expect(level.levelNumber).toBe(9);
      expect(level.name).toBe('Professional III');
    });

    it('should return Elite at 2000 XP', () => {
      const level = service.calculateLevel(2000);
      expect(level.levelNumber).toBe(10);
      expect(level.name).toBe('Elite');
    });

    it('should return Elite II at 3000 XP', () => {
      const level = service.calculateLevel(3000);
      expect(level.levelNumber).toBe(11);
      expect(level.name).toBe('Elite II');
    });

    it('should return Elite III at 4500 XP', () => {
      const level = service.calculateLevel(4500);
      expect(level.levelNumber).toBe(12);
      expect(level.name).toBe('Elite III');
    });

    it('should return Legend at 6000 XP', () => {
      const level = service.calculateLevel(6000);
      expect(level.levelNumber).toBe(13);
      expect(level.name).toBe('Legend');
    });

    it('should stay at Legend above 6000 XP', () => {
      const level = service.calculateLevel(99999);
      expect(level.levelNumber).toBe(13);
      expect(level.name).toBe('Legend');
    });
  });

  describe('getLevelProgress', () => {
    it('should return 0% exactly at threshold', () => {
      const progress = service.getLevelProgress(0, 1);
      expect(progress).toBe(0);
    });

    it('should return 100% at max threshold', () => {
      const progress = service.getLevelProgress(50, 1);
      expect(progress).toBe(100);
    });

    it('should return 50% halfway through a level', () => {
      const progress = service.getLevelProgress(75, 2);
      expect(progress).toBe(50);
    });

    it('should return 100% for max level', () => {
      const progress = service.getLevelProgress(10000, 13);
      expect(progress).toBe(100);
    });
  });

  describe('level-up detection', () => {
    it('should detect level up when crossing threshold (addXp logic)', () => {
      const level = service.calculateLevel(49);
      expect(level.levelNumber).toBe(1);

      const levelAfter = service.calculateLevel(50);
      expect(levelAfter.levelNumber).toBe(2);
    });

    it('should detect multi-level jump', () => {
      const level = service.calculateLevel(49);
      expect(level.levelNumber).toBe(1);

      const levelJump = service.calculateLevel(200);
      expect(levelJump.levelNumber).toBe(4);
    });
  });

  describe('XP accumulation', () => {
    it('should preserve XP level accuracy at boundaries', () => {
      const levels = [0, 49, 50, 99, 100, 199, 200, 349, 500, 750, 1000, 1500, 2000, 3000, 4500, 6000];
      const expected = [1, 1, 2, 2, 3, 3, 4, 4, 6, 7, 8, 9, 10, 11, 12, 13];

      levels.forEach((xp, i) => {
        const level = service.calculateLevel(xp);
        expect(level.levelNumber).toBe(expected[i]);
      });
    });
  });
});
