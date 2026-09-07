import {
  AP_BIO_NAMESPACE,
  AP_BIO_SOURCE_BASIS,
} from "@/features/learn/courses/ap-bio/manifest";
import type { ApBioLesson } from "@/features/learn/courses/ap-bio/schema";

export const cellularEnergeticsLessons: readonly ApBioLesson[] = [
  {
    namespace: AP_BIO_NAMESPACE,
    unitSlug: "cellular-energetics",
    slug: "enzymes-and-free-energy",
    title: "Enzymes and free energy",
    position: 5,
    estimatedMinutes: 20,
    sourceBasis: AP_BIO_SOURCE_BASIS,
    objectiveCodes: ["ENE-1.D", "ENE-1.E", "ENE-1.F"],
    bodyPlain: [
      "Chemical reactions in cells are constrained by free energy. An exergonic reaction can release free energy. An endergonic reaction requires a net input. Cells couple the two: the energy released from one process, often ATP hydrolysis, is used to drive a process that would otherwise not proceed. ATP is not magic fuel. It is a phosphorylated nucleotide whose hydrolysis is linked, through enzymes, to work such as transport, movement, or synthesis.",
      "Enzymes are biological catalysts, usually proteins, that lower activation energy without being consumed. An active site binds a substrate in an orientation that favors the reaction. Temperature, pH, and salt can change enzyme shape and therefore rate. Too much heat unfolds the protein. A pH far from the enzyme's working range changes charged groups in the active site. The yogurt club sees this when a culture held too warm or too acidic stops thickening.",
      "Rate also depends on substrate concentration. At low substrate, adding more increases rate because more active sites fill. At saturation, extra substrate does little because enzymes are busy. Competitive inhibitors occupy the active site and can be overcome by more substrate. Noncompetitive inhibitors bind elsewhere and change shape so extra substrate cannot fully rescue the rate. A locker-room ice pack that slows a bruise enzyme is a crude temperature story; a designed inhibitor is a shape story.",
      "When students graph a yeast-and-peroxide lab, they should read the curve as enzyme behavior, not as a pretty line. A plateau can mean saturation or denaturation, depending on what they changed. A drop after a pH spike is not the substrate vanishing; it is the catalyst losing its working fold. The claim to write is always about free energy, activation energy, or available active sites.",
    ].join("\n\n"),
  },
  {
    namespace: AP_BIO_NAMESPACE,
    unitSlug: "cellular-energetics",
    slug: "photosynthesis-and-cellular-respiration",
    title: "Photosynthesis and cellular respiration",
    position: 6,
    estimatedMinutes: 22,
    sourceBasis: AP_BIO_SOURCE_BASIS,
    objectiveCodes: ["ENE-1.G", "ENE-1.H", "ENE-1.I", "ENE-1.J", "ENE-1.K"],
    bodyPlain: [
      "Photosynthesis captures light energy and stores it in carbohydrates. In chloroplasts, photosystems in the thylakoid membrane absorb photons, excite electrons, and move those electrons through carriers. Water is split, oxygen is released, and a proton gradient forms. ATP synthase uses that gradient. The Calvin cycle in the stroma then uses ATP and NADPH to fix carbon dioxide into sugar. The garden club's spinach-leaf disks that float after a light treatment are showing oxygen production, not sugar crystals appearing on the leaf.",
      "Cellular respiration oxidizes organic molecules and captures free energy in ATP. Glycolysis in the cytosol splits glucose and yields a small amount of ATP plus pyruvate. If oxygen and mitochondria are available, pyruvate enters the matrix, the citric acid cycle strips more electrons, and the electron-transport chain in the inner membrane rebuilds a proton gradient. ATP synthase again couples proton flow to ATP. The carbon leaves as carbon dioxide.",
      "The two pathways are complementary at the ecosystem scale and tightly related at the chemical scale. The oxygen released by photosynthesis is the terminal electron acceptor of aerobic respiration. The carbon dioxide released by respiration can be refixed. An uncoupler that lets protons leak across the inner membrane burns fuel without making ATP, which is why the gradient—not merely the presence of oxygen—is the immediate driver of oxidative phosphorylation.",
      "Fermentation is a backup that regenerates NAD+ so glycolysis can continue when the electron-transport chain cannot run. Yeast in a sealed juice bottle produce ethanol and carbon dioxide. Muscle cells under sudden demand produce lactate. Neither path harvests as much ATP as full respiration, but both keep a redox cycle turning. Students should track electrons, protons, and carbon, not just recite organelle names.",
    ].join("\n\n"),
  },
];
