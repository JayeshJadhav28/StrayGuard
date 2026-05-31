'use client';

import { useState } from 'react';
import {
	MapPinned,
	Activity,
	ShieldAlert,
	AlertCircle,
	RefreshCw,
	LocateFixed,
	Maximize2,
	Clock,
	TrendingUp,
} from 'lucide-react';
import { DashboardMap } from '@/components/map/DashboardMap';
import { LayerPanel } from '@/components/map/LayerPanel';
import { LegendPanel } from '@/components/map/LegendPanel';
import { MapControls } from '@/components/map/MapControls';
import { ZoneInfoPanel } from '@/components/map/ZoneInfoPanel';

export default function MapPage() {
	const [selectedZone, setSelectedZone] = useState<any>(null);
	const [layers, setLayers] = useState({
		heatmap: true,
		zones: true,
		roads: true,
		labels: false,
		events: false,
	});
	const [mapView, setMapView] = useState<'normal' | 'fullscreen'>('normal');

	const handleResetView = () => {
		console.log('Reset view');
	};

	const handleRefresh = () => {
		console.log('Refresh data');
	};

	const toggleLayer = (layer: keyof typeof layers) => {
		setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/30">
			<div className="space-y-6">
				<header className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
									<MapPinned className="h-6 w-6 text-white" />
								</div>
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">Geospatial Intelligence</p>
									<h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">Live Risk Map</h1>
								</div>
							</div>

							<p className="max-w-3xl text-sm text-slate-600 md:text-base">
								Interactive map displaying real-time animal detection heatmaps, active danger zone polygons, and monitored road corridor overlays for operational awareness.
							</p>

							<div className="flex flex-wrap items-center gap-3">
								<div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
									<div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
									Live Updates
								</div>

								<div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
									<Clock className="h-3.5 w-3.5" />
									Updated 1 min ago
								</div>

								<div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
									<MapPinned className="h-3.5 w-3.5" />
									NH48 Corridor
								</div>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-3">
							<button onClick={handleRefresh} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow">
								<RefreshCw className="h-4 w-4" />
								<span className="hidden sm:inline">Refresh</span>
							</button>

							<button onClick={handleResetView} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow">
								<LocateFixed className="h-4 w-4" />
								<span className="hidden sm:inline">Reset View</span>
							</button>

							<button onClick={() => setMapView(mapView === 'normal' ? 'fullscreen' : 'normal')} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40">
								<Maximize2 className="h-4 w-4" />
								<span className="hidden sm:inline">Fullscreen</span>
							</button>
						</div>
					</div>
				</header>

				<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<MapStatCard title="Active Zones" value="27" description="Currently visible on map" icon={MapPinned} tone="blue" trend={{ value: 2, label: 'new this week' }} />
					<MapStatCard title="Live Detections" value="184" description="Last 30 days (filtered view)" icon={Activity} tone="emerald" trend={{ value: 12, label: 'vs last month' }} />
					<MapStatCard title="Critical Zones" value="3" description="Highest-risk areas" icon={ShieldAlert} tone="rose" />
					<MapStatCard title="Detection Hotspot" value="DZ-NH48-007" description="Most active zone" icon={AlertCircle} tone="amber" isText />
				</section>

				<section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
					<div className={mapView === 'fullscreen' ? 'xl:col-span-12' : 'xl:col-span-9'}>
						<div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all hover:shadow-md">
							<div className="flex items-center justify-between border-b border-slate-200/70 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
								<div>
									<h2 className="text-lg font-semibold text-slate-900">Map Workspace</h2>
									<p className="mt-1 text-sm text-slate-500">Interactive visualization of detection density and risk zones</p>
								</div>

								<div className="hidden items-center gap-2 md:flex">
									<span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700"><span className="h-2 w-2 rounded-full bg-rose-500" />Critical</span>
									<span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700"><span className="h-2 w-2 rounded-full bg-orange-500" />High Risk</span>
									<span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"><span className="h-2 w-2 rounded-full bg-blue-500" />Density</span>
								</div>
							</div>

							<div className="relative h-[70vh] min-h-[520px] bg-slate-50 p-4">
								<DashboardMap layers={layers} onZoneClick={setSelectedZone} selectedZone={selectedZone} onResetView={handleResetView} onRefresh={handleRefresh} mapView={mapView} />

								<div className="absolute bottom-6 left-6 z-10 max-w-xs rounded-xl border border-white/80 bg-white/90 p-4 shadow-lg backdrop-blur-sm">
									<p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Risk Levels</p>
									<div className="space-y-2">
										<LegendItem color="bg-emerald-500" label="Low Risk" />
										<LegendItem color="bg-amber-500" label="Medium Risk" />
										<LegendItem color="bg-orange-500" label="High Risk" />
										<LegendItem color="bg-rose-600" label="Critical Risk" />
										<LegendItem color="bg-blue-500" label="Detection Heat" opacity="opacity-60" />
									</div>
								</div>

								<div className="absolute bottom-6 right-6 z-10 rounded-lg bg-slate-900/90 px-4 py-2 backdrop-blur-sm">
									<p className="text-xs text-slate-300">Showing <span className="font-bold text-white">27</span> zones</p>
								</div>
							</div>
						</div>
					</div>

					{mapView === 'normal' ? (
						<aside className="space-y-6 xl:col-span-3">
							<LayerPanel layers={layers} onToggle={toggleLayer} />
							<LegendPanel />
							<ZoneInfoPanel zone={selectedZone} />
						</aside>
					) : null}
				</section>
			</div>
		</div>
	);
}

function MapStatCard({
	title,
	value,
	description,
	icon: Icon,
	tone,
	trend,
	isText = false,
}: {
	title: string;
	value: string;
	description: string;
	icon: any;
	tone: 'blue' | 'emerald' | 'rose' | 'amber';
	trend?: { value: number; label: string };
	isText?: boolean;
}) {
	const toneStyles = {
		blue: { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-700', ring: 'ring-blue-500/20' },
		emerald: { bg: 'from-emerald-500 to-green-500', text: 'text-emerald-700', ring: 'ring-emerald-500/20' },
		rose: { bg: 'from-rose-500 to-red-500', text: 'text-rose-700', ring: 'ring-rose-500/20' },
		amber: { bg: 'from-amber-500 to-orange-500', text: 'text-amber-700', ring: 'ring-amber-500/20' },
	};

	const styles = toneStyles[tone];

	return (
		<div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all hover:shadow-md">
			<div className="relative space-y-4">
				<div className="flex items-start justify-between">
					<div className="flex-1 space-y-1">
						<p className="text-sm font-medium text-slate-600">{title}</p>
						<p className="text-xs text-slate-500">{description}</p>
					</div>

					<div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${styles.bg} ring-4 ${styles.ring} shadow-lg`}>
						<Icon className="h-6 w-6 text-white" />
					</div>
				</div>

				<div>
					<p className={`${styles.text} ${isText ? 'text-xl' : 'text-3xl'} font-bold tabular-nums tracking-tight`}>{value}</p>
				</div>

				{trend ? (
					<div className="flex items-center gap-1.5">
						<TrendingUp className={`h-4 w-4 ${styles.text}`} />
						<span className={`text-sm font-semibold ${styles.text}`}>+{trend.value} {trend.label}</span>
					</div>
				) : null}
			</div>
		</div>
	);
}

function LegendItem({ color, label, opacity = '' }: { color: string; label: string; opacity?: string }) {
	return (
		<div className="flex items-center gap-3">
			<span className={`h-3 w-3 rounded-full ${color} ${opacity}`} />
			<span className="text-sm font-medium text-slate-700">{label}</span>
		</div>
	);
}