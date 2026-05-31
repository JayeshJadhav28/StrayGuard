import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { env } from './env';

export const prisma = new PrismaClient({
	log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Raw PostGIS queries
export const pgPool = new Pool({
	connectionString: env.DATABASE_URL,
});

// Graceful shutdown
process.on('beforeExit', async () => {
	await prisma.$disconnect();
	await pgPool.end();
});
