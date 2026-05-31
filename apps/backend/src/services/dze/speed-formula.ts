export function calculateRecommendedSpeed(
	riskScore: number,
	freeFlowSpeed: number
): number {
	const reduction = Math.floor(freeFlowSpeed * (1.0 - 0.4 * riskScore));
	return Math.max(reduction, 20); // Hard floor at 20 km/h
}

export function getRiskLevel(riskScore: number): string {
	if (riskScore < 0.2) return 'low';
	if (riskScore < 0.5) return 'medium';
	if (riskScore < 0.8) return 'high';
	return 'critical';
}
