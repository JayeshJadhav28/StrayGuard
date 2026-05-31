import Link from 'next/link';

export default function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
			<div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-black/20 backdrop-blur">
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">StrayGuard Dashboard</p>
				<h1 className="mt-3 text-3xl font-bold tracking-tight text-white">Page not found</h1>
				<p className="mt-3 text-sm leading-6 text-slate-300">
					The route you requested is not available. Return to the dashboard to continue monitoring reports, zones, and analytics.
				</p>
				<div className="mt-6">
					<Link href="/dashboard" className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-100">
						Go to dashboard
					</Link>
				</div>
			</div>
		</div>
	);
}