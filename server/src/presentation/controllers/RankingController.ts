import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { GetGlobalRankingUseCase } from '../../core/useCases/ranking/GetGlobalRankingUseCase.js';
import { GetWeeklyRankingUseCase } from '../../core/useCases/ranking/GetWeeklyRankingUseCase.js';
import { GetCountryRankingUseCase } from '../../core/useCases/ranking/GetCountryRankingUseCase.js';
import { GetUserRankingUseCase } from '../../core/useCases/ranking/GetUserRankingUseCase.js';
import { globalRankingQuerySchema, weeklyRankingQuerySchema, userRankingQuerySchema } from '../validators/ranking.schema.js';

export class RankingController {
  constructor(
    private readonly getGlobalRankingUseCase: GetGlobalRankingUseCase,
    private readonly getWeeklyRankingUseCase: GetWeeklyRankingUseCase,
    private readonly getCountryRankingUseCase: GetCountryRankingUseCase,
    private readonly getUserRankingUseCase: GetUserRankingUseCase,
  ) {}

  async getGlobal(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = globalRankingQuerySchema.parse(req.query);
      const seasonId = query.seasonId || req.user?.userId;
      if (!seasonId) {
        res.status(400).json({ error: 'seasonId is required' });
        return;
      }
      const result = await this.getGlobalRankingUseCase.execute({
        seasonId,
        page: query.page,
        limit: query.limit,
      });
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async getWeekly(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = weeklyRankingQuerySchema.parse(req.query);
      const result = await this.getWeeklyRankingUseCase.execute({
        page: query.page,
        limit: query.limit,
      });
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async getCountry(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { code } = req.params;
      const query = userRankingQuerySchema.parse(req.query);
      const seasonId = query.seasonId || req.user?.userId;
      if (!seasonId) {
        res.status(400).json({ error: 'seasonId is required' });
        return;
      }
      const rankings = await this.getCountryRankingUseCase.execute({
        countryCode: code,
        seasonId,
      });
      res.json({ data: rankings });
    } catch (error) {
      next(error);
    }
  }

  async getUserPosition(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = userRankingQuerySchema.parse(req.query);
      const seasonId = query.seasonId || req.user?.userId;
      if (!seasonId) {
        res.status(400).json({ error: 'seasonId is required' });
        return;
      }
      const ranking = await this.getUserRankingUseCase.execute({
        userId: req.user!.userId,
        seasonId,
      });
      res.json({ data: ranking });
    } catch (error) {
      next(error);
    }
  }
}
