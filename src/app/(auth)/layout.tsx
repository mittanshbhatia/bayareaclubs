import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f8fb] px-5 py-9 sm:py-14">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.11),transparent_68%)]"
      />
      <div className="relative mx-auto w-full max-w-[36rem]">
        <Link
          href="/"
          className="font-display mx-auto mb-8 flex w-fit items-center gap-3 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl"
        >
          <span className="relative grid size-10 place-items-center rounded-xl bg-sky-700 text-white shadow-[0_8px_20px_rgb(3_105_161/0.20)]">
            <Sparkles aria-hidden="true" className="size-5" />
          </span>
          BayAreaClubs
        </Link>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgb(15_23_42/0.09)] sm:p-9">
          {children}
        </section>
        <p className="mt-6 flex items-start justify-center gap-2 text-center text-xs leading-5 text-slate-600">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-teal-700"
          />
          BayAreaClubs provides compliance-supporting controls. Institutional
          and legal review remains required.
        </p>
      </div>
    </main>
  );
}
