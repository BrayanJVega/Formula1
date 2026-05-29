import { DriverRepository } from '../../../infrastructure/persistence/repositories/DriverRepository.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';

export class DeleteDriverUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.driverRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Driver not found');
    }

    await this.driverRepository.delete(id);
  }
}
