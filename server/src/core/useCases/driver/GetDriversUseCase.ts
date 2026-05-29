import { Driver } from '../../entities/Driver.js';
import { DriverRepository } from '../../../infrastructure/persistence/repositories/DriverRepository.js';

export interface GetDriversOptions {
  teamId?: string;
  nationality?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface GetDriversResult {
  drivers: Driver[];
  total: number;
  page: number;
  limit: number;
}

export class GetDriversUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(options?: GetDriversOptions): Promise<GetDriversResult> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;

    const { drivers, total } = await this.driverRepository.findAllPaginated({
      teamId: options?.teamId,
      nationality: options?.nationality,
      isActive: options?.isActive,
      page,
      limit,
    });

    return { drivers, total, page, limit };
  }
}
