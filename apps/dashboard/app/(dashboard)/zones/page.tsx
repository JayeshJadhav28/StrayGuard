'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import {
	MapPin,
	Clock,
	ShieldAlert,
	Activity,
	TrendingUp,
	Download,
	Search,
	ArrowRight,
	AlertTriangle,
} from 'lucide-react';
import { RiskDistributionChart } from '@/components/zones/RiskDistributionChart';
import { TopZonesChart } from '@/components/zones/TopZonesChart';
import { ZoneCard } from '@/components/zones/ZoneCard';
import { FilterChips } from '@/components/zones/FilterChips';
import { SummaryCard } from '@/components/zones/SummaryCard';

const FILTERS = ['all', 'low', 'medium', 'high', 'critical'];

export default function ZonesPage() {
	const [filter, setFilter] = useState<string>('all');
	const [searchQuery, setSearchQuery] = useState('');
	const { data, isLoading } = useSWR('/zones', fetchAPI);

	const zones = data?.zones || [];

	const filteredZones = useMemo(() => {
		let result = zones;

		if (filter !== 'all') {
			result = result.filter((zone: any) => zone.risk_level === filter);
		}

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter((zone: any) => {
				return (
					zone.zone_code?.toLowerCase().includes(query) ||
					zone.segment_label?.toLowerCase().includes(query)
				);
			});
		}

		return result;
	}, [zones, filter, searchQuery]);

	const summary = useMemo(() => {
		const totalZones = zones.length;
		const criticalZones = zones.filter((zone: any) => zone.risk_level === 'critical').length;
		const highZones = zones.filter((zone: any) => zone.risk_level === 'high').length;

		const totalDetections = zones.reduce((sum: number, zone: any) => sum + (zone.detection_count_30d || 0), 0);

		const avgSpeed = totalZones > 0
			? Math.round(zones.reduce((sum: number, zone: any) => sum + (zone.recommended_speed_kmph || 0), 0) / totalZones)
			: 0;

		const animalCounts = zones.reduce((acc: Record<string, number>, zone: any) => {
			const key = zone.dominant_animal || 'unknown';
			acc[key] = (acc[key] || 0) + 1;
			return acc;
		}, {});

		const dominantAnimal =
			(Object.entries(animalCounts) as Array<[string, number]>)
				.sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';

		const topZone = [...zones].sort((a: any, b: any) => (b.detection_count_30d || 0) - (a.detection_count_30d || 0))[0] || null;

		return { totalZones, criticalZones, highZones, totalDetections, avgSpeed, dominantAnimal, topZone };
	}, [zones]);

	const riskChartData = useMemo(() => {
		const counts = { low: 0, medium: 0, high: 0, critical: 0 };

		zones.forEach((zone: any) => {
			if (counts[zone.risk_level as keyof typeof counts] !== undefined) {
				counts[zone.risk_level as keyof typeof counts] += 1;
			}
		});

		return Object.entries(counts).map(([name, value]) => ({ name, value }));
	}, [zones]);

	const topZonesData = useMemo(() => {
		return [...zones]
			.sort((a: any, b: any) => (b.detection_count_30d || 0) - (a.detection_count_30d || 0))
			.slice(0, 5)
			.map((zone: any) => ({
				name: zone.zone_code,
				detections: zone.detection_count_30d || 0,
			}));
	}, [zones]);

	if (isLoading) {
		return <LoadingSkeleton />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/30">
			<div className="space-y-6">
				<header className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
									<ShieldAlert className="h-6 w-6 text-white" />
								</div>
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-600">Risk Zone Management</p>
									<h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">Active Danger Zones</h1>
								</div>
							</div>

							<p className="max-w-3xl text-sm text-slate-600 md:text-base">
								Dynamic animal-risk zones generated from detections, clustered by location, severity, and time patterns.
								Each zone includes recommended safe speeds and active monitoring hours.
							</p>

							<div className="flex flex-wrap items-center gap-3">
								<div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
									<Clock className="h-3.5 w-3.5" />
									Updated just now
								</div>

								<div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
									<MapPin className="h-3.5 w-3.5" />
									Corridor: NH48 (Mumbai-Pune)
								</div>
							</div>
						</div>

						<button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow">
							<Download className="h-4 w-4" />
							<span className="hidden sm:inline">Export Report</span>
						</button>
					</div>
				</header>

				<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<SummaryCard title="Active Zones" value={summary.totalZones} description="Currently monitored areas" icon={MapPin} tone="blue" />
					<SummaryCard title="Critical + High Risk" value={summary.criticalZones + summary.highZones} description="Zones requiring caution" icon={ShieldAlert} tone="rose" trend={{ value: summary.criticalZones, label: 'critical' }} />
					<SummaryCard title="Avg. Recommended Speed" value={`${summary.avgSpeed} km/h`} description="Network-wide safe speed" icon={AlertTriangle} tone="amber" />
					<SummaryCard title="30-Day Detections" value={summary.totalDetections.toLocaleString()} description={`Dominant: ${summary.dominantAnimal}`} icon={Activity} tone="emerald" />
				</section>

				<section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
					<div className="xl:col-span-2 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
						<div className="border-b border-slate-200/70 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
							<h2 className="text-lg font-semibold text-slate-900">Risk Distribution</h2>
							<p className="mt-1 text-sm text-slate-500">Zone count by severity level and top zones by activity</p>
						</div>

						<div className="p-6">
							<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
								<RiskDistributionChart data={riskChartData} />
								<TopZonesChart data={topZonesData} />
							</div>
						</div>
					</div>

					<div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
						<div className="border-b border-slate-200/70 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
							<h2 className="text-lg font-semibold text-slate-900">Zone Insights</h2>
							<p className="mt-1 text-sm text-slate-500">Operational summary for highest-impact area</p>
						</div>

						<div className="space-y-4 p-6">
							<InsightItem label="Highest-Activity Zone" value={summary.topZone?.zone_code || '—'} />
							<InsightItem label="Recommended Speed" value={`${summary.topZone?.recommended_speed_kmph || '—'} km/h`} />
							<InsightItem label="Dominant Animal" value={<span className="flex items-center gap-2 capitalize"><span className="inline-block h-2 w-2 rounded-full bg-amber-500" />{summary.topZone?.dominant_animal || 'Unknown'}</span>} />
							<InsightItem label="Active Window" value={`${summary.topZone?.active_from || '--:--'} - ${summary.topZone?.active_to || '--:--'}`} />
							<InsightItem label="30-Day Detections" value={summary.topZone?.detection_count_30d?.toLocaleString() || '0'} />

							<div className="border-t border-slate-200 pt-4">
								<Link href={`/zones/${summary.topZone?.id || ''}`} className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
									View full details
									<ArrowRight className="h-4 w-4" />
								</Link>
							</div>
						</div>
					</div>
				</section>

				<section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="relative max-w-md flex-1">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							placeholder="Search by zone code or segment..."
							value={searchQuery}
							onChange={(event) => setSearchQuery(event.target.value)}
							className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50"
						/>
					</div>

					<FilterChips selected={filter} onChange={setFilter} options={FILTERS} />
				</section>

				<section>
					{filteredZones.length > 0 ? (
						<div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
							{filteredZones.map((zone: any) => (
								<ZoneCard key={zone.id} zone={zone} />
							))}
						</div>
					) : (
						<EmptyState filter={filter} searchQuery={searchQuery} />
					)}
				</section>
			</div>
		</div>
	);
}

