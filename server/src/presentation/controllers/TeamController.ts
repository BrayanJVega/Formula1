import { Request, Response, NextFunction } from 'express';
import { GetTeamsUseCase } from '../../core/useCases/team/GetTeamsUseCase.js';
import { GetTeamByIdUseCase } from '../../core/useCases/team/GetTeamByIdUseCase.js';
import { CreateTeamUseCase } from '../../core/useCases/team/CreateTeamUseCase.js';
import { UpdateTeamUseCase } from '../../core/useCases/team/UpdateTeamUseCase.js';
import { DeleteTeamUseCase } from '../../core/useCases/team/DeleteTeamUseCase.js';
import { createTeamSchema, updateTeamSchema } from '../validators/team.schema.js';

export class TeamController {
  constructor(
    private readonly getTeamsUseCase: GetTeamsUseCase,
    private readonly getTeamByIdUseCase: GetTeamByIdUseCase,
    private readonly createTeamUseCase: CreateTeamUseCase,
    private readonly updateTeamUseCase: UpdateTeamUseCase,
    private readonly deleteTeamUseCase: DeleteTeamUseCase,
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const isActive = req.query.isActive !== undefined
        ? req.query.isActive === 'true'
        : undefined;
      const teams = await this.getTeamsUseCase.execute(
        isActive !== undefined ? { isActive } : undefined,
      );
      res.json({ data: teams });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const team = await this.getTeamByIdUseCase.execute(req.params.id);
      res.json({ data: team });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createTeamSchema.parse(req.body);
      const team = await this.createTeamUseCase.execute(dto);
      res.status(201).json({ data: team });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = updateTeamSchema.parse(req.body);
      const team = await this.updateTeamUseCase.execute(req.params.id, dto);
      res.json({ data: team });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.deleteTeamUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
