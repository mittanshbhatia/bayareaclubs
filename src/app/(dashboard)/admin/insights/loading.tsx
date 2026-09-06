import { LoadingSkeleton } from "@/components/ds/loading-skeleton";

export default function AdminInsightsLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-4 px-5 py-8 sm:px-8">
      <LoadingSkeleton variant="metric" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <LoadingSkeleton variant="metric" />
        <LoadingSkeleton variant="metric" />
        <LoadingSkeleton variant="metric" />
      </div>
      <LoadingSkeleton variant="card" />
    </div>
  );
}
