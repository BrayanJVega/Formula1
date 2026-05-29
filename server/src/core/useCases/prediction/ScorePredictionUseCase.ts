import { IPredictionRepository } from '../../repositories/IPredictionRepository.js';
import { Prediction } from '../../entities/Prediction.js';
import { ScoringEngine, PredictionScores, QualifyingResults, RaceResults } from '../../services/ScoringEngine.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';
import { ForbiddenError } from '../../../shared/errors/ForbiddenError.js';
import { query } from '../../../config/database.js';

interface ScorePredictionInput {
  predictionId: string;
  actualResults: QualifyingResults | RaceResults;
}

interface ScoredPrediction {
  prediction: Prediction;
  scores: PredictionScores;
}

export class ScorePredictionUseCase {
  constructor(
    private readonly predictionRepository: IPredictionRepository,
    private readonly scoringEngine: ScoringEngine,
  ) {}

  async execute(input: ScorePredictionInput): Promise<ScoredPrediction> {
    const prediction = await this.predictionRepository.findById(input.predictionId);
    if (!prediction) {
      throw new NotFoundError(`Prediction with id ${input.predictionId} not found`);
    }

    if (prediction.isLocked && prediction.totalScore > 0) {
      throw new ForbiddenError('Prediction has already been scored');
    }

    const lockedPrediction = new Prediction({
      ...prediction,
      isLocked: true,
    });

    let scores: PredictionScores;

    if (lockedPrediction.type === 'qualifying') {
      scores = this.scoringEngine.calculateQualifyingScore(
        lockedPrediction,
        input.actualResults as QualifyingResults,
      );
    } else {
      scores = this.scoringEngine.calculateRaceScore(
        lockedPrediction,
        input.actualResults as RaceResults,
      );
    }

    const scoredPrediction = new Prediction({
      ...lockedPrediction,
      totalScore: scores.totalScore,
    });

    await this.predictionRepository.update(scoredPrediction);

    await query(
      `INSERT INTO prediction_scores (
        prediction_id, pole_score, winner_score, podium_score,
        top10_score, fastest_lap_score, safety_car_score,
        red_flag_score, total_score
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (prediction_id) DO UPDATE SET
        pole_score = EXCLUDED.pole_score,
        winner_score = EXCLUDED.winner_score,
        podium_score = EXCLUDED.podium_score,
        top10_score = EXCLUDED.top10_score,
        fastest_lap_score = EXCLUDED.fastest_lap_score,
        safety_car_score = EXCLUDED.safety_car_score,
        red_flag_score = EXCLUDED.red_flag_score,
        total_score = EXCLUDED.total_score`,
      [
        scoredPrediction.id,
        scores.poleScore,
        scores.winnerScore,
        scores.podiumScore,
        scores.top10Score,
        scores.fastestLapScore,
        scores.safetyCarScore,
        scores.redFlagScore,
        scores.totalScore,
      ],
    );

    return { prediction: scoredPrediction, scores };
  }
}
