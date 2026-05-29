import { ITeamRepository } from '../../repositories/ITeamRepository.js';
import { Team } from '../../entities/Team.js';

export class CreateTeamUseCase {
  constructor(private readonly teamRepository: ITeamRepository) {}

  async execute(dto: {
    name: string;
    fullName: string;
    nationality: string;
    base: string;
    teamPrincipal: string;
    chassis: string;
    powerUnit: string;
    foundedYear: number;
    logoUrl?: string;
    photoUrl?: string;
    biography?: string;
  }): Promise<Team> {
    const team = new Team(dto);
    return this.teamRepository.save(team);
  }
}
