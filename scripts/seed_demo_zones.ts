import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const pgPool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

async function seed() {
	console.log('🌱 Seeding demo data...');

	const adminHash = await bcrypt.hash('demo123', 10);
	await prisma.adminUser.upsert({
		where: { email: 'admin@demo.com' },
		create: {
			email: 'admin@demo.com',
			passwordHash: adminHash,
			role: 'admin',
		},
		update: {},
	});

	const agencyHash = await bcrypt.hash('agency123', 10);
	await prisma.adminUser.upsert({
		where: { email: 'agency@demo.com' },
		create: {
			email: 'agency@demo.com',
			passwordHash: agencyHash,
			role: 'agency',
		},
		update: {},
	});

	const device = await prisma.device.upsert({
		where: { deviceHash: 'demo_device_hash_12345678901234567890123456789012' },
		create: {
			deviceHash: 'demo_device_hash_12345678901234567890123456789012',
			appVersion: '1.0.0',
			firstSeen: new Date(),
			lastSeen: new Date(),
		},
		update: {},
	});

	const demoLocations = [
		{ lat: 19.076, lon: 72.8777, name: 'Mumbai' },
		{ lat: 18.9068, lon: 73.4317, name: 'Khopoli' },
		{ lat: 18.5204, lon: 73.8567, name: 'Pune' },
	];

	for (const loc of demoLocations) {
		for (let i = 0; i < 50; i++) {
			const latOffset = (Math.random() - 0.5) * 0.02;
			const lonOffset = (Math.random() - 0.5) * 0.02;
			const animalTypes = ['cattle', 'dog', 'goat', 'buffalo'];
			const randomAnimal = animalTypes[Math.floor(Math.random() * animalTypes.length)];

			await pgPool.query(
				`
				INSERT INTO detections (
					device_id, detected_at, lat, lon, geom,
					speed_kmph, heading_deg, animal_class, confidence,
					bbox_norm, app_version
				) VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326), $7, $8, $9, $10, $11, $12)
				`,
				[
					device.id,
					new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
					loc.lat + latOffset,
					loc.lon + lonOffset,
					loc.lon + lonOffset,
					loc.lat + latOffset,
					50 + Math.random() * 30,
					Math.random() * 360,
					randomAnimal,
					0.6 + Math.random() * 0.3,
					[0.2, 0.3, 0.7, 0.8],
					'1.0.0',
				]
			);
		}
	}

	console.log('✅ Seeding completed!');
	console.log('📧 Admin: admin@demo.com / demo123');
	console.log('📧 Agency: agency@demo.com / agency123');

	await prisma.$disconnect();
	await pgPool.end();
}

seed().catch(async (error) => {
	console.error(error);
	await prisma.$disconnect();
	await pgPool.end();
	process.exit(1);
});
