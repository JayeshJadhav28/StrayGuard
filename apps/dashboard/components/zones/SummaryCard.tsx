import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface SummaryCardProps {
	title: string;
	value: string | number;
	description: string;
	icon: LucideIcon;
	tone: 'blue' | 'amber' | 'rose' | 'emerald';
	trend?: { value: number; label: string; direction?: 'up' | 'down' };
}

const toneStyles = {
	blue: 'bg-blue-50 text-blue-600 ring-blue-500/20',
	amber: 'bg-amber-50 text-amber-600 ring-amber-500/20',
	rose: 'bg-rose-50 text-rose-600 ring-rose-500/20',
	emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-500/20',
};

export function SummaryCard({ title, value, description, icon: Icon, tone, trend }: SummaryCardProps) {
	const isTrendDown = trend?.direction === 'down';

	return (
		<div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all hover:shadow-md">
			<div className="space-y-4">
				<div className="flex items-start justify-between">
					<div className="space-y-1">
						<p className="text-sm font-medium text-slate-600">{title}</p>
						<p className="text-xs text-slate-500">{description}</p>
					</div>

					<div className={`flex h-12 w-12 items-center justify-center rounded-xl ring-4 ${toneStyles[tone]}`}>
						<Icon className="h-6 w-6" />
					</div>
				</div>

				<div>
					<p className="text-3xl font-bold tabular-nums tracking-tight text-slate-900">{value}</p>
				</div>

				{trend ? (
					<div className="flex items-center gap-1.5 text-sm">
						{isTrendDown ? <TrendingDown className="h-4 w-4 text-slate-400" /> : <TrendingUp className="h-4 w-4 text-rose-500" />}
						<span className={`font-semibold ${isTrendDown ? 'text-slate-500' : 'text-rose-600'}`}>
							{trend.value} {trend.label}
						</span>
					</div>
				) : null}
			</div>
		</div>
	);
}