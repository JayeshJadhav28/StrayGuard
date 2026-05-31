 'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fetchAPI } from '@/lib/api';

const ANIMAL_COLORS: Record<string, string> = {
	cattle: '#ef4444',
	dog: '#f59e0b',
	goat: '#10b981',
	sheep: '#6366f1',
	horse: '#8b5cf6',
	buffalo: '#ec4899',
};

export function ClassBreakdownBar() {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchAPI('/stats/summary')
			.then((res) => {
				const formatted = Object.entries(res.by_class || {}).map(([animal, count]) => ({
					animal: animal.charAt(0).toUpperCase() + animal.slice(1),
					count: count as number,
					fill: ANIMAL_COLORS[animal] || '#6b7280',
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
			<BarChart data={data}>
				<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
				<XAxis dataKey="animal" tick={{ fontSize: 12 }} stroke="#6b7280" />
				<YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
				<Tooltip
					contentStyle={{
						backgroundColor: '#fff',
						border: '1px solid #e5e7eb',
						borderRadius: '8px',
					}}
				/>
				<Bar dataKey="count" radius={[8, 8, 0, 0]} />
			</BarChart>
		</ResponsiveContainer>
	);
}
