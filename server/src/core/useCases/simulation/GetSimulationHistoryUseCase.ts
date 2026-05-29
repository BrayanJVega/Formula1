import type { SimulationResult } from '../../entities/Simulation.js';

interface ISimulationRepository {
  findByUserId(userId: string, type?: string): Promise<SimulationResult[]>;
  findById(id: string): Promise<SimulationResult | null>;
}

export class GetSimulationHistoryUseCase {
  constructor(private readonly repository: ISimulationRepository) {}

  async execute(userId: string, type?: string): Promise<SimulationResult[]> {
    return this.repository.findByUserId(userId, type);
  }
}

export class GetSimulationByIdUseCase {
  constructor(private readonly repository: ISimulationRepository) {}

  async execute(id: string): Promise<SimulationResult | null> {
    return this.repository.findById(id);
  }
}
