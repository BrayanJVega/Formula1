import { Router } from 'express';
import { TeamController } from '../controllers/TeamController.js';
import { GetTeamsUseCase } from '../../core/useCases/team/GetTeamsUseCase.js';
import { GetTeamByIdUseCase } from '../../core/useCases/team/GetTeamByIdUseCase.js';
import { CreateTeamUseCase } from '../../core/useCases/team/CreateTeamUseCase.js';
import { UpdateTeamUseCase } from '../../core/useCases/team/UpdateTeamUseCase.js';
import { DeleteTeamUseCase } from '../../core/useCases/team/DeleteTeamUseCase.js';
import { TeamRepository } from '../../infrastructure/persistence/repositories/TeamRepository.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createTeamSchema, updateTeamSchema } from '../validators/team.schema.js';

const router = Router();

const teamRepository = new TeamRepository();

const getTeamsUseCase = new GetTeamsUseCase(teamRepository);
const getTeamByIdUseCase = new GetTeamByIdUseCase(teamRepository);
const createTeamUseCase = new CreateTeamUseCase(teamRepository);
const updateTeamUseCase = new UpdateTeamUseCase(teamRepository);
const deleteTeamUseCase = new DeleteTeamUseCase(teamRepository);

const controller = new TeamController(
  getTeamsUseCase,
  getTeamByIdUseCase,
  createTeamUseCase,
  updateTeamUseCase,
  deleteTeamUseCase,
);

router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/', authenticate, validate(createTeamSchema), controller.create.bind(controller));
router.put('/:id', authenticate, validate(updateTeamSchema), controller.update.bind(controller));
router.delete('/:id', authenticate, controller.delete.bind(controller));

export default router;
