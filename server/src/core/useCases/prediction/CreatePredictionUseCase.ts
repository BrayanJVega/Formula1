import { IPredictionRepository } from '../../repositories/IPredictionRepository.js';
import { IRaceRepository } from '../../repositories/IRaceRepository.js';
import { IDriverRepository } from '../../repositories/IDriverRepository.js';
import { Prediction, PredictionType } from '../../entities/Prediction.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';
import { ForbiddenError } from '../../../shared/errors/ForbiddenError.js';

interface CreatePredictionInput {
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
}

export class CreatePredictionUseCase {
  constructor(
    private readonly predictionRepository: IPredictionRepository,
    private readonly raceRepository: IRaceRepository,
    private readonly driverRepository: IDriverRepository,
  ) {}

  async execute(input: CreatePredictionInput): Promise<Prediction> {
    const race = await this.raceRepository.findById(input.raceId);
    if (!race) {
      throw new NotFoundError(`Race with id ${input.raceId} not found`);
    }

    if (race.raceDate <= new Date()) {
      throw new ForbiddenError('Race has already started, predictions are closed');
    }

    const driverIds = await this.collectDriverIds(input);
    for (const driverId of driverIds) {
      if (driverId) {
        const driver = await this.driverRepository.findById(driverId);
        if (!driver) {
          throw new NotFoundError(`Driver with id ${driverId} not found`);
        }
      }
    }

    const prediction = new Prediction({
      ...input,
      isLocked: false,
    });

    return this.predictionRepository.save(prediction);
  }

  private collectDriverIds(input: CreatePredictionInput): string[] {
    const ids: string[] = [];
    if (input.polePrediction) ids.push(input.polePrediction);
    if (input.top3Prediction) ids.push(...input.top3Prediction);
    if (input.top10Prediction) ids.push(...input.top10Prediction);
    if (input.winnerPrediction) ids.push(input.winnerPrediction);
    if (input.podiumPrediction) ids.push(...input.podiumPrediction);
    if (input.fastestLapPrediction) ids.push(input.fastestLapPrediction);
    return ids;
  }
}
