import { Circuit } from '../../entities/Circuit.js';
import { ICircuitRepository } from '../../repositories/ICircuitRepository.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';

export class UpdateCircuitUseCase {
  constructor(private readonly circuitRepository: ICircuitRepository) {}

  async execute(
    id: string,
    dto: {
      name?: string;
      country?: string;
      city?: string;
      lengthKm?: number;
      turns?: number;
      drsZones?: number;
      lapRecord?: string;
      lapRecordTime?: number;
      lapRecordDriverId?: string;
      lapRecordYear?: number;
      capacity?: number;
      firstGpYear?: number;
      circuitMapUrl?: string;
      imageUrl?: string;
      description?: string;
      altitude?: number;
      isStreetCircuit?: boolean;
    },
  ) {
    const existing = await this.circuitRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Circuit not found');
    }

    const updated = new Circuit({
      id: existing.id,
      name: dto.name ?? existing.name,
      country: dto.country ?? existing.country,
      city: dto.city ?? existing.city,
      lengthKm: dto.lengthKm ?? existing.lengthKm,
      turns: dto.turns ?? existing.turns,
      drsZones: dto.drsZones ?? existing.drsZones,
      lapRecord: dto.lapRecord !== undefined ? dto.lapRecord : existing.lapRecord,
      lapRecordTime: dto.lapRecordTime !== undefined ? dto.lapRecordTime : existing.lapRecordTime,
      lapRecordDriverId: dto.lapRecordDriverId !== undefined ? dto.lapRecordDriverId : existing.lapRecordDriverId,
      lapRecordYear: dto.lapRecordYear !== undefined ? dto.lapRecordYear : existing.lapRecordYear,
      capacity: dto.capacity !== undefined ? dto.capacity : existing.capacity,
      firstGpYear: dto.firstGpYear ?? existing.firstGpYear,
      circuitMapUrl: dto.circuitMapUrl !== undefined ? dto.circuitMapUrl : existing.circuitMapUrl,
      imageUrl: dto.imageUrl !== undefined ? dto.imageUrl : existing.imageUrl,
      description: dto.description !== undefined ? dto.description : existing.description,
      altitude: dto.altitude !== undefined ? dto.altitude : existing.altitude,
      isStreetCircuit: dto.isStreetCircuit ?? existing.isStreetCircuit,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    return this.circuitRepository.update(updated);
  }
}
