import { clusterDetections } from './clustering';
import { calculateRiskScore } from './risk-scoring';
import { calculateRecommendedSpeed, getRiskLevel } from './speed-formula';
import { pgPool, prisma } from '../../config/database';
import { env } from '../../config/env';

type ClusterRow = {
	cluster_id: number;
	buffered_polygon: string;
	total_detections: number;
	active_hours: number[];
	dominant_animal: string;
	cell_count: number;
};

export class DZEService {
	async runDZE() {
		console.log('🔄 Starting DZE processing...');
		const startTime = Date.now();

		try {
			const clusters = (await clusterDetections(parseInt(env.DZE_LOOKBACK_DAYS, 10))) as ClusterRow[];
			console.log(`✅ Found ${clusters.length} clusters`);

			await prisma.dangerZone.updateMany({
				where: { isActive: true },
				data: { isActive: false },
			});

			for (const cluster of clusters) {
				const polygon = JSON.parse(cluster.buffered_polygon);

				const riskScore = calculateRiskScore({
					totalDetections: cluster.total_detections,
					cellCount: cluster.cell_count,
					hoursActive: cluster.active_hours.length,
				});

				const riskLevel = getRiskLevel(riskScore);
				const recommendedSpeed = calculateRecommendedSpeed(
					riskScore,
					parseInt(env.FREE_FLOW_SPEED_DEFAULT, 10)
				);

				const activeHours = [...cluster.active_hours].sort((a, b) => a - b);
				const peakHour = this.findPeakHour(activeHours);
				const activeFrom = `${Math.max(0, peakHour - 1).toString().padStart(2, '0')}:00`;
				const activeTo = `${Math.min(23, peakHour + 3).toString().padStart(2, '0')}:00`;

				// Keep a stable zone code per cluster for deterministic upserts.
				const zoneCode = `DZ-${cluster.cluster_id}`;

				await pgPool.query(
					`
					INSERT INTO danger_zones (
						zone_code, polygon, risk_level, risk_score, recommended_speed_kmph,
						active_from, active_to, dominant_animal, detection_count_30d,
						free_flow_speed, updated_at, is_active
					) VALUES ($1, ST_GeomFromGeoJSON($2), $3, $4, $5, $6, $7, $8, $9, $10, NOW(), true)
					ON CONFLICT (zone_code)
					DO UPDATE SET
						polygon = EXCLUDED.polygon,
						risk_score = EXCLUDED.risk_score,
						risk_level = EXCLUDED.risk_level,
						recommended_speed_kmph = EXCLUDED.recommended_speed_kmph,
						active_from = EXCLUDED.active_from,
						active_to = EXCLUDED.active_to,
						dominant_animal = EXCLUDED.dominant_animal,
						detection_count_30d = EXCLUDED.detection_count_30d,
						free_flow_speed = EXCLUDED.free_flow_speed,
						updated_at = NOW(),
						is_active = true
					`,
					[
						zoneCode,
						JSON.stringify(polygon),
						riskLevel,
						riskScore,
						recommendedSpeed,
						activeFrom,
						activeTo,
						cluster.dominant_animal,
						cluster.total_detections,
						parseInt(env.FREE_FLOW_SPEED_DEFAULT, 10),
					]
				);
			}

			const duration = ((Date.now() - startTime) / 1000).toFixed(2);
			console.log(`✅ DZE completed in ${duration}s - Created/updated ${clusters.length} zones`);

			return {
				success: true,
				zonesProcessed: clusters.length,
				duration,
			};
		} catch (error) {
			console.error('❌ DZE failed:', error);
			throw error;
		}
	}

	private findPeakHour(hours: number[]): number {
		const counts: Record<number, number> = {};
		hours.forEach((h) => {
			counts[h] = (counts[h] || 0) + 1;
		});

		return parseInt(
			Object.keys(counts).reduce((a, b) => (counts[parseInt(a, 10)] > counts[parseInt(b, 10)] ? a : b)),
			10
		);
	}
}

export const dzeService = new DZEService();
