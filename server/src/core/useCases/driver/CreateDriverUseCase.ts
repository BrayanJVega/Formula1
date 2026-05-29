import { Driver } from '../../entities/Driver.js';
import { DriverRepository } from '../../../infrastructure/persistence/repositories/DriverRepository.js';

export interface CreateDriverDto {
  name: string;
  number: number;
  nationality: string;
  dateOfBirth: Date;
  teamId: string;
  photoUrl?: string;
  biography?: string;
}

export class CreateDriverUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(dto: CreateDriverDto): Promise<Driver> {
    const driver = new Driver({
      name: dto.name,
      number: dto.number,
      nationality: dto.nationality,
      dateOfBirth: dto.dateOfBirth,
      teamId: dto.teamId,
      photoUrl: dto.photoUrl,
      biography: dto.biography,
    });

    return this.driverRepository.save(driver);
  }
}
