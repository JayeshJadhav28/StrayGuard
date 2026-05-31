import { Router } from 'express';
import * as authController from './auth.controller';
import { verifyJWT } from '../../middleware/auth.middleware';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', verifyJWT, authController.me);

export default router;
