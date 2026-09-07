"use client";

import { useId, useState } from "react";
import { Menu } from "lucide-react";

import { ModuleNavList } from "@/components/dashboard/module-nav";
import { modulesForSurface } from "@/components/dashboard/nav-modules";
import type { ResolvedDashboardModule } from "@/components/dashboard/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export function DashboardMobileNav({
  modules,
  pathname,
}: {
  modules: readonly ResolvedDashboardModule[];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const visible = modulesForSurface(modules, "mobile");

  return (
    <div data-slot="dashboard-mobile-nav" className="md:hidden">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-expanded={open}
        aria-controls="dashboard-mobile-modules"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        aria-label="Open dashboard modules"
      >
        <Menu aria-hidden className="size-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          id="dashboard-mobile-modules"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className="top-0 left-0 h-[100dvh] max-h-[100dvh] w-[min(20rem,100%)] max-w-none translate-x-0 translate-y-0 gap-0 overflow-y-auto rounded-none border-y-0 border-l-0 p-0 motion-reduce:transition-none sm:rounded-none"
        >
          <DialogTitle id={titleId} className="sr-only">
            Dashboard modules
          </DialogTitle>
          <DialogDescription id={descriptionId} className="sr-only">
            Mandatory and overflow modules for the current workspace. Use the
            tab key to move through links.
          </DialogDescription>
          <nav aria-label="Dashboard modules" className="px-3 py-8">
            <ModuleNavList
              modules={visible}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          </nav>
        </DialogContent>
      </Dialog>
    </div>
  );
}
