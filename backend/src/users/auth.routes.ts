import { Router } from 'express';
import { authController } from './auth.controller.js';
import { requireAuth } from './auth.middleware.js';

const router = Router();

// Spec pedía GET; por seguridad (credenciales fuera de URL/logs) se usa POST + JWT.
router.post('/register', authController.register);
router.post('/login', authController.login);

// Vista protegida: información del usuario logueado.
router.get('/me', requireAuth, authController.me);

export default router;
