import { Driver } from '../../entities/Driver.js';
import { DriverRepository } from '../../../infrastructure/persistence/repositories/DriverRepository.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';

export interface UpdateDriverDto {
  name?: string;
  number?: number;
  nationality?: string;
  dateOfBirth?: Date;
  teamId?: string;
  photoUrl?: string;
  biography?: string;
  isActive?: boolean;
}

export class UpdateDriverUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(id: string, dto: UpdateDriverDto): Promise<Driver> {
    const existing = await this.driverRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Driver not found');
    }

    const updated = new Driver({
      id: existing.id,
      name: dto.name ?? existing.name,
      number: dto.number ?? existing.number,
      nationality: dto.nationality ?? existing.nationality,
      dateOfBirth: dto.dateOfBirth ?? existing.dateOfBirth,
      teamId: dto.teamId ?? existing.teamId,
      photoUrl: dto.photoUrl ?? existing.photoUrl,
      biography: dto.biography ?? existing.biography,
      isActive: dto.isActive ?? existing.isActive,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    return this.driverRepository.update(updated);
  }
}
