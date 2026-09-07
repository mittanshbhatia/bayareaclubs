/**
 * Original BayAreaClubs multiple-choice items for AP Physics 2.
 * Written from scratch. Not derived from College Board, Unlimited Voices,
 * Stellar Learning, or any other question bank. source_basis: ORIGINAL.
 */

import {
  AP_PHYSICS_2_NAMESPACE,
  AP_PHYSICS_2_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-2/manifest";

export type ApPhysics2ChoiceId = "a" | "b" | "c" | "d";

export type ApPhysics2Choice = {
  id: ApPhysics2ChoiceId;
  text: string;
};

export type ApPhysics2Difficulty = "easy" | "medium" | "hard";

export type ApPhysics2Question = {
  namespace: typeof AP_PHYSICS_2_NAMESPACE;
  slug: string;
  lessonSlug: string;
  questionType: "multiple_choice";
  prompt: string;
  choices: readonly [ApPhysics2Choice, ApPhysics2Choice, ApPhysics2Choice, ApPhysics2Choice];
  answerId: ApPhysics2ChoiceId;
  explanation: string;
  objectiveCodes: readonly string[];
  difficulty: ApPhysics2Difficulty;
  sourceBasis: typeof AP_PHYSICS_2_SOURCE_BASIS;
  version: 1;
};

export const questions: readonly ApPhysics2Question[] = [
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "balloon-pressure-temperature",
    lessonSlug: "kinetic-theory-and-ideal-gas",
    questionType: "multiple_choice",
    prompt:
      "The Environmental Club warms a sealed helium tank on the quad. Volume and particle number stay fixed. Why does the pressure reading rise?",
    choices: [
      {
        id: "a",
        text: "Helium atoms grow larger and fill more of the tank.",
      },
      {
        id: "b",
        text: "Atoms move faster on average, so they hit the walls harder and more often.",
      },
      {
        id: "c",
        text: "Warm air outside pushes the gauge needle without changing the gas.",
      },
      {
        id: "d",
        text: "Atoms stick to the walls and weigh the tank down.",
      },
    ],
    answerId: "b",
    explanation:
      "Temperature tracks average kinetic energy. Faster atoms deliver larger impulses more often, so force per area rises at fixed volume.",
    objectiveCodes: ["9.1.A", "9.1.B"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "sealed-syringe-ideal-gas",
    lessonSlug: "kinetic-theory-and-ideal-gas",
    questionType: "multiple_choice",
    prompt:
      "A club syringe holds a trapped air sample. The plunger can slide, so pressure stays near atmospheric. Kelvin temperature is doubled and no air leaks. What happens to the volume?",
    choices: [
      { id: "a", text: "The volume is cut in half." },
      { id: "b", text: "The volume stays the same because pressure is fixed." },
      { id: "c", text: "The volume doubles." },
      { id: "d", text: "The volume quadruples because pressure and temperature both change." },
    ],
    answerId: "c",
    explanation:
      "PV = nRT with P and n fixed means V is proportional to T. Doubling kelvin temperature doubles volume.",
    objectiveCodes: ["9.2.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "first-law-compression-sign",
    lessonSlug: "first-law-entropy-and-heat-engines",
    questionType: "multiple_choice",
    prompt:
      "A bike-pump barrel is compressed quickly enough that almost no heat leaves during the stroke. What happens to the internal energy of the trapped air?",
    choices: [
      {
        id: "a",
        text: "It stays the same because heat and work cancel in every compression.",
      },
      {
        id: "b",
        text: "It decreases because the gas does work as it is squeezed.",
      },
      {
        id: "c",
        text: "It increases because work is done on the gas while heat transfer is nearly zero.",
      },
      {
        id: "d",
        text: "It decreases because compression always cools an ideal gas.",
      },
    ],
    answerId: "c",
    explanation:
      "The first law is ΔU = Q + W. Rapid compression does work on the gas and Q is nearly zero, so ΔU rises and the barrel feels warmer.",
    objectiveCodes: ["9.4.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "engine-efficiency-limit",
    lessonSlug: "first-law-entropy-and-heat-engines",
    questionType: "multiple_choice",
    prompt:
      "A proposed club demo engine would take 400 J from a hot plate, dump 0 J to the ice bath, and deliver 400 J of work each cycle. Why is the proposal impossible?",
    choices: [
      {
        id: "a",
        text: "Energy conservation already forbids converting any heat into work.",
      },
      {
        id: "b",
        text: "A complete cycle that produces work must dump some energy to a colder reservoir.",
      },
      {
        id: "c",
        text: "Ice baths cannot be used as reservoirs in thermodynamics.",
      },
      {
        id: "d",
        text: "The work output would have to be larger than the heat input.",
      },
    ],
    answerId: "b",
    explanation:
      "The first law would allow Q_in = W if Q_out were zero, but the second law requires a cold dump so the working substance can return to its start. 100 percent thermal efficiency is not available.",
    objectiveCodes: ["9.6.A"],
    difficulty: "hard",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "two-charge-force-direction",
    lessonSlug: "charge-force-and-electric-fields",
    questionType: "multiple_choice",
    prompt:
      "Two pith balls on the robotics bench each carry positive charge. Which statement describes the electric force between them?",
    choices: [
      { id: "a", text: "They attract along the line that joins them." },
      { id: "b", text: "They repel along the line that joins them." },
      { id: "c", text: "The forces are equal and both point toward the floor." },
      { id: "d", text: "There is no force unless a third charge is present." },
    ],
    answerId: "b",
    explanation:
      "Like charges repel. Coulomb's law gives a force along the joining line, equal in magnitude and opposite in direction on the two balls.",
    objectiveCodes: ["10.1.A"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "field-between-parallel-plates",
    lessonSlug: "charge-force-and-electric-fields",
    questionType: "multiple_choice",
    prompt:
      "A club capacitor is two large plates: the left plate is positive and the right plate is negative. What is the electric field in the central gap, ignoring fringing?",
    choices: [
      { id: "a", text: "Nearly uniform, pointing from left to right." },
      { id: "b", text: "Nearly uniform, pointing from right to left." },
      { id: "c", text: "Zero everywhere between the plates." },
      { id: "d", text: "Radial, pointing outward from the gap's midpoint." },
    ],
    answerId: "a",
    explanation:
      "Field arrows leave positive charge and end on negative charge, so they point left to right. Parallel plates make that field nearly uniform in the middle.",
    objectiveCodes: ["10.3.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "potential-vs-field-path",
    lessonSlug: "potential-energy-potential-and-capacitors",
    questionType: "multiple_choice",
    prompt:
      "A positive test charge is moved slowly between two points that sit on the same equipotential surface near a charged sphere. How much work does the electric field do?",
    choices: [
      { id: "a", text: "A positive amount, because the charge is positive." },
      { id: "b", text: "A negative amount, because the movers always fight the field." },
      { id: "c", text: "Zero, because the potential difference between the points is zero." },
      {
        id: "d",
        text: "It depends on the path length even though both points have the same potential.",
      },
    ],
    answerId: "c",
    explanation:
      "Work per unit charge by the field equals minus ΔV. On an equipotential, ΔV is zero, so the field does no net work for any path that starts and ends there.",
    objectiveCodes: ["10.5.A", "10.7.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "capacitor-dielectric-energy",
    lessonSlug: "potential-energy-potential-and-capacitors",
    questionType: "multiple_choice",
    prompt:
      "A photography-club flash capacitor is charged and then disconnected from the battery. Students slide a dielectric slab into the gap. What happens to the stored energy?",
    choices: [
      { id: "a", text: "It increases because capacitance increases at fixed charge." },
      { id: "b", text: "It decreases because U = Q squared over 2C and C increases while Q is fixed." },
      { id: "c", text: "It stays the same because a disconnected capacitor cannot change energy." },
      { id: "d", text: "It drops to zero because dielectrics cancel all stored charge." },
    ],
    answerId: "b",
    explanation:
      "Disconnecting fixes Q. A dielectric raises C. Stored energy Q^2/(2C) therefore falls. The missing energy is accounted for in the work associated with pulling the slab in.",
    objectiveCodes: ["10.6.A"],
    difficulty: "hard",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "current-from-charge-flow",
    lessonSlug: "current-resistance-and-simple-circuits",
    questionType: "multiple_choice",
    prompt:
      "A robotics motor lead carries 8.0 C of charge past a clip in 2.0 s. What is the current?",
    choices: [
      { id: "a", text: "0.25 A" },
      { id: "b", text: "4.0 A" },
      { id: "c", text: "10 A" },
      { id: "d", text: "16 A" },
    ],
    answerId: "b",
    explanation:
      "Current is charge per time: 8.0 C / 2.0 s = 4.0 A.",
    objectiveCodes: ["11.1.A"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "series-vs-parallel-brightness",
    lessonSlug: "current-resistance-and-simple-circuits",
    questionType: "multiple_choice",
    prompt:
      "Two identical lamps are first wired in series on a 12 V club battery, then rewired in parallel on the same battery. Which statement is true?",
    choices: [
      {
        id: "a",
        text: "Each lamp is dimmer in parallel because the current splits.",
      },
      {
        id: "b",
        text: "Each lamp is brighter in parallel because each receives the full 12 V.",
      },
      {
        id: "c",
        text: "Brightness is the same because the lamps are identical.",
      },
      {
        id: "d",
        text: "The parallel pair cannot light because current has two paths.",
      },
    ],
    answerId: "b",
    explanation:
      "Series lamps share the battery voltage. Parallel lamps each see 12 V, so each draws more current and dissipates more power.",
    objectiveCodes: ["11.2.A", "11.4.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "kirchhoff-loop-unknown",
    lessonSlug: "kirchhoff-and-rc-circuits",
    questionType: "multiple_choice",
    prompt:
      "A single loop has a 12 V battery and series resistors 2.0 ohm and 4.0 ohm. What is the potential drop across the 4.0 ohm resistor?",
    choices: [
      { id: "a", text: "2.0 V" },
      { id: "b", text: "4.0 V" },
      { id: "c", text: "6.0 V" },
      { id: "d", text: "8.0 V" },
    ],
    answerId: "d",
    explanation:
      "The loop current is 12 V / 6.0 ohm = 2.0 A. The drop on 4.0 ohm is I R = 8.0 V. The 2.0 ohm resistor takes the remaining 4.0 V.",
    objectiveCodes: ["11.6.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "rc-charging-time-constant",
    lessonSlug: "kirchhoff-and-rc-circuits",
    questionType: "multiple_choice",
    prompt:
      "An uncharged flash capacitor charges through a resistor from a battery. After one time constant, the capacitor voltage is closest to which fraction of the battery voltage?",
    choices: [
      { id: "a", text: "0.37" },
      { id: "b", text: "0.50" },
      { id: "c", text: "0.63" },
      { id: "d", text: "1.00" },
    ],
    answerId: "c",
    explanation:
      "Charging follows V = V_b (1 - e^{-t/RC}). At t = RC the term in parentheses is 1 - 1/e, about 0.63.",
    objectiveCodes: ["11.8.A"],
    difficulty: "hard",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "field-around-bar-magnet",
    lessonSlug: "magnetic-fields-and-moving-charges",
    questionType: "multiple_choice",
    prompt:
      "Students map a bar magnet with compasses. Which description of the field lines is correct?",
    choices: [
      { id: "a", text: "Lines leave the south end and enter the north end." },
      { id: "b", text: "Lines leave the north end and enter the south end." },
      { id: "c", text: "Lines start on the magnet and end in midair." },
      { id: "d", text: "Lines cross at the magnet's center where the field is strongest." },
    ],
    answerId: "b",
    explanation:
      "Magnetic field lines leave the north end, enter the south end, and continue through the magnet as closed loops. They do not cross.",
    objectiveCodes: ["12.1.A"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "charge-in-magnetic-field-path",
    lessonSlug: "magnetic-fields-and-moving-charges",
    questionType: "multiple_choice",
    prompt:
      "A positive ion in a club velocity selector moves to the right. A uniform magnetic field points into the page. The magnetic force on the ion is toward which direction on the page?",
    choices: [
      { id: "a", text: "Toward the top of the page." },
      { id: "b", text: "Toward the bottom of the page." },
      { id: "c", text: "Into the page." },
      { id: "d", text: "To the right, along the velocity." },
    ],
    answerId: "a",
    explanation:
      "For a positive charge, point fingers right (v) and curl them into the page (B). The thumb points up. The force is perpendicular to both v and B.",
    objectiveCodes: ["12.2.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "wire-force-right-hand",
    lessonSlug: "magnetic-fields-and-moving-charges",
    questionType: "multiple_choice",
    prompt:
      "A straight jumper on the robotics table carries current due east. Earth's magnetic field is due north. The magnetic force on the wire is toward which direction?",
    choices: [
      { id: "a", text: "East, along the current." },
      { id: "b", text: "North, along the field." },
      { id: "c", text: "Up, out of the table." },
      { id: "d", text: "West, opposite the current." },
    ],
    answerId: "c",
    explanation:
      "F is along I cross B. Point fingers east and curl them north. The thumb points up. The force is perpendicular to both the wire and the field.",
    objectiveCodes: ["12.3.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "loop-area-change-induced",
    lessonSlug: "induction-and-faraday",
    questionType: "multiple_choice",
    prompt:
      "A wire loop lies flat on a table in a uniform field that points into the table. Students shrink the loop's area without rotating it. Which induced current, viewed from above, opposes the flux change?",
    choices: [
      {
        id: "a",
        text: "Clockwise, so the loop's own field also points into the table.",
      },
      {
        id: "b",
        text: "Counterclockwise, so the loop's own field points out of the table.",
      },
      {
        id: "c",
        text: "No current, because the field strength did not change.",
      },
      {
        id: "d",
        text: "A current that oscillates even though the area shrinks steadily.",
      },
    ],
    answerId: "a",
    explanation:
      "Flux into the table decreases as area shrinks. Lenz's law requires an induced field into the table. A clockwise current, viewed from above, produces that field.",
    objectiveCodes: ["12.4.A"],
    difficulty: "hard",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "plane-mirror-image-distance",
    lessonSlug: "reflection-and-mirror-images",
    questionType: "multiple_choice",
    prompt:
      "A yearbook photographer stands 1.2 m in front of a plane dressing-room mirror. How far behind the glass is the photographer's image?",
    choices: [
      { id: "a", text: "0.60 m" },
      { id: "b", text: "1.2 m" },
      { id: "c", text: "2.4 m" },
      { id: "d", text: "The image sits on the glass, so the distance is zero." },
    ],
    answerId: "b",
    explanation:
      "A plane-mirror image is as far behind the mirror as the object is in front, virtual, and the same size.",
    objectiveCodes: ["13.1.A", "13.2.A"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "concave-mirror-object-inside-f",
    lessonSlug: "reflection-and-mirror-images",
    questionType: "multiple_choice",
    prompt:
      "A makeup mirror is a concave spherical mirror. A student holds a comb closer to the glass than the focal point. What kind of image is formed?",
    choices: [
      { id: "a", text: "Real, inverted, and reduced." },
      { id: "b", text: "Real, inverted, and enlarged." },
      { id: "c", text: "Virtual, upright, and enlarged." },
      { id: "d", text: "Virtual, upright, and reduced." },
    ],
    answerId: "c",
    explanation:
      "Inside the focal point, reflected rays diverge. Extending them backward gives a virtual, upright, enlarged image, which is the usual makeup-mirror result.",
    objectiveCodes: ["13.2.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "snell-air-to-water",
    lessonSlug: "refraction-and-lens-images",
    questionType: "multiple_choice",
    prompt:
      "A laser from the physics club enters an aquarium at 40 degrees from the normal. Compared with 40 degrees, the refracted angle in the water is",
    choices: [
      { id: "a", text: "smaller, because the ray bends toward the normal." },
      { id: "b", text: "larger, because the ray bends away from the normal." },
      { id: "c", text: "exactly 40 degrees, because frequency does not change." },
      { id: "d", text: "90 degrees, because water always causes total internal reflection." },
    ],
    answerId: "a",
    explanation:
      "Water has a larger index than air. Snell's law then requires a smaller angle from the normal. Total internal reflection is an exit problem, not an entry problem.",
    objectiveCodes: ["13.3.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "converging-lens-object-2f",
    lessonSlug: "refraction-and-lens-images",
    questionType: "multiple_choice",
    prompt:
      "A club projector lens has focal length 10 cm. A slide sits 20 cm from the lens. Where is the image, and is it inverted?",
    choices: [
      { id: "a", text: "10 cm from the lens, upright." },
      { id: "b", text: "20 cm from the lens on the far side, inverted." },
      { id: "c", text: "20 cm from the lens on the near side, upright." },
      { id: "d", text: "At infinity, because the object is at 2f." },
    ],
    answerId: "b",
    explanation:
      "1/d_o + 1/d_i = 1/f gives 1/20 + 1/d_i = 1/10, so d_i = 20 cm. Magnification is -d_i/d_o = -1, so the image is real, inverted, and the same size.",
    objectiveCodes: ["13.4.A"],
    difficulty: "hard",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "wave-speed-from-f-lambda",
    lessonSlug: "wave-properties-sound-and-doppler",
    questionType: "multiple_choice",
    prompt:
      "A tuning fork at 250 Hz sends a sound wave of wavelength 1.36 m across the orchestra room. What is the wave speed?",
    choices: [
      { id: "a", text: "184 m/s" },
      { id: "b", text: "250 m/s" },
      { id: "c", text: "340 m/s" },
      { id: "d", text: "3400 m/s" },
    ],
    answerId: "c",
    explanation:
      "Wave speed is frequency times wavelength: 250 Hz times 1.36 m = 340 m/s.",
    objectiveCodes: ["14.2.A"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "doppler-ambulance-toward",
    lessonSlug: "wave-properties-sound-and-doppler",
    questionType: "multiple_choice",
    prompt:
      "An ambulance on El Camino comes toward a student on the sidewalk, then passes and recedes. How does the observed siren frequency compare with the rest frequency?",
    choices: [
      {
        id: "a",
        text: "Lower while approaching, higher while receding.",
      },
      {
        id: "b",
        text: "Higher while approaching, lower while receding.",
      },
      {
        id: "c",
        text: "Equal to the rest frequency the whole time because the student is at rest.",
      },
      {
        id: "d",
        text: "Higher both before and after the pass, because the siren is loud.",
      },
    ],
    answerId: "b",
    explanation:
      "Approach shortens the observed period, so frequency rises. Recession lengthens it, so frequency falls. Loudness is not the Doppler shift.",
    objectiveCodes: ["14.5.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "double-slit-path-difference",
    lessonSlug: "interference-diffraction-and-thin-films",
    questionType: "multiple_choice",
    prompt:
      "Two in-phase laser slits send light to a point on a far gym wall where the path-length difference is exactly one wavelength. That point is",
    choices: [
      { id: "a", text: "a dark fringe, because one wavelength is a half-cycle shift." },
      { id: "b", text: "a bright fringe, because the waves arrive in phase." },
      { id: "c", text: "neither bright nor dark, because slits cannot interfere." },
      { id: "d", text: "bright only if the wall is a mirror." },
    ],
    answerId: "b",
    explanation:
      "A path difference of a whole number of wavelengths keeps in-phase sources in phase. Crest meets crest, so the point is a maximum.",
    objectiveCodes: ["14.6.A", "14.8.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "thin-film-soap-constructive",
    lessonSlug: "interference-diffraction-and-thin-films",
    questionType: "multiple_choice",
    prompt:
      "A soap film in air is much thinner than a visible wavelength. In reflected white light the film looks dark. Why?",
    choices: [
      {
        id: "a",
        text: "Soap absorbs every visible color when the film is thin.",
      },
      {
        id: "b",
        text: "The two reflected waves have a relative phase inversion and almost no extra path, so they cancel.",
      },
      {
        id: "c",
        text: "Thin films only work in transmitted light, so reflection is always black.",
      },
      {
        id: "d",
        text: "The front surface inverts the wave and the back surface inverts it again, so they add.",
      },
    ],
    answerId: "b",
    explanation:
      "Air-to-soap reflection inverts; soap-to-air reflection does not. With t near zero the path difference is negligible, so the one inversion makes the reflections interfere destructively.",
    objectiveCodes: ["14.9.A"],
    difficulty: "hard",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "photon-energy-from-frequency",
    lessonSlug: "photons-photoelectric-and-spectra",
    questionType: "multiple_choice",
    prompt:
      "The astronomy club compares a red LED and a blue LED. Which photon has more energy, and why?",
    choices: [
      { id: "a", text: "The red photon, because red looks warmer." },
      { id: "b", text: "The blue photon, because blue light has a higher frequency." },
      { id: "c", text: "They have equal energy because both are visible." },
      { id: "d", text: "Whichever LED is brighter, because intensity is photon energy." },
    ],
    answerId: "b",
    explanation:
      "Photon energy is h f. Blue light has a higher frequency than red, so each blue photon carries more energy. Brightness is about photon rate, not one photon's energy.",
    objectiveCodes: ["15.1.A"],
    difficulty: "easy",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "photoelectric-threshold",
    lessonSlug: "photons-photoelectric-and-spectra",
    questionType: "multiple_choice",
    prompt:
      "A metal plate in a lab photocell emits no electrons under a dim red lamp. The club switches to a much brighter red lamp of the same frequency. What happens?",
    choices: [
      {
        id: "a",
        text: "Electrons appear because extra intensity supplies the missing energy per electron.",
      },
      {
        id: "b",
        text: "Still no electrons, because each photon is still below the work-function energy.",
      },
      {
        id: "c",
        text: "Electrons appear with a range of kinetic energies up to h f.",
      },
      {
        id: "d",
        text: "The threshold frequency falls because the lamp is brighter.",
      },
    ],
    answerId: "b",
    explanation:
      "If f is below threshold, one photon cannot free an electron. Raising intensity adds more of those same photons. It does not raise h f or lower the work function.",
    objectiveCodes: ["15.5.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "bohr-level-photon-emission",
    lessonSlug: "photons-photoelectric-and-spectra",
    questionType: "multiple_choice",
    prompt:
      "In a hydrogen emission-tube demo, an electron drops from n = 3 to n = 2. Which statement is correct?",
    choices: [
      {
        id: "a",
        text: "A photon is absorbed, and its energy equals E_3 minus E_2.",
      },
      {
        id: "b",
        text: "A photon is emitted, and its energy equals E_3 minus E_2.",
      },
      {
        id: "c",
        text: "No photon is involved because n changed by only one unit.",
      },
      {
        id: "d",
        text: "A photon is emitted with energy E_3 plus E_2.",
      },
    ],
    answerId: "b",
    explanation:
      "A drop to a lower level releases the energy difference as an emitted photon. Absorption would be the upward jump.",
    objectiveCodes: ["15.2.A", "15.3.A"],
    difficulty: "medium",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    slug: "fission-vs-fusion-mass-defect",
    lessonSlug: "nuclear-decay-fission-and-fusion",
    questionType: "multiple_choice",
    prompt:
      "Why can both fission of a heavy nucleus and fusion of light nuclei release energy?",
    choices: [
      {
        id: "a",
        text: "Both processes create charge, and new charge is energy.",
      },
      {
        id: "b",
        text: "Both move toward nuclei that are more tightly bound per nucleon, so the products have less mass than the fuel.",
      },
      {
        id: "c",
        text: "Fission releases energy and fusion always absorbs energy; the premise is false.",
      },
      {
        id: "d",
        text: "Both convert entire nuclei into photons and leave no leftover mass.",
      },
    ],
    answerId: "b",
    explanation:
      "Binding energy per nucleon peaks near iron. Splitting very heavy nuclei or joining very light ones can produce more tightly bound products. The mass defect appears as energy.",
    objectiveCodes: ["15.7.A"],
    difficulty: "hard",
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    version: 1,
  },
];

export default questions;
