import { Router } from 'express';
import { RankingController } from '../controllers/RankingController.js';
import { GetGlobalRankingUseCase } from '../../core/useCases/ranking/GetGlobalRankingUseCase.js';
import { GetWeeklyRankingUseCase } from '../../core/useCases/ranking/GetWeeklyRankingUseCase.js';
import { GetCountryRankingUseCase } from '../../core/useCases/ranking/GetCountryRankingUseCase.js';
import { GetUserRankingUseCase } from '../../core/useCases/ranking/GetUserRankingUseCase.js';
import { RankingRepository } from '../../infrastructure/persistence/repositories/RankingRepository.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

const rankingRepository = new RankingRepository();

const getGlobalRankingUseCase = new GetGlobalRankingUseCase(rankingRepository);
const getWeeklyRankingUseCase = new GetWeeklyRankingUseCase(rankingRepository);
const getCountryRankingUseCase = new GetCountryRankingUseCase(rankingRepository);
const getUserRankingUseCase = new GetUserRankingUseCase(rankingRepository);

const controller = new RankingController(
  getGlobalRankingUseCase,
  getWeeklyRankingUseCase,
  getCountryRankingUseCase,
  getUserRankingUseCase,
);

router.get('/global', optionalAuth, controller.getGlobal.bind(controller));
router.get('/weekly', optionalAuth, controller.getWeekly.bind(controller));
router.get('/country/:code', optionalAuth, controller.getCountry.bind(controller));
router.get('/me', authenticate, controller.getUserPosition.bind(controller));

export default router;
