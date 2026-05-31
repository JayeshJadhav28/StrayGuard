'use client';

import { Layers3, Eye, EyeOff } from 'lucide-react';

interface LayerPanelProps {
	layers: Record<string, boolean>;
	onToggle: (layer: string) => void;
}

const LAYER_CONFIG = [
	{ key: 'heatmap', label: 'Detection Heatmap', color: 'text-blue-600' },
	{ key: 'zones', label: 'Danger Zone Polygons', color: 'text-rose-600' },
	{ key: 'roads', label: 'Road Segments', color: 'text-slate-600' },
	{ key: 'labels', label: 'Zone Labels', color: 'text-purple-600' },
	{ key: 'events', label: 'Recent Events (24h)', color: 'text-amber-600' },
];

export function LayerPanel({ layers, onToggle }: LayerPanelProps) {
	return (
		<div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
			<div className="mb-5 flex items-center gap-2">
				<Layers3 className="h-5 w-5 text-slate-700" />
				<h2 className="text-lg font-semibold text-slate-900">Map Layers</h2>
			</div>
			<p className="mb-5 text-sm text-slate-500">Control visibility of map information layers</p>

			<div className="space-y-2">
				{LAYER_CONFIG.map((layer) => (
					<button key={layer.key} onClick={() => onToggle(layer.key)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition-all ${layers[layer.key] ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}>
						<div className="flex items-center gap-3">
							{layers[layer.key] ? <Eye className={`h-4 w-4 ${layer.color}`} /> : <EyeOff className="h-4 w-4 text-slate-400" />}
							<span className={`text-sm font-medium ${layers[layer.key] ? 'text-slate-900' : 'text-slate-600'}`}>{layer.label}</span>
						</div>

						<div className={`h-2 w-2 rounded-full ${layers[layer.key] ? 'bg-blue-500' : 'bg-slate-300'}`} />
					</button>
				))}
			</div>

			<div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3">
				<p className="text-xs text-blue-700"><strong>Tip:</strong> Disable layers to reduce visual clutter and improve performance.</p>
			</div>
		</div>
	);
}