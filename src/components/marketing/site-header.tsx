"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { PageContainer } from "@/components/ds/page-container";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#discover", label: "Discover" },
  { href: "#events", label: "Events" },
  { href: "#learn", label: "Learn" },
  { href: "#schools", label: "For Schools" },
  { href: "#trust", label: "Safety" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-[var(--z-sticky)] border-b text-white transition-[background-color,border-color,transform] duration-300",
        scrolled
          ? "border-white/10 bg-[#080b1a]/88 shadow-[0_12px_40px_rgb(0_0_0_/_22%)] backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <PageContainer
        size="xl"
        className="flex min-h-18 items-center justify-between gap-5"
      >
        <Link
          href="/"
          className="group font-display flex items-center gap-2.5 text-base font-semibold tracking-[-0.025em]"
        >
          <span className="flex size-8 items-center justify-center rounded-lg border border-white/14 bg-white/8 transition-colors group-hover:bg-white/14">
            <Sparkles aria-hidden className="size-4 text-[var(--home-cyan)]" />
          </span>
          BayAreaClubs
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-2 text-xs font-semibold text-white/58 transition-colors after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:origin-left after:scale-x-0 after:bg-[var(--home-cyan)] after:transition-transform hover:text-white hover:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden text-white hover:bg-white/9 sm:inline-flex"
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="group hidden bg-white text-[var(--home-ink)] hover:bg-white md:inline-flex"
          >
            <Link href="/start-a-club">
              Start a Club
              <ArrowUpRight
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </Button>

          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-white/18 bg-white/7 text-white shadow-none hover:bg-white/12 lg:hidden"
                aria-label="Open menu"
              >
                <Menu aria-hidden className="size-4" />
                <span className="hidden sm:inline">Menu</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="top-0 left-0 flex h-full max-h-none w-full max-w-none translate-x-0 translate-y-0 flex-col rounded-none border-0 bg-[#080b1a] p-6 text-white sm:max-w-none">
              <DialogHeader className="text-left">
                <DialogTitle className="font-display flex items-center gap-2.5 text-xl text-white">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-white/8">
                    <Sparkles
                      aria-hidden
                      className="size-4 text-[var(--home-cyan)]"
                    />
                  </span>
                  BayAreaClubs
                </DialogTitle>
              </DialogHeader>
              <nav
                aria-label="Mobile primary"
                className="mt-10 flex flex-col gap-1"
              >
                {navLinks.map((link, index) => (
                  <DialogClose asChild key={link.href}>
                    <a
                      href={link.href}
                      className="flex min-h-14 items-center justify-between border-b border-white/8 text-lg font-semibold"
                    >
                      <span>{link.label}</span>
                      <span className="font-mono text-[0.6rem] text-white/28">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </DialogClose>
                ))}
                <DialogClose asChild>
                  <Link
                    href="/sign-in"
                    className="mt-7 flex min-h-12 items-center justify-center rounded-lg border border-white/14 text-sm font-semibold"
                  >
                    Sign In
                  </Link>
                </DialogClose>
                <DialogClose asChild>
                  <Link
                    href="/start-a-club"
                    className="mt-3 flex min-h-12 items-center justify-center rounded-lg bg-white text-sm font-semibold text-[var(--home-ink)]"
                  >
                    Start a Club
                  </Link>
                </DialogClose>
              </nav>
            </DialogContent>
          </Dialog>
        </div>
      </PageContainer>
    </header>
  );
}
