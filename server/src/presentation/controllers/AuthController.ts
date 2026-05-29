import { Request, Response, NextFunction } from 'express';
import { RegisterUseCase } from '../../core/useCases/auth/RegisterUseCase.js';
import { LoginUseCase } from '../../core/useCases/auth/LoginUseCase.js';
import { ForgotPasswordUseCase } from '../../core/useCases/auth/ForgotPasswordUseCase.js';
import { RefreshTokenUseCase } from '../../core/useCases/auth/RefreshTokenUseCase.js';
import { registerSchema, loginSchema, forgotPasswordSchema, refreshTokenSchema } from '../validators/auth.schema.js';

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = registerSchema.parse(req.body);
      const result = await this.registerUseCase.execute(dto);
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = loginSchema.parse(req.body);
      const result = await this.loginUseCase.execute(dto);
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response) {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = refreshTokenSchema.parse({
        refreshToken: req.cookies?.refreshToken || req.body?.refreshToken,
      });
      const result = await this.refreshTokenUseCase.execute(refreshToken);
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      await this.forgotPasswordUseCase.execute(email);
      res.json({ message: 'Password reset email sent if account exists' });
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response) {
    res.json({ user: (req as any).user });
  }
}
