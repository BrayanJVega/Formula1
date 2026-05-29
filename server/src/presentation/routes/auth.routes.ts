import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { RegisterUseCase } from '../../core/useCases/auth/RegisterUseCase.js';
import { LoginUseCase } from '../../core/useCases/auth/LoginUseCase.js';
import { ForgotPasswordUseCase } from '../../core/useCases/auth/ForgotPasswordUseCase.js';
import { RefreshTokenUseCase } from '../../core/useCases/auth/RefreshTokenUseCase.js';
import { UserRepository } from '../../infrastructure/persistence/repositories/UserRepository.js';
import { BcryptProvider } from '../../infrastructure/auth/BcryptProvider.js';
import { JwtProvider } from '../../infrastructure/auth/JwtProvider.js';
import { EmailProvider } from '../../infrastructure/auth/EmailProvider.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { registerSchema, loginSchema, forgotPasswordSchema } from '../validators/auth.schema.js';
import { authLimiter } from '../../config/rateLimit.js';

const router = Router();

const userRepository = new UserRepository();
const bcryptProvider = new BcryptProvider();
const jwtProvider = new JwtProvider();
const emailProvider = new EmailProvider();

const registerUseCase = new RegisterUseCase(userRepository, bcryptProvider, jwtProvider);
const loginUseCase = new LoginUseCase(userRepository, bcryptProvider, jwtProvider);
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, emailProvider);
const refreshTokenUseCase = new RefreshTokenUseCase(userRepository, jwtProvider);

const controller = new AuthController(
  registerUseCase,
  loginUseCase,
  forgotPasswordUseCase,
  refreshTokenUseCase,
);

router.post('/register', authLimiter, validate(registerSchema), controller.register.bind(controller));
router.post('/login', authLimiter, validate(loginSchema), controller.login.bind(controller));
router.post('/logout', controller.logout.bind(controller));
router.post('/refresh', controller.refresh.bind(controller));
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), controller.forgotPassword.bind(controller));
router.get('/me', authenticate, controller.me.bind(controller));

export default router;
