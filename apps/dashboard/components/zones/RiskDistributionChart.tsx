'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS: Record<string, string> = {
	low: '#10b981',
	medium: '#f59e0b',
	high: '#f97316',
	critical: '#e11d48',
};

interface RiskDistributionChartProps {
	data: Array<{ name: string; value: number }>;
}

export function RiskDistributionChart({ data }: RiskDistributionChartProps) {
	return (
		<div className="h-72">
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={data}
						dataKey="value"
						nameKey="name"
						cx="50%"
						cy="50%"
						innerRadius={60}
						outerRadius={90}
						paddingAngle={4}
						label={({ name, percent }) => `${name.charAt(0).toUpperCase() + name.slice(1)} ${(percent * 100).toFixed(0)}%`}
					>
						{data.map((entry) => <Cell key={entry.name} fill={COLORS[entry.name] || '#6b7280'} />)}
					</Pie>
					<Tooltip />
					<Legend verticalAlign="bottom" height={36} />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}