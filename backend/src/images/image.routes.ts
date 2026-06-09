import { Router } from 'express';
import { imageController } from './image.controller.js';

const router = Router();

// GET /api/images/imagesbybreedid?breed_id=abys
router.get('/imagesbybreedid', imageController.getByBreedId);

export default router;
