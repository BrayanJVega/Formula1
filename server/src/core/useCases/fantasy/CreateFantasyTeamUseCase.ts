import { FantasyTeam } from '../../entities/FantasyTeam.js';
import { FantasyRepository } from '../../../infrastructure/persistence/repositories/FantasyRepository.js';
import { ValidationError } from '../../../shared/errors/ValidationError.js';

export interface CreateFantasyTeamDto {
  userId: string;
  seasonId: string;
  name: string;
}

export class CreateFantasyTeamUseCase {
  constructor(private readonly fantasyRepository: FantasyRepository) {}

  async execute(dto: CreateFantasyTeamDto): Promise<FantasyTeam> {
    const existing = await this.fantasyRepository.findByUserAndSeason(dto.userId, dto.seasonId);
    if (existing) {
      throw new ValidationError({ name: ['You already have a fantasy team for this season'] });
    }

    const team = new FantasyTeam({
      userId: dto.userId,
      seasonId: dto.seasonId,
      name: dto.name,
      budget: 100,
    });

    return this.fantasyRepository.save(team);
  }
}
