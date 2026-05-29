import { IPredictionRepository } from '../../repositories/IPredictionRepository.js';
import { Prediction } from '../../entities/Prediction.js';

interface GetUserPredictionsInput {
  userId: string;
  page?: number;
  limit?: number;
}

interface GetUserPredictionsOutput {
  predictions: Prediction[];
  total: number;
  page: number;
  limit: number;
}

export class GetUserPredictionsUseCase {
  constructor(
    private readonly predictionRepository: IPredictionRepository,
  ) {}

  async execute(input: GetUserPredictionsInput): Promise<GetUserPredictionsOutput> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;

    const result = await this.predictionRepository.findByUser(input.userId, { page, limit });

    return {
      predictions: result.predictions,
      total: result.total,
      page,
      limit,
    };
  }
}
