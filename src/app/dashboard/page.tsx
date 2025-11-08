import DashboardStats from "@/features/dashboard/components/dashboard-stats";
import { PageLayout } from "@/shared/components/layout";

export default function Dashboard() {
  return (
    <PageLayout title="Dashboard">
      <DashboardStats />
    </PageLayout>
  );
}
