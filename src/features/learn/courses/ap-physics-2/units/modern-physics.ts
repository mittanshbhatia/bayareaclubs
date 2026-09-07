/**
 * Original modern-physics lessons. Public CED codes only. source_basis: ORIGINAL.
 */

import {
  AP_PHYSICS_2_NAMESPACE,
  AP_PHYSICS_2_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-2/manifest";
import type { ApPhysics2Lesson } from "@/features/learn/courses/ap-physics-2/units/types";

export const modernPhysicsLessons: readonly ApPhysics2Lesson[] = [
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    unitSlug: "modern-physics",
    slug: "photons-photoelectric-and-spectra",
    title: "Photons, photoelectric effect, and spectra",
    position: 13,
    estimatedMinutes: 25,
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    objectiveCodes: ["15.1.A", "15.2.A", "15.3.A", "15.4.A", "15.5.A", "15.6.A"],
    bodyPlain: [
      "Light can be modeled as a stream of photons, each with energy E = h f. A blue photon carries more energy than a red photon because its frequency is higher. Intensity for a given color is about how many photons arrive per second, not about the energy of one photon. The astronomy club's photodiode does not see a dim blue LED as 'weaker photons.' It sees fewer of them, or a smaller collecting area, or a shorter exposure.",
      "The photoelectric effect is the cleanest classroom argument that those photons are not optional. Light on a metal can free electrons, but only if f is above a threshold set by the work function φ. Below that frequency, a brighter lamp does nothing. Above it, extra photon energy becomes electron kinetic energy: K_max = h f - φ. Raising intensity then increases the number of electrons, not K_max. A stopping voltage that just cancels K_max lets you measure that energy without chasing electrons across the room.",
      "Atoms emit and absorb only certain wavelengths because their electrons occupy discrete energy levels. A jump down from a higher level to a lower one emits a photon whose energy equals the gap. A jump up requires a photon that matches the gap, or some other energy input of the same size. The Bohr model for hydrogen makes those levels concrete and predicts the visible Balmer lines as drops into n = 2. Real atoms are messier, but the discrete-gap idea survives.",
      "Blackbody spectra connect this unit to heat. A hotter object radiates more and peaks at a shorter wavelength. Compton scattering is a different photon story: an X-ray that bounces off an electron loses energy and lengthens its wavelength, as if the collision conserved momentum and energy with a particle. Wave models still matter for interference. Particle models matter for absorption and scattering. The course asks you to pick the model that matches the measurement, not to pick a side forever.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    unitSlug: "modern-physics",
    slug: "nuclear-decay-fission-and-fusion",
    title: "Nuclear decay, fission, and fusion",
    position: 14,
    estimatedMinutes: 25,
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    objectiveCodes: ["15.7.A", "15.8.A"],
    bodyPlain: [
      "A nucleus is protons and neutrons bound together. The mass of a stable nucleus is less than the mass of the separate nucleons. That missing mass is the binding energy through E = m c^2. A more tightly bound nucleus sits lower in energy. Fission splits a heavy nucleus into middle-weight pieces that are more tightly bound per nucleon. Fusion joins light nuclei into a heavier one that is also more tightly bound per nucleon. Both can release energy if the products sit lower on the binding curve than the fuel.",
      "Radioactive decay is a nucleus rearranging toward stability. Alpha emission throws out a helium nucleus, dropping Z by 2 and A by 4. Beta-minus emission turns a neutron into a proton and an electron, raising Z by 1. Gamma emission dumps energy without changing Z or A. Each process has a characteristic half-life: the time for half the sample to decay. After two half-lives, one fourth remains. The decay is random for one nucleus and predictable for a large sample.",
      "Club cloud-chamber kits and school-safe sources, when a teacher is allowed to use them, make tracks you can classify by how they bend or how far they go. You do not need those kits to do the bookkeeping. Write the parent, the particle, and the daughter so charge and nucleon number balance. If they do not balance, the reaction is incomplete or impossible. A decay series is just that ledger repeated until a stable nucleus appears.",
      "Energy released in a nuclear change is the mass defect times c^2. Convert grams to kilograms before you multiply, or the result will be off by powers of ten. Fission fragments plus neutrons can trigger more fission if a moderator and geometry allow a chain. Fusion in stars fights electrostatic repulsion until the nuclei are close enough for the strong force to bind them. Neither story is a chemistry combustion with extra zeros. The energy scale is nuclear, the conservation rules are still charge, nucleon number, energy, and momentum, and the algebra stays the same as the rest of this course.",
    ].join("\n\n"),
  },
];
