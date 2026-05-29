import { ICircuitRepository } from '../../repositories/ICircuitRepository.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';

export class GetCircuitByIdUseCase {
  constructor(private readonly circuitRepository: ICircuitRepository) {}

  async execute(id: string) {
    const circuit = await this.circuitRepository.findById(id);
    if (!circuit) {
      throw new NotFoundError('Circuit not found');
    }
    return circuit;
  }
}
