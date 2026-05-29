import { Router } from 'express';
import { FantasyController } from '../controllers/FantasyController.js';
import { CreateFantasyTeamUseCase } from '../../core/useCases/fantasy/CreateFantasyTeamUseCase.js';
import { GetFantasyTeamUseCase } from '../../core/useCases/fantasy/GetFantasyTeamUseCase.js';
import { UpdateFantasyTeamUseCase } from '../../core/useCases/fantasy/UpdateFantasyTeamUseCase.js';
import { AddPickUseCase } from '../../core/useCases/fantasy/AddPickUseCase.js';
import { RemovePickUseCase } from '../../core/useCases/fantasy/RemovePickUseCase.js';
import { TransferDriverUseCase } from '../../core/useCases/fantasy/TransferDriverUseCase.js';
import { GetMarketValuesUseCase } from '../../core/useCases/fantasy/GetMarketValuesUseCase.js';
import { GetFantasyStandingsUseCase } from '../../core/useCases/fantasy/GetFantasyStandingsUseCase.js';
import { FantasyRepository } from '../../infrastructure/persistence/repositories/FantasyRepository.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createFantasyTeamSchema, updateFantasyTeamSchema, addPickSchema, transferDriverSchema } from '../validators/fantasy.schema.js';

const router = Router();

const fantasyRepository = new FantasyRepository();

const createFantasyTeamUseCase = new CreateFantasyTeamUseCase(fantasyRepository);
const getFantasyTeamUseCase = new GetFantasyTeamUseCase(fantasyRepository);
const updateFantasyTeamUseCase = new UpdateFantasyTeamUseCase(fantasyRepository);
const addPickUseCase = new AddPickUseCase(fantasyRepository);
const removePickUseCase = new RemovePickUseCase(fantasyRepository);
const transferDriverUseCase = new TransferDriverUseCase(fantasyRepository);
const getMarketValuesUseCase = new GetMarketValuesUseCase(fantasyRepository);
const getFantasyStandingsUseCase = new GetFantasyStandingsUseCase(fantasyRepository);

const controller = new FantasyController(
  createFantasyTeamUseCase,
  getFantasyTeamUseCase,
  updateFantasyTeamUseCase,
  addPickUseCase,
  removePickUseCase,
  transferDriverUseCase,
  getMarketValuesUseCase,
  getFantasyStandingsUseCase,
);

router.post('/team', authenticate, validate(createFantasyTeamSchema), controller.create.bind(controller));
router.get('/team/my', authenticate, controller.getMyTeam.bind(controller));
router.get('/team/:id', authenticate, controller.getById.bind(controller));
router.put('/team/:id', authenticate, validate(updateFantasyTeamSchema), controller.update.bind(controller));
router.post('/team/:id/picks', authenticate, validate(addPickSchema), controller.addPick.bind(controller));
router.delete('/picks/:pickId', authenticate, controller.removePick.bind(controller));
router.post('/team/:id/transfer', authenticate, validate(transferDriverSchema), controller.transfer.bind(controller));
router.get('/market-values', authenticate, controller.getMarketValues.bind(controller));
router.get('/standings', authenticate, controller.getStandings.bind(controller));

export default router;
