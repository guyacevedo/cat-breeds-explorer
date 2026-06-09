import express, { type Express } from 'express';
import cors from 'cors';
import breedRoutes from './breeds/breed.routes.js';
import imageRoutes from './images/image.routes.js';
import authRoutes from './users/auth.routes.js';
import { errorHandler, notFoundHandler } from './shared/error.middleware.js';

/** Builds the Express application (composition root, no side effects). */
export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/breeds', breedRoutes);
  app.use('/api/images', imageRoutes);
  app.use('/api/auth', authRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
