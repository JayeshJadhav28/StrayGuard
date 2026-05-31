import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	API_KEY_DEVICE: z.string().min(32),
	JWT_SECRET: z.string().min(32),
	PORT: z.string().default('3000'),
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	CORS_ORIGIN: z.string().url(),
	DZE_LOOKBACK_DAYS: z.string().default('30'),
	FREE_FLOW_SPEED_DEFAULT: z.string().default('60'),
	DZE_CRON_SCHEDULE: z.string().default('0 2 * * *'),
});

export const env = envSchema.parse(process.env);
