'use client';

import Link from 'next/link';
import { MapPin, Clock, Gauge, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';

interface ZoneInfoPanelProps {
	zone: any;
}

export function ZoneInfoPanel({ zone }: ZoneInfoPanelProps) {
	if (!zone) {
		return (
			<div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
				<h2 className="text-lg font-semibold text-slate-900">Selected Zone</h2>
				<p className="mt-2 text-sm text-slate-500">Click on a danger zone polygon to view details</p>

				<div className="mt-6 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
					<MapPin className="mx-auto h-12 w-12 text-slate-300" />
					<p className="mt-3 text-sm text-slate-500">No zone selected</p>
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
			<div className="mb-5 flex items-start justify-between">
				<div>
					<h2 className="text-lg font-semibold text-slate-900">Selected Zone</h2>
					<p className="mt-1 text-sm text-slate-500">Zone details and metrics</p>
				</div>

				<span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${zone.risk_level === 'critical' ? 'border-rose-200 bg-rose-100 text-rose-700' : zone.risk_level === 'high' ? 'border-orange-200 bg-orange-100 text-orange-700' : zone.risk_level === 'medium' ? 'border-amber-200 bg-amber-100 text-amber-700' : 'border-emerald-200 bg-emerald-100 text-emerald-700'}`}>
					{zone.risk_level}
				</span>
			</div>

			<div className="space-y-3">
				<InfoBlock icon={<MapPin className="h-4 w-4 text-blue-500" />} label="Zone Code" value={zone.zone_code || '—'} />
				<InfoBlock icon={<MapPin className="h-4 w-4 text-purple-500" />} label="Segment" value={zone.segment_label || 'Unlabeled'} />
				<InfoBlock icon={<Gauge className="h-4 w-4 text-orange-500" />} label="Recommended Speed" value={`${zone.recommended_speed_kmph || '—'} km/h`} />
				<InfoBlock icon={<Clock className="h-4 w-4 text-violet-500" />} label="Active Window" value={`${zone.active_from || '--:--'} - ${zone.active_to || '--:--'}`} />
				<InfoBlock icon={<AlertTriangle className="h-4 w-4 text-amber-500" />} label="Dominant Animal" value={<span className="capitalize">{zone.dominant_animal || 'Unknown'}</span>} />
				<InfoBlock icon={<TrendingUp className="h-4 w-4 text-emerald-500" />} label="30-Day Detections" value={zone.detection_count_30d?.toLocaleString() || '0'} />
			</div>

			<Link href={`/dashboard/zones/${zone.id}`} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40">
				View Full Details
				<ArrowRight className="h-4 w-4" />
			</Link>
		</div>
	);
}

function InfoBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
	return (
		<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
			<div className="flex items-center gap-2 text-xs font-medium text-slate-500">
				{icon}
				{label}
			</div>
			<p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
		</div>
	);
}