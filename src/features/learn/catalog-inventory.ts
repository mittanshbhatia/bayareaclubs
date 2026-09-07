import { manifest as bio } from "@/features/learn/courses/ap-bio/manifest";
import { manifest as calcAb } from "@/features/learn/courses/ap-calc-ab/manifest";
import { manifest as calcBc } from "@/features/learn/courses/ap-calc-bc/manifest";
import { manifest as chem } from "@/features/learn/courses/ap-chem/manifest";
import { manifest as csa } from "@/features/learn/courses/ap-csa/manifest";
import { manifest as csp } from "@/features/learn/courses/ap-csp/manifest";
import { manifest as envsci } from "@/features/learn/courses/ap-envsci/manifest";
import { manifest as physics1 } from "@/features/learn/courses/ap-physics-1/manifest";
import { manifest as physics2 } from "@/features/learn/courses/ap-physics-2/manifest";
import { manifest as precalc } from "@/features/learn/courses/ap-precalc/manifest";
import { manifest as psych } from "@/features/learn/courses/ap-psych/manifest";
import { manifest as stats } from "@/features/learn/courses/ap-stats/manifest";

type InventoryManifest = {
  units: ReadonlyArray<{ lessons: readonly unknown[] }>;
};

const MANIFESTS: Record<string, InventoryManifest> = {
  "ap-csp": csp,
  "ap-csa": csa,
  "ap-calc-ab": calcAb,
  "ap-calc-bc": calcBc,
  "ap-stats": stats,
  "ap-precalc": precalc,
  "ap-physics-1": physics1,
  "ap-physics-2": physics2,
  "ap-chem": chem,
  "ap-bio": bio,
  "ap-envsci": envsci,
  "ap-psych": psych,
};

export type CatalogInventory = {
  unitCount: number;
  moduleCount: number;
};

export function catalogInventory(namespace: string): CatalogInventory {
  const manifest = MANIFESTS[namespace];
  if (!manifest) {
    return { unitCount: 0, moduleCount: 0 };
  }
  return {
    unitCount: manifest.units.length,
    moduleCount: manifest.units.reduce(
      (sum, unit) => sum + unit.lessons.length,
      0,
    ),
  };
}

export function catalogCardProgressPercent(input: {
  attemptCount: number;
  moduleCount: number;
}): number {
  if (input.attemptCount <= 0 || input.moduleCount <= 0) return 0;
  return Math.min(100, Math.round((input.attemptCount / input.moduleCount) * 100));
}
