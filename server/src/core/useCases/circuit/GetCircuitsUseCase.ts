import { ICircuitRepository } from '../../repositories/ICircuitRepository.js';

export class GetCircuitsUseCase {
  constructor(private readonly circuitRepository: ICircuitRepository) {}

  async execute() {
    return this.circuitRepository.findAll();
  }
}
