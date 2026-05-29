import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { CreateLeagueUseCase } from '../../core/useCases/league/CreateLeagueUseCase.js';
import { GetLeagueUseCase } from '../../core/useCases/league/GetLeagueUseCase.js';
import { JoinLeagueUseCase } from '../../core/useCases/league/JoinLeagueUseCase.js';
import { LeaveLeagueUseCase } from '../../core/useCases/league/LeaveLeagueUseCase.js';
import { GetMyLeaguesUseCase } from '../../core/useCases/league/GetMyLeaguesUseCase.js';
import { GetLeagueRankingUseCase } from '../../core/useCases/league/GetLeagueRankingUseCase.js';
import { createLeagueSchema, joinLeagueSchema } from '../validators/league.schema.js';

export class LeagueController {
  constructor(
    private readonly createLeagueUseCase: CreateLeagueUseCase,
    private readonly getLeagueUseCase: GetLeagueUseCase,
    private readonly joinLeagueUseCase: JoinLeagueUseCase,
    private readonly leaveLeagueUseCase: LeaveLeagueUseCase,
    private readonly getMyLeaguesUseCase: GetMyLeaguesUseCase,
    private readonly getLeagueRankingUseCase: GetLeagueRankingUseCase,
  ) {}

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = createLeagueSchema.parse(req.body);
      const league = await this.createLeagueUseCase.execute({
        ...dto,
        ownerId: req.user!.userId,
      });
      res.status(201).json({ data: league });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.getLeagueUseCase.execute(id);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async join(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = joinLeagueSchema.parse(req.body);
      const league = await this.joinLeagueUseCase.execute(dto.code, req.user!.userId);
      res.json({ data: league, message: 'Successfully joined the league' });
    } catch (error) {
      next(error);
    }
  }

  async leave(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.leaveLeagueUseCase.execute(id, req.user!.userId);
      res.json({ message: 'Successfully left the league' });
    } catch (error) {
      next(error);
    }
  }

  async getMyLeagues(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const leagues = await this.getMyLeaguesUseCase.execute(req.user!.userId);
      res.json({ data: leagues });
    } catch (error) {
      next(error);
    }
  }

  async getMembers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await this.getLeagueUseCase.execute(id);
      res.json({ data: result.members });
    } catch (error) {
      next(error);
    }
  }

  async getLeagueRanking(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const rankings = await this.getLeagueRankingUseCase.execute(id);
      res.json({ data: rankings });
    } catch (error) {
      next(error);
    }
  }
}
