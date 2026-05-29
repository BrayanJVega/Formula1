import { AIPredictionService, AIPrediction } from '../../services/AIPredictionService.js';
import { queryOne } from '../../../config/database.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';

export class GetAIPredictionsUseCase {
  constructor(
    private readonly aiPredictionService: AIPredictionService,
  ) {}

  async execute(raceId: string): Promise<AIPrediction> {
    const race = await queryOne<Record<string, unknown>>(
      'SELECT id, name FROM races WHERE id = $1',
      [raceId],
    );
    if (!race) {
      throw new NotFoundError(`Race with id ${raceId} not found`);
    }

    return this.aiPredictionService.getFullPredictions(raceId);
  }
}
