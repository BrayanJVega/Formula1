import { Request, Response, NextFunction } from 'express';
import { GetAIPredictionsUseCase } from '../../core/useCases/ai/GetAIPredictionsUseCase.js';
import { GetWinProbabilitiesUseCase } from '../../core/useCases/ai/GetWinProbabilitiesUseCase.js';

export class AIController {
  constructor(
    private readonly getAIPredictionsUseCase: GetAIPredictionsUseCase,
    private readonly getWinProbabilitiesUseCase: GetWinProbabilitiesUseCase,
  ) {}

  async getPredictions(req: Request, res: Response, next: NextFunction) {
    try {
      const { raceId } = req.params;
      const predictions = await this.getAIPredictionsUseCase.execute(raceId);
      res.json({ data: predictions });
    } catch (error) {
      next(error);
    }
  }

  async getWinProbabilities(req: Request, res: Response, next: NextFunction) {
    try {
      const { raceId } = req.params;
      const probabilities = await this.getWinProbabilitiesUseCase.execute(raceId);
      res.json({ data: probabilities });
    } catch (error) {
      next(error);
    }
  }
}
