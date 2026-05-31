 'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function DayOfWeekGrid() {
	const [data, setData] = useState<Record<string, Record<number, number>>>({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchAPI('/stats/heatgrid')
			.then((res) => setData(res.grid || {}))
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return <div className="h-64 flex items-center justify-center">Loading...</div>;
	}

	const maxCount = Math.max(
		...Object.values(data).flatMap((hours) => Object.values(hours))
	);

	const getColor = (count: number) => {
		const intensity = count / (maxCount || 1);
		if (intensity === 0) return 'bg-gray-100';
		if (intensity < 0.25) return 'bg-blue-200';
		if (intensity < 0.5) return 'bg-blue-400';
		if (intensity < 0.75) return 'bg-blue-600';
		return 'bg-blue-800';
	};

	return (
		<div className="overflow-x-auto">
			<div className="inline-block min-w-full">
				<div className="flex gap-1">
					<div className="w-12"></div>
					{HOURS.map((hour) => (
						<div key={hour} className="w-6 text-xs text-center text-gray-600">
							{hour}
						</div>
					))}
				</div>
				{DAYS.map((day) => (
					<div key={day} className="flex gap-1 mt-1">
						<div className="w-12 text-xs font-medium text-gray-700 flex items-center">{day}</div>
						{HOURS.map((hour) => {
							const count = data[day]?.[hour] || 0;
							return (
								<div
									key={hour}
									className={`w-6 h-6 rounded ${getColor(count)} cursor-pointer hover:ring-2 hover:ring-blue-500`}
									title={`${day} ${hour}:00 - ${count} detections`}
								/>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
}
