import { Request, Response } from 'express';
import { pgPool, prisma } from '../../config/database';

export const getSummary = async (_req: Request, res: Response) => {
  const totalDetections = await prisma.detection.count();
  const activeZones = await prisma.dangerZone.count({ where: { isActive: true } });
  const avgRisk = await prisma.dangerZone.aggregate({
    where: { isActive: true },
    _avg: { riskScore: true },
  });

  const topZone = await prisma.dangerZone.findFirst({
    where: { isActive: true },
    orderBy: { detectionCount30d: 'desc' },
    select: { zoneCode: true },
  });

  const byClass = await pgPool.query(
    `SELECT animal_class, COUNT(*) as count
     FROM detections
     GROUP BY animal_class`
  );

  const byClassMap = byClass.rows.reduce((acc: Record<string, number>, row: any) => {
    acc[row.animal_class] = parseInt(row.count, 10);
    return acc;
  }, {});

  res.json({
    total_detections: totalDetections,
    active_zones: activeZones,
    top_zone: topZone?.zoneCode || 'N/A',
    average_risk: avgRisk._avg.riskScore ? Number(avgRisk._avg.riskScore.toFixed(2)) : 0,
    by_class: byClassMap,
  });
};

export const getHeatmapPoints = async (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string, 10) || 30;

  const result = await pgPool.query(
    `
    SELECT
      AVG(lat) AS lat,
      AVG(lon) AS lon,
      COUNT(*)::int AS weight
    FROM detections
    WHERE detected_at >= NOW() - ($1::text || ' days')::interval
    GROUP BY ST_SnapToGrid(geom, 0.005)
    `,
    [days]
  );

  res.json({ points: result.rows });
};

export const getTimeSeries = async (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string, 10) || 7;

  const result = await pgPool.query(
    `
    SELECT 
      DATE_TRUNC('hour', detected_at) as hour,
      COUNT(*) as count
    FROM detections
    WHERE detected_at >= NOW() - ($1::text || ' days')::interval
    GROUP BY hour
    ORDER BY hour
    `,
    [days]
  );

  res.json({ data: result.rows });
};

export const getHeatGrid = async (_req: Request, res: Response) => {
  const result = await pgPool.query(
    `
    SELECT 
      TO_CHAR(detected_at, 'Dy') as day,
      EXTRACT(HOUR FROM detected_at)::int as hour,
      COUNT(*) as count
    FROM detections
    WHERE detected_at >= NOW() - INTERVAL '30 days'
    GROUP BY day, hour
    `
  );

  const grid: Record<string, Record<number, number>> = {};
  
  result.rows.forEach((row: any) => {
    if (!grid[row.day]) grid[row.day] = {};
    grid[row.day][row.hour] = parseInt(row.count, 10);
  });

  res.json({ grid });
};

export const getRiskDistribution = async (_req: Request, res: Response) => {
  const result = await prisma.dangerZone.groupBy({
    by: ['riskLevel'],
    _count: { _all: true },
    where: { isActive: true },
  });

  const distribution = result.reduce((acc: Record<string, number>, item: any) => {
    acc[item.riskLevel] = item._count._all;
    return acc;
  }, {});

  res.json({ distribution });
};
