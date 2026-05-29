export type PredictionType = 'qualifying' | 'race';

export interface PredictionProps {
  id?: string;
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
  submittedAt?: Date;
  isLocked?: boolean;
  totalScore?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Prediction {
  readonly id: string;
  readonly userId: string;
  readonly raceId: string;
  readonly type: PredictionType;
  readonly polePrediction?: string;
  readonly top3Prediction?: string[];
  readonly top10Prediction?: string[];
  readonly winnerPrediction?: string;
  readonly podiumPrediction?: string[];
  readonly fastestLapPrediction?: string;
  readonly safetyCarPrediction?: boolean;
  readonly redFlagPrediction?: boolean;
  readonly dnfsPrediction?: number;
  readonly submittedAt: Date;
  readonly isLocked: boolean;
  readonly totalScore: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: PredictionProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.userId = props.userId;
    this.raceId = props.raceId;
    this.type = props.type;
    this.polePrediction = props.polePrediction;
    this.top3Prediction = props.top3Prediction;
    this.top10Prediction = props.top10Prediction;
    this.winnerPrediction = props.winnerPrediction;
    this.podiumPrediction = props.podiumPrediction;
    this.fastestLapPrediction = props.fastestLapPrediction;
    this.safetyCarPrediction = props.safetyCarPrediction;
    this.redFlagPrediction = props.redFlagPrediction;
    this.dnfsPrediction = props.dnfsPrediction;
    this.submittedAt = props.submittedAt ?? new Date();
    this.isLocked = props.isLocked ?? false;
    this.totalScore = props.totalScore ?? 0;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
