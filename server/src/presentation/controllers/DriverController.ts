import { Request, Response, NextFunction } from 'express';
import { GetDriversUseCase } from '../../core/useCases/driver/GetDriversUseCase.js';
import { GetDriverByIdUseCase } from '../../core/useCases/driver/GetDriverByIdUseCase.js';
import { CreateDriverUseCase } from '../../core/useCases/driver/CreateDriverUseCase.js';
import { UpdateDriverUseCase } from '../../core/useCases/driver/UpdateDriverUseCase.js';
import { DeleteDriverUseCase } from '../../core/useCases/driver/DeleteDriverUseCase.js';
import { createDriverSchema, updateDriverSchema } from '../validators/driver.schema.js';

export class DriverController {
  constructor(
    private readonly getDriversUseCase: GetDriversUseCase,
    private readonly getDriverByIdUseCase: GetDriverByIdUseCase,
    private readonly createDriverUseCase: CreateDriverUseCase,
    private readonly updateDriverUseCase: UpdateDriverUseCase,
    private readonly deleteDriverUseCase: DeleteDriverUseCase,
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { teamId, nationality, isActive, page, limit } = req.query;
      const result = await this.getDriversUseCase.execute({
        teamId: teamId as string | undefined,
        nationality: nationality as string | undefined,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const driver = await this.getDriverByIdUseCase.execute(req.params.id);
      res.json(driver);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createDriverSchema.parse(req.body);
      const driver = await this.createDriverUseCase.execute({
        ...dto,
        dateOfBirth: new Date(dto.dateOfBirth),
      });
      res.status(201).json(driver);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = updateDriverSchema.parse(req.body);
      const driver = await this.updateDriverUseCase.execute(req.params.id, {
        ...dto,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      });
      res.json(driver);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.deleteDriverUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
