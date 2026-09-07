/**
 * Original waves and physical-optics lessons. Public CED codes only. source_basis: ORIGINAL.
 */

import {
  AP_PHYSICS_2_NAMESPACE,
  AP_PHYSICS_2_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-2/manifest";
import type { ApPhysics2Lesson } from "@/features/learn/courses/ap-physics-2/units/types";

export const wavesSoundPhysicalOpticsLessons: readonly ApPhysics2Lesson[] = [
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    unitSlug: "waves-sound-physical-optics",
    slug: "wave-properties-sound-and-doppler",
    title: "Wave properties, sound, and Doppler shifts",
    position: 11,
    estimatedMinutes: 25,
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    objectiveCodes: ["14.1.A", "14.2.A", "14.3.A", "14.4.A", "14.5.A"],
    bodyPlain: [
      "A wave carries energy through a repeating disturbance. The Palo Alto orchestra's sound is a pressure wave in air. A jump-rope on the quad is a transverse wave on a string. In both cases the medium wobbles; the wave is the pattern that travels. Wavelength is the crest-to-crest distance. Frequency is how many cycles pass a point each second. Their product is wave speed: v = f λ. Changing frequency on a fixed string does not change v if tension and mass density stay put; it changes λ instead.",
      "Wave speed depends on the medium. Sound is faster in warm air than in cold air and much faster in metal than in air. Light in vacuum is an electromagnetic wave that needs no air at all. Polarization is a transverse-only story: the oscillation can be confined to one plane. A polarizing filter on a camera cuts glare off the bay because reflected light is partly polarized. A longitudinal sound wave has no such plane to filter.",
      "At a boundary a wave can reflect, transmit, or do both. A pulse on a rope fixed at a wall inverts on reflection. A pulse at a free end reflects upright. Part of the energy can enter a second rope with a different mass density, which changes speed and wavelength while the frequency stays the same. That last point is easy to miss: the hand that shakes the rope, or the driver that shakes the air, sets f. The new medium sets v, and λ follows.",
      "The Doppler effect is a change in observed frequency when source and observer approach or recede. An ambulance on El Camino coming toward you sounds higher than the same siren after it passes. Greater relative speed along the line of sight means a larger shift. If both move the same way at the same speed, the observed frequency matches the rest frequency. Club timing gates that use sound pulses must decide whether the source, the reflector, or both are moving, or the calculated range will drift.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    unitSlug: "waves-sound-physical-optics",
    slug: "interference-diffraction-and-thin-films",
    title: "Interference, diffraction, and thin films",
    position: 12,
    estimatedMinutes: 25,
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    objectiveCodes: ["14.6.A", "14.7.A", "14.8.A", "14.9.A"],
    bodyPlain: [
      "When two waves overlap, the displacements add. Crest on crest is constructive interference. Crest on trough is destructive. Two speakers in a gym playing the same tone make loud and quiet spots you can walk through. The condition is a path-length difference of a whole number of wavelengths for a maximum, or an odd number of half-wavelengths for a minimum, once the sources are in phase. If one source is inverted, those conditions swap.",
      "Standing waves are interference that stays put. A string fixed at both ends supports harmonics with nodes at the ends. The fundamental has length L = λ/2. The next has L = λ, then 3λ/2, and so on. An open air column has antinodes at both ends; a closed column has a node at the closed end and an antinode at the open end, so only odd harmonics appear. The jazz-band clarinet is closer to the closed-pipe story. A flute is closer to the open-pipe story. Tune by changing length or by changing the air temperature that sets v.",
      "Diffraction is the spreading of a wave past an edge or through a slit. A narrow doorway lets hallway sound fill a classroom more than a narrow light beam would fill it, because sound wavelengths are closer to the door width. Light still diffracts, which you can see as fringes when a laser hits a hair or a single slit. A double slit produces a regular bright-dark pattern on a far screen. The bright-fringe locations satisfy d sinθ = m λ. A diffraction grating is many slits: the peaks get sharper and the angle formula keeps the same skeleton.",
      "Thin-film colors on a soap bubble or an oil sheen on a wet parking lot are interference plus a possible phase flip. A reflection from a higher-n boundary inverts the wave; a reflection from a lower-n boundary does not. The extra optical path is about 2 n t for a film of thickness t. Constructive or destructive conditions therefore depend on both the thickness and which reflections invert. White light shows color because each wavelength meets the condition at a different t. The club demo works with a soap film on a slide in a dark room and a single lamp. Name the inversions before you write 2 n t = m λ.",
    ].join("\n\n"),
  },
];
