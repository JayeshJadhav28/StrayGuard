'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
	ArrowRightOnRectangleIcon,
	BellIcon,
	ChartBarIcon,
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	Cog6ToothIcon,
	DocumentChartBarIcon,
	HomeIcon,
	MapIcon,
	XMarkIcon,
	ShieldCheckIcon,
	UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
	ChartBarIcon as ChartBarIconSolid,
	Cog6ToothIcon as Cog6ToothIconSolid,
	DocumentChartBarIcon as DocumentChartBarIconSolid,
	HomeIcon as HomeIconSolid,
	MapIcon as MapIconSolid,
	ShieldCheckIcon as ShieldCheckIconSolid,
} from '@heroicons/react/24/solid';

interface NavigationItem {
	name: string;
	href: string;
	icon: typeof HomeIcon;
	iconSolid: typeof HomeIconSolid;
	badge?: string;
	adminOnly?: boolean;
}

const navigation: NavigationItem[] = [
	{ name: 'Overview', href: '/dashboard', icon: HomeIcon, iconSolid: HomeIconSolid },
	{ name: 'Map View', href: '/map', icon: MapIcon, iconSolid: MapIconSolid },
	{ name: 'Danger Zones', href: '/zones', icon: ShieldCheckIcon, iconSolid: ShieldCheckIconSolid, badge: '8' },
	{ name: 'Analytics', href: '/analytics', icon: ChartBarIcon, iconSolid: ChartBarIconSolid },
	{ name: 'Reports', href: '/reports', icon: DocumentChartBarIcon, iconSolid: DocumentChartBarIconSolid },
	{ name: 'Admin Panel', href: '/admin', icon: Cog6ToothIcon, iconSolid: Cog6ToothIconSolid, adminOnly: true },
];

interface SidebarProps {
	userEmail?: string;
	userRole?: string;
	mobileOpen?: boolean;
	onMobileClose?: () => void;
}

