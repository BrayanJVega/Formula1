import { Router } from 'express';
import { LeagueController } from '../controllers/LeagueController.js';
import { CreateLeagueUseCase } from '../../core/useCases/league/CreateLeagueUseCase.js';
import { GetLeagueUseCase } from '../../core/useCases/league/GetLeagueUseCase.js';
import { JoinLeagueUseCase } from '../../core/useCases/league/JoinLeagueUseCase.js';
import { LeaveLeagueUseCase } from '../../core/useCases/league/LeaveLeagueUseCase.js';
import { GetMyLeaguesUseCase } from '../../core/useCases/league/GetMyLeaguesUseCase.js';
import { GetLeagueRankingUseCase } from '../../core/useCases/league/GetLeagueRankingUseCase.js';
import { LeagueRepository } from '../../infrastructure/persistence/repositories/LeagueRepository.js';
import { RankingRepository } from '../../infrastructure/persistence/repositories/RankingRepository.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createLeagueSchema, joinLeagueSchema } from '../validators/league.schema.js';

const router = Router();

const leagueRepository = new LeagueRepository();
const rankingRepository = new RankingRepository();

const createLeagueUseCase = new CreateLeagueUseCase(leagueRepository);
const getLeagueUseCase = new GetLeagueUseCase(leagueRepository);
const joinLeagueUseCase = new JoinLeagueUseCase(leagueRepository);
const leaveLeagueUseCase = new LeaveLeagueUseCase(leagueRepository);
const getMyLeaguesUseCase = new GetMyLeaguesUseCase(leagueRepository);
const getLeagueRankingUseCase = new GetLeagueRankingUseCase(rankingRepository, leagueRepository);

const controller = new LeagueController(
  createLeagueUseCase,
  getLeagueUseCase,
  joinLeagueUseCase,
  leaveLeagueUseCase,
  getMyLeaguesUseCase,
  getLeagueRankingUseCase,
);

router.post('/', authenticate, validate(createLeagueSchema), controller.create.bind(controller));
router.get('/my', authenticate, controller.getMyLeagues.bind(controller));
router.get('/:id', authenticate, controller.getById.bind(controller));
router.post('/:id/join', authenticate, validate(joinLeagueSchema), controller.join.bind(controller));
router.post('/:id/leave', authenticate, controller.leave.bind(controller));
router.get('/:id/members', authenticate, controller.getMembers.bind(controller));
router.get('/:id/ranking', authenticate, controller.getLeagueRanking.bind(controller));

export default router;
