import { FantasyTeam } from '../../entities/FantasyTeam.js';
import { FantasyRepository } from '../../../infrastructure/persistence/repositories/FantasyRepository.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';

export class GetFantasyTeamUseCase {
  constructor(private readonly fantasyRepository: FantasyRepository) {}

  async execute(id: string): Promise<FantasyTeam> {
    const team = await this.fantasyRepository.findById(id);
    if (!team) {
      throw new NotFoundError('Fantasy team not found');
    }
    return team;
  }

  async findByUserAndSeason(userId: string, seasonId: string): Promise<FantasyTeam | null> {
    return this.fantasyRepository.findByUserAndSeason(userId, seasonId);
  }
}
