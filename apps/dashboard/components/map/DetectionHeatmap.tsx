'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import useSWR from 'swr';
import { fetchAPI } from '@/lib/api';

interface DetectionHeatmapProps {
	enabled?: boolean;
	days?: number;
}

export function DetectionHeatmap({ enabled = true, days = 30 }: DetectionHeatmapProps) {
	const map = useMap();
	const { data } = useSWR(enabled ? `/stats/heatmap?days=${days}` : null, fetchAPI, {
		refreshInterval: enabled ? 30000 : 0,
	});

	useEffect(() => {
		if (!enabled || !data?.points || data.points.length === 0) return;

		const points = data.points.map((point: any) => [Number(point.lat), Number(point.lon), Number(point.weight || 1)]);

		// @ts-ignore leaflet.heat augments the Leaflet namespace at runtime.
		const heatLayer = L.heatLayer(points, {
			radius: 25,
			blur: 15,
			maxZoom: 17,
			max: 1.0,
			gradient: {
				0.0: 'blue',
				0.5: 'yellow',
				0.7: 'orange',
				1.0: 'red',
			},
		}).addTo(map);

		return () => {
			map.removeLayer(heatLayer);
		};
	}, [data, enabled, map]);

	return null;
}
