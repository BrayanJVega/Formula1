import { ITeamRepository } from '../../repositories/ITeamRepository.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';

export class DeleteTeamUseCase {
  constructor(private readonly teamRepository: ITeamRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.teamRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Team not found');
    }

    await this.teamRepository.delete(id);
  }
}
