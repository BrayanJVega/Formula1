import { Driver } from '../entities/Driver.js';

export interface IDriverRepository {
  findById(id: string): Promise<Driver | null>;
  findAll(options?: { teamId?: string; nationality?: string; isActive?: boolean }): Promise<Driver[]>;
  save(driver: Driver): Promise<Driver>;
  update(driver: Driver): Promise<Driver>;
  delete(id: string): Promise<void>;
}
