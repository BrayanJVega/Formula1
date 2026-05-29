import { describe, it, expect } from 'vitest';
import { ScoringEngine } from '../../server/src/core/services/ScoringEngine.js';
import { Prediction } from '../../server/src/core/entities/Prediction.js';
import type { QualifyingResults, RaceResults } from '../../server/src/core/services/ScoringEngine.js';

describe('ScoringEngine', () => {
  const engine = new ScoringEngine();

  describe('calculateRaceScore', () => {
    it('should award 25 points for correct winner prediction', () => {
      const prediction = new Prediction({
        userId: 'user1',
        raceId: 'race1',
        type: 'race',
        winnerPrediction: 'driver1',
        podiumPrediction: ['driver1', 'driver2', 'driver3'],
        fastestLapPrediction: 'driver2',
        safetyCarPrediction: false,
      });

      const results: RaceResults = {
        winnerId: 'driver1',
        podiumIds: ['driver1', 'driver2', 'driver3'],
        fastestLapId: 'driver2',
        safetyCar: false,
        redFlag: false,
        dnfCount: 2,
      };

      const score = engine.calculateRaceScore(prediction, results);
      expect(score.winnerScore).toBe(25);
      expect(score.totalScore).toBeGreaterThan(0);
    });

    it('should award 0 points for wrong winner prediction', () => {
      const prediction = new Prediction({
        userId: 'user1',
        raceId: 'race1',
        type: 'race',
        winnerPrediction: 'driver1',
      });

      const results: RaceResults = {
        winnerId: 'driver2',
        podiumIds: ['driver2', 'driver3', 'driver4'],
        fastestLapId: 'driver2',
        safetyCar: false,
        redFlag: false,
        dnfCount: 2,
      };

      const score = engine.calculateRaceScore(prediction, results);
      expect(score.winnerScore).toBe(0);
    });

    it('should award 50 points for exact podium (all 3 correct in order)', () => {
      const prediction = new Prediction({
        userId: 'user1',
        raceId: 'race1',
        type: 'race',
        podiumPrediction: ['driver1', 'driver2', 'driver3'],
      });

      const results: RaceResults = {
        winnerId: 'driver1',
        podiumIds: ['driver1', 'driver2', 'driver3'],
        fastestLapId: 'driver1',
        safetyCar: false,
        redFlag: false,
        dnfCount: 2,
      };

      const score = engine.calculateRaceScore(prediction, results);
      expect(score.podiumScore).toBe(50);
    });

    it('should award 15 points for correct fastest lap prediction', () => {
      const prediction = new Prediction({
        userId: 'user1',
        raceId: 'race1',
        type: 'race',
        fastestLapPrediction: 'driver3',
      });

      const results: RaceResults = {
        winnerId: 'driver1',
        podiumIds: ['driver1', 'driver2', 'driver3'],
        fastestLapId: 'driver3',
        safetyCar: false,
        redFlag: false,
        dnfCount: 2,
      };

      const score = engine.calculateRaceScore(prediction, results);
      expect(score.fastestLapScore).toBe(15);
    });

    it('should award 10 points for correct safety car prediction', () => {
      const prediction = new Prediction({
        userId: 'user1',
        raceId: 'race1',
        type: 'race',
        safetyCarPrediction: true,
      });

      const results: RaceResults = {
        winnerId: 'driver1',
        podiumIds: ['driver1', 'driver2', 'driver3'],
        fastestLapId: 'driver1',
        safetyCar: true,
        redFlag: false,
        dnfCount: 2,
      };

      const score = engine.calculateRaceScore(prediction, results);
      expect(score.safetyCarScore).toBe(10);
    });

    it('should score 0 for empty predictions', () => {
      const prediction = new Prediction({
        userId: 'user1',
        raceId: 'race1',
        type: 'race',
      });

      const results: RaceResults = {
        winnerId: 'driver1',
        podiumIds: ['driver1', 'driver2', 'driver3'],
        fastestLapId: 'driver1',
        safetyCar: false,
        redFlag: false,
        dnfCount: 2,
      };

      const score = engine.calculateRaceScore(prediction, results);
      expect(score.totalScore).toBe(0);
    });

    it('should handle partial correctness (winner in top 3 but not 1st)', () => {
      const prediction = new Prediction({
        userId: 'user1',
        raceId: 'race1',
        type: 'race',
        winnerPrediction: 'driver2',
        podiumPrediction: ['driver1', 'driver2', 'driver3'],
      });

      const results: RaceResults = {
        winnerId: 'driver1',
        podiumIds: ['driver1', 'driver2', 'driver3'],
        fastestLapId: 'driver1',
        safetyCar: false,
        redFlag: false,
        dnfCount: 2,
      };

      const score = engine.calculateRaceScore(prediction, results);
      expect(score.winnerScore).toBe(10); // WINNER_TOP3
      expect(score.podiumScore).toBe(50);
    });
  });

  describe('calculateQualifyingScore', () => {
    it('should award 10 points for correct pole prediction', () => {
      const prediction = new Prediction({
        userId: 'user1',
        raceId: 'race1',
        type: 'qualifying',
        polePrediction: 'driver1',
      });

      const results: QualifyingResults = {
        poleId: 'driver1',
        top3Ids: ['driver1', 'driver2', 'driver3'],
        top10Ids: ['driver1', 'driver2', 'driver3', 'driver4', 'driver5', 'driver6', 'driver7', 'driver8', 'driver9', 'driver10'],
      };

      const score = engine.calculateQualifyingScore(prediction, results);
      expect(score.poleScore).toBe(10);
    });

    it('should award 0 points for wrong pole prediction', () => {
      const prediction = new Prediction({
        userId: 'user1',
        raceId: 'race1',
        type: 'qualifying',
        polePrediction: 'driver2',
      });

      const results: QualifyingResults = {
        poleId: 'driver1',
        top3Ids: ['driver1', 'driver2', 'driver3'],
        top10Ids: [],
      };

      const score = engine.calculateQualifyingScore(prediction, results);
      expect(score.poleScore).toBe(0);
    });
  });

  describe('calculateTotalScore', () => {
    it('should use qualifying scoring for qualifying predictions', () => {
      const prediction = new Prediction({
        userId: 'user1',
        raceId: 'race1',
        type: 'qualifying',
        polePrediction: 'driver1',
      });

      const results: QualifyingResults = {
        poleId: 'driver1',
        top3Ids: [],
        top10Ids: [],
      };

      const total = engine.calculateTotalScore(prediction, results);
      expect(total).toBe(10);
    });

    it('should use race scoring for race predictions', () => {
      const prediction = new Prediction({
        userId: 'user1',
        raceId: 'race1',
        type: 'race',
        winnerPrediction: 'driver1',
      });

      const results: RaceResults = {
        winnerId: 'driver1',
        podiumIds: ['driver1', 'driver2', 'driver3'],
        fastestLapId: 'driver1',
        safetyCar: false,
        redFlag: false,
        dnfCount: 2,
      };

      const total = engine.calculateTotalScore(prediction, results);
      expect(total).toBe(25);
    });
  });
});
