import { pgPool } from '../../config/database';

export async function clusterDetections(lookbackDays: number) {
	const result = await pgPool.query(
		`
		WITH detection_cells AS (
			SELECT
				ST_SnapToGrid(geom, 0.001) AS cell_geom,
				EXTRACT(HOUR FROM detected_at)::int AS hour_bucket,
				animal_class,
				COUNT(*)::int AS detection_count
			FROM detections
			WHERE detected_at >= NOW() - ($1::text || ' days')::interval
			GROUP BY cell_geom, hour_bucket, animal_class
			HAVING COUNT(*) > 2
		),
		clustered AS (
			SELECT
				ST_ClusterDBSCAN(cell_geom, eps := 0.002, minpoints := 5) OVER () AS cluster_id,
				cell_geom,
				hour_bucket,
				animal_class,
				detection_count
			FROM detection_cells
		)
		SELECT
			cluster_id,
			ST_AsGeoJSON(ST_ConvexHull(ST_Collect(cell_geom))) AS polygon,
			ST_AsGeoJSON(ST_Buffer(ST_ConvexHull(ST_Collect(cell_geom)), 0.0005)) AS buffered_polygon,
			SUM(detection_count)::int AS total_detections,
			array_agg(DISTINCT hour_bucket ORDER BY hour_bucket) AS active_hours,
			mode() WITHIN GROUP (ORDER BY animal_class) AS dominant_animal,
			COUNT(DISTINCT cell_geom)::int AS cell_count
		FROM clustered
		WHERE cluster_id IS NOT NULL
		GROUP BY cluster_id
		HAVING SUM(detection_count) >= 10
		`,
		[lookbackDays]
	);

	return result.rows;
}
