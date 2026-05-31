 'use client';

import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { fetchAPI } from '@/lib/api';

const RISK_COLORS: Record<string, string> = {
	low: '#10b981',
	medium: '#f59e0b',
	high: '#ef4444',
	critical: '#991b1b',
};

export function RiskDistributionPie() {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchAPI('/stats/risk-distribution')
			.then((res) => {
				const formatted = Object.entries(res.distribution || {}).map(([level, count]) => ({
					name: level.charAt(0).toUpperCase() + level.slice(1),
					value: count as number,
					color: RISK_COLORS[level] || '#6b7280',
				}));
				setData(formatted);
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return <div className="h-64 flex items-center justify-center">Loading...</div>;
	}

	return (
		<ResponsiveContainer width="100%" height={300}>
			<PieChart>
				<Pie
					data={data}
					cx="50%"
					cy="50%"
					labelLine={false}
					label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
					outerRadius={80}
					fill="#8884d8"
					dataKey="value"
				>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={entry.color} />
					))}
				</Pie>
				<Tooltip />
				<Legend />
			</PieChart>
		</ResponsiveContainer>
	);
}
