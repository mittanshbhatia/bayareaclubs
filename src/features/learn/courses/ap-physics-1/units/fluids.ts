import {
  AP_PHYSICS_1_NAMESPACE,
  AP_PHYSICS_1_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-1/manifest";
import type { ApPhysics1Lesson } from "@/features/learn/courses/ap-physics-1/lesson-types";

export const fluidsLessons: readonly ApPhysics1Lesson[] = [
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    unitSlug: "fluids",
    slug: "density-pressure-and-buoyancy",
    title: "Density, pressure, and buoyancy",
    position: 1,
    estimatedMinutes: 22,
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    objectiveCodes: ["8.1.A", "8.2.A", "8.3.A", "8.4.A"],
    bodyPlain: [
      "Density is mass per volume: ρ = m / V. Water's density is 1.00 × 10^3 kg/m^3. A 0.025 m^3 sample of fresh water has mass 25 kg. Specific gravity is the ratio of a material's density to the density of water, so a number like 0.80 means the material is 80 percent as dense as water. Club density labs should report both mass and a measured volume, not a guessed milliliter mark.",
      "Pressure is force per area: P = F / A, when the force is perpendicular to the surface. The SI unit is the pascal, N/m^2. A 400 N student standing on one 0.020 m^2 shoe sole exerts 2.0 × 10^4 Pa on the floor. The same student on a 0.20 m^2 board exerts ten times smaller pressure. Pressure in a static fluid increases with depth: P = P0 + ρ g h, where h is the vertical depth below the level where the pressure is P0. Horizontal position at the same depth does not change the pressure.",
      "Absolute pressure includes the atmosphere. Gauge pressure is the excess above atmosphere, which is what many tire gauges report. At a depth of 2.0 m in a pool, the gauge pressure is about (1000)(9.8)(2.0) = 1.96 × 10^4 Pa, and the absolute pressure is that value plus 1.01 × 10^5 Pa. A hole in the side of a tank feels a force equal to pressure times area, directed outward, perpendicular to the wall.",
      "Buoyant force is the net upward force from pressure being larger on the bottom of a submerged object than on the top. Its size is F_b = ρ_fluid V_displaced g, the weight of the displaced fluid. A 0.0020 m^3 block fully under water feels 19.6 N upward from buoyancy, regardless of the block's own mass. Whether the block sinks or floats is decided by comparing F_b to the object's weight.",
      "A floating object displaces a weight of fluid equal to its own weight, so only part of its volume is under the waterline if it is less dense than the fluid. A 0.80 kg rectangular boat model with bottom area 0.020 m^2 sits 0.040 m deep in fresh water, because (1000)(0.020)(0.040)(9.8) = 7.8 N, which matches the 7.8 N weight. Apparent weight of a hanging object lowered into a fluid is the true weight minus F_b. That is the reading a spring scale should show in a buoyancy lab.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    unitSlug: "fluids",
    slug: "continuity-and-bernoulli",
    title: "Continuity and Bernoulli",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    objectiveCodes: ["8.5.A", "8.6.A"],
    bodyPlain: [
      "An incompressible fluid cannot pile up inside a pipe. The volume flow rate A v is therefore the same at every cross section: A1 v1 = A2 v2. A garden hose with interior area 5.0 × 10^-4 m^2 that feeds a nozzle of area 1.0 × 10^-4 m^2 speeds the water by a factor of five. Narrower means faster. The mass flow rate ρ A v is likewise constant if density is constant.",
      "Bernoulli's relation for steady, inviscid, incompressible flow along a streamline is P + ρ g h + (1/2) ρ v^2 = constant. The three terms are pressure, gravitational potential energy per volume, and kinetic energy per volume. You use the algebra statement; you do not derive it from a calculus energy argument in this course. If height is unchanged, a rise in speed is paid for by a drop in pressure.",
      "A roof that lifts in a strong wind is the classroom story for that pressure drop: faster air over the top, lower pressure above than below. A perfume atomizer or a club Venturi tube is the same idea in a pipe. If the fluid also climbs, you keep the ρ g h term. Water leaving a tank through a small hole a depth h below the surface has exit speed about sqrt(2 g h) if the top surface is open to the atmosphere and nearly still. That is Bernoulli plus continuity with v_top ≈ 0.",
      "Static limits still hide inside the flowing equation. If v is zero everywhere, Bernoulli reduces to the hydrostatic result P + ρ g h = constant, which is the same information as P = P0 + ρ g h. If a problem is about a resting tank, do not invent a flow speed. If a problem is about a hose, do not ignore the speed term.",
      "Real water has viscosity and turbulence, so Bernoulli is a model, not a promise. For AP Physics 1 problems the model is the assigned tool. Name the two points you are comparing, list P, h, and v at each, cancel the terms that are equal, and solve. A sketch of the pipe or tank with those two dots labeled prevents most algebra mistakes.",
    ].join("\n\n"),
  },
];
