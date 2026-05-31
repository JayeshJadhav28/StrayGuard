'use client';

import { useMemo, useState } from 'react';
import {
	FileText,
	Download,
	CalendarRange,
	MapPinned,
	ShieldAlert,
	Activity,
	Clock,
	ChevronRight,
	FileSpreadsheet,
	FileBarChart2,
	TrendingUp,
	AlertCircle,
	CheckCircle2,
	Loader2,
} from 'lucide-react';
import {
	ResponsiveContainer,
	BarChart,
	Bar,
	CartesianGrid,
	Tooltip,
	XAxis,
	YAxis,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
} from 'recharts';

const REPORT_TYPES = [
	{
		id: 'zone-risk',
		title: 'Zone Risk Report',
		description: 'Comprehensive analysis of active danger zones, severity distribution, and recommended speeds.',
		icon: ShieldAlert,
		color: 'from-rose-500 to-red-500',
		estimatedTime: '~2 min',
	},
	{
		id: 'animal-activity',
		title: 'Animal Activity Report',
		description: 'Detailed breakdown of dominant species, temporal patterns, and detection hotspots.',
		icon: Activity,
		color: 'from-amber-500 to-orange-500',
		estimatedTime: '~3 min',
	},
	{
		id: 'corridor-summary',
		title: 'Corridor Summary',
		description: 'Executive overview for highway administrators including KPIs, trends, and recommendations.',
		icon: MapPinned,
		color: 'from-blue-500 to-cyan-500',
		estimatedTime: '~4 min',
	},
	{
		id: 'detection-trends',
		title: 'Detection Trends',
		description: 'Time-series analysis of detection patterns, peak hours, and week-over-week comparisons.',
		icon: TrendingUp,
		color: 'from-purple-500 to-pink-500',
		estimatedTime: '~2 min',
	},
];

const MOCK_PREVIEW_DATA = {
	riskDistribution: [
		{ name: 'Low', value: 6, color: '#10b981' },
		{ name: 'Medium', value: 11, color: '#f59e0b' },
		{ name: 'High', value: 7, color: '#f97316' },
		{ name: 'Critical', value: 3, color: '#e11d48' },
	],
	detectionTrend: [
		{ day: 'Mon', detections: 24 },
		{ day: 'Tue', detections: 31 },
		{ day: 'Wed', detections: 28 },
		{ day: 'Thu', detections: 35 },
		{ day: 'Fri', detections: 29 },
		{ day: 'Sat', detections: 22 },
		{ day: 'Sun', detections: 19 },
	],
};

const RECENT_REPORTS = [
	{
		id: 'RPT-2024-001',
		title: 'NH48 Zone Risk Analysis',
		type: 'Zone Risk Report',
		date: '2024-05-24',
		time: '14:32',
		format: 'PDF',
		size: '2.4 MB',
		status: 'completed',
	},
	{
		id: 'RPT-2024-002',
		title: 'Weekly Cattle Activity Summary',
		type: 'Animal Activity Report',
		date: '2024-05-23',
		time: '09:15',
		format: 'CSV',
		size: '856 KB',
		status: 'completed',
	},
	{
		id: 'RPT-2024-003',
		title: 'Mumbai-Pune Corridor Monthly Overview',
		type: 'Corridor Summary',
		date: '2024-05-22',
		time: '16:45',
		format: 'PDF',
		size: '3.1 MB',
		status: 'generating',
	},
	{
		id: 'RPT-2024-004',
		title: 'Detection Patterns Q2 2024',
		type: 'Detection Trends',
		date: '2024-05-20',
		time: '11:20',
		format: 'CSV',
		size: '1.2 MB',
		status: 'completed',
	},
];

