import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen bg-background px-5 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-display font-semibold tracking-tight"
        >
          <ShieldCheck aria-hidden="true" className="size-5 text-primary" />
          BayAreaClubs
        </Link>
        <section className="rounded-lg border border-border bg-surface p-6 shadow-xs sm:p-8">
          {children}
        </section>
        <p className="mt-6 text-sm leading-6 text-muted-foreground">
          BayAreaClubs provides compliance-supporting controls. Institutional
          and legal review remains required.
        </p>
      </div>
    </main>
  );
}
