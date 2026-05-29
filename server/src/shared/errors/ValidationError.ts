import { AppError } from './AppError.js';

export class ValidationError extends AppError {
  readonly errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>, message: string = 'Validation failed') {
    super(message, 400);
    this.errors = errors;
  }
}
