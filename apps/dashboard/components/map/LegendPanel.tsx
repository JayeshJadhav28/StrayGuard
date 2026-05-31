import { Info } from 'lucide-react';

const LEGEND_ITEMS = [
	{ color: 'bg-blue-500', label: 'Detection Heat Intensity', type: 'gradient' },
	{ color: 'bg-emerald-500', label: 'Low Risk Zone', type: 'solid' },
	{ color: 'bg-amber-500', label: 'Medium Risk Zone', type: 'solid' },
	{ color: 'bg-orange-500', label: 'High Risk Zone', type: 'solid' },
	{ color: 'bg-rose-600', label: 'Critical Risk Zone', type: 'solid' },
	{ color: 'bg-slate-400', label: 'Monitored Road Segment', type: 'line' },
];

export function LegendPanel() {
	return (
		<div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
			<div className="mb-5 flex items-center gap-2">
				<Info className="h-5 w-5 text-slate-700" />
				<h2 className="text-lg font-semibold text-slate-900">Map Legend</h2>
			</div>

			<div className="space-y-3">
				{LEGEND_ITEMS.map((item, index) => (
					<div key={index} className="flex items-center gap-3">
						{item.type === 'line' ? <div className={`h-0.5 w-4 ${item.color}`} /> : <div className={`h-3 w-3 rounded-full ${item.color} ${item.type === 'gradient' ? 'opacity-60' : ''}`} />}
						<span className="text-sm text-slate-700">{item.label}</span>
					</div>
				))}
			</div>

			<div className="mt-5 rounded-xl bg-slate-50 p-4">
				<p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Risk Formula</p>
				<p className="text-sm text-slate-700">Risk score = (detections / area) / hours_active</p>
			</div>
		</div>
	);
}