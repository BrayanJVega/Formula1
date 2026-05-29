import { IPredictionRepository } from '../../repositories/IPredictionRepository.js';
import { Prediction } from '../../entities/Prediction.js';

export class GetRacePredictionsUseCase {
  constructor(
    private readonly predictionRepository: IPredictionRepository,
  ) {}

  async execute(raceId: string): Promise<Prediction[]> {
    return this.predictionRepository.findByRace(raceId);
  }
}
