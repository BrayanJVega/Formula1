import { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { RunRaceSimulationUseCase } from '../../core/useCases/simulation/RunRaceSimulationUseCase.js';
import { RunSeasonSimulationUseCase } from '../../core/useCases/simulation/RunSeasonSimulationUseCase.js';
import { RunWhatIfSimulationUseCase } from '../../core/useCases/simulation/RunWhatIfSimulationUseCase.js';
import { GetSimulationHistoryUseCase, GetSimulationByIdUseCase } from '../../core/useCases/simulation/GetSimulationHistoryUseCase.js';
import { runRaceSchema, runSeasonSchema, runWhatIfSchema } from '../validators/simulation.schema.js';

export class SimulationController {
  constructor(
    private readonly runRaceUseCase: RunRaceSimulationUseCase,
    private readonly runSeasonUseCase: RunSeasonSimulationUseCase,
    private readonly runWhatIfUseCase: RunWhatIfSimulationUseCase,
    private readonly getHistoryUseCase: GetSimulationHistoryUseCase,
    private readonly getByIdUseCase: GetSimulationByIdUseCase,
  ) {}

  async runRace(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = runRaceSchema.parse(req.body);
      const { simulation, result } = await this.runRaceUseCase.execute(input);
      res.status(201).json({ data: { simulation, result } });
    } catch (error) {
      next(error);
    }
  }

  async runSeason(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = runSeasonSchema.parse(req.body);
      const { simulation, result } = await this.runSeasonUseCase.execute(input);
      res.status(201).json({ data: { simulation, result } });
    } catch (error) {
      next(error);
    }
  }

  async runWhatIf(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = runWhatIfSchema.parse(req.body);
      const { simulation, result } = await this.runWhatIfUseCase.execute(input);
      res.status(201).json({ data: { simulation, result } });
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId ?? '';
      const type = req.query.type as string | undefined;
      const simulations = await this.getHistoryUseCase.execute(userId, type);
      res.json({ data: simulations });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const simulation = await this.getByIdUseCase.execute(req.params.id);
      if (!simulation) {
        res.status(404).json({ error: 'Simulation not found' });
        return;
      }
      res.json({ data: simulation });
    } catch (error) {
      next(error);
    }
  }
}
