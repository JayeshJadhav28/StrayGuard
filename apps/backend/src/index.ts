import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import detectionsRouter from './api/detections/detections.router';
import zonesRouter from './api/zones/zones.router';
import statsRouter from './api/stats/stats.router';
import authRouter from './api/auth/auth.router';
import adminRouter from './api/admin/admin.router';
import dzeRouter from './api/dze/dze.router';
import { router as healthRouter } from './api/health/health.router';
import './jobs/dze.job'; // Start cron jobs

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

// Routes
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/detections', detectionsRouter);
app.use('/api/v1/zones', zonesRouter);
app.use('/api/v1/stats', statsRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/dze', dzeRouter);

// Error handling
app.use(errorHandler);

app.listen(parseInt(env.PORT), () => {
	console.log(`🚀 Server running on port ${env.PORT}`);
});
