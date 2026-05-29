import { ITeamRepository } from '../../repositories/ITeamRepository.js';
import { Team } from '../../entities/Team.js';

export class GetTeamsUseCase {
  constructor(private readonly teamRepository: ITeamRepository) {}

  async execute(options?: { isActive?: boolean }): Promise<Team[]> {
    return this.teamRepository.findAll(options);
  }
}
