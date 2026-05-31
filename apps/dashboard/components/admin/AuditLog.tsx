'use client';

import { Clock, Settings, Shield, User } from 'lucide-react';

const MOCK_AUDIT_LOG = [
	{ id: 1, action: 'DZE Manual Trigger', user: 'admin@demo.com', timestamp: '2024-05-24T14:32:00Z', type: 'critical', details: 'Manual DZE execution completed successfully' },
	{ id: 2, action: 'Speed Override Applied', user: 'admin@demo.com', timestamp: '2024-05-24T10:15:00Z', type: 'warning', details: 'Zone DZ-NH48-007: Override to 45 km/h' },
	{ id: 3, action: 'User Created', user: 'admin@demo.com', timestamp: '2024-05-23T16:20:00Z', type: 'info', details: 'New agency user: operations@nhai.gov.in' },
	{ id: 4, action: 'System Config Updated', user: 'admin@demo.com', timestamp: '2024-05-22T09:45:00Z', type: 'info', details: 'DZE schedule modified: 02:00 UTC' },
];

export function AuditLog() {
	return (
		<div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
			<div className="mb-5 flex items-center justify-between">
				<div>
					<h3 className="text-lg font-semibold text-slate-900">Audit Log</h3>
					<p className="mt-1 text-sm text-slate-500">Recent administrative actions and system events</p>
				</div>
				<button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All →</button>
			</div>

			<div className="space-y-3">
				{MOCK_AUDIT_LOG.map((entry) => <AuditLogEntry key={entry.id} entry={entry} />)}
			</div>
		</div>
	);
}

function AuditLogEntry({ entry }: { entry: any }) {
	const typeStyles = {
		critical: 'bg-red-50 border-red-200 text-red-700',
		warning: 'bg-amber-50 border-amber-200 text-amber-700',
		info: 'bg-blue-50 border-blue-200 text-blue-700',
	};

	const icons = {
		critical: Shield,
		warning: Settings,
		info: User,
	};

	const Icon = icons[entry.type as keyof typeof icons];

	return (
		<div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white">
			<div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border ${typeStyles[entry.type as keyof typeof typeStyles]}`}>
				<Icon className="h-5 w-5" />
			</div>

			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="font-semibold text-slate-900">{entry.action}</p>
						<p className="mt-1 text-sm text-slate-600">{entry.details}</p>
					</div>

					<div className="flex flex-shrink-0 items-center gap-2 text-xs text-slate-500">
						<Clock className="h-3.5 w-3.5" />
						{new Date(entry.timestamp).toLocaleString()}
					</div>
				</div>

				<div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
					<User className="h-3.5 w-3.5" />
					{entry.user}
				</div>
			</div>
		</div>
	);
}