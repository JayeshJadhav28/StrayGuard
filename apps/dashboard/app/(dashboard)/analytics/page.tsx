'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { fetchAPI } from '@/lib/api';
import { Activity, BarChart3, Calendar, Download, LineChart, PieChart, ShieldAlert, TrendingUp } from 'lucide-react';
import { DetectionTimeSeries } from '@/components/charts/DetectionTimeSeries';
import { ClassBreakdownBar } from '@/components/charts/ClassBreakdownBar';
import { RiskDistributionPie } from '@/components/charts/RiskDistributionPie';
import { DayOfWeekGrid } from '@/components/charts/DayOfWeekGrid';

export default function AnalyticsPage() {
	const [range, setRange] = useState('7');
	const { data, isLoading } = useSWR('/stats/summary', fetchAPI);

	const summary = data || {};

	const insights = useMemo(() => {
		const byClass = summary.by_class || {};
		const topAnimal = Object.entries(byClass as Record<string, number>).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';
		const topAnimalCount = (byClass as Record<string, number>)[topAnimal] || 0;
		const totalDetections = Number(summary.total_detections || 0);
		const activeZones = Number(summary.active_zones || 0);
		const averageRisk = Number(summary.average_risk || 0);

		return {
			topAnimal,
			topAnimalCount,
			totalDetections,
			activeZones,
			averageRisk,
		};
	}, [summary]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/30">
			<div className="space-y-6">
				<header className="rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-sm">
					<div className="p-6 lg:p-8">
						<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
										<LineChart className="h-6 w-6 text-white" />
									</div>
									<div>
										<p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-600">Analytics Command Center</p>
										<h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">Detection Intelligence</h1>
									</div>
								</div>

								<p className="max-w-3xl text-sm text-slate-600 md:text-base">
									Operational analytics across detection patterns, animal classes, seasonal trends, and day-hour activity grids.
								</p>

								<div className="flex flex-wrap items-center gap-3">
									<div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
										<Activity className="h-3.5 w-3.5" />
										{isLoading ? 'Loading summary...' : `${insights.totalDetections.toLocaleString()} detections tracked`}
									</div>

									<div className="flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700">
										<TrendingUp className="h-3.5 w-3.5" />
										Top animal: {insights.topAnimal}
									</div>
								</div>
							</div>

							<div className="flex flex-wrap items-center gap-3">
								<button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow">
									<Calendar className="h-4 w-4" />
									<span>{range === '7' ? 'Last 7 days' : 'Last 30 days'}</span>
								</button>

								<select
									value={range}
									onChange={(event) => setRange(event.target.value)}
									className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-cyan-500/40"
								>
									<option value="7">7 days</option>
									<option value="30">30 days</option>
								</select>

								<button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/30 transition-all hover:shadow-xl hover:shadow-cyan-500/40">
									<Download className="h-4 w-4" />
									<span className="hidden sm:inline">Export Report</span>
								</button>
							</div>
						</div>
					</div>
				</header>

				<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<MetricCard title="Total Detections" value={insights.totalDetections.toLocaleString()} description="Overall logged events" icon={Activity} tone="blue" />
					<MetricCard title="Active Zones" value={insights.activeZones} description="Zones under monitoring" icon={ShieldAlert} tone="amber" />
					<MetricCard title="Average Risk" value={insights.averageRisk} description="Current fleet-wide risk score" icon={PieChart} tone="rose" />
					<MetricCard title="Top Animal" value={insights.topAnimal} description={`${insights.topAnimalCount} zones dominated`} icon={BarChart3} tone="emerald" isText />
				</section>

				<section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
					<div className="xl:col-span-8">
						<div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
							<div className="border-b border-slate-200/70 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
								<h2 className="text-lg font-semibold text-slate-900">Detection Trend</h2>
								<p className="mt-1 text-sm text-slate-500">Hourly activity over the selected period</p>
							</div>
							<div className="p-4">
								<DetectionTimeSeries days={Number(range)} />
							</div>
						</div>
					</div>

					<div className="space-y-6 xl:col-span-4">
						<div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
							<div className="border-b border-slate-200/70 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
								<h2 className="text-lg font-semibold text-slate-900">Class Breakdown</h2>
								<p className="mt-1 text-sm text-slate-500">Detected animal distribution</p>
							</div>
							<div className="p-4">
								<ClassBreakdownBar />
							</div>
						</div>

						<div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
							<div className="border-b border-slate-200/70 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
								<h2 className="text-lg font-semibold text-slate-900">Risk Distribution</h2>
								<p className="mt-1 text-sm text-slate-500">Severity split across monitored zones</p>
							</div>
							<div className="p-4">
								<RiskDistributionPie />
							</div>
						</div>
					</div>
				</section>

				<section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
					<div className="mb-4 flex items-center justify-between gap-4">
						<div>
							<h2 className="text-lg font-semibold text-slate-900">Activity Heatgrid</h2>
							<p className="mt-1 text-sm text-slate-500">Day and hour activity density across the week</p>
						</div>
						<div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
							<Activity className="h-3.5 w-3.5" />
							Live summary
						</div>
					</div>

					<DayOfWeekGrid />
				</section>
			</div>
		</div>
	);
}

function MetricCard({
	title,
	value,
	description,
	icon: Icon,
	tone,
	isText = false,
}: {
	title: string;
	value: string | number;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	tone: 'blue' | 'amber' | 'rose' | 'emerald';
	isText?: boolean;
}) {
	const toneStyles = {
		blue: 'bg-blue-50 text-blue-600 ring-blue-500/20',
		amber: 'bg-amber-50 text-amber-600 ring-amber-500/20',
		rose: 'bg-rose-50 text-rose-600 ring-rose-500/20',
		emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-500/20',
	};

	return (
		<div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all hover:shadow-md">
			<div className="space-y-4">
				<div className="flex items-start justify-between">
					<div className="space-y-1">
						<p className="text-sm font-medium text-slate-600">{title}</p>
						<p className="text-xs text-slate-500">{description}</p>
					</div>

					<div className={`flex h-12 w-12 items-center justify-center rounded-xl ring-4 ${toneStyles[tone]}`}>
						<Icon className="h-6 w-6" />
					</div>
				</div>

				<p className={`text-3xl font-bold tracking-tight text-slate-900 ${isText ? 'text-xl' : ''}`}>{value}</p>
			</div>
		</div>
	);
}