import { Request, Response, NextFunction } from 'express';
import { GetCircuitsUseCase } from '../../core/useCases/circuit/GetCircuitsUseCase.js';
import { GetCircuitByIdUseCase } from '../../core/useCases/circuit/GetCircuitByIdUseCase.js';
import { CreateCircuitUseCase } from '../../core/useCases/circuit/CreateCircuitUseCase.js';
import { UpdateCircuitUseCase } from '../../core/useCases/circuit/UpdateCircuitUseCase.js';
import { DeleteCircuitUseCase } from '../../core/useCases/circuit/DeleteCircuitUseCase.js';
import { createCircuitSchema, updateCircuitSchema } from '../validators/circuit.schema.js';

export class CircuitController {
  constructor(
    private readonly getCircuitsUseCase: GetCircuitsUseCase,
    private readonly getCircuitByIdUseCase: GetCircuitByIdUseCase,
    private readonly createCircuitUseCase: CreateCircuitUseCase,
    private readonly updateCircuitUseCase: UpdateCircuitUseCase,
    private readonly deleteCircuitUseCase: DeleteCircuitUseCase,
  ) {}

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const circuits = await this.getCircuitsUseCase.execute();
      res.json(circuits);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const circuit = await this.getCircuitByIdUseCase.execute(req.params.id);
      res.json(circuit);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createCircuitSchema.parse(req.body);
      const circuit = await this.createCircuitUseCase.execute(dto);
      res.status(201).json(circuit);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = updateCircuitSchema.parse(req.body);
      const circuit = await this.updateCircuitUseCase.execute(req.params.id, dto);
      res.json(circuit);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.deleteCircuitUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
