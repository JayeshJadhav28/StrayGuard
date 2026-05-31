'use client';

import { useState } from 'react';
import { Play, RotateCw, AlertTriangle, CheckCircle2, Loader2, ShieldAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchAPI } from '@/lib/api';

export function DzeControlPanel() {
	const [loading, setLoading] = useState(false);
	const [lastRun, setLastRun] = useState<string | null>('2024-05-24T14:32:00Z');
	const [message, setMessage] = useState('');
	const [confirmRun, setConfirmRun] = useState(false);

	const triggerDZE = async () => {
		setLoading(true);
		setMessage('');

		try {
			await fetchAPI('/dze/trigger', { method: 'POST' });
			setMessage('Danger Zone Engine execution started successfully.');
			setLastRun(new Date().toISOString());
			setConfirmRun(false);
		} catch {
			setMessage('Failed to trigger Danger Zone Engine. Check system logs.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="rounded-2xl border border-rose-200/70 bg-gradient-to-br from-rose-50/50 to-orange-50/30 p-6 shadow-sm">
			<div className="flex items-start justify-between gap-4">
				<div>
					<div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-100 px-2.5 py-1">
						<ShieldAlert className="h-3.5 w-3.5 text-rose-700" />
						<span className="text-xs font-semibold uppercase tracking-wide text-rose-700">Critical System</span>
					</div>
					<h2 className="text-xl font-bold text-slate-900">Danger Zone Engine</h2>
					<p className="mt-2 text-sm text-slate-600">
						Recomputes spatial clusters, risk scores, and recommended speeds for all active zones.
					</p>
				</div>

				<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg">
					<RotateCw className="h-6 w-6 text-white" />
				</div>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
				<StatusBox label="Last Execution" value={lastRun ? new Date(lastRun).toLocaleString() : 'Not available'} icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />} />
				<StatusBox label="Next Scheduled" value="Daily at 02:00 UTC" icon={<RotateCw className="h-4 w-4 text-blue-600" />} />
			</div>

			<div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
				<div className="flex gap-3">
					<AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600" />
					<div>
						<p className="text-sm font-semibold text-amber-900">Manual execution warning</p>
						<p className="mt-1 text-sm text-amber-700">
							Only trigger manual runs when immediate recalculation is required outside the scheduled cycle. This operation is computationally intensive and may temporarily affect system performance.
						</p>
					</div>
				</div>
			</div>

			<AnimatePresence>
				{message ? (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className={`mt-4 rounded-xl p-4 ${message.includes('Failed') ? 'border border-red-200 bg-red-50' : 'border border-emerald-200 bg-emerald-50'}`}
					>
						<div className="flex items-start gap-3">
							{!message.includes('Failed') ? <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600" /> : null}
							<p className={`text-sm font-medium ${message.includes('Failed') ? 'text-red-700' : 'text-emerald-700'}`}>{message}</p>
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>

			{!confirmRun ? (
				<button onClick={() => setConfirmRun(true)} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl">
					<Play className="h-4 w-4" />
					Trigger Manual Execution
				</button>
			) : (
				<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 rounded-2xl border-2 border-rose-200 bg-white p-5">
					<div className="mb-4 flex items-start gap-3">
						<AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" />
						<div>
							<p className="text-sm font-bold text-slate-900">Confirm Manual DZE Execution</p>
							<p className="mt-1 text-sm text-slate-600">This action will immediately start the Danger Zone Engine processing cycle.</p>
						</div>
					</div>

					<div className="flex gap-3">
						<button onClick={triggerDZE} disabled={loading} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50">
							{loading ? <><Loader2 className="h-4 w-4 animate-spin" />Processing...</> : <><Play className="h-4 w-4" />Yes, Execute Now</>}
						</button>

						<button onClick={() => setConfirmRun(false)} disabled={loading} className="inline-flex flex-1 items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
							Cancel
						</button>
					</div>
				</motion.div>
			)}
		</div>
	);
}

function StatusBox({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
	return (
		<div className="rounded-xl border border-slate-200 bg-white p-4">
			<div className="flex items-center gap-2 text-xs font-medium text-slate-500">
				{icon}
				{label}
			</div>
			<p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
		</div>
	);
}