import { Router } from 'express';
import * as zonesController from './zones.controller';
import { verifyApiKey, verifyJWT, requireRole } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', verifyJWT, zonesController.listDangerZones);
router.get('/check', verifyApiKey, zonesController.checkDangerZone);
router.patch('/:id/override', verifyJWT, requireRole('admin'), zonesController.updateSpeedOverride);

export default router;
