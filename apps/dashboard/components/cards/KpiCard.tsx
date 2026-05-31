'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import useSWR from 'swr';
import { fetchAPI } from '@/lib/api';

interface KpiCardProps {
	title: string;
	endpoint: string;
	field: string;
	icon: LucideIcon;
	tone: 'blue' | 'amber' | 'rose' | 'emerald';
	description?: string;
	trend?: {
		value: number;
		direction: 'up' | 'down';
		label?: string;
	};
	suffix?: string;
	isText?: boolean;
}


const toneConfig = {
	blue: {
		bg: 'bg-blue-50',
		icon: 'text-blue-600',
		ring: 'ring-blue-500/20',
		glow: 'from-blue-500/20',
		trend: 'text-blue-600',
	},
	amber: {
		bg: 'bg-amber-50',
		icon: 'text-amber-600',
		ring: 'ring-amber-500/20',
		glow: 'from-amber-500/20',
		trend: 'text-amber-600',
	},
	rose: {
		bg: 'bg-rose-50',
		icon: 'text-rose-600',
		ring: 'ring-rose-500/20',
		glow: 'from-rose-500/20',
		trend: 'text-rose-600',
	},
	emerald: {
		bg: 'bg-emerald-50',
		icon: 'text-emerald-600',
		ring: 'ring-emerald-500/20',
		glow: 'from-emerald-500/20',
		trend: 'text-emerald-600',
	},
} as const;

export function KpiCard({
	title,
	endpoint,
	field,
	icon: Icon,
	tone,
	description,
	trend,
	suffix = '',
	isText = false,
}: KpiCardProps) {
	const { data, isLoading } = useSWR(endpoint, fetchAPI, { refreshInterval: 30000 });
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const value = data?.[field] ?? 'N/A';
	const colors = toneConfig[tone];

	if (!mounted) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all hover:shadow-md"
		>
			<div className={`absolute -left-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${colors.glow} to-transparent opacity-0 blur-2xl transition-opacity group-hover:opacity-100`} />

			<div className="relative space-y-4">
				<div className="flex items-start justify-between">
					<div className="space-y-1">
						<p className="text-sm font-medium text-slate-600">{title}</p>
						{description ? <p className="text-xs text-slate-500">{description}</p> : null}
					</div>

					<div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} ring-4 ${colors.ring}`}>
						<Icon className={`h-6 w-6 ${colors.icon}`} />
					</div>
				</div>

				<div>
					{isLoading ? (
						<div className="h-10 w-24 animate-pulse rounded bg-slate-200" />
					) : (
						<p className={`text-3xl font-bold tabular-nums tracking-tight text-slate-900 ${isText ? 'text-xl' : ''}`}>
							{isText ? value : `${Number(value).toLocaleString()}${suffix}`}
						</p>
					)}
				</div>

				{trend && !isLoading ? (
					<div className="flex items-center gap-1.5">
						{trend.direction === 'up' ? (
							<TrendingUp className={`h-4 w-4 ${colors.trend}`} />
						) : (
							<TrendingDown className="h-4 w-4 text-slate-400" />
						)}
						<span className={`text-sm font-semibold ${trend.direction === 'up' ? colors.trend : 'text-slate-500'}`}>
							{trend.value}% {trend.label}
						</span>
					</div>
				) : null}
			</div>
		</motion.div>
	);
}
