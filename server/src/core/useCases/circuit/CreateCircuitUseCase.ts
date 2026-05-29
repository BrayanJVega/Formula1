import { Circuit } from '../../entities/Circuit.js';
import { ICircuitRepository } from '../../repositories/ICircuitRepository.js';

export class CreateCircuitUseCase {
  constructor(private readonly circuitRepository: ICircuitRepository) {}

  async execute(dto: {
    name: string;
    country: string;
    city: string;
    lengthKm: number;
    turns: number;
    drsZones: number;
    lapRecord?: string;
    lapRecordTime?: number;
    lapRecordDriverId?: string;
    lapRecordYear?: number;
    capacity?: number;
    firstGpYear: number;
    circuitMapUrl?: string;
    imageUrl?: string;
    description?: string;
    altitude?: number;
    isStreetCircuit?: boolean;
  }) {
    const circuit = new Circuit(dto);
    return this.circuitRepository.save(circuit);
  }
}
