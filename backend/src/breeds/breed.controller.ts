import type { NextFunction, Request, Response } from 'express';
import { AppError, ErrorCodes } from '../shared/app-error.js';
import { breedService, type BreedService } from './breed.service.js';

/** HTTP adapter for the breeds domain. No business logic lives here. */
export class BreedController {
  constructor(private readonly service: BreedService = breedService) {}

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await this.service.getAll());
    } catch (err) {
      next(err);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = String(req.query.q ?? '').trim();
      if (!q) {
        throw new AppError('El parámetro de búsqueda "q" es requerido', ErrorCodes.VALIDATION_ERROR, 400);
      }
      res.json(await this.service.search(q));
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await this.service.getById(req.params.breed_id));
    } catch (err) {
      next(err);
    }
  };
}

export const breedController = new BreedController();
