'use client';

import { GeoJSON, Tooltip, Popup } from 'react-leaflet';
import useSWR from 'swr';
import { fetchAPI } from '@/lib/api';

const RISK_COLORS: Record<string, string> = {
	low: '#10b981',
	medium: '#f59e0b',
	high: '#ef4444',
	critical: '#991b1b',
};

interface ZonePolygonLayerProps {
	selectedZone?: any;
	onZoneClick?: (zone: any) => void;
	showLabels?: boolean;
}

export function ZonePolygonLayer({ selectedZone, onZoneClick, showLabels = false }: ZonePolygonLayerProps) {
	const { data } = useSWR('/zones', fetchAPI, {
		refreshInterval: 60000,
	});

	if (!data?.zones) return null;

	return (
		<>
			{data.zones
				.filter((zone: any) => zone.polygon)
				.map((zone: any) => {
					const isSelected = selectedZone?.id === zone.id;

					return (
						<GeoJSON
							key={zone.id}
							data={zone.polygon}
							eventHandlers={{ click: () => onZoneClick?.(zone) }}
							style={{
								color: isSelected ? '#0f172a' : RISK_COLORS[zone.risk_level] || '#6b7280',
								weight: isSelected ? 4 : 2,
								fillOpacity: isSelected ? 0.4 : 0.28,
								fillColor: RISK_COLORS[zone.risk_level] || '#6b7280',
							}}
						>
							{showLabels ? (
								<Tooltip permanent direction="center" className="zone-label-tooltip">
									<div className="rounded-full bg-white/95 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700 shadow">
										{zone.zone_code}
									</div>
								</Tooltip>
							) : null}
							<Popup>
								<div className="p-2">
									<h3 className="text-lg font-bold">{zone.zone_code}</h3>
									<p className="text-sm text-gray-600">{zone.segment_label || 'Unlabeled segment'}</p>
									<div className="mt-2 space-y-1">
										<div className="flex justify-between">
											<span className="text-xs">Risk:</span>
											<span className="text-xs font-semibold uppercase" style={{ color: RISK_COLORS[zone.risk_level] }}>
												{zone.risk_level}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-xs">Recommended Speed:</span>
											<span className="text-xs font-bold">{zone.recommended_speed_kmph} km/h</span>
										</div>
										<div className="flex justify-between">
											<span className="text-xs">Dominant Animal:</span>
											<span className="text-xs capitalize">{zone.dominant_animal || 'unknown'}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-xs">Active:</span>
											<span className="text-xs">{zone.active_from || '--:--'} - {zone.active_to || '--:--'}</span>
										</div>
									</div>
								</div>
							</Popup>
						</GeoJSON>
					);
				})}
		</>
	);
}