function InsightItem({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="rounded-xl bg-slate-50 p-4">
			<p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
			<p className="mt-1 text-base font-semibold text-slate-900">{value}</p>
		</div>
	);
}

function EmptyState({ filter, searchQuery }: { filter: string; searchQuery: string }) {
	return (
		<div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
			<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
				<MapPin className="h-8 w-8 text-slate-400" />
			</div>
			<h3 className="text-lg font-semibold text-slate-900">No zones found</h3>
			<p className="mt-2 text-sm text-slate-500">
				{searchQuery
					? `No zones match "${searchQuery}"`
					: filter !== 'all'
						? `No ${filter} risk zones currently active`
						: 'No danger zones are currently active'}
			</p>
			{(filter !== 'all' || searchQuery) && (
				<button type="button" onClick={() => window.location.reload()} className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">
					Clear filters
				</button>
			)}
		</div>
	);
}

function LoadingSkeleton() {
	return (
		<div className="space-y-6">
			<div className="h-32 animate-pulse rounded-2xl bg-slate-100" />
			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-100" />)}
			</div>
			<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
				<div className="h-96 animate-pulse rounded-2xl bg-slate-100 xl:col-span-2" />
				<div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
			</div>
			<div className="grid grid-cols-1 gap-5 md:grid-cols-3">
				{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-64 animate-pulse rounded-2xl bg-slate-100" />)}
			</div>
		</div>
	);
}