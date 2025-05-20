import { ErrorCodes } from '../constants/constants';

export class AppError extends Error {
  constructor(
    public code: ErrorCodes,
    message?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
} 