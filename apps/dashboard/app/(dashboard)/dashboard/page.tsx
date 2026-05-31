 'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import {
	Activity,
	AlertTriangle,
	Calendar,
	Download,
	MapPinned,
	RefreshCw,
	ShieldAlert,
} from 'lucide-react';
import { KpiCard } from '@/components/cards/KpiCard';
import { DetectionTimeSeries } from '@/components/charts/DetectionTimeSeries';
import { QuickInsights } from '@/components/dashboard/QuickInsights';
import { LiveIndicator } from '@/components/dashboard/LiveIndicator';

const DashboardMap = dynamic(() => import('@/components/map/DashboardMap').then((module) => module.DashboardMap), {
	ssr: false,
	loading: () => <MapSkeleton />,
});

export default function DashboardHomePage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/30">
			<div className="space-y-6">
				<header className="rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-sm">
					<div className="p-6 lg:p-8">
						<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
										<ShieldAlert className="h-6 w-6 text-white" />
									</div>
									<div>
										<p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">
											Road-Watch Operations
										</p>
										<h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">
											StrayGuard Command Center
										</h1>
									</div>
								</div>

								<p className="max-w-3xl text-sm text-slate-600 md:text-base">
									Real-time monitoring of stray animal detections, active danger zones, and intelligent speed recommendations across national highway corridors.
								</p>

								<div className="flex flex-wrap items-center gap-3">
									<LiveIndicator />

									<div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
										<Calendar className="h-3.5 w-3.5" />
										Updated 2 min ago
									</div>

									<div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
										<MapPinned className="h-3.5 w-3.5" />
										Pilot Corridor: NH48
									</div>
								</div>
							</div>

							<div className="flex flex-wrap items-center gap-3">
								<button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow">
									<RefreshCw className="h-4 w-4" />
									<span className="hidden sm:inline">Refresh</span>
								</button>

								<button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow">
									<Calendar className="h-4 w-4" />
									<span className="hidden sm:inline">Last 7 days</span>
								</button>

								<button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40">
									<Download className="h-4 w-4" />
									<span className="hidden sm:inline">Export Report</span>
								</button>
							</div>
						</div>
					</div>
				</header>

				<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<Suspense fallback={<KpiCardSkeleton />}>
						<KpiCard
							title="Total Detections"
							endpoint="/stats/summary"
							field="total_detections"
							icon={Activity}
							tone="blue"
							description="Lifetime recorded events"
							trend={{ value: 12, direction: 'up', label: 'vs yesterday' }}
						/>
					</Suspense>

					<Suspense fallback={<KpiCardSkeleton />}>
						<KpiCard
							title="Active Danger Zones"
							endpoint="/stats/summary"
							field="active_zones"
							icon={MapPinned}
							tone="amber"
							description="Currently flagged areas"
							trend={{ value: 2, direction: 'up', label: 'new this week' }}
						/>
					</Suspense>

					<Suspense fallback={<KpiCardSkeleton />}>
						<KpiCard
							title="Highest Risk Zone"
							endpoint="/stats/summary"
							field="top_zone"
							icon={AlertTriangle}
							tone="rose"
							description="Most concentrated area"
							isText
						/>
					</Suspense>

					<Suspense fallback={<KpiCardSkeleton />}>
						<KpiCard
							title="Detection Accuracy"
							endpoint="/stats/summary"
							field="detection_accuracy"
							icon={ShieldAlert}
							tone="emerald"
							description="Model confidence score"
							suffix="%"
							trend={{ value: 3, direction: 'up', label: 'improved' }}
						/>
					</Suspense>
				</section>

				<section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
					<div className="xl:col-span-8">
						<div className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all hover:shadow-md">
							<div className="flex items-center justify-between border-b border-slate-200/70 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
								<div>
									<h2 className="text-lg font-semibold text-slate-900">Live Detection Heatmap</h2>
									<p className="mt-1 text-sm text-slate-500">Real-time density visualization of animal activity and danger zone overlays</p>
								</div>

								<div className="flex items-center gap-3">
									<span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
										<span className="relative flex h-2 w-2">
											<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
											<span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
										</span>
										Live
									</span>

									<button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
										<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
										</svg>
									</button>
								</div>
							</div>

							<div className="relative h-[480px] bg-slate-50 p-4">
								<Suspense fallback={<MapSkeleton />}>
									<DashboardMap />
								</Suspense>

								<div className="absolute bottom-6 left-6 z-10 rounded-xl border border-white/80 bg-white/90 p-3 shadow-lg backdrop-blur-sm">
									<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Risk Levels</p>
									<div className="space-y-1.5">
										<div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-green-500" /><span className="text-xs text-slate-700">Low</span></div>
										<div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-yellow-500" /><span className="text-xs text-slate-700">Medium</span></div>
										<div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-orange-500" /><span className="text-xs text-slate-700">High</span></div>
										<div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-red-500" /><span className="text-xs text-slate-700">Critical</span></div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-6 xl:col-span-4">
						<div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
							<div className="border-b border-slate-200/70 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
								<h2 className="text-lg font-semibold text-slate-900">Detection Trends</h2>
								<p className="mt-1 text-sm text-slate-500">Hourly pattern across monitored segments</p>
							</div>

							<div className="p-4">
								<Suspense fallback={<ChartSkeleton />}>
									<DetectionTimeSeries />
								</Suspense>
							</div>
						</div>

						<Suspense fallback={<InsightsSkeleton />}>
							<QuickInsights />
						</Suspense>
					</div>
				</section>

				<section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
						<a href="/dashboard/zones" className="text-sm font-medium text-blue-600 hover:text-blue-700">
							View all →
						</a>
					</div>

					<div className="space-y-3">
						{[
							{ time: '2 min ago', event: 'New danger zone created', location: 'NH48 KM 215-217', severity: 'high' },
							{ time: '15 min ago', event: 'Cattle detection spike', location: 'NH48 KM 189', severity: 'medium' },
							{ time: '1 hour ago', event: 'Speed advisory updated', location: 'NH48 KM 198-202', severity: 'low' },
						].map((item) => (
							<div key={`${item.event}-${item.time}`} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-slate-100/50">
								<div className={`h-2 w-2 rounded-full ${item.severity === 'high' ? 'bg-red-500' : item.severity === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
								<div className="flex-1">
									<p className="text-sm font-medium text-slate-900">{item.event}</p>
									<p className="text-xs text-slate-500">{item.location}</p>
								</div>
								<span className="text-xs text-slate-400">{item.time}</span>
							</div>
						))}
					</div>
				</section>
			</div>
		</div>
	);
}

function KpiCardSkeleton() {
	return <div className="animate-pulse rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm"><div className="mb-3 h-4 w-1/2 rounded bg-slate-200" /><div className="h-8 w-3/4 rounded bg-slate-200" /></div>;
}

function MapSkeleton() {
	return <div className="flex h-full items-center justify-center rounded-xl bg-slate-100"><div className="text-center"><div className="mx-auto mb-3 h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-blue-500" /><p className="text-sm text-slate-500">Loading map data...</p></div></div>;
}

function ChartSkeleton() {
	return <div className="h-64 animate-pulse rounded-xl bg-slate-100" />;
}

function InsightsSkeleton() {
	return <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white" />;
}