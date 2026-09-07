import { LoadingSkeleton } from "@/components/ds/loading-skeleton";

export default function AdminDashboardConfigLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard configuration">
      <LoadingSkeleton />
      <LoadingSkeleton variant="list" />
      <LoadingSkeleton variant="card" />
    </div>
  );
}
