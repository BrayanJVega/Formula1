export type PredictionType = 'qualifying' | 'race';

export interface Prediction {
  id: string;
  userId: string;
  raceId: string;
  type: PredictionType;
  polePrediction?: string;
  top3Prediction?: string[];
  top10Prediction?: string[];
  winnerPrediction?: string;
  podiumPrediction?: string[];
  fastestLapPrediction?: string;
  safetyCarPrediction?: boolean;
  redFlagPrediction?: boolean;
  dnfsPrediction?: number;
  submittedAt: string;
  isLocked: boolean;
  totalScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface PredictionFormData {
  raceId: string;
  type: PredictionType;
  polePrediction?: string;
  top3Prediction?: string[];
  top10Prediction?: string[];
  winnerPrediction?: string;
  podiumPrediction?: string[];
  fastestLapPrediction?: string;
  safetyCarPrediction?: boolean;
  redFlagPrediction?: boolean;
  dnfsPrediction?: number;
}

export interface PredictionScore {
  id: string;
  predictionId: string;
  poleScore: number;
  winnerScore: number;
  podiumScore: number;
  top10Score: number;
  fastestLapScore: number;
  safetyCarScore: number;
  redFlagScore: number;
  totalScore: number;
  calculatedAt: string;
}

export interface PredictionWithScore extends Prediction {
  scores?: PredictionScore | null;
}

export interface PaginatedPredictions {
  predictions: Prediction[];
  total: number;
  page: number;
  limit: number;
}
