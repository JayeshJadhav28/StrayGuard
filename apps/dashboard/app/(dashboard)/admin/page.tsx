import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Activity, AlertTriangle, Clock, Settings2, ShieldCheck, Users } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { AuditLog } from '@/components/admin/AuditLog';
import { DzeControlPanel } from '@/components/admin/DzeControlPanel';
import { SpeedOverridePanel } from '@/components/admin/SpeedOverridePanel';
import { SystemHealthCard } from '@/components/admin/SystemHealthCard';
import { UserManagement } from '@/components/admin/UserManagement';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-rose-50/20">
      <div className="space-y-6">
        <header className="relative overflow-hidden rounded-2xl border border-rose-200/70 bg-gradient-to-br from-rose-50 to-orange-50 p-6 shadow-sm">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-rose-200/30 blur-3xl" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-orange-600 shadow-lg">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-rose-700">Restricted Access Area</p>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl lg:text-4xl">System Administration</h1>
                </div>
              </div>

              <p className="max-w-3xl text-sm text-slate-700 md:text-base">
                Manage the Danger Zone Engine, apply manual safety interventions, control user access, and monitor system health. All actions are logged and require admin authorization.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <SecurityBadge label="Admin Only" icon={<ShieldCheck className="h-3 w-3" />} tone="rose" />
                <SecurityBadge label="DZE Active" icon={<Activity className="h-3 w-3" />} tone="emerald" />
                <SecurityBadge label="3 Overrides Active" icon={<AlertTriangle className="h-3 w-3" />} tone="amber" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <div className="text-xs text-slate-500">Logged in as</div>
                <div className="mt-0.5 text-sm font-semibold text-slate-900">{session?.user?.email ?? 'admin@demo.com'}</div>
              </div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SystemHealthCard title="DZE Status" value="Operational" description="Last cycle completed successfully" icon={Settings2} tone="emerald" timestamp="2 hours ago" />
          <SystemHealthCard title="Next Scheduled Run" value="02:00 UTC" description="Daily automated processing" icon={Clock} tone="blue" timestamp="in 6 hours" />
          <SystemHealthCard title="Manual Overrides" value="3 Active" description="Requires periodic review" icon={AlertTriangle} tone="amber" timestamp="Last: 4 hours ago" />
          <SystemHealthCard title="System Users" value="14 Active" description="Admin, agency, NGO roles" icon={Users} tone="purple" timestamp="5 new this month" />
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-1 w-1 rounded-full bg-rose-500" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Critical Operations</h2>
              <p className="text-sm text-slate-500">High-impact controls requiring explicit authorization and confirmation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <DzeControlPanel />
            <SpeedOverridePanel />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-1 w-1 rounded-full bg-blue-500" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Access Control</h2>
              <p className="text-sm text-slate-500">Manage authenticated users and role-based permissions</p>
            </div>
          </div>

          <UserManagement />
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-1 w-1 rounded-full bg-purple-500" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
              <p className="text-sm text-slate-500">System audit log and administrative actions</p>
            </div>
          </div>

          <AuditLog />
        </section>
      </div>
    </div>
  );
}

function SecurityBadge({
  label,
  icon,
  tone,
}: {
  label: string;
  icon: React.ReactNode;
  tone: 'emerald' | 'amber' | 'rose';
}) {
  const styles = {
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    rose: 'border-rose-200 bg-rose-50 text-rose-700',
  };

  return (
    <div className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 ${styles[tone]}`}>
      {icon}
      <span className="text-xs font-semibold">{label}</span>
    </div>
  );
}
