 'use client';

import { useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';

export function SpeedOverrideForm() {
	const [zones, setZones] = useState<any[]>([]);
	const [selectedZone, setSelectedZone] = useState('');
	const [speed, setSpeed] = useState('');
	const [message, setMessage] = useState('');

	useEffect(() => {
		fetchAPI('/zones')
			.then((res) => setZones(res.zones || []))
			.catch(console.error);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage('');

		try {
			await fetchAPI(`/zones/${selectedZone}/override`, {
				method: 'PATCH',
				body: JSON.stringify({ speed_override: parseInt(speed) }),
			});

			setMessage('Speed override updated successfully');
			setSpeed('');
		} catch (error) {
			setMessage('Error updating override');
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow">
			<h2 className="text-xl font-semibold mb-4">Manual Speed Override</h2>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Select Zone</label>
					<select
						value={selectedZone}
						onChange={(e) => setSelectedZone(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
						required
					>
						<option value="">Choose a zone...</option>
						{zones.map((zone) => (
							<option key={zone.id} value={zone.id}>
								{zone.zone_code} - {zone.segment_label}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Override Speed (km/h)</label>
					<input
						type="number"
						min="20"
						max="80"
						value={speed}
						onChange={(e) => setSpeed(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
						placeholder="e.g., 40"
						required
					/>
				</div>

				{message && (
					<div className={`p-3 rounded-lg text-sm ${
						message.includes('Error') || message.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
					}`}>
						{message}
					</div>
				)}

				<button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
					Apply Override
				</button>
			</form>
		</div>
	);
}
