import Link from 'next/link';
import { ArrowRight, AlertTriangle, Clock, MapPin } from 'lucide-react';

const RISK_STYLES: Record<string, string> = {
	low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
	medium: 'bg-amber-50 text-amber-700 border-amber-200',
	high: 'bg-orange-50 text-orange-700 border-orange-200',
	critical: 'bg-rose-50 text-rose-700 border-rose-200',
};

interface ZoneCardProps {
	zone: any;
}

export function ZoneCard({ zone }: ZoneCardProps) {
	return (
		<Link
			href={`/zones/${zone.id}`}
			className="group rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
		>
			<div className="mb-5 flex items-start justify-between gap-4">
				<div>
					<h3 className="text-lg font-semibold text-slate-900">{zone.zone_code}</h3>
					<p className="mt-1 text-sm text-slate-500">{zone.segment_label || 'Unlabeled segment'}</p>
				</div>

				<span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${RISK_STYLES[zone.risk_level] || 'border-slate-200 bg-slate-100 text-slate-700'}`}>
					{zone.risk_level}
				</span>
			</div>

			<div className="space-y-3">
				<InfoRow icon={<AlertTriangle className="h-4 w-4 text-orange-500" />} label="Recommended speed" value={`${zone.recommended_speed_kmph} km/h`} />
				<InfoRow icon={<MapPin className="h-4 w-4 text-blue-500" />} label="Dominant animal" value={<span className="capitalize">{zone.dominant_animal || 'unknown'}</span>} />
				<InfoRow icon={<Clock className="h-4 w-4 text-violet-500" />} label="Active hours" value={`${zone.active_from || '--:--'} - ${zone.active_to || '--:--'}`} />
			</div>

			<div className="mt-5 border-t border-slate-100 pt-4">
				<div className="flex items-center justify-between">
					<p className="text-sm text-slate-500">{zone.detection_count_30d} detections (30 days)</p>
					<span className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 transition-all group-hover:gap-2">
						View details
						<ArrowRight className="h-4 w-4" />
					</span>
				</div>
			</div>
		</Link>
	);
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
	return (
		<div className="flex items-center justify-between gap-3">
			<div className="flex items-center gap-2 text-sm text-slate-500">
				{icon}
				<span>{label}</span>
			</div>
			<span className="text-sm font-medium text-slate-900">{value}</span>
		</div>
	);
}