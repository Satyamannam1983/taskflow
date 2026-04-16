import AppLayout from '@/components/layout/AppLayout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentBoards from '@/components/dashboard/RecentBoards';

export default function HomePage() {
  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Overview */}
        <DashboardStats />
        
        {/* Recent Boards */}
        <RecentBoards />
      </div>
    </AppLayout>
  );
}
