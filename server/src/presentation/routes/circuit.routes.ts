import { Router } from 'express';
import { CircuitController } from '../controllers/CircuitController.js';
import { GetCircuitsUseCase } from '../../core/useCases/circuit/GetCircuitsUseCase.js';
import { GetCircuitByIdUseCase } from '../../core/useCases/circuit/GetCircuitByIdUseCase.js';
import { CreateCircuitUseCase } from '../../core/useCases/circuit/CreateCircuitUseCase.js';
import { UpdateCircuitUseCase } from '../../core/useCases/circuit/UpdateCircuitUseCase.js';
import { DeleteCircuitUseCase } from '../../core/useCases/circuit/DeleteCircuitUseCase.js';
import { CircuitRepository } from '../../infrastructure/persistence/repositories/CircuitRepository.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createCircuitSchema, updateCircuitSchema } from '../validators/circuit.schema.js';

const router = Router();

const circuitRepository = new CircuitRepository();

const getCircuitsUseCase = new GetCircuitsUseCase(circuitRepository);
const getCircuitByIdUseCase = new GetCircuitByIdUseCase(circuitRepository);
const createCircuitUseCase = new CreateCircuitUseCase(circuitRepository);
const updateCircuitUseCase = new UpdateCircuitUseCase(circuitRepository);
const deleteCircuitUseCase = new DeleteCircuitUseCase(circuitRepository);

const controller = new CircuitController(
  getCircuitsUseCase,
  getCircuitByIdUseCase,
  createCircuitUseCase,
  updateCircuitUseCase,
  deleteCircuitUseCase,
);

router.get('/', authenticate, controller.getAll.bind(controller));
router.get('/:id', authenticate, controller.getById.bind(controller));
router.post('/', authenticate, requireAdmin, validate(createCircuitSchema), controller.create.bind(controller));
router.put('/:id', authenticate, requireAdmin, validate(updateCircuitSchema), controller.update.bind(controller));
router.delete('/:id', authenticate, requireAdmin, controller.delete.bind(controller));

export default router;
