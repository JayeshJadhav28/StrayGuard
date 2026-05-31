import { Router } from 'express';
import { uploadDetections } from './detections.controller';
import { verifyApiKey } from '../../middleware/auth.middleware';

const router = Router();

router.post('/', verifyApiKey, uploadDetections);

export default router;
