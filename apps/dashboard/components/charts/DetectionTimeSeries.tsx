 'use client';

import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fetchAPI } from '@/lib/api';

export function DetectionTimeSeries({ days = 7 }: { days?: number }) {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		fetchAPI(`/stats/timeseries?days=${days}`)
			.then((res) => {
				const formatted = res.data.map((d: any) => ({
					time: new Date(d.hour).toLocaleDateString('en-US', {
						month: 'short',
						day: 'numeric',
						hour: '2-digit',
					}),
					detections: d.count,
				}));
				setData(formatted);
			})
			.finally(() => setLoading(false));
	}, [days]);

	if (loading) {
		return <div className="h-64 flex items-center justify-center">Loading...</div>;
	}

	return (
		<ResponsiveContainer width="100%" height={300}>
			<AreaChart data={data}>
				<defs>
					<linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
						<stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
					</linearGradient>
				</defs>
				<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
				<XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#6b7280" />
				<YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
				<Tooltip
					contentStyle={{
						backgroundColor: '#fff',
						border: '1px solid #e5e7eb',
						borderRadius: '8px',
						padding: '8px 12px',
					}}
				/>
				<Area type="monotone" dataKey="detections" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDetections)" />
			</AreaChart>
		</ResponsiveContainer>
	);
}
