import { Prediction } from '../entities/Prediction.js';
import { SCORING_DEFAULT } from '../../shared/constants.js';

export interface QualifyingResults {
  poleId: string;
  top3Ids: string[];
  top10Ids: string[];
}

export interface RaceResults {
  winnerId: string;
  podiumIds: string[];
  fastestLapId: string;
  safetyCar: boolean;
  redFlag: boolean;
  dnfCount: number;
}

export interface PredictionScores {
  poleScore: number;
  winnerScore: number;
  podiumScore: number;
  top10Score: number;
  fastestLapScore: number;
  safetyCarScore: number;
  redFlagScore: number;
  dnfScore: number;
  totalScore: number;
}

export class ScoringEngine {
  calculateQualifyingScore(
    prediction: Prediction,
    actualResults: QualifyingResults,
  ): PredictionScores {
    const poleScore = prediction.polePrediction === actualResults.poleId
      ? SCORING_DEFAULT.POLE
      : 0;

    const podiumScore = this.calculatePodiumScore(
      prediction.top3Prediction ?? [],
      actualResults.top3Ids,
    );

    const top10Score = this.calculateTop10Score(
      prediction.top10Prediction ?? [],
      actualResults.top10Ids,
    );

    const totalScore = poleScore + podiumScore + top10Score;

    return {
      poleScore,
      winnerScore: 0,
      podiumScore,
      top10Score,
      fastestLapScore: 0,
      safetyCarScore: 0,
      redFlagScore: 0,
      dnfScore: 0,
      totalScore,
    };
  }

  calculateRaceScore(
    prediction: Prediction,
    actualResults: RaceResults,
  ): PredictionScores {
    let winnerScore = 0;
    if (prediction.winnerPrediction === actualResults.winnerId) {
      winnerScore = SCORING_DEFAULT.WINNER;
    } else if (
      prediction.winnerPrediction &&
      actualResults.podiumIds.includes(prediction.winnerPrediction)
    ) {
      winnerScore = SCORING_DEFAULT.WINNER_TOP3;
    }

    const podiumScore = this.calculatePodiumScore(
      prediction.podiumPrediction ?? [],
      actualResults.podiumIds,
    );

    const fastestLapScore =
      prediction.fastestLapPrediction === actualResults.fastestLapId
        ? SCORING_DEFAULT.FASTEST_LAP
        : 0;

    let safetyCarScore = 0;
    if (prediction.safetyCarPrediction !== undefined) {
      safetyCarScore =
        prediction.safetyCarPrediction === actualResults.safetyCar
          ? SCORING_DEFAULT.SAFETY_CAR
          : 0;
    }

    let redFlagScore = 0;
    if (prediction.redFlagPrediction !== undefined) {
      redFlagScore =
        prediction.redFlagPrediction === actualResults.redFlag
          ? SCORING_DEFAULT.RED_FLAG
          : 0;
    }

    let dnfScore = 0;
    if (prediction.dnfsPrediction !== undefined) {
      const diff = Math.abs(prediction.dnfsPrediction - actualResults.dnfCount);
      if (diff <= 2) {
        dnfScore = SCORING_DEFAULT.DNF_RANGE;
      }
    }

    const totalScore =
      winnerScore +
      podiumScore +
      fastestLapScore +
      safetyCarScore +
      redFlagScore +
      dnfScore;

    return {
      poleScore: 0,
      winnerScore,
      podiumScore,
      top10Score: 0,
      fastestLapScore,
      safetyCarScore,
      redFlagScore,
      dnfScore,
      totalScore,
    };
  }

  calculateTotalScore(
    prediction: Prediction,
    actualResults: QualifyingResults | RaceResults,
  ): number {
    if (prediction.type === 'qualifying') {
      return this.calculateQualifyingScore(
        prediction,
        actualResults as QualifyingResults,
      ).totalScore;
    }
    return this.calculateRaceScore(
      prediction,
      actualResults as RaceResults,
    ).totalScore;
  }

  private calculatePodiumScore(
    predictedPodium: string[],
    actualPodium: string[],
  ): number {
    if (
      predictedPodium.length === 3 &&
      actualPodium.length === 3 &&
      predictedPodium[0] === actualPodium[0] &&
      predictedPodium[1] === actualPodium[1] &&
      predictedPodium[2] === actualPodium[2]
    ) {
      return SCORING_DEFAULT.PODIUM_EXACT;
    }

    let score = 0;
    for (const driverId of predictedPodium) {
      if (actualPodium.includes(driverId)) {
        score += SCORING_DEFAULT.PODIUM_ANY;
      }
    }
    return score;
  }

  private calculateTop10Score(
    predictedTop10: string[],
    actualTop10: string[],
  ): number {
    if (
      predictedTop10.length === 10 &&
      actualTop10.length === 10 &&
      predictedTop10.every((id, idx) => id === actualTop10[idx])
    ) {
      return SCORING_DEFAULT.TOP10_EXACT;
    }

    let score = 0;
    for (const driverId of predictedTop10) {
      if (actualTop10.includes(driverId)) {
        score += SCORING_DEFAULT.TOP10_ANY;
      }
    }
    return score;
  }
}
