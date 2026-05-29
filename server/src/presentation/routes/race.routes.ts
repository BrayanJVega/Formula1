import { Router } from 'express';
import { RaceController } from '../controllers/RaceController.js';
import { GetRacesUseCase } from '../../core/useCases/race/GetRacesUseCase.js';
import { GetRaceByIdUseCase } from '../../core/useCases/race/GetRaceByIdUseCase.js';
import { GetNextRaceUseCase } from '../../core/useCases/race/GetNextRaceUseCase.js';
import { CreateRaceUseCase } from '../../core/useCases/race/CreateRaceUseCase.js';
import { UpdateRaceUseCase } from '../../core/useCases/race/UpdateRaceUseCase.js';
import { DeleteRaceUseCase } from '../../core/useCases/race/DeleteRaceUseCase.js';
import { RaceRepository } from '../../infrastructure/persistence/repositories/RaceRepository.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createRaceSchema, updateRaceSchema } from '../validators/race.schema.js';

const router = Router();

const raceRepository = new RaceRepository();

const getRacesUseCase = new GetRacesUseCase(raceRepository);
const getRaceByIdUseCase = new GetRaceByIdUseCase(raceRepository);
const getNextRaceUseCase = new GetNextRaceUseCase(raceRepository);
const createRaceUseCase = new CreateRaceUseCase(raceRepository);
const updateRaceUseCase = new UpdateRaceUseCase(raceRepository);
const deleteRaceUseCase = new DeleteRaceUseCase(raceRepository);

const controller = new RaceController(
  getRacesUseCase,
  getRaceByIdUseCase,
  getNextRaceUseCase,
  createRaceUseCase,
  updateRaceUseCase,
  deleteRaceUseCase,
);

router.get('/', authenticate, controller.getAll.bind(controller));
router.get('/next', controller.getNext.bind(controller));
router.get('/:id', authenticate, controller.getById.bind(controller));
router.post('/', authenticate, validate(createRaceSchema), controller.create.bind(controller));
router.put('/:id', authenticate, validate(updateRaceSchema), controller.update.bind(controller));
router.delete('/:id', authenticate, controller.delete.bind(controller));

export default router;
