import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from './logger.js';

export class AppError extends Error {
  constructor(public readonly status: number, message: string, public readonly code = 'APP_ERROR') {
    super(message);
  }
}

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, 'Route not found', 'NOT_FOUND'));
}

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', details: error.flatten() } });
  }
  const known = error instanceof AppError;
  const status = known ? error.status : 500;
  const code = known ? error.code : 'INTERNAL_ERROR';
  logger.error({ err: error, requestId: req.header('x-request-id'), code }, 'request failed');
  return res.status(status).json({ error: { code, message: known ? error.message : 'Unexpected server error' } });
}
