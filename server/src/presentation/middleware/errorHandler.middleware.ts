import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError.js';
import { ZodError } from 'zod';
import { logger } from '../../shared/logger.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    logger.warn('Operational error', { message: err.message, statusCode: err.statusCode });
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.statusCode === 400 && 'errors' in err ? { details: (err as any).errors } : {}),
    });
  }

  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    err.errors.forEach((e) => {
      const path = e.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path].push(e.message);
    });
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  logger.error('Unexpected error', { message: err.message, stack: err.stack });
  return res.status(500).json({ error: 'Internal server error' });
}
