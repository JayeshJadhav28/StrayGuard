import { Router } from 'express';
import * as dzeController from './dze.controller';
import { verifyJWT, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.post('/trigger', verifyJWT, requireRole('admin'), dzeController.triggerDZE);
router.get('/status', verifyJWT, dzeController.getDZEStatus);

export default router;
