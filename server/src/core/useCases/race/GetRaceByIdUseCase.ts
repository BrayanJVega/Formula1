import { IRaceRepository } from '../../repositories/IRaceRepository.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';
import { RaceWithCircuit } from './RaceWithCircuit.js';

export class GetRaceByIdUseCase {
  constructor(private readonly raceRepository: IRaceRepository) {}

  async execute(id: string): Promise<RaceWithCircuit> {
    const race = await this.raceRepository.findByIdWithCircuit(id);
    if (!race) {
      throw new NotFoundError(`Race with id ${id} not found`);
    }
    return race;
  }
}
