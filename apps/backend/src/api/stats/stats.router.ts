import { Router } from 'express';
import * as statsController from './stats.controller';
import { verifyJWT } from '../../middleware/auth.middleware';

const router = Router();

router.get('/summary', verifyJWT, statsController.getSummary);
router.get('/heatmap', verifyJWT, statsController.getHeatmapPoints);
router.get('/timeseries', verifyJWT, statsController.getTimeSeries);
router.get('/heatgrid', verifyJWT, statsController.getHeatGrid);
router.get('/risk-distribution', verifyJWT, statsController.getRiskDistribution);

export default router;
