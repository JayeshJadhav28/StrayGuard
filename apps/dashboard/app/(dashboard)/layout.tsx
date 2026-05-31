import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const user = {
    email: session.user?.email ?? 'admin@demo.com',
    role: (session.user as { role?: string } | undefined)?.role ?? 'admin',
  };

  return (
    <DashboardShell userEmail={user.email} userRole={user.role}>
      {children}
    </DashboardShell>
  );
}
