import { Request, Response } from 'express';
import { pgPool, prisma } from '../../config/database';
import { AuthRequest } from '../../middleware/auth.middleware';

export const checkDangerZone = async (req: Request, res: Response) => {
	const { lat, lon, time } = req.query;

	if (!lat || !lon) {
		return res.status(400).json({ error: 'lat and lon are required' });
	}

	const currentTime = time || new Date().toISOString().substring(11, 16);

	const result = await pgPool.query(
		`
		SELECT 
			id, zone_code, risk_level, risk_score, 
			recommended_speed_kmph, dominant_animal,
			active_from, active_to,
			COALESCE(speed_override, recommended_speed_kmph) as final_speed
		FROM danger_zones
		WHERE 
			is_active = true
			AND ST_Within(
				ST_SetSRID(ST_MakePoint($1, $2), 4326),
				polygon
			)
			AND ($3 >= active_from OR active_from IS NULL)
			AND ($3 <= active_to OR active_to IS NULL)
		LIMIT 1
		`,
		[parseFloat(lon as string), parseFloat(lat as string), currentTime]
	);

	if (result.rows.length === 0) {
		return res.json({
			inside_zone: false,
			message: 'No active animal-risk zone at this location',
		});
	}

	const zone = result.rows[0];

	res.json({
		inside_zone: true,
		zone_id: zone.id,
		zone_code: zone.zone_code,
		risk_level: zone.risk_level,
		risk_score: zone.risk_score,
		recommended_speed_kmph: zone.final_speed,
		active_now: true,
		dominant_animal: zone.dominant_animal,
		message: `Animal-risk zone — reduce to ${zone.final_speed} km/h`,
	});
};

export const listDangerZones = async (req: Request, res: Response) => {
	const result = await pgPool.query(
		`
		SELECT 
			id, zone_code, segment_label, risk_level, risk_score,
			recommended_speed_kmph, dominant_animal, active_from, active_to,
			detection_count_30d, updated_at,
			ST_AsGeoJSON(polygon) as polygon_geojson
		FROM danger_zones
		WHERE is_active = true
		ORDER BY risk_score DESC
		`
	);

	const zones = result.rows.map((row) => ({
		id: row.id,
		zone_code: row.zone_code,
		segment_label: row.segment_label,
		polygon: row.polygon_geojson ? JSON.parse(row.polygon_geojson) : null,
		risk_level: row.risk_level,
		risk_score: row.risk_score,
		recommended_speed_kmph: row.recommended_speed_kmph,
		dominant_animal: row.dominant_animal,
		active_from: row.active_from,
		active_to: row.active_to,
		detection_count_30d: row.detection_count_30d,
	}));

	res.json({
		zones,
		total: zones.length,
		updated_at: result.rows[0]?.updated_at || new Date(),
	});
};

export const updateSpeedOverride = async (req: AuthRequest, res: Response) => {
	const { id } = req.params;
	const { speed_override } = req.body;

	if (typeof speed_override !== 'number' || speed_override < 20 || speed_override > 80) {
		return res.status(400).json({ error: 'Speed must be between 20-80 km/h' });
	}

	const zone = await prisma.dangerZone.update({
		where: { id: parseInt(id, 10) },
		data: { speedOverride: speed_override },
	});

	res.json({ success: true, zone });
};
