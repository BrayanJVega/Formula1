import { IRaceRepository } from '../../repositories/IRaceRepository.js';
import { RaceWithCircuit } from './RaceWithCircuit.js';

export class GetNextRaceUseCase {
  constructor(private readonly raceRepository: IRaceRepository) {}

  async execute(): Promise<RaceWithCircuit | null> {
    const race = await this.raceRepository.findNext();
    return race as RaceWithCircuit | null;
  }
}
