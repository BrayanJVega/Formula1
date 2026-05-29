import { Circuit } from '../entities/Circuit.js';

export interface ICircuitRepository {
  findById(id: string): Promise<Circuit | null>;
  findAll(): Promise<Circuit[]>;
  save(circuit: Circuit): Promise<Circuit>;
  update(circuit: Circuit): Promise<Circuit>;
  delete(id: string): Promise<void>;
}
