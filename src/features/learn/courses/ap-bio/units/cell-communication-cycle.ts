import {
  AP_BIO_NAMESPACE,
  AP_BIO_SOURCE_BASIS,
} from "@/features/learn/courses/ap-bio/manifest";
import type { ApBioLesson } from "@/features/learn/courses/ap-bio/schema";

export const cellCommunicationCycleLessons: readonly ApBioLesson[] = [
  {
    namespace: AP_BIO_NAMESPACE,
    unitSlug: "cell-communication-cycle",
    slug: "signal-reception-and-transduction",
    title: "Signal reception and transduction",
    position: 7,
    estimatedMinutes: 20,
    sourceBasis: AP_BIO_SOURCE_BASIS,
    objectiveCodes: ["IST-3.A", "IST-3.B", "IST-3.C", "IST-3.D"],
    bodyPlain: [
      "Cells communicate because a signal from outside can change activity inside without the signal itself doing the work. A ligand binds a receptor. That binding changes receptor shape. The changed receptor starts a transduction path: second messengers, phosphorylation cascades, or ion flows. The cell responds by altering enzyme activity, gene expression, or cytoskeleton. A hallway announcement is a weak analogy; the better one is a locked club-room door that opens only for a matching key and then turns on the lights.",
      "Reception is specific. A receptor's binding pocket fits some ligands and not others. The same ligand can have different effects in different cells if those cells display different receptors or different downstream proteins. Epinephrine speeding a heart cell and mobilizing fuel in a liver cell is one signal with two response programs. Distance also varies. Some signals act on a neighbor. Hormones travel in blood. Quorum-sensing bacteria release molecules that only matter once the local crowd is dense.",
      "Transduction often amplifies. One occupied receptor can activate many G proteins or kinases, each of which can activate many targets. A small ligand pulse can therefore yield a large internal change. The path can also be shut off: phosphatases remove phosphates, second messengers are degraded, and receptors are internalized. A cascade that cannot turn off is as dangerous as one that cannot turn on.",
      "When a medicine or a mutation blocks a receptor, ask whether the ligand still arrives and whether the internal path can still fire. A shape change that prevents ligand binding stops the path at reception. A mutation in a kinase can freeze the path on or off regardless of ligand. Club case studies should always name the step—reception, transduction, or response—rather than saying the cell 'got the message' and stopping there.",
    ].join("\n\n"),
  },
  {
    namespace: AP_BIO_NAMESPACE,
    unitSlug: "cell-communication-cycle",
    slug: "cell-cycle-and-checkpoints",
    title: "Cell cycle and checkpoints",
    position: 8,
    estimatedMinutes: 20,
    sourceBasis: AP_BIO_SOURCE_BASIS,
    objectiveCodes: ["IST-1.D", "IST-1.E", "IST-3.E"],
    bodyPlain: [
      "The cell cycle is the ordered sequence that duplicates a cell. Interphase includes G1, S, and G2. DNA is copied in S phase. Mitosis then separates sister chromatids, and cytokinesis splits the cytoplasm. The point of the cycle is two cells with the same genetic information, not merely 'growth.' A yeast culture on the bio-club bench that doubles overnight is a population of completed cycles.",
      "Checkpoints are decision points. Proteins survey whether DNA is intact, whether chromosomes are attached to the spindle, and whether the cell has enough resources. If a check fails, the cycle pauses or the cell may undergo programmed death. Cyclins and cyclin-dependent kinases rise and fall to push the cycle forward only when the next phase is allowed. A checkpoint is not a decorative label on a diagram; it is a molecular veto.",
      "Cancer biology, at the level this course needs, is checkpoint failure plus uncontrolled division. A mutation that disables a brake or locks an accelerator lets damaged DNA keep copying. That is why 'cells divide too much' is an incomplete answer. Students should say which control was lost. A culture dish that keeps growing after contact should have stopped is a lab-scale picture of missing density-dependent inhibition.",
      "Feedback also links signaling to the cycle. Growth-factor ligands can push a cell past G1. DNA-damage signals can block S-phase entry. The same logic used in signal transduction—ligand, receptor, cascade, response—reappears here with a binary outcome: proceed or halt. When writing an explanation, name the phase, the check, and the molecular consequence of skipping it.",
    ].join("\n\n"),
  },
];
