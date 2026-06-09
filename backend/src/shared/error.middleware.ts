import type { NextFunction, Request, Response } from 'express';
import { AppError, ErrorCodes } from './app-error.js';

/** 404 handler for unmatched routes. */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.path}`, ErrorCodes.NOT_FOUND, 404));
}

/** Central error handler — emits the immutable { error, code, timestamp } schema. */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.status).json(err.toJSON());
    return;
  }

  console.error('[error]', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    code: ErrorCodes.INTERNAL_ERROR,
    timestamp: new Date().toISOString(),
  });
}
