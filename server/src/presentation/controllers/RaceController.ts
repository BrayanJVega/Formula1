import { Request, Response, NextFunction } from 'express';
import { GetRacesUseCase } from '../../core/useCases/race/GetRacesUseCase.js';
import { GetRaceByIdUseCase } from '../../core/useCases/race/GetRaceByIdUseCase.js';
import { GetNextRaceUseCase } from '../../core/useCases/race/GetNextRaceUseCase.js';
import { CreateRaceUseCase } from '../../core/useCases/race/CreateRaceUseCase.js';
import { UpdateRaceUseCase } from '../../core/useCases/race/UpdateRaceUseCase.js';
import { DeleteRaceUseCase } from '../../core/useCases/race/DeleteRaceUseCase.js';
import { createRaceSchema, updateRaceSchema, getRacesQuerySchema } from '../validators/race.schema.js';

export class RaceController {
  constructor(
    private readonly getRacesUseCase: GetRacesUseCase,
    private readonly getRaceByIdUseCase: GetRaceByIdUseCase,
    private readonly getNextRaceUseCase: GetNextRaceUseCase,
    private readonly createRaceUseCase: CreateRaceUseCase,
    private readonly updateRaceUseCase: UpdateRaceUseCase,
    private readonly deleteRaceUseCase: DeleteRaceUseCase,
  ) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getRacesQuerySchema.parse(req.query);
      const races = await this.getRacesUseCase.execute({
        seasonId: query.seasonId,
        status: query.status as any,
      });
      res.json({ data: races });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const race = await this.getRaceByIdUseCase.execute(req.params.id);
      res.json({ data: race });
    } catch (error) {
      next(error);
    }
  }

  async getNext(_req: Request, res: Response, next: NextFunction) {
    try {
      const race = await this.getNextRaceUseCase.execute();
      res.json({ data: race });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createRaceSchema.parse(req.body);
      const race = await this.createRaceUseCase.execute(dto);
      res.status(201).json({ data: race });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = updateRaceSchema.parse({ ...req.body, id: req.params.id });
      const race = await this.updateRaceUseCase.execute({ ...dto, id: req.params.id });
      res.json({ data: race });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.deleteRaceUseCase.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
