'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface TopZonesChartProps {
	data: Array<{ name: string; detections: number }>;
}

export function TopZonesChart({ data }: TopZonesChartProps) {
	return (
		<div className="h-72">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={data}>
					<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
					<XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
					<YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
					<Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
					<Bar dataKey="detections" fill="#2563eb" radius={[8, 8, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}