import { LucideIcon } from 'lucide-react';

interface SystemHealthCardProps {
	title: string;
	value: string;
	description: string;
	icon: LucideIcon;
	tone: 'emerald' | 'blue' | 'amber' | 'purple';
	timestamp: string;
}

const toneStyles = {
	emerald: {
		bg: 'from-emerald-500 to-green-500',
		text: 'text-emerald-700',
		ring: 'ring-emerald-500/20',
	},
	blue: {
		bg: 'from-blue-500 to-cyan-500',
		text: 'text-blue-700',
		ring: 'ring-blue-500/20',
	},
	amber: {
		bg: 'from-amber-500 to-orange-500',
		text: 'text-amber-700',
		ring: 'ring-amber-500/20',
	},
	purple: {
		bg: 'from-purple-500 to-pink-500',
		text: 'text-purple-700',
		ring: 'ring-purple-500/20',
	},
};

export function SystemHealthCard({ title, value, description, icon: Icon, tone, timestamp }: SystemHealthCardProps) {
	const styles = toneStyles[tone];

	return (
		<div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all hover:shadow-md">
			<div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${styles.bg} opacity-0 blur-2xl transition-opacity group-hover:opacity-10`} />

			<div className="relative space-y-4">
				<div className="flex items-start justify-between">
					<div className="flex-1 space-y-1">
						<p className="text-sm font-medium text-slate-600">{title}</p>
						<p className="text-xs text-slate-500">{description}</p>
					</div>

					<div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${styles.bg} ring-4 ${styles.ring} shadow-lg`}>
						<Icon className="h-6 w-6 text-white" />
					</div>
				</div>

				<div>
					<p className={`text-3xl font-bold tabular-nums tracking-tight ${styles.text}`}>{value}</p>
					<p className="mt-1 text-xs text-slate-500">{timestamp}</p>
				</div>
			</div>
		</div>
	);
}