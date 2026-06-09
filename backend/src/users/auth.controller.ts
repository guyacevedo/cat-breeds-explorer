import type { NextFunction, Request, Response } from 'express';
import { AppError, ErrorCodes } from '../shared/app-error.js';
import { authService, type AuthService } from './auth.service.js';
import { loginSchema, registerSchema } from './auth.schemas.js';

/** HTTP adapter for authentication / users. */
export class AuthController {
  constructor(private readonly service: AuthService = authService) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(
          parsed.error.issues[0]?.message ?? 'Datos inválidos',
          ErrorCodes.VALIDATION_ERROR,
          400,
        );
      }
      res.status(201).json(await this.service.register(parsed.data));
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(
          parsed.error.issues[0]?.message ?? 'Datos inválidos',
          ErrorCodes.VALIDATION_ERROR,
          400,
        );
      }
      res.json(await this.service.login(parsed.data));
    } catch (err) {
      next(err);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('No autenticado', ErrorCodes.UNAUTHORIZED, 401);
      }
      res.json(await this.service.getById(req.user.sub));
    } catch (err) {
      next(err);
    }
  };
}

export const authController = new AuthController();
