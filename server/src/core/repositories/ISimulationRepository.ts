import { SimulationResult } from '../entities/Simulation.js';

export interface ISimulationRepository {
  save(simulation: SimulationResult): Promise<SimulationResult>;
  findById(id: string): Promise<SimulationResult | null>;
  findByUserId(userId: string, type?: string): Promise<SimulationResult[]>;
}
