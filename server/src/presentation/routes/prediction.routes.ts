import { Router } from 'express';
import { PredictionController } from '../controllers/PredictionController.js';
import { CreatePredictionUseCase } from '../../core/useCases/prediction/CreatePredictionUseCase.js';
import { GetPredictionUseCase } from '../../core/useCases/prediction/GetPredictionUseCase.js';
import { GetUserPredictionsUseCase } from '../../core/useCases/prediction/GetUserPredictionsUseCase.js';
import { GetRacePredictionsUseCase } from '../../core/useCases/prediction/GetRacePredictionsUseCase.js';
import { ScorePredictionUseCase } from '../../core/useCases/prediction/ScorePredictionUseCase.js';
import { UpdatePredictionUseCase } from '../../core/useCases/prediction/UpdatePredictionUseCase.js';
import { ScoringEngine } from '../../core/services/ScoringEngine.js';
import { PredictionRepository } from '../../infrastructure/persistence/repositories/PredictionRepository.js';
import { RaceRepository } from '../../infrastructure/persistence/repositories/RaceRepository.js';
import { DriverRepository } from '../../infrastructure/persistence/repositories/DriverRepository.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createPredictionSchema, updatePredictionSchema, submitPredictionSchema } from '../validators/prediction.schema.js';

const router = Router();

const predictionRepository = new PredictionRepository();
const raceRepository = new RaceRepository();
const driverRepository = new DriverRepository();

const createPredictionUseCase = new CreatePredictionUseCase(
  predictionRepository,
  raceRepository,
  driverRepository,
);
const getPredictionUseCase = new GetPredictionUseCase(predictionRepository);
const getUserPredictionsUseCase = new GetUserPredictionsUseCase(predictionRepository);
const getRacePredictionsUseCase = new GetRacePredictionsUseCase(predictionRepository);
const scoringEngine = new ScoringEngine();
const scorePredictionUseCase = new ScorePredictionUseCase(
  predictionRepository,
  scoringEngine,
);
const updatePredictionUseCase = new UpdatePredictionUseCase(predictionRepository);

const controller = new PredictionController(
  createPredictionUseCase,
  getPredictionUseCase,
  getUserPredictionsUseCase,
  getRacePredictionsUseCase,
  scorePredictionUseCase,
  updatePredictionUseCase,
);

router.post('/', authenticate, validate(createPredictionSchema), controller.create.bind(controller));
router.get('/my', authenticate, controller.getMyPredictions.bind(controller));
router.get('/race/:raceId', authenticate, controller.getByRace.bind(controller));
router.get('/race/:raceId/all', authenticate, requireAdmin, controller.getRacePredictions.bind(controller));
router.get('/:id/score', authenticate, controller.getScore.bind(controller));
router.get('/:id', authenticate, controller.getById.bind(controller));
router.put('/:id', authenticate, validate(updatePredictionSchema), controller.update.bind(controller));
router.post('/:id/submit', authenticate, requireAdmin, validate(submitPredictionSchema), controller.submit.bind(controller));

export default router;
