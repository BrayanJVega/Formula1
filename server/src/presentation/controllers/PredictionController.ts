import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { CreatePredictionUseCase } from '../../core/useCases/prediction/CreatePredictionUseCase.js';
import { GetPredictionUseCase } from '../../core/useCases/prediction/GetPredictionUseCase.js';
import { GetUserPredictionsUseCase } from '../../core/useCases/prediction/GetUserPredictionsUseCase.js';
import { GetRacePredictionsUseCase } from '../../core/useCases/prediction/GetRacePredictionsUseCase.js';
import { ScorePredictionUseCase } from '../../core/useCases/prediction/ScorePredictionUseCase.js';
import { UpdatePredictionUseCase } from '../../core/useCases/prediction/UpdatePredictionUseCase.js';
import { createPredictionSchema, updatePredictionSchema, submitPredictionSchema, predictionQuerySchema } from '../validators/prediction.schema.js';
import { queryOne } from '../../config/database.js';

export class PredictionController {
  constructor(
    private readonly createPredictionUseCase: CreatePredictionUseCase,
    private readonly getPredictionUseCase: GetPredictionUseCase,
    private readonly getUserPredictionsUseCase: GetUserPredictionsUseCase,
    private readonly getRacePredictionsUseCase: GetRacePredictionsUseCase,
    private readonly scorePredictionUseCase: ScorePredictionUseCase,
    private readonly updatePredictionUseCase: UpdatePredictionUseCase,
  ) {}

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = createPredictionSchema.parse(req.body);
      const prediction = await this.createPredictionUseCase.execute({
        ...dto,
        userId: req.user!.userId,
      });
      res.status(201).json({ data: prediction });
    } catch (error) {
      next(error);
    }
  }

  async getMyPredictions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = predictionQuerySchema.parse(req.query);
      const result = await this.getUserPredictionsUseCase.execute({
        userId: req.user!.userId,
        page: query.page,
        limit: query.limit,
      });
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async getByRace(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { raceId } = req.params;
      const prediction = await this.getPredictionUseCase.executeByUserAndRace(
        req.user!.userId,
        raceId,
      );
      res.json({ data: prediction });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const prediction = await this.getPredictionUseCase.executeById(id);

      if (prediction.userId !== req.user!.userId && req.user!.role !== 'admin') {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const scoreRow = await queryOne<Record<string, unknown>>(
        'SELECT * FROM prediction_scores WHERE prediction_id = $1',
        [id],
      );

      res.json({ data: prediction, scores: scoreRow ?? null });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = updatePredictionSchema.parse(req.body);
      const cleanDto = Object.fromEntries(
        Object.entries(dto).filter(([_, v]) => v !== null)
      );
      const prediction = await this.updatePredictionUseCase.execute({
        id: req.params.id,
        userId: req.user!.userId,
        ...cleanDto,
      });
      res.json({ data: prediction });
    } catch (error) {
      next(error);
    }
  }

  async submit(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto = submitPredictionSchema.parse(req.body);
      const result = await this.scorePredictionUseCase.execute({
        predictionId: req.params.id,
        actualResults: dto.actualResults as any,
      });
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }

  async getScore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const scoreRow = await queryOne<Record<string, unknown>>(
        'SELECT * FROM prediction_scores WHERE prediction_id = $1',
        [id],
      );
      if (!scoreRow) {
        res.status(404).json({ error: 'Score not found for this prediction' });
        return;
      }
      res.json({ data: scoreRow });
    } catch (error) {
      next(error);
    }
  }

  async getRacePredictions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { raceId } = req.params;
      const predictions = await this.getRacePredictionsUseCase.execute(raceId);
      res.json({ data: predictions });
    } catch (error) {
      next(error);
    }
  }
}
