import { FantasyRepository, DriverMarketValue } from '../../../infrastructure/persistence/repositories/FantasyRepository.js';

export class GetMarketValuesUseCase {
  constructor(private readonly fantasyRepository: FantasyRepository) {}

  async execute(seasonId: string): Promise<DriverMarketValue[]> {
    return this.fantasyRepository.getAllDriverMarketValues(seasonId);
  }
}
