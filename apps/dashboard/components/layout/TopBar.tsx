'use client';

import { motion } from 'framer-motion';
import { BellIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

interface TopBarProps {
	user: {
		email: string;
		role: string;
	};
}

export function TopBar({ user }: TopBarProps) {
	return (
		<header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-xl">
			<div className="flex items-center justify-between gap-4">
				<div>
					<h2 className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-2xl font-bold text-transparent">
						Welcome back!
					</h2>
					<p className="mt-1 text-sm text-slate-600">Monitor and manage road safety zones in real-time</p>
				</div>

				<div className="flex items-center gap-4">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="relative rounded-xl bg-slate-100 p-2.5 transition-colors hover:bg-slate-200"
					>
						<BellIcon className="h-5 w-5 text-slate-600" />
						<span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
							3
						</span>
					</motion.button>

					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="rounded-xl bg-slate-100 p-2.5 transition-colors hover:bg-slate-200"
					>
						<Cog6ToothIcon className="h-5 w-5 text-slate-600" />
					</motion.button>

					<div className="flex items-center gap-3 border-l border-slate-300 pl-4">
						<div className="text-right">
							<div className="text-sm font-medium text-slate-800">{user.email}</div>
							<div className="text-xs capitalize text-slate-500">{user.role} Access</div>
						</div>
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 font-semibold text-white shadow-lg shadow-sky-500/20">
							{user.email.charAt(0).toUpperCase()}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
