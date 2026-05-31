export interface RiskMetrics {
	totalDetections: number;
	cellCount: number;
	hoursActive: number;
}

export function calculateRiskScore(metrics: RiskMetrics): number {
	const density = metrics.totalDetections / Math.max(1, metrics.cellCount);
	const timeSpread = Math.max(1, metrics.hoursActive);

	const rawScore = (density / timeSpread) * Math.log10(metrics.totalDetections + 1);
	const normalized = Math.min(1.0, rawScore / 50);

	return Math.round(normalized * 100) / 100;
}
