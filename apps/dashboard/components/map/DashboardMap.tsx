'use client';

import { CircleMarker, MapContainer, Popup, Polyline, TileLayer } from 'react-leaflet';
import { DetectionHeatmap } from './DetectionHeatmap';
import { MapControls } from './MapControls';
import { ZonePolygonLayer } from './ZonePolygonLayer';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;

const ROAD_SEGMENTS: Array<Array<[number, number]>> = [
	[[19.076, 72.8777], [19.45, 73.45], [19.9, 74.2]],
	[[18.52, 73.8567], [18.95, 74.2], [19.4, 74.8]],
	[[26.9124, 75.7873], [26.5, 75.3], [25.9, 74.6]],
];

const EVENT_POINTS = [
	{ id: 'evt-1', position: [19.3, 73.95] as [number, number], label: 'Recent cattle movement' },
	{ id: 'evt-2', position: [18.88, 74.35] as [number, number], label: 'Night-time crossing' },
	{ id: 'evt-3', position: [26.12, 75.02] as [number, number], label: 'Roadside cluster' },
];

interface DashboardMapProps {
	layers?: {
		heatmap: boolean;
		zones: boolean;
		roads: boolean;
		labels: boolean;
		events: boolean;
	};
	selectedZone?: any;
	onZoneClick?: (zone: any) => void;
	onResetView?: () => void;
	onRefresh?: () => void;
	mapView?: 'normal' | 'fullscreen';
}

export function DashboardMap({ layers, selectedZone, onZoneClick, onResetView, onRefresh, mapView }: DashboardMapProps) {
	return (
		<div className="relative h-full w-full overflow-hidden rounded-2xl">
			<MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} style={{ height: '100%', width: '100%' }}>
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />

				{layers?.roads ? <RoadLayer /> : null}
				{layers?.events ? <EventLayer /> : null}
				{layers?.heatmap !== false ? <DetectionHeatmap enabled={layers?.heatmap} /> : null}
				{layers?.zones !== false ? <ZonePolygonLayer selectedZone={selectedZone} onZoneClick={onZoneClick} showLabels={layers?.labels} /> : null}

				<MapControls onResetView={onResetView} onRefresh={onRefresh} mapView={mapView} />
			</MapContainer>
		</div>
	);
}

function RoadLayer() {
	return (
		<>
			{ROAD_SEGMENTS.map((segment, index) => (
				<Polyline key={index} positions={segment} pathOptions={{ color: '#64748b', weight: 3, opacity: 0.65 }} />
			))}
		</>
	);
}

function EventLayer() {
	return (
		<>
			{EVENT_POINTS.map((event) => (
				<CircleMarker key={event.id} center={event.position} radius={8} pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.75, weight: 2 }}>
					<Popup>
						<div className="p-1 text-sm text-slate-700">{event.label}</div>
					</Popup>
				</CircleMarker>
			))}
		</>
	);
}
