import { Router } from 'express';
import * as adminController from './admin.controller';
import { verifyJWT, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.get('/users', verifyJWT, requireRole('admin'), adminController.listUsers);
router.post('/users', verifyJWT, requireRole('admin'), adminController.createUser);
router.delete('/users/:id', verifyJWT, requireRole('admin'), adminController.deleteUser);

export default router;
