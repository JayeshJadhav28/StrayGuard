'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
	ShieldCheck,
	Eye,
	EyeOff,
	LockKeyhole,
	Mail,
	AlertCircle,
	CheckCircle2,
	Loader2,
	ArrowRight,
	Shield,
	Settings,
	BarChart3,
} from 'lucide-react';

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const isFormValid = useMemo(() => email.trim().length > 0 && password.trim().length >= 6, [email, password]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError('');
		setLoading(true);

		try {
			const result = await signIn('credentials', {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				setError('Invalid email or password. Please verify your credentials and try again.');
				return;
			}

			router.push('/dashboard');
			router.refresh();
		} catch {
			setError('Unable to sign in at this time. Please try again in a moment.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="h-screen overflow-hidden bg-slate-950">
			<div className="grid h-full grid-cols-1 lg:grid-cols-2">
				<section className="relative hidden overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-8 lg:flex lg:flex-col lg:justify-between xl:p-10">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.15),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_35%)]" />
					<div className="absolute left-20 top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
					<div className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />

					<div className="relative z-10">
						<div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
							<ShieldCheck className="h-4 w-4 text-blue-400" />
							<span className="text-sm font-medium text-slate-200">Protected Operations Access</span>
						</div>

						<div className="mt-8 max-w-xl space-y-5">
							<div className="flex items-center gap-3">
								<div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
									<Image src="/logo.png" alt="StrayGuard Logo" width={32} height={32} className="rounded-lg" priority />
									<ShieldCheck className="absolute h-7 w-7 text-white" style={{ display: 'none' }} />
								</div>
								<div>
									<h1 className="text-3xl font-bold text-white">StrayGuard</h1>
									<p className="text-sm text-slate-400">Admin Console</p>
								</div>
							</div>

							<h2 className="text-3xl font-bold tracking-tight text-white xl:text-4xl">Secure Access to Road Safety Operations</h2>

							<p className="text-base leading-relaxed text-slate-300">
								Control danger-zone computation, manage manual safety interventions, and oversee stakeholder reporting for India's highway animal-risk mitigation platform.
							</p>
						</div>

						<div className="mt-8 grid gap-3">
							<FeatureCard icon={<Settings className="h-5 w-5 text-blue-400" />} title="Danger Zone Engine Control" description="Run and monitor zone generation cycles for real-time road-risk intelligence." />
							<FeatureCard icon={<Shield className="h-5 w-5 text-emerald-400" />} title="Manual Safety Overrides" description="Adjust recommended speeds for high-risk corridors when field conditions require intervention." />
							<FeatureCard icon={<BarChart3 className="h-5 w-5 text-purple-400" />} title="Analytics & Reporting" description="Access comprehensive dashboards, zone analytics, and stakeholder export capabilities." />
						</div>
					</div>
				</section>

				<section className="flex items-center justify-center overflow-hidden bg-slate-950 px-4 py-4 sm:px-6 lg:px-10">
					<div className="w-full max-w-md">
						<div className="mb-4 flex items-center justify-center gap-3 lg:hidden">
							<div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
								<Image src="/logo.png" alt="StrayGuard Logo" width={28} height={28} className="rounded-lg" priority />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-white">StrayGuard</h1>
								<p className="text-sm text-slate-400">Admin Console</p>
							</div>
						</div>

						<div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl shadow-black/50 backdrop-blur-sm lg:p-6">
							<div className="mb-4 space-y-3">
								<div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
									<LockKeyhole className="h-3.5 w-3.5" />
									Administrator Sign-In
								</div>

								<h2 className="text-2xl font-bold tracking-tight text-white">Welcome back</h2>
								<p className="text-xs leading-relaxed text-slate-400 sm:text-sm">Enter your credentials to access the StrayGuard operations dashboard and administrative controls.</p>
							</div>

							<form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
								{error ? (
									<div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3.5 text-sm text-rose-200">
										<AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
										<div>
											<p className="font-medium">Authentication Failed</p>
											<p className="mt-1 text-rose-300">{error}</p>
										</div>
									</div>
								) : null}

								<div className="space-y-1.5">
									<label htmlFor="email" className="block text-sm font-medium text-slate-200">Email Address</label>
									<div className="group relative">
										<Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
										<input id="email" name="email" type="email" autoComplete="username" inputMode="email" spellCheck={false} value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="admin@strayguard.app" className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-12 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
									</div>
								</div>

								<div className="space-y-1.5">
									<div className="flex items-center justify-between">
										<label htmlFor="password" className="block text-sm font-medium text-slate-200">Password</label>
										<button type="button" className="text-xs font-medium text-blue-400 transition hover:text-blue-300">Forgot password?</button>
									</div>
									<div className="group relative">
										<LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
										<input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Enter your password" className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-12 py-3 pr-12 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
										<button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200">
											{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
										</button>
									</div>
								</div>

								<button type="submit" disabled={loading || !isFormValid} className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:shadow-none">
									{loading ? <><Loader2 className="h-5 w-5 animate-spin" />Authenticating...</> : <><ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />Sign In to Dashboard</>}
								</button>
							</form>

							<div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5">
								<div className="flex items-start gap-3">
									<CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
									<div className="flex-1">
										<p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Demo Access Available</p>
										<p className="mt-1.5 text-xs leading-relaxed text-slate-400 sm:text-sm">For hackathon review and testing purposes, use the credentials below:</p>
										<div className="mt-2.5 rounded-xl border border-slate-800 bg-slate-900 p-2.5">
											<div className="flex items-center justify-between gap-4">
												<div className="font-mono text-sm text-slate-200">
													<div>admin@demo.com</div>
													<div className="mt-1">demo123</div>
												</div>
												<button type="button" onClick={() => { setEmail('admin@demo.com'); setPassword('demo123'); }} className="text-xs font-medium text-blue-400 transition hover:text-blue-300">Auto-fill</button>
											</div>
										</div>
									</div>
								</div>
							</div>

						</div>

						<div className="mt-3 text-center">
							<a href="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-slate-200 sm:text-sm">← Back to landing page</a>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
	return (
		<div className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:bg-white/10">
			<div className="flex items-start gap-4">
				<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
					{icon}
				</div>
				<div className="flex-1">
					<h3 className="font-semibold text-white">{title}</h3>
					<p className="mt-2 text-sm leading-relaxed text-slate-300">{description}</p>
				</div>
			</div>
		</div>
	);
}