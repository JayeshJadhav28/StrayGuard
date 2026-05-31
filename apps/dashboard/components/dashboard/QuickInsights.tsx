'use client';

import { Clock, Lightbulb, PawPrint, TrendingUp } from 'lucide-react';

export function QuickInsights() {
	const insights = [
		{
			icon: Clock,
			label: 'Peak Detection Window',
			value: '7:00 PM - 10:00 PM',
			tone: 'purple',
		},
		{
			icon: PawPrint,
			label: 'Most Detected Animal',
			value: 'Cattle (68%)',
			tone: 'amber',
		},
		{
			icon: TrendingUp,
			label: 'Trend vs Last Week',
			value: '+12% detections',
			tone: 'red',
		},
		{
			icon: Lightbulb,
			label: 'Recommended Action',
			value: 'Increase signage in top 3 zones',
			tone: 'blue',
		},
	];

	const toneColors: Record<string, string> = {
		purple: 'bg-purple-50 text-purple-700',
		amber: 'bg-amber-50 text-amber-700',
		red: 'bg-red-50 text-red-700',
		blue: 'bg-blue-50 text-blue-700',
	};

	return (
		<div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
			<div className="border-b border-slate-200/70 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
				<h3 className="text-lg font-semibold text-slate-900">Quick Insights</h3>
				<p className="mt-1 text-sm text-slate-500">Key patterns and recommendations</p>
			</div>

			<div className="space-y-3 p-4">
				{insights.map((item) => {
					const Icon = item.icon;
					return (
						<div
							key={item.label}
							className="group flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-sm"
						>
							<div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${toneColors[item.tone]}`}>
								<Icon className="h-5 w-5" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
								<p className="mt-1 text-sm font-semibold text-slate-900">{item.value}</p>
							</div>
						</div>
					);
				})}
			</div>

			<div className="border-t border-slate-200/70 bg-slate-50 px-6 py-3">
				<a href="/dashboard/analytics" className="text-sm font-medium text-blue-600 hover:text-blue-700">
					View detailed analytics →
				</a>
			</div>
		</div>
	);
}