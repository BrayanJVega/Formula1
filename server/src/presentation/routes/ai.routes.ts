import { Router } from 'express';
import { AIController } from '../controllers/AIController.js';
import { GetAIPredictionsUseCase } from '../../core/useCases/ai/GetAIPredictionsUseCase.js';
import { GetWinProbabilitiesUseCase } from '../../core/useCases/ai/GetWinProbabilitiesUseCase.js';
import { AIPredictionService } from '../../core/services/AIPredictionService.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

const aiPredictionService = new AIPredictionService();
const getAIPredictionsUseCase = new GetAIPredictionsUseCase(aiPredictionService);
const getWinProbabilitiesUseCase = new GetWinProbabilitiesUseCase(aiPredictionService);

const controller = new AIController(
  getAIPredictionsUseCase,
  getWinProbabilitiesUseCase,
);

router.get('/predictions/:raceId', authenticate, controller.getPredictions.bind(controller));
router.get('/win-probabilities/:raceId', authenticate, controller.getWinProbabilities.bind(controller));

export default router;
