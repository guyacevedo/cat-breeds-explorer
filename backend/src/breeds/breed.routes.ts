import { Router } from 'express';
import { breedController } from './breed.controller.js';

const router = Router();

// NOTE: '/search' must be declared before '/:breed_id' so it is not
// swallowed by the dynamic route.
router.get('/search', breedController.search);
router.get('/', breedController.getAll);
router.get('/:breed_id', breedController.getById);

export default router;
