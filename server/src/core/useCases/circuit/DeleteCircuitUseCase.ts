import { ICircuitRepository } from '../../repositories/ICircuitRepository.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';

export class DeleteCircuitUseCase {
  constructor(private readonly circuitRepository: ICircuitRepository) {}

  async execute(id: string): Promise<void> {
    const circuit = await this.circuitRepository.findById(id);
    if (!circuit) {
      throw new NotFoundError('Circuit not found');
    }
    await this.circuitRepository.delete(id);
  }
}
