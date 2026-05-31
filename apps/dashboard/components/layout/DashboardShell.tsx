'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { Sidebar } from './Sidebar';

interface DashboardShellProps {
	userEmail: string;
	userRole: string;
	children: React.ReactNode;
}

export function DashboardShell({ userEmail, userRole, children }: DashboardShellProps) {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
			<header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:hidden">
				<button
					type="button"
					onClick={() => setMobileOpen(true)}
					className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:bg-slate-100"
					aria-label="Open menu"
				>
					<Bars3Icon className="h-6 w-6" />
				</button>

				<div className="flex items-center gap-3">
					<div className="relative h-10 w-10 overflow-hidden rounded-2xl">
						<Image src="/logo.png" alt="StrayGuard" fill sizes="40px" className="object-contain" priority />
					</div>
					<div>
						<div className="text-sm font-semibold text-slate-900">StrayGuard</div>
						<div className="text-[11px] text-slate-500">Predict. Prevent. Protect.</div>
					</div>
				</div>

				<div className="h-10 w-10" />
			</header>

			<Sidebar
				userEmail={userEmail}
				userRole={userRole}
				mobileOpen={mobileOpen}
				onMobileClose={() => setMobileOpen(false)}
			/>

			<div className="flex flex-1 flex-col overflow-hidden">
				<main className="flex-1 overflow-y-auto">
					<div className="p-4 md:p-6">{children}</div>
				</main>
			</div>
		</div>
	);
}