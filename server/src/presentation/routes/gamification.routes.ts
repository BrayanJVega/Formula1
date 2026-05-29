import { Router } from 'express';
import { GamificationController } from '../controllers/GamificationController.js';
import { GetGamificationProfileUseCase } from '../../core/useCases/gamification/GetGamificationProfileUseCase.js';
import { AchievementRepository } from '../../infrastructure/persistence/repositories/AchievementRepository.js';
import { LevelService } from '../../core/services/LevelService.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

const achievementRepository = new AchievementRepository();
const levelService = new LevelService();
const getGamificationProfileUseCase = new GetGamificationProfileUseCase(levelService);

const controller = new GamificationController(
  getGamificationProfileUseCase,
  achievementRepository,
);

router.get('/profile', authenticate, controller.getProfile.bind(controller));
router.get('/achievements', authenticate, controller.getAchievements.bind(controller));
router.get('/levels', authenticate, controller.getLevels.bind(controller));
router.get('/streaks', authenticate, controller.getStreaks.bind(controller));

export default router;
