import { IRaceRepository } from '../../repositories/IRaceRepository.js';
import { RaceStatus } from '../../entities/Race.js';
import { RaceWithCircuit } from './RaceWithCircuit.js';

interface GetRacesInput {
  seasonId: string;
  status?: RaceStatus;
}

export class GetRacesUseCase {
  constructor(private readonly raceRepository: IRaceRepository) {}

  async execute(input: GetRacesInput): Promise<RaceWithCircuit[]> {
    const races = await this.raceRepository.findAllBySeason(input.seasonId);
    if (input.status) {
      return (races as RaceWithCircuit[]).filter((r) => r.status === input.status);
    }
    return races as RaceWithCircuit[];
  }
}
