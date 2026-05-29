import { FantasyTeam } from '../../entities/FantasyTeam.js';
import { FantasyRepository } from '../../../infrastructure/persistence/repositories/FantasyRepository.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';

export interface UpdateFantasyTeamDto {
  name: string;
}

export class UpdateFantasyTeamUseCase {
  constructor(private readonly fantasyRepository: FantasyRepository) {}

  async execute(id: string, dto: UpdateFantasyTeamDto): Promise<FantasyTeam> {
    const team = await this.fantasyRepository.findById(id);
    if (!team) {
      throw new NotFoundError('Fantasy team not found');
    }

    const updated = new FantasyTeam({
      id: team.id,
      userId: team.userId,
      seasonId: team.seasonId,
      name: dto.name,
      budget: team.budget,
      totalScore: team.totalScore,
      createdAt: team.createdAt,
      updatedAt: new Date(),
    });

    return this.fantasyRepository.update(updated);
  }
}
