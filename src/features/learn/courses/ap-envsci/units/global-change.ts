import {
  AP_ENVSCI_NAMESPACE,
  AP_ENVSCI_SOURCE_BASIS,
} from "@/features/learn/courses/ap-envsci/manifest";
import type { ApEnvsciLesson } from "@/features/learn/courses/ap-envsci/course-types";

export const globalChangeLessons: readonly ApEnvsciLesson[] = [
  {
    namespace: AP_ENVSCI_NAMESPACE,
    unitSlug: "global-change",
    slug: "ozone-greenhouse-and-climate-feedbacks",
    title: "Ozone, Greenhouse, and Climate Feedbacks",
    position: 1,
    estimatedMinutes: 20,
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    objectiveCodes: ["STB-4.A", "STB-4.B", "STB-4.C", "STB-4.E", "STB-4.F"],
    bodyPlain: [
      "Stratospheric ozone absorbs a band of ultraviolet light that would otherwise raise skin-cancer and crop-damage risk. Certain chlorine- and bromine-bearing industrial chemicals, historically including chlorofluorocarbons used in older coolants and foams, can destroy that ozone when they reach the stratosphere and break down. The repair path was a global phaseout of those chemicals, not a local tree planting. Tropospheric ozone is a different molecule in a different layer with a different story. Mixing the two on a poster is a common club error.",
      "Greenhouse gases let shortwave sunlight in and slow the exit of longwave heat. Water vapor, carbon dioxide, methane, and nitrous oxide are the names a student should be able to place. Burning fossil fuels, draining peat, some fertilizers, and leaking gas pipes all change the mix. The greenhouse effect itself is not a hoax and not a villain: without any of it, Earth would be a frozen rock. The policy argument is about the extra trapping from gases people added quickly.",
      "Climate responses include rising average temperatures, shifting rain, earlier snowmelt, longer fire seasons, and rising seas as ice melts and water expands. A feedback amplifies or damps the first change. Arctic warming that melts bright ice and exposes dark water is a positive albedo feedback: more heat is absorbed, so more ice melts. Permafrost thaw that releases methane is another amplifier. A negative feedback would work the other way, such as a process that increased outgoing heat or stored more carbon. The Silicon Valley Climate Club's snow-to-stream timeline for a fictional Sierra gauge is a local readout of those global mechanics: earlier melt, a longer dry tail, and more pressure on reservoirs that were sized for a slower season.",
      "Short-term weather is not climate. One cool foggy July does not cancel a multi-decade warming trend, and one hot week does not prove a model by itself. Students should read trends, ranges, and impacts on ecosystems: species moving upslope or poleward, coral bleaching in warmer seas, and wetlands drowning if they cannot build elevation as fast as the tide rises. Solutions split into mitigation (cut the gases) and adaptation (live with the change already locked in). A campus that only buys a cooler and never touches its gas use has adapted a room and has not mitigated a thing.",
    ].join("\n\n"),
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    unitSlug: "global-change",
    slug: "invasives-habitat-loss-and-club-response",
    title: "Invasives, Habitat Loss, and Club Response",
    position: 2,
    estimatedMinutes: 20,
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    objectiveCodes: ["STB-4.G", "STB-4.H", "EIN-4.A", "EIN-4.B", "EIN-4.C"],
    bodyPlain: [
      "Invasive species arrive with people, find few predators, and can rewrite a community. A bay club pulling iceplant off a dune is not gardening for taste. Iceplant can smother natives, change soil, and leave a bare slope when it is finally removed without a replant plan. Ballast water, hikers, and the plant trade all move species. Prevention is cheaper than a decade of pulling. A wash station at a trailhead is a control. A motivational quote on a tote bag is not.",
      "Habitat loss and fragmentation remain the large, quiet drivers of species decline. A highway that splits a mountain lion's range, a levee that erases a marsh terrace, or a vineyard that replaces an oak woodland each removes area and raises the edge. Edges are windier, drier, and more open to generalists and pets. Corridors, undercrossings, and clustered rather than scattered development can keep some movement. A single tiny preserve with no connection is an island, and the island lesson from Unit 2 still applies.",
      "Human activities also change biodiversity through overharvest, pollution, and climate stress stacked on the same population. Strategies that work are specific. A take limit can recover a fishery if it is enforced and if habitat remains. A captive-breeding program fails if there is no wild place left to return to. Protected areas work better as a network than as isolated postage stamps. The East Bay Watershed Club's invented corridor plan links a creek buffer, a schoolyard native patch, and a county park instead of arguing for one heroic fence around a parking-lot planter.",
      "Club response should be measurable. Count the plants that survive the second summer. Log the days the indoor-air plan actually moved practice. Publish the energy audit with the leftover problems named. Global change is a stack of local ledgers. Students who can connect an invasive pull, a corridor, a gas leak, and a wetland elevation project to public CED codes are doing the course. Students who only collect disaster headlines are not.",
    ].join("\n\n"),
  },
];
