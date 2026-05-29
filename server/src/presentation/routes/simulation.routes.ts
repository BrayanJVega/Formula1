import { Router } from 'express';
import { SimulationController } from '../controllers/SimulationController.js';
import { RunRaceSimulationUseCase } from '../../core/useCases/simulation/RunRaceSimulationUseCase.js';
import { RunSeasonSimulationUseCase } from '../../core/useCases/simulation/RunSeasonSimulationUseCase.js';
import { RunWhatIfSimulationUseCase } from '../../core/useCases/simulation/RunWhatIfSimulationUseCase.js';
import { GetSimulationHistoryUseCase, GetSimulationByIdUseCase } from '../../core/useCases/simulation/GetSimulationHistoryUseCase.js';
import { SimulationRepository } from '../../infrastructure/persistence/repositories/SimulationRepository.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { runRaceSchema, runSeasonSchema, runWhatIfSchema } from '../validators/simulation.schema.js';

const router = Router();

const simulationRepository = new SimulationRepository();

const runRaceUseCase = new RunRaceSimulationUseCase();
const runSeasonUseCase = new RunSeasonSimulationUseCase();
const runWhatIfUseCase = new RunWhatIfSimulationUseCase();
const getHistoryUseCase = new GetSimulationHistoryUseCase(simulationRepository);
const getByIdUseCase = new GetSimulationByIdUseCase(simulationRepository);

const controller = new SimulationController(
  runRaceUseCase,
  runSeasonUseCase,
  runWhatIfUseCase,
  getHistoryUseCase,
  getByIdUseCase,
);

router.post('/race', authenticate, validate(runRaceSchema), controller.runRace.bind(controller));
router.post('/season', authenticate, validate(runSeasonSchema), controller.runSeason.bind(controller));
router.post('/what-if', authenticate, validate(runWhatIfSchema), controller.runWhatIf.bind(controller));
router.get('/history', authenticate, controller.getHistory.bind(controller));
router.get('/:id', authenticate, controller.getById.bind(controller));

export default router;
