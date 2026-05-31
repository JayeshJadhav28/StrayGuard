import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { dzeService } from '../../services/dze/dze.service';

export const triggerDZE = async (_req: Request, res: Response) => {
	try {
		dzeService.runDZE().catch(console.error);

		res.json({
			job_id: `dze-${Date.now()}`,
			status: 'queued',
			message: 'DZE processing started',
		});
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const getDZEStatus = async (_req: Request, res: Response) => {
	const activeZones = await prisma.dangerZone.count({ where: { isActive: true } });
	const stats = await prisma.dangerZone.aggregate({
		_max: { updatedAt: true },
		where: { isActive: true },
	});

	res.json({
		active_zones: activeZones,
		last_run: stats._max.updatedAt,
	});
};
