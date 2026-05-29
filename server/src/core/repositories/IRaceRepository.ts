import { Race } from '../entities/Race.js';
import { RaceWithCircuit } from '../useCases/race/RaceWithCircuit.js';

export interface IRaceRepository {
  findById(id: string): Promise<Race | null>;
  findByIdWithCircuit(id: string): Promise<RaceWithCircuit | null>;
  findNext(): Promise<Race | null>;
  findAllBySeason(seasonId: string): Promise<Race[]>;
  save(race: Race): Promise<Race>;
  update(race: Race): Promise<Race>;
  delete(id: string): Promise<void>;
}
