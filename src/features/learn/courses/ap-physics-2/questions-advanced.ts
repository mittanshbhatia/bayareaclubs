/**
 * Advanced original AP Physics 2 items. source_basis: ORIGINAL.
 */
import { originalItem } from "@/features/learn/courses/q";

export const questions = [
  originalItem({
    slug: "ideal-gas-p-over-t",
    lessonSlug: "kinetic-theory-and-ideal-gas",
    prompt:
      "A sealed syringe holds n moles. T doubles at constant volume. Pressure:",
    choices: ["Halves", "Stays the same", "Doubles", "Quadruples"],
    answer: "c",
    explanation:
      "PV=nRT. V and n fixed, P ∝ T. Doubling Kelvin temperature doubles P. Celsius doubling would be the common trap.",
    codes: ["1.2.A"],
  }),
  originalItem({
    slug: "capacitor-energy-after-disconnect",
    lessonSlug: "potential-energy-potential-and-capacitors",
    prompt:
      "A capacitor is charged and disconnected. A dielectric is then inserted. Energy stored:",
    choices: [
      "Rises because C rises.",
      "Falls because U=Q^2/(2C) and Q is fixed while C rises.",
      "Stays the same because Q is fixed.",
      "Becomes zero.",
    ],
    answer: "b",
    explanation:
      "Disconnected means Q is fixed. Inserting a dielectric raises C, so Q^2/(2C) falls. The field does work pulling the dielectric in.",
    codes: ["2.5.A"],
  }),
  originalItem({
    slug: "kirchhoff-loop-sign",
    lessonSlug: "kirchhoff-and-rc-circuits",
    prompt:
      "A loop has a 12 V battery and two resistors. Traversing from the negative to the positive terminal of the battery, the battery contribution to the loop sum is:",
    choices: ["-12 V", "+12 V", "0", "12 A"],
    answer: "b",
    explanation:
      "Walking from − to + through the battery is a rise of +ε. The resistor drops are −IR in the direction of current. The loop sum is still zero.",
    codes: ["3.3.A"],
  }),
  originalItem({
    slug: "lenz-opposes-change",
    lessonSlug: "induction-and-faraday",
    prompt:
      "Flux through a loop into the page is decreasing. The induced current's field is:",
    choices: [
      "Out of the page, because the existing field is into the page.",
      "Into the page, to oppose the decrease of into-the-page flux.",
      "Zero because flux is still nonzero.",
      "Parallel to the wire only.",
    ],
    answer: "b",
    explanation:
      "Lenz opposes the change. Into-the-page flux is decreasing, so the induced field is into the page to try to maintain that flux.",
    codes: ["4.6.A"],
  }),
  originalItem({
    slug: "snell-toward-normal",
    lessonSlug: "refraction-and-lens-images",
    prompt:
      "Light goes from air into water (n=1.33). The ray in water is:",
    choices: [
      "Bent away from the normal.",
      "Bent toward the normal.",
      "Reflected with angle of incidence doubled.",
      "Stopped; water is opaque to visible light.",
    ],
    answer: "b",
    explanation:
      "n sinθ is constant. Larger n means smaller θ from the normal. Air to water bends toward the normal.",
    codes: ["5.3.A"],
  }),
  originalItem({
    slug: "photoelectric-below-threshold",
    lessonSlug: "photons-photoelectric-and-spectra",
    prompt:
      "Light below the threshold frequency hits a clean metal. Intensity is then doubled. What happens?",
    choices: [
      "Electrons appear with twice the KE.",
      "Still no photoelectrons; extra intensity does not beat the frequency threshold.",
      "The work function halves.",
      "The stopping voltage doubles.",
    ],
    answer: "b",
    explanation:
      "Each photon's energy is hf. Below threshold, no electron is freed. Intensity changes the number of photons, not hf.",
    codes: ["7.2.A"],
  }),
] as const;
