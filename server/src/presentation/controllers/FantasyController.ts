import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { CreateFantasyTeamUseCase } from '../../core/useCases/fantasy/CreateFantasyTeamUseCase.js';
import { GetFantasyTeamUseCase } from '../../core/useCases/fantasy/GetFantasyTeamUseCase.js';
import { UpdateFantasyTeamUseCase } from '../../core/useCases/fantasy/UpdateFantasyTeamUseCase.js';
import { AddPickUseCase } from '../../core/useCases/fantasy/AddPickUseCase.js';
import { RemovePickUseCase } from '../../core/useCases/fantasy/RemovePickUseCase.js';
import { TransferDriverUseCase } from '../../core/useCases/fantasy/TransferDriverUseCase.js';
import { GetMarketValuesUseCase } from '../../core/useCases/fantasy/GetMarketValuesUseCase.js';
import { GetFantasyStandingsUseCase } from '../../core/useCases/fantasy/GetFantasyStandingsUseCase.js';
import { FantasyRepository } from '../../infrastructure/persistence/repositories/FantasyRepository.js';
import { createFantasyTeamSchema, updateFantasyTeamSchema, addPickSchema, transferDriverSchema } from '../validators/fantasy.schema.js';

export class FantasyController {
  private fantasyRepository: FantasyRepository;

  constructor(
    private readonly createFantasyTeamUseCase: CreateFantasyTeamUseCase,
    private readonly getFantasyTeamUseCase: GetFantasyTeamUseCase,
    private readonly updateFantasyTeamUseCase: UpdateFantasyTeamUseCase,
    private readonly addPickUseCase: AddPickUseCase,
    private readonly removePickUseCase: RemovePickUseCase,
    private readonly transferDriverUseCase: TransferDriverUseCase,
    private readonly getMarketValuesUseCase: GetMarketValuesUseCase,
    private readonly getFantasyStandingsUseCase: GetFantasyStandingsUseCase,
  ) {
    this.fantasyRepository = new FantasyRepository();
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = createFantasyTeamSchema.parse(req.body);
      const team = await this.createFantasyTeamUseCase.execute({
        userId: req.user!.userId,
        seasonId: dto.seasonId,
        name: dto.name,
      });
      res.status(201).json(team);
    } catch (error) {
      next(error);
    }
  }

  async getMyTeam(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { seasonId } = req.query;
      if (!seasonId) {
        res.status(400).json({ error: 'seasonId is required' });
        return;
      }
      const team = await this.getFantasyTeamUseCase.findByUserAndSeason(
        req.user!.userId,
        seasonId as string,
      );
      if (!team) {
        res.status(404).json({ error: 'Fantasy team not found' });
        return;
      }

      const picks = await this.fantasyRepository.getPicks(team.id);
      const transfers = await this.fantasyRepository.getTransfers(team.id);

      res.json({ ...team, picks, transfers });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const team = await this.getFantasyTeamUseCase.execute(req.params.id);
      const picks = await this.fantasyRepository.getPicks(team.id);
      const transfers = await this.fantasyRepository.getTransfers(team.id);
      res.json({ ...team, picks, transfers });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = updateFantasyTeamSchema.parse(req.body);
      const team = await this.updateFantasyTeamUseCase.execute(req.params.id, dto);
      res.json(team);
    } catch (error) {
      next(error);
    }
  }

  async addPick(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = addPickSchema.parse(req.body);
      const pick = await this.addPickUseCase.execute({
        fantasyTeamId: req.params.id,
        ...dto,
      });
      res.status(201).json(pick);
    } catch (error) {
      next(error);
    }
  }

  async removePick(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const team = await this.removePickUseCase.execute(req.params.pickId);
      res.json(team);
    } catch (error) {
      next(error);
    }
  }

  async transfer(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = transferDriverSchema.parse(req.body);
      const result = await this.transferDriverUseCase.execute({
        fantasyTeamId: req.params.id,
        ...dto,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMarketValues(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { seasonId } = req.query;
      if (!seasonId) {
        res.status(400).json({ error: 'seasonId is required' });
        return;
      }
      const values = await this.getMarketValuesUseCase.execute(seasonId as string);
      res.json(values);
    } catch (error) {
      next(error);
    }
  }

  async getStandings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { seasonId } = req.query;
      if (!seasonId) {
        res.status(400).json({ error: 'seasonId is required' });
        return;
      }
      const standings = await this.getFantasyStandingsUseCase.execute(seasonId as string);
      res.json(standings);
    } catch (error) {
      next(error);
    }
  }
}
