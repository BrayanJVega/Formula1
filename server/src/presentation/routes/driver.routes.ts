import { Router } from 'express';
import { DriverController } from '../controllers/DriverController.js';
import { GetDriversUseCase } from '../../core/useCases/driver/GetDriversUseCase.js';
import { GetDriverByIdUseCase } from '../../core/useCases/driver/GetDriverByIdUseCase.js';
import { CreateDriverUseCase } from '../../core/useCases/driver/CreateDriverUseCase.js';
import { UpdateDriverUseCase } from '../../core/useCases/driver/UpdateDriverUseCase.js';
import { DeleteDriverUseCase } from '../../core/useCases/driver/DeleteDriverUseCase.js';
import { DriverRepository } from '../../infrastructure/persistence/repositories/DriverRepository.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createDriverSchema, updateDriverSchema } from '../validators/driver.schema.js';

const router = Router();

const driverRepository = new DriverRepository();

const getDriversUseCase = new GetDriversUseCase(driverRepository);
const getDriverByIdUseCase = new GetDriverByIdUseCase(driverRepository);
const createDriverUseCase = new CreateDriverUseCase(driverRepository);
const updateDriverUseCase = new UpdateDriverUseCase(driverRepository);
const deleteDriverUseCase = new DeleteDriverUseCase(driverRepository);

const controller = new DriverController(
  getDriversUseCase,
  getDriverByIdUseCase,
  createDriverUseCase,
  updateDriverUseCase,
  deleteDriverUseCase,
);

router.get('/', controller.getAll.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.post('/', authenticate, requireAdmin, validate(createDriverSchema), controller.create.bind(controller));
router.put('/:id', authenticate, requireAdmin, validate(updateDriverSchema), controller.update.bind(controller));
router.delete('/:id', authenticate, requireAdmin, controller.delete.bind(controller));

export default router;
