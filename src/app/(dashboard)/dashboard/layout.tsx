export default function DashboardSegmentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="px-5 py-6 sm:px-8">{children}</div>
  );
}