export default function ReportsPage() {
	const [selectedReport, setSelectedReport] = useState('zone-risk');
	const [dateRange, setDateRange] = useState('last-30-days');
	const [corridor, setCorridor] = useState('nh48');
	const [riskLevel, setRiskLevel] = useState('all');
	const [animalType, setAnimalType] = useState('all');
	const [isGenerating, setIsGenerating] = useState(false);

	const selectedReportMeta = useMemo(
		() => REPORT_TYPES.find((report) => report.id === selectedReport),
		[selectedReport]
	);

	const handleGenerateReport = () => {
		setIsGenerating(true);
		setTimeout(() => {
			setIsGenerating(false);
		}, 2000);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/30">
			<div className="space-y-6">
				<header className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div className="space-y-3">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg">
									<FileText className="h-6 w-6 text-white" />
								</div>
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-600">Data Intelligence & Insights</p>
									<h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">Reports & Exports</h1>
								</div>
							</div>

							<p className="max-w-3xl text-sm text-slate-600 md:text-base">
								Generate comprehensive road safety reports, zone analytics, and animal activity summaries for stakeholders, government agencies, and research partners.
							</p>

							<div className="flex flex-wrap items-center gap-3">
								<div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
									<Clock className="h-3.5 w-3.5" />
									Last updated: Just now
								</div>

								<div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
									<CheckCircle2 className="h-3.5 w-3.5" />
									4 reports generated this week
								</div>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-3">
							<button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow">
								<FileSpreadsheet className="h-4 w-4" />
								<span className="hidden sm:inline">Quick CSV</span>
							</button>

							<button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40">
								<Download className="h-4 w-4" />
								<span className="hidden sm:inline">Export Template</span>
							</button>
						</div>
					</div>
				</header>

				<section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
					<div className="space-y-6 xl:col-span-2">
						<div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
							<div className="mb-5">
								<h2 className="text-lg font-semibold text-slate-900">1. Choose Report Type</h2>
								<p className="mt-1 text-sm text-slate-500">Select the type of analysis you want to generate</p>
							</div>

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								{REPORT_TYPES.map((report) => {
									const Icon = report.icon;
									const isActive = selectedReport === report.id;

									return (
										<button
											key={report.id}
											type="button"
											onClick={() => setSelectedReport(report.id)}
											className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all ${
												isActive ? 'border-blue-200 bg-blue-50 shadow-md' : 'border-slate-200 bg-white hover:bg-slate-50 hover:shadow-sm'
											}`}
										>
											{isActive ? <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${report.color} opacity-10 blur-2xl`} /> : null}
											<div className="relative space-y-3">
												<div className="flex items-start justify-between">
													<div className={`inline-flex rounded-xl bg-gradient-to-br ${report.color} p-2.5 text-white shadow-lg`}>
														<Icon className="h-5 w-5" />
													</div>
													{isActive ? <CheckCircle2 className="h-5 w-5 text-blue-600" /> : null}
												</div>

												<div>
													<h3 className="text-base font-semibold text-slate-900">{report.title}</h3>
													<p className="mt-1 line-clamp-2 text-sm text-slate-500">{report.description}</p>
												</div>

												<div className="flex items-center gap-2 text-xs text-slate-500">
													<Clock className="h-3.5 w-3.5" />
													{report.estimatedTime}
												</div>
											</div>
										</button>
									);
								})}
							</div>
						</div>

						<div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
							<div className="mb-5">
								<h2 className="text-lg font-semibold text-slate-900">2. Configure Parameters</h2>
								<p className="mt-1 text-sm text-slate-500">Apply filters to customize the report scope</p>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
								<FilterField label="Date Range" icon={<CalendarRange className="h-4 w-4" />}>
									<select value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20">
										<option value="last-7-days">Last 7 days</option>
										<option value="last-30-days">Last 30 days</option>
										<option value="last-90-days">Last 90 days</option>
										<option value="custom">Custom range</option>
									</select>
								</FilterField>

								<FilterField label="Corridor" icon={<MapPinned className="h-4 w-4" />}>
									<select value={corridor} onChange={(event) => setCorridor(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20">
										<option value="all">All corridors</option>
										<option value="nh48">NH48 (Mumbai-Pune)</option>
										<option value="jaipur-agra">NH21 (Jaipur-Agra)</option>
										<option value="jaipur-rewari">NH48 (Jaipur-Rewari)</option>
									</select>
								</FilterField>

								<FilterField label="Risk Level" icon={<ShieldAlert className="h-4 w-4" />}>
									<select value={riskLevel} onChange={(event) => setRiskLevel(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20">
										<option value="all">All levels</option>
										<option value="low">Low</option>
										<option value="medium">Medium</option>
										<option value="high">High</option>
										<option value="critical">Critical</option>
									</select>
								</FilterField>

								<FilterField label="Animal Type" icon={<Activity className="h-4 w-4" />}>
									<select value={animalType} onChange={(event) => setAnimalType(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20">
										<option value="all">All animals</option>
										<option value="cattle">Cattle</option>
										<option value="dog">Dog</option>
										<option value="goat">Goat</option>
										<option value="buffalo">Buffalo</option>
									</select>
								</FilterField>
							</div>

							<div className="mt-6 flex flex-wrap gap-3">
								<button
									onClick={handleGenerateReport}
									disabled={isGenerating}
									className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{isGenerating ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin" />
											Generating...
										</>
									) : (
										<>
											<FileBarChart2 className="h-4 w-4" />
											Generate Preview
										</>
									)}
								</button>

								<button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow">
									<Download className="h-4 w-4" />
									Export Current
								</button>

								<button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow">
									Save Template
								</button>
							</div>
						</div>
					</div>

					<div className="space-y-6">
						<div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
							<h2 className="text-lg font-semibold text-slate-900">Configuration</h2>
							<p className="mt-1 text-sm text-slate-500">Current report settings</p>

							<div className="mt-6 space-y-3">
								<ConfigCard label="Report Type" value={selectedReportMeta?.title || '—'} icon={selectedReportMeta?.icon} />
								<ConfigCard label="Date Range" value={dateRange.replace(/-/g, ' ')} />
								<ConfigCard label="Corridor" value={corridor.toUpperCase()} />
								<ConfigCard label="Risk Filter" value={riskLevel.toUpperCase()} />
								<ConfigCard label="Animal Type" value={animalType.toUpperCase()} />
							</div>

							<div className="mt-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
								<div className="flex items-start gap-3">
									<AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
									<div>
										<p className="text-sm font-medium text-blue-900">Suggested Use</p>
										<p className="mt-1 text-sm text-blue-700">
											Ideal for weekly stakeholder reviews, highway authority briefings, and NGO field planning sessions.
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
							<h3 className="text-base font-semibold text-slate-900">Export Options</h3>
							<div className="mt-4 space-y-2">
								<ExportOption icon={FileText} label="PDF Report" size="~2-4 MB" />
								<ExportOption icon={FileSpreadsheet} label="CSV Data" size="~500 KB" />
								<ExportOption icon={FileBarChart2} label="Excel Workbook" size="~1-2 MB" />
							</div>
						</div>
					</div>
				</section>

				<section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
					<div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm xl:col-span-2">
						<div className="mb-5 flex items-start justify-between">
							<div>
								<h2 className="text-lg font-semibold text-slate-900">Data Preview</h2>
								<p className="mt-1 text-sm text-slate-500">Visual summary of report metrics</p>
							</div>
						</div>

						<div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
							<PreviewStat label="Zones" value="27" />
							<PreviewStat label="Critical" value="3" trend="+1" />
							<PreviewStat label="Detections" value="184" trend="+12%" />
							<PreviewStat label="Avg Speed" value="42 km/h" />
						</div>

						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							<div>
								<h3 className="mb-3 text-sm font-semibold text-slate-700">Risk Distribution</h3>
								<div className="h-64">
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie data={MOCK_PREVIEW_DATA.riskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
												{MOCK_PREVIEW_DATA.riskDistribution.map((entry) => (
													<Cell key={entry.name} fill={entry.color} />
												))}
											</Pie>
											<Tooltip />
										</PieChart>
									</ResponsiveContainer>
								</div>
							</div>

							<div>
								<h3 className="mb-3 text-sm font-semibold text-slate-700">Weekly Trend</h3>
								<div className="h-64">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={MOCK_PREVIEW_DATA.detectionTrend}>
											<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
											<XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
											<YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
											<Tooltip />
											<Line type="monotone" dataKey="detections" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb', r: 4 }} />
										</LineChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>
					</div>

					<div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
						<h2 className="text-lg font-semibold text-slate-900">Recent Reports</h2>
						<p className="mt-1 text-sm text-slate-500">Previously generated exports</p>

						<div className="mt-5 space-y-3">
							{RECENT_REPORTS.map((report) => <ReportHistoryCard key={report.id} report={report} />)}
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

function FilterField({
	label,
	icon,
	children,
}: {
	label: string;
	icon: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-2">
			<label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
				<span className="text-slate-500">{icon}</span>
				{label}
			</label>
			{children}
		</div>
	);
}

function ConfigCard({
	label,
	value,
	icon,
}: {
	label: string;
	value: string;
	icon?: any;
}) {
	const Icon = icon as React.ComponentType<{ className?: string }> | undefined;

	return (
		<div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
			<div className="flex items-center justify-between">
				<p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
				{Icon ? <Icon className="h-4 w-4 text-slate-400" /> : null}
			</div>
			<p className="mt-1 text-sm font-semibold capitalize text-slate-900">{value}</p>
		</div>
	);
}

function ExportOption({ icon: Icon, label, size }: { icon: any; label: string; size: string }) {
	return (
		<button type="button" className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-left transition hover:bg-slate-50">
			<div className="flex items-center gap-3">
				<Icon className="h-4 w-4 text-slate-500" />
				<span className="text-sm font-medium text-slate-700">{label}</span>
			</div>
			<span className="text-xs text-slate-500">{size}</span>
		</button>
	);
}

function PreviewStat({ label, value, trend }: { label: string; value: string; trend?: string }) {
	return (
		<div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
			<p className="text-sm text-slate-500">{label}</p>
			<p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
			{trend ? <p className="mt-1 text-xs font-medium text-emerald-600">↑ {trend}</p> : null}
		</div>
	);
}

function ReportHistoryCard({ report }: { report: any }) {
	return (
		<div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm">
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0 flex-1">
					<h3 className="truncate text-sm font-semibold text-slate-900">{report.title}</h3>
					<p className="mt-1 text-xs text-slate-500">{report.type}</p>
				</div>
				<span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${report.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
					{report.status === 'completed' ? 'Ready' : 'Processing'}
				</span>
			</div>

			<div className="mt-4 flex items-center justify-between text-xs text-slate-500">
				<span>{new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
				<span>{report.format} · {report.size}</span>
			</div>

			<button type="button" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-700 transition group-hover:gap-2">
				Download report
				<ChevronRight className="h-4 w-4" />
			</button>
		</div>
	);
}