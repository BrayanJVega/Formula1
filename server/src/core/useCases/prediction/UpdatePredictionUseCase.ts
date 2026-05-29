import { IPredictionRepository } from '../../repositories/IPredictionRepository.js';
import { Prediction } from '../../entities/Prediction.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';
import { ForbiddenError } from '../../../shared/errors/ForbiddenError.js';

interface UpdatePredictionInput {
  id: string;
  userId: string;
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

export class UpdatePredictionUseCase {
  constructor(
    private readonly predictionRepository: IPredictionRepository,
  ) {}

  async execute(input: UpdatePredictionInput): Promise<Prediction> {
    const existing = await this.predictionRepository.findById(input.id);
    if (!existing) {
      throw new NotFoundError(`Prediction with id ${input.id} not found`);
    }

    if (existing.userId !== input.userId) {
      throw new ForbiddenError('You can only update your own predictions');
    }

    if (existing.isLocked) {
      throw new ForbiddenError('Cannot update a locked prediction');
    }

    const updated = new Prediction({
      ...existing,
      polePrediction: input.polePrediction ?? existing.polePrediction,
      top3Prediction: input.top3Prediction ?? existing.top3Prediction,
      top10Prediction: input.top10Prediction ?? existing.top10Prediction,
      winnerPrediction: input.winnerPrediction ?? existing.winnerPrediction,
      podiumPrediction: input.podiumPrediction ?? existing.podiumPrediction,
      fastestLapPrediction: input.fastestLapPrediction ?? existing.fastestLapPrediction,
      safetyCarPrediction: input.safetyCarPrediction ?? existing.safetyCarPrediction,
      redFlagPrediction: input.redFlagPrediction ?? existing.redFlagPrediction,
      dnfsPrediction: input.dnfsPrediction ?? existing.dnfsPrediction,
    });

    return this.predictionRepository.update(updated);
  }
}
