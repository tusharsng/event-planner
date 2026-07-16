import DashboardContent from '@/components/dashboard-content';
import { auth } from '@/lib/auth/server';

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth.getSession();
  return (
    <DashboardContent userId={session.data?.user.id} />
  );
}