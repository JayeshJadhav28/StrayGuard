'use client';

import { useEffect, useState } from 'react';
import { Gauge, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchAPI } from '@/lib/api';

export function SpeedOverridePanel() {
	const [zones, setZones] = useState<any[]>([]);
	const [selectedZone, setSelectedZone] = useState('');
	const [speed, setSpeed] = useState('');
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchAPI('/zones')
			.then((res) => setZones(res.zones || []))
			.catch(console.error);
	}, []);

	const selectedZoneData = zones.find((zone) => zone.id.toString() === selectedZone);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setMessage('');
		setLoading(true);

		try {
			await fetchAPI(`/zones/${selectedZone}/override`, {
				method: 'PATCH',
				body: JSON.stringify({ speed_override: Number.parseInt(speed, 10) }),
			});
			setMessage('Speed override applied successfully. Review in 24-48 hours.');
			setSpeed('');
			setSelectedZone('');
		} catch {
			setMessage('Failed to apply speed override. Check permissions.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-50/50 to-amber-50/30 p-6 shadow-sm">
			<div className="flex items-start justify-between gap-4">
				<div>
					<div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-100 px-2.5 py-1">
						<AlertOctagon className="h-3.5 w-3.5 text-orange-700" />
						<span className="text-xs font-semibold uppercase tracking-wide text-orange-700">Manual Intervention</span>
					</div>
					<h2 className="text-xl font-bold text-slate-900">Speed Override</h2>
					<p className="mt-2 text-sm text-slate-600">
						Temporarily override algorithm-generated speed recommendations when field conditions require adjustment.
					</p>
				</div>

				<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
					<Gauge className="h-6 w-6 text-white" />
				</div>
			</div>

			<div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-4">
				<div className="flex gap-3">
					<AlertOctagon className="h-5 w-5 flex-shrink-0 text-orange-600" />
					<p className="text-sm text-orange-800">
						<strong>Use sparingly.</strong> Manual overrides should be reviewed within 24-48 hours and removed once traffic or animal activity patterns stabilize.
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="mt-6 space-y-4">
				<div className="space-y-2">
					<label className="text-sm font-semibold text-slate-700">Select Zone</label>
					<select value={selectedZone} onChange={(event) => setSelectedZone(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20" required>
						<option value="">Choose a zone...</option>
						{zones.map((zone) => (
							<option key={zone.id} value={zone.id}>
								{zone.zone_code} — {zone.segment_label} (Current: {zone.recommended_speed_kmph} km/h)
							</option>
						))}
					</select>
				</div>

				{selectedZoneData ? (
					<div className="rounded-xl border border-slate-200 bg-white p-4">
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="text-slate-500">Current Speed:</span>
								<span className="ml-2 font-semibold text-slate-900">{selectedZoneData.recommended_speed_kmph} km/h</span>
							</div>
							<div>
								<span className="text-slate-500">Risk Level:</span>
								<span className={`ml-2 font-semibold capitalize ${selectedZoneData.risk_level === 'critical' ? 'text-red-600' : selectedZoneData.risk_level === 'high' ? 'text-orange-600' : selectedZoneData.risk_level === 'medium' ? 'text-amber-600' : 'text-green-600'}`}>
									{selectedZoneData.risk_level}
								</span>
							</div>
						</div>
					</div>
				) : null}

				<div className="space-y-2">
					<label className="text-sm font-semibold text-slate-700">Override Speed (km/h)</label>
					<input type="number" min="20" max="80" value={speed} onChange={(event) => setSpeed(event.target.value)} placeholder="e.g., 40" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20" required />
					<p className="text-xs text-slate-500">Valid range: 20–80 km/h</p>
				</div>

				<AnimatePresence>
					{message ? (
						<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`rounded-xl p-4 ${message.includes('Failed') ? 'border border-red-200 bg-red-50' : 'border border-emerald-200 bg-emerald-50'}`}>
							<div className="flex items-start gap-3">
								{!message.includes('Failed') ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : null}
								<p className={`text-sm font-medium ${message.includes('Failed') ? 'text-red-700' : 'text-emerald-700'}`}>{message}</p>
							</div>
						</motion.div>
					) : null}
				</AnimatePresence>

				<button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-orange-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50">
					{loading ? 'Applying...' : 'Apply Override'}
				</button>
			</form>
		</div>
	);
}