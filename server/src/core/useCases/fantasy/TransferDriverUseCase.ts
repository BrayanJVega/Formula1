import { FantasyTeam } from '../../entities/FantasyTeam.js';
import { FantasyRepository, FantasyTransfer } from '../../../infrastructure/persistence/repositories/FantasyRepository.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';
import { ValidationError } from '../../../shared/errors/ValidationError.js';

const TRANSFER_FEE = 1.0;

export interface TransferDriverDto {
  fantasyTeamId: string;
  pickId: string;
  newDriverId: string;
  newDriverCost: number;
  raceId?: string;
}

export class TransferDriverUseCase {
  constructor(private readonly fantasyRepository: FantasyRepository) {}

  async execute(dto: TransferDriverDto): Promise<{ team: FantasyTeam; transfer: FantasyTransfer }> {
    const team = await this.fantasyRepository.findById(dto.fantasyTeamId);
    if (!team) {
      throw new NotFoundError('Fantasy team not found');
    }

    const pick = await this.fantasyRepository.getPickById(dto.pickId);
    if (!pick || pick.fantasyTeamId !== dto.fantasyTeamId) {
      throw new NotFoundError('Pick not found');
    }
    if (pick.type !== 'driver') {
      throw new ValidationError({ pick: ['Only drivers can be transferred'] });
    }

    const priceDiff = dto.newDriverCost - pick.cost;
    const totalCost = priceDiff + TRANSFER_FEE;

    if (totalCost > 0 && team.budget < totalCost) {
      throw new ValidationError({ budget: ['Insufficient budget for transfer'] });
    }

    await this.fantasyRepository.deactivatePick(pick.id);

    await this.fantasyRepository.addPick(dto.fantasyTeamId, {
      fantasyTeamId: dto.fantasyTeamId,
      driverId: dto.newDriverId,
      teamId: null,
      type: 'driver',
      cost: dto.newDriverCost,
    });

    const transfer = await this.fantasyRepository.createTransfer({
      fantasyTeamId: dto.fantasyTeamId,
      driverOutId: pick.driverId,
      driverInId: dto.newDriverId,
      cost: totalCost,
      raceId: dto.raceId ?? null,
    });

    const newBudget = team.budget - (totalCost > 0 ? totalCost : 0);
    const updatedTeam = new FantasyTeam({
      id: team.id,
      userId: team.userId,
      seasonId: team.seasonId,
      name: team.name,
      budget: newBudget,
      totalScore: team.totalScore,
      createdAt: team.createdAt,
      updatedAt: new Date(),
    });
    await this.fantasyRepository.update(updatedTeam);

    return { team: updatedTeam, transfer };
  }
}
