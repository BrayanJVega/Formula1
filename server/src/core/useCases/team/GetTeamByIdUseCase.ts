import { ITeamRepository } from '../../repositories/ITeamRepository.js';
import { Team } from '../../entities/Team.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';

export class GetTeamByIdUseCase {
  constructor(private readonly teamRepository: ITeamRepository) {}

  async execute(id: string): Promise<Team> {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new NotFoundError('Team not found');
    }
    return team;
  }
}
