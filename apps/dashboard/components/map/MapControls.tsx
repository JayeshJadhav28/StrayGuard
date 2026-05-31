'use client';

import { useMap } from 'react-leaflet';
import { LocateFixed, Maximize2, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;

interface MapControlsProps {
	onResetView?: () => void;
	onRefresh?: () => void;
	mapView?: 'normal' | 'fullscreen';
}

export function MapControls({ onResetView, onRefresh, mapView }: MapControlsProps) {
	const map = useMap();

	const handleReset = () => {
		map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
		onResetView?.();
	};

	return (
		<div className="absolute right-6 top-6 z-10 space-y-2">
			<div className="rounded-xl border border-white/80 bg-white/95 p-1 shadow-lg backdrop-blur-sm">
				<button type="button" onClick={() => map.zoomIn()} className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm transition hover:bg-slate-50">
					<ZoomIn className="h-5 w-5 text-slate-700" />
				</button>
				<button type="button" onClick={() => map.zoomOut()} className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm transition hover:bg-slate-50">
					<ZoomOut className="h-5 w-5 text-slate-700" />
				</button>
			</div>

			<div className="rounded-xl border border-white/80 bg-white/95 p-1 shadow-lg backdrop-blur-sm">
				<button type="button" onClick={onRefresh} className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm transition hover:bg-slate-50" title="Refresh map data">
					<RefreshCw className="h-4 w-4 text-slate-700" />
				</button>
				<button type="button" onClick={handleReset} className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm transition hover:bg-slate-50" title="Reset map view">
					<LocateFixed className="h-4 w-4 text-slate-700" />
				</button>
				<button type="button" onClick={() => map.setZoom(mapView === 'fullscreen' ? 6 : 5)} className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm transition hover:bg-slate-50" title="Fit zoom">
					<Maximize2 className="h-4 w-4 text-slate-700" />
				</button>
			</div>
		</div>
	);
}