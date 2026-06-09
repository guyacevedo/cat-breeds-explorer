import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError, ErrorCodes } from '../shared/app-error.js';

export interface AuthPayload {
  sub: string;
  email: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/** Route guard: requires a valid Bearer JWT. */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Token no provisto', ErrorCodes.UNAUTHORIZED, 401));
  }

  try {
    const payload = jwt.verify(token, env.jwt.secret) as AuthPayload;
    req.user = { sub: payload.sub, email: payload.email };
    next();
  } catch {
    next(new AppError('Token inválido o expirado', ErrorCodes.UNAUTHORIZED, 401));
  }
}
