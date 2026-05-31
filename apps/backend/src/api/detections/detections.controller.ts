import { Request, Response } from 'express';
import { batchDetectionsSchema } from './detections.schema';
import { prisma, pgPool } from '../../config/database';

export const uploadDetections = async (req: Request, res: Response) => {
	try {
		const data = batchDetectionsSchema.parse(req.body);

		// Upsert device
		const device = await prisma.device.upsert({
			where: { deviceHash: data.device_id },
			create: {
				deviceHash: data.device_id,
				appVersion: data.app_version,
				firstSeen: new Date(),
				lastSeen: new Date(),
			},
			update: {
				lastSeen: new Date(),
				appVersion: data.app_version,
			},
		});

		// Insert detections
		let accepted = 0;
		let rejected = 0;

		for (const event of data.events) {
			try {
				await pgPool.query(
					`
					INSERT INTO detections (
						device_id, detected_at, lat, lon, geom, 
						speed_kmph, heading_deg, animal_class, confidence, 
						bbox_norm, app_version
					) VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326), $7, $8, $9, $10, $11, $12)
					ON CONFLICT (device_id, detected_at) DO NOTHING
					`,
					[
						device.id,
						new Date(event.timestamp),
						event.lat,
						event.lon,
						event.lon,
						event.lat,
						event.speed_kmph || null,
						event.heading_deg || null,
						event.animal_class,
						event.confidence,
						event.bbox_norm,
						data.app_version,
					]
				);
				accepted++;
			} catch (error) {
				console.error('Detection insert failed:', error);
				rejected++;
			}
		}

		// Update device event count
		await prisma.device.update({
			where: { id: device.id },
			data: { eventCount: { increment: accepted } },
		});

		res.json({ accepted, rejected });
	} catch (error) {
		throw error;
	}
};
