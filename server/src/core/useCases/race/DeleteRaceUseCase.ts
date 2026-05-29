import { IRaceRepository } from '../../repositories/IRaceRepository.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';

export class DeleteRaceUseCase {
  constructor(private readonly raceRepository: IRaceRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.raceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Race with id ${id} not found`);
    }
    await this.raceRepository.delete(id);
  }
}