export function Sidebar({
	userEmail = 'admin@demo.com',
	userRole = 'admin',
	mobileOpen = false,
	onMobileClose,
}: SidebarProps) {
	const pathname = usePathname();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const visibleNavigation = navigation.filter((item) => !item.adminOnly || userRole === 'admin');

	const renderNavigation = (collapsed: boolean, closeOnSelect = false) => (
		<>
			<nav className="flex-1 overflow-y-auto px-3 py-4">
				<ul className="space-y-1">
					{visibleNavigation.map((item) => {
						const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
						const Icon = isActive ? item.iconSolid : item.icon;

						return (
							<li key={item.name}>
								<Link
									href={item.href}
									onClick={closeOnSelect ? onMobileClose : undefined}
									className={`group relative flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200 ${
										isActive
											? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/20'
											: 'text-slate-400 hover:bg-white/5 hover:text-white'
									} ${collapsed ? 'justify-center' : ''}`}
								>
									<div className="relative">
										<Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
										{item.badge && collapsed ? (
											<span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
												{item.badge}
											</span>
										) : null}
									</div>

									{!collapsed ? (
										<div className="flex flex-1 items-center justify-between">
											<span className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>{item.name}</span>
											{item.badge ? (
												<span className={`rounded-full px-2 py-0.5 text-xs font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-300'}`}>
													{item.badge}
												</span>
											) : null}
										</div>
									) : null}

									{collapsed ? (
										<div className="invisible absolute left-full z-50 ml-4 whitespace-nowrap rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
											{item.name}
											{item.badge ? <span className="ml-2 rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">{item.badge}</span> : null}
											<div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1 -translate-y-1/2 rotate-45 border-b border-l border-slate-700 bg-slate-900" />
										</div>
									) : null}
								</Link>
							</li>
						);
					})}
				</ul>

				{collapsed ? (
					<div className="mt-6 border-t border-slate-800 pt-6">
						<div className="flex flex-col items-center gap-1 px-2">
							<BellIcon className="h-5 w-5 text-slate-500" />
							<span className="text-xs text-slate-500">12</span>
						</div>
					</div>
				) : null}
			</nav>

			<div className="mt-auto border-t border-slate-800">
				<div className={`p-4 ${collapsed ? 'px-2' : ''}`}>
					{!collapsed ? (
						<div className="group flex cursor-pointer items-center gap-3 rounded-2xl bg-slate-800/50 p-3 transition hover:bg-slate-800">
							<div className="relative">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 font-semibold text-white">
									{userEmail.charAt(0).toUpperCase()}
								</div>
								<div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-slate-950 bg-green-500" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-medium text-white">{userEmail}</p>
								<p className="text-xs capitalize text-slate-400">{userRole}</p>
							</div>
							<UserCircleIcon className="h-5 w-5 text-slate-500 transition-colors group-hover:text-slate-300" />
						</div>
					) : (
						<div className="relative mx-auto w-fit">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 font-semibold text-white transition-transform hover:scale-110">
								{userEmail.charAt(0).toUpperCase()}
							</div>
							<div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-slate-950 bg-green-500" />
						</div>
					)}
				</div>

				<div className="p-4 pt-0">
					<button
						type="button"
						onClick={() => signOut({ callbackUrl: '/' })}
						className={`group relative flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-white ${collapsed ? 'justify-center' : ''}`}
					>
						<ArrowRightOnRectangleIcon className="h-5 w-5" />
						{!collapsed ? <span className="text-sm font-medium">Logout</span> : null}

						{collapsed ? (
							<div className="invisible absolute left-full z-50 ml-4 whitespace-nowrap rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
								Logout
								<div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1 -translate-y-1/2 rotate-45 border-b border-l border-slate-700 bg-slate-900" />
							</div>
						) : null}
					</button>
				</div>
			</div>
		</>
	);

	return (
		<>
			<motion.aside
				initial={false}
				animate={{ width: isCollapsed ? 88 : 288 }}
				transition={{ duration: 0.25, ease: 'easeInOut' }}
				className="sticky top-0 z-40 hidden h-screen min-h-0 flex-col overflow-y-auto border-r border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white shadow-2xl shadow-slate-950/50 md:flex md:flex-none"
			>
				<div className="border-b border-slate-800 px-5 py-5">
				<div className="flex items-center justify-between gap-3">
					<AnimatePresence mode="wait">
						{!isCollapsed ? (
							<motion.div
								key="expanded"
								initial={{ opacity: 0, x: -8 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -8 }}
								className="flex items-center gap-3"
							>
								<div className="relative h-12 w-12 overflow-hidden rounded-2xl ring-1 ring-white/10">
									<Image src="/logo.png" alt="StrayGuard" fill sizes="48px" className="object-contain" priority />
								</div>
								<div>
									<h2 className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-xl font-bold text-transparent">
										StrayGuard
									</h2>
									<p className="text-xs text-slate-400">Predict. Prevent. Protect.</p>
								</div>
							</motion.div>
						) : (
							<motion.div
								key="collapsed"
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								className="relative mx-auto h-12 w-12 overflow-hidden rounded-2xl ring-1 ring-white/10"
							>
								<Image src="/logo.png" alt="StrayGuard" fill sizes="48px" className="object-contain" priority />
							</motion.div>
						)}
					</AnimatePresence>

					<button
						type="button"
						onClick={() => setIsCollapsed((value) => !value)}
						className="hidden items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white md:inline-flex"
						aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
					>
						{isCollapsed ? <ChevronDoubleRightIcon className="h-5 w-5" /> : <ChevronDoubleLeftIcon className="h-5 w-5" />}
					</button>
				</div>
			</div>

			{renderNavigation(isCollapsed)}
			</motion.aside>

			<AnimatePresence>
				{mobileOpen ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm md:hidden"
						onClick={onMobileClose}
					>
						<motion.aside
							initial={{ x: '-100%' }}
							animate={{ x: 0 }}
							exit={{ x: '-100%' }}
							transition={{ duration: 0.25, ease: 'easeInOut' }}
							className="flex h-full w-[86vw] max-w-sm flex-col overflow-y-auto border-r border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white shadow-2xl shadow-slate-950/50"
							onClick={(event) => event.stopPropagation()}
						>
							<div className="border-b border-slate-800 px-5 py-5">
								<div className="flex items-center justify-between gap-3">
									<div className="flex items-center gap-3">
										<div className="relative h-12 w-12 overflow-hidden rounded-2xl ring-1 ring-white/10">
											<Image src="/logo.png" alt="StrayGuard" fill sizes="48px" className="object-contain" priority />
										</div>
										<div>
											<h2 className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-xl font-bold text-transparent">
												StrayGuard
											</h2>
											<p className="text-xs text-slate-400">Predict. Prevent. Protect.</p>
										</div>
									</div>
									<button
										type="button"
										onClick={onMobileClose}
										className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
										aria-label="Close menu"
									>
										<XMarkIcon className="h-5 w-5" />
									</button>
								</div>
							</div>

							{renderNavigation(false, true)}
						</motion.aside>
					</motion.div>
				) : null}
			</AnimatePresence>
		</>
	);
}
