import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="bg-background min-h-screen px-5 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-semibold tracking-tight"
        >
          <ShieldCheck aria-hidden="true" className="text-primary size-5" />
          BayAreaClubs
        </Link>
        <section className="bg-surface rounded-lg border p-6 shadow-sm sm:p-8">
          {children}
        </section>
        <p className="text-muted-foreground mt-6 text-sm leading-6">
          BayAreaClubs provides compliance-supporting controls. Institutional
          and legal review remains required.
        </p>
      </div>
    </main>
  );
}
