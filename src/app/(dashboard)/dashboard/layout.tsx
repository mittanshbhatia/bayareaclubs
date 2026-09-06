export default function DashboardSegmentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">{children}</div>
  );
}
