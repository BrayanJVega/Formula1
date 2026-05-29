import { ITeamRepository } from '../../repositories/ITeamRepository.js';
import { Team } from '../../entities/Team.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';

export class UpdateTeamUseCase {
  constructor(private readonly teamRepository: ITeamRepository) {}

  async execute(
    id: string,
    dto: {
      name?: string;
      fullName?: string;
      nationality?: string;
      base?: string;
      teamPrincipal?: string;
      chassis?: string;
      powerUnit?: string;
      foundedYear?: number;
      logoUrl?: string;
      photoUrl?: string;
      biography?: string;
      isActive?: boolean;
    },
  ): Promise<Team> {
    const existing = await this.teamRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Team not found');
    }

    const updated = new Team({
      id: existing.id,
      name: dto.name ?? existing.name,
      fullName: dto.fullName ?? existing.fullName,
      nationality: dto.nationality ?? existing.nationality,
      base: dto.base ?? existing.base,
      teamPrincipal: dto.teamPrincipal ?? existing.teamPrincipal,
      chassis: dto.chassis ?? existing.chassis,
      powerUnit: dto.powerUnit ?? existing.powerUnit,
      foundedYear: dto.foundedYear ?? existing.foundedYear,
      logoUrl: dto.logoUrl !== undefined ? dto.logoUrl : existing.logoUrl,
      photoUrl: dto.photoUrl !== undefined ? dto.photoUrl : existing.photoUrl,
      biography: dto.biography !== undefined ? dto.biography : existing.biography,
      isActive: dto.isActive ?? existing.isActive,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    return this.teamRepository.update(updated);
  }
}
