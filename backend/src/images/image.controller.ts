import type { NextFunction, Request, Response } from 'express';
import { AppError, ErrorCodes } from '../shared/app-error.js';
import { imageService, type ImageService } from './image.service.js';

/** HTTP adapter for the images domain. */
export class ImageController {
  constructor(private readonly service: ImageService = imageService) {}

  getByBreedId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const breedId = String(req.query.breed_id ?? '').trim();
      if (!breedId) {
        throw new AppError(
          'El parámetro "breed_id" es requerido',
          ErrorCodes.VALIDATION_ERROR,
          400,
        );
      }
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      res.json(await this.service.getByBreedId(breedId, limit));
    } catch (err) {
      next(err);
    }
  };
}

export const imageController = new ImageController();
