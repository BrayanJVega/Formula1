import { FantasyTeam } from '../../entities/FantasyTeam.js';
import { FantasyRepository } from '../../../infrastructure/persistence/repositories/FantasyRepository.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';

export class RemovePickUseCase {
  constructor(private readonly fantasyRepository: FantasyRepository) {}

  async execute(pickId: string): Promise<FantasyTeam> {
    const pick = await this.fantasyRepository.getPickById(pickId);
    if (!pick) {
      throw new NotFoundError('Pick not found');
    }

    const team = await this.fantasyRepository.findById(pick.fantasyTeamId);
    if (!team) {
      throw new NotFoundError('Fantasy team not found');
    }

    await this.fantasyRepository.removePick(pickId);

    const updatedTeam = new FantasyTeam({
      id: team.id,
      userId: team.userId,
      seasonId: team.seasonId,
      name: team.name,
      budget: team.budget + pick.cost,
      totalScore: team.totalScore,
      createdAt: team.createdAt,
      updatedAt: new Date(),
    });

    return this.fantasyRepository.update(updatedTeam);
  }
}
