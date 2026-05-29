import { Router } from 'express';
import authRoutes from './auth.routes.js';
import driverRoutes from './driver.routes.js';
import teamRoutes from './team.routes.js';
import circuitRoutes from './circuit.routes.js';
import raceRoutes from './race.routes.js';
import simulationRoutes from './simulation.routes.js';
import rankingRoutes from './ranking.routes.js';
import leagueRoutes from './league.routes.js';
import fantasyRoutes from './fantasy.routes.js';
import gamificationRoutes from './gamification.routes.js';
import predictionRoutes from './prediction.routes.js';
import aiRoutes from './ai.routes.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use('/auth', authRoutes);

// Protected routes
router.use('/drivers', driverRoutes);
router.use('/teams', teamRoutes);
router.use('/circuits', circuitRoutes);
router.use('/races', raceRoutes);
router.use('/predictions', predictionRoutes);
router.use('/fantasy', fantasyRoutes);
router.use('/rankings', rankingRoutes);
router.use('/leagues', authenticate, leagueRoutes);
router.use('/simulation', authenticate, simulationRoutes);
router.use('/statistics', (_, res) => res.json({ message: 'Statistics module - coming soon' }));
router.use('/gamification', authenticate, gamificationRoutes);
router.use('/ai', authenticate, aiRoutes);

export default router;
