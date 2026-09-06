"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PageContainer } from "@/components/ds/page-container";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#lifecycle", label: "Lifecycle" },
  { href: "#operate", label: "Operate" },
  { href: "/resources", label: "Resources" },
  { href: "#events", label: "Events" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-sticky)] border-b transition-[background-color,border-color,box-shadow]",
        scrolled
          ? "border-border bg-surface/95 shadow-xs backdrop-blur-md"
          : "border-transparent bg-background/80 backdrop-blur-sm",
      )}
    >
      <PageContainer className="flex min-h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-foreground"
        >
          BayAreaClubs
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/start-a-club">Start a Club</Link>
          </Button>
          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu aria-hidden className="size-4" />
                Menu
              </Button>
            </DialogTrigger>
            <DialogContent className="left-0 top-0 flex h-full max-h-none w-full max-w-none translate-x-0 translate-y-0 flex-col rounded-none border-0 sm:max-w-none">
              <DialogHeader className="text-left">
                <DialogTitle className="font-display text-xl">
                  BayAreaClubs
                </DialogTitle>
              </DialogHeader>
              <nav aria-label="Mobile primary" className="mt-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <DialogClose asChild key={link.href}>
                    <a
                      href={link.href}
                      className="rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-surface-muted"
                    >
                      {link.label}
                    </a>
                  </DialogClose>
                ))}
                <DialogClose asChild>
                  <Link
                    href="/sign-in"
                    className="rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-surface-muted"
                  >
                    Sign in
                  </Link>
                </DialogClose>
                <DialogClose asChild>
                  <Link
                    href="/start-a-club"
                    className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
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
