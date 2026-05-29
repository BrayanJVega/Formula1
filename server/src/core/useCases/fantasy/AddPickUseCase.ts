import { FantasyRepository, FantasyPick } from '../../../infrastructure/persistence/repositories/FantasyRepository.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';
import { ValidationError } from '../../../shared/errors/ValidationError.js';

export interface AddPickDto {
  fantasyTeamId: string;
  driverId?: string;
  teamId?: string;
  type: 'driver' | 'constructor';
  cost: number;
}

export class AddPickUseCase {
  constructor(private readonly fantasyRepository: FantasyRepository) {}

  async execute(dto: AddPickDto): Promise<FantasyPick> {
    const team = await this.fantasyRepository.findById(dto.fantasyTeamId);
    if (!team) {
      throw new NotFoundError('Fantasy team not found');
    }

    if (team.budget < dto.cost) {
      throw new ValidationError({ budget: ['Insufficient budget'] });
    }

    const picks = await this.fantasyRepository.getPicks(dto.fantasyTeamId);
    const activePicks = picks.filter((p) => p.isActive);
    const maxDrivers = 5;
    const maxConstructors = 1;

    const driverCount = activePicks.filter((p) => p.type === 'driver').length;
    const constructorCount = activePicks.filter((p) => p.type === 'constructor').length;

    if (dto.type === 'driver' && driverCount >= maxDrivers) {
      throw new ValidationError({ picks: ['Maximum 5 drivers allowed'] });
    }
    if (dto.type === 'constructor' && constructorCount >= maxConstructors) {
      throw new ValidationError({ picks: ['Maximum 1 constructor allowed'] });
    }

    if (dto.type === 'driver' && dto.driverId) {
      const alreadyPicked = activePicks.some(
        (p) => p.driverId === dto.driverId && p.type === 'driver',
      );
      if (alreadyPicked) {
        throw new ValidationError({ picks: ['Driver already in your team'] });
      }
    }
    if (dto.type === 'constructor' && dto.teamId) {
      const alreadyPicked = activePicks.some(
        (p) => p.teamId === dto.teamId && p.type === 'constructor',
      );
      if (alreadyPicked) {
        throw new ValidationError({ picks: ['Constructor already in your team'] });
      }
    }

    const pick = await this.fantasyRepository.addPick(dto.fantasyTeamId, {
      fantasyTeamId: dto.fantasyTeamId,
      driverId: dto.driverId ?? null,
      teamId: dto.teamId ?? null,
      type: dto.type,
      cost: dto.cost,
    });

    const updatedTeam = new (await import('../../entities/FantasyTeam.js')).FantasyTeam({
      id: team.id,
      userId: team.userId,
      seasonId: team.seasonId,
      name: team.name,
      budget: team.budget - dto.cost,
      totalScore: team.totalScore,
      createdAt: team.createdAt,
      updatedAt: new Date(),
    });
    await this.fantasyRepository.update(updatedTeam);

    return pick;
  }
}
