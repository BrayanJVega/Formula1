import { Driver } from '../../entities/Driver.js';
import { DriverRepository } from '../../../infrastructure/persistence/repositories/DriverRepository.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';

export class GetDriverByIdUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(id: string): Promise<Driver> {
    const driver = await this.driverRepository.findById(id);
    if (!driver) {
      throw new NotFoundError('Driver not found');
    }
    return driver;
  }
}
