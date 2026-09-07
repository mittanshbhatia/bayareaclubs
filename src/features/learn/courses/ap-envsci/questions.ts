/**
 * Original BayAreaClubs multiple-choice items for AP Environmental Science.
 * Written from scratch. Not derived from College Board, Stellar, or other banks.
 * source_basis: ORIGINAL.
 */

import {
  AP_ENVSCI_NAMESPACE,
  AP_ENVSCI_SOURCE_BASIS,
} from "@/features/learn/courses/ap-envsci/manifest";

export type ApEnvsciChoiceId = "a" | "b" | "c" | "d";

export type ApEnvsciChoice = {
  id: ApEnvsciChoiceId;
  text: string;
};

export type ApEnvsciDifficulty = "easy" | "medium" | "hard";

export type ApEnvsciQuestion = {
  namespace: typeof AP_ENVSCI_NAMESPACE;
  slug: string;
  lessonSlug: string | null;
  questionType: "multiple_choice";
  prompt: string;
  choices: readonly [ApEnvsciChoice, ApEnvsciChoice, ApEnvsciChoice, ApEnvsciChoice];
  answerId: ApEnvsciChoiceId;
  explanation: string;
  objectiveCodes: readonly string[];
  difficulty: ApEnvsciDifficulty;
  sourceBasis: typeof AP_ENVSCI_SOURCE_BASIS;
  version: 1;
};

export const questions: readonly ApEnvsciQuestion[] = [
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "pickleweed-and-mutualism",
    lessonSlug: "wetland-partners-and-resource-limits",
    questionType: "multiple_choice",
    prompt:
      "Peninsula Eco Club watches native bees collect nectar from restored gumplant while the flowers receive pollen. Which pairing is this?",
    choices: [
      { id: "a", text: "Competition, because both species want the same mudflat." },
      { id: "b", text: "Predation, because the bee is hunting the plant." },
      { id: "c", text: "Mutualism, because each partner gains a resource it cannot get as cheaply alone." },
      { id: "d", text: "Commensalism, because the plant is harmed and the bee is helped." },
    ],
    answerId: "c",
    explanation:
      "Both the bee and the flower gain. That is mutualism, not competition, predation, or a one-sided commensal pairing.",
    objectiveCodes: ["ERT-1.A"],
    difficulty: "easy",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "energy-lost-between-trophic-steps",
    lessonSlug: "cycles-through-a-bay-marsh",
    questionType: "multiple_choice",
    prompt:
      "A Hayward marsh food web lists algae, snails, and a shorebird. Why is the bird's available energy much smaller than the algae's captured sunlight?",
    choices: [
      { id: "a", text: "Carbon atoms are destroyed at each feeding step." },
      { id: "b", text: "Energy is recycled perfectly, so the bird only needs a little." },
      { id: "c", text: "Matter cannot move from plants to animals in a marsh." },
      { id: "d", text: "A large share of energy is lost as heat and unfinished work at each step, and energy is not recycled." },
    ],
    answerId: "d",
    explanation:
      "Energy fades as heat along a food chain. Matter cycles; energy does not. Carbon atoms are rearranged, not destroyed.",
    objectiveCodes: ["ERT-1.D", "ERT-1.G"],
    difficulty: "medium",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "nitrogen-fixation-in-mud",
    lessonSlug: "cycles-through-a-bay-marsh",
    questionType: "multiple_choice",
    prompt:
      "After a fertilizer pulse, club samples from a farm ditch show nitrate that plants can use. Why can those plants not use the nitrogen gas that already fills most of the air?",
    choices: [
      { id: "a", text: "Nitrogen gas is rare in air, so plants never encounter it." },
      { id: "b", text: "Most organisms cannot take nitrogen gas directly; microbes must convert it into usable forms." },
      { id: "c", text: "Nitrogen has no cycle and only exists in fertilizer bags." },
      { id: "d", text: "Plants use phosphorus gas instead of nitrogen." },
    ],
    answerId: "b",
    explanation:
      "Air is mostly nitrogen gas that plants cannot use until microbes fix it. Fertilizer nitrate is already in a usable form.",
    objectiveCodes: ["ERT-1.E"],
    difficulty: "medium",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "phosphorus-has-no-gas-phase",
    lessonSlug: "cycles-through-a-bay-marsh",
    questionType: "multiple_choice",
    prompt:
      "A levee repair stirs old mud into a slough and club phosphate readings jump. Why would watching only the air miss this budget?",
    choices: [
      { id: "a", text: "Phosphorus has no significant gas phase; large stores sit in rock and sediment." },
      { id: "b", text: "Phosphorus is stored only as a gas above the marsh." },
      { id: "c", text: "Phosphorus atoms are destroyed when mud is moved." },
      { id: "d", text: "The hydrologic cycle cannot carry dissolved or particle-bound phosphorus." },
    ],
    answerId: "a",
    explanation:
      "Phosphorus is rock- and sediment-bound, not an atmospheric gas like much of the nitrogen inventory. Stirred mud can release a pulse the air will not show.",
    objectiveCodes: ["ERT-1.F"],
    difficulty: "hard",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "bottleneck-after-a-levee-breach",
    lessonSlug: "three-layers-of-diversity",
    questionType: "multiple_choice",
    prompt:
      "A levee breach strands a small goby pocket. Later swabs show fewer rare genetic markers than an upstream reach, though the species is still present. What was lost first?",
    choices: [
      { id: "a", text: "The species name on the list, because bottlenecks erase taxonomy." },
      { id: "b", text: "Habitat diversity only; genes are unchanged by population size." },
      { id: "c", text: "Genetic diversity, because few breeders leave a thinner set of alleles." },
      { id: "d", text: "All ecosystem services worldwide." },
    ],
    answerId: "c",
    explanation:
      "A bottleneck keeps the species on the list while stripping genetic options the next stressor may need.",
    objectiveCodes: ["ERT-2.A"],
    difficulty: "medium",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "island-size-and-species-count",
    lessonSlug: "islands-tolerance-and-recovery",
    questionType: "multiple_choice",
    prompt:
      "Two coastal-prairie remnants sit in a sea of turf. Remnant A is larger and closer to a county park. Remnant B is tiny and isolated. Which prediction matches island biogeography?",
    choices: [
      { id: "a", text: "Remnant B should hold more specialist plants because isolation protects them." },
      { id: "b", text: "Remnant A should hold more species at equilibrium because colonization is easier and local extinction is slower." },
      { id: "c", text: "Size and distance do not affect species number on habitat islands." },
      { id: "d", text: "Only oceanic islands follow the pattern; campus remnants cannot." },
    ],
    answerId: "b",
    explanation:
      "Larger, nearer patches support more species. Habitat islands on land follow the same size and distance logic.",
    objectiveCodes: ["ERT-2.D"],
    difficulty: "easy",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "services-of-a-restored-marsh",
    lessonSlug: "three-layers-of-diversity",
    questionType: "multiple_choice",
    prompt:
      "A grant writes only about a trail overlook at a restored marsh and ignores flood storage and fish nursery space. Which mistake is that?",
    choices: [
      { id: "a", text: "Counting one cultural service while silently spending regulating and supporting services." },
      { id: "b", text: "Proving that marshes have no services except scenery." },
      { id: "c", text: "Measuring genetic diversity with a pair of binoculars." },
      { id: "d", text: "Showing that habitat loss raises specialist counts." },
    ],
    answerId: "a",
    explanation:
      "Overlooks are one service. Flood storage and nursery habitat are others. Pricing only the view undercounts the marsh.",
    objectiveCodes: ["ERT-2.B"],
    difficulty: "easy",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "primary-vs-secondary-succession",
    lessonSlug: "islands-tolerance-and-recovery",
    questionType: "multiple_choice",
    prompt:
      "After a grass fire on an East Bay hillside, soil and roots remain. What kind of succession should the club expect?",
    choices: [
      { id: "a", text: "Primary succession, because fire creates bare rock with no soil." },
      { id: "b", text: "No succession, because burned land stays empty forever." },
      { id: "c", text: "Secondary succession, because a soil seedbed remains." },
      { id: "d", text: "A population bottleneck in the atmosphere." },
    ],
    answerId: "c",
    explanation:
      "Secondary succession starts where soil remains. Primary succession starts on new or stripped substrate with no soil.",
    objectiveCodes: ["ERT-2.I"],
    difficulty: "medium",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "specialist-in-a-shrinking-marsh",
    lessonSlug: "specialists-curves-and-carrying-capacity",
    questionType: "multiple_choice",
    prompt:
      "A rail needs dense pickleweed. A raccoon eats crabs, scraps, and fruit. The marsh map loses area. Who usually drops first, and why?",
    choices: [
      { id: "a", text: "The raccoon, because generalists cannot use leftover food." },
      { id: "b", text: "The rail, because a specialist loses its narrow resource first when habitat shrinks." },
      { id: "c", text: "Neither, because carrying capacity never changes." },
      { id: "d", text: "Both equally, because diet does not affect persistence." },
    ],
    answerId: "b",
    explanation:
      "Specialists are first to go when the menu or cover shortens. Generalists can switch foods.",
    objectiveCodes: ["ERT-3.A"],
    difficulty: "easy",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "pyramid-age-structure",
    lessonSlug: "age-structure-and-demographic-shift",
    questionType: "multiple_choice",
    prompt:
      "A city's age-structure diagram is wide at the base and narrow at the top. What does that shape usually mean for population change?",
    choices: [
      { id: "a", text: "Many children relative to adults, so the population is likely growing." },
      { id: "b", text: "Few children, so the population is already shrinking fast." },
      { id: "c", text: "Birth and death rates are exactly replacement, so the shape must be a column." },
      { id: "d", text: "Age structure cannot be read without a soil texture triangle." },
    ],
    answerId: "a",
    explanation:
      "A wide base is a youthful, typically growing population. A column is nearer replacement. A narrow base is aging.",
    objectiveCodes: ["EIN-1.A"],
    difficulty: "medium",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "type-three-survivorship",
    lessonSlug: "specialists-curves-and-carrying-capacity",
    questionType: "multiple_choice",
    prompt:
      "An oyster restoration plot shows huge early death and a few long-lived adults. Which survivorship curve is that?",
    choices: [
      { id: "a", text: "Type I, high survival until old age." },
      { id: "b", text: "Type II, a fairly steady risk at every age." },
      { id: "c", text: "Type III, heavy early death and a few long-lived survivors." },
      { id: "d", text: "No curve applies to invertebrates." },
    ],
    answerId: "c",
    explanation:
      "Type III is early die-off with a few survivors. Type I is the opposite pattern. Type II is a steadier slope.",
    objectiveCodes: ["ERT-3.C"],
    difficulty: "easy",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "fertility-and-education",
    lessonSlug: "age-structure-and-demographic-shift",
    questionType: "multiple_choice",
    prompt:
      "Which change is most likely to lower a region's total fertility rate without inventing a new planet?",
    choices: [
      { id: "a", text: "Blocking access to education and family planning." },
      { id: "b", text: "Raising infant mortality on purpose." },
      { id: "c", text: "Wider access to education, nutrition, and family planning, and later average marriage." },
      { id: "d", text: "Assuming wealth appears automatically in every stage of the demographic transition." },
    ],
    answerId: "c",
    explanation:
      "Education, nutrition, family planning, and later marriage are the levers that commonly lower fertility. The transition model is not a promise that wealth arrives on a timer.",
    objectiveCodes: ["EIN-1.B", "EIN-1.C"],
    difficulty: "medium",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "clay-silt-sand-and-irrigation",
    lessonSlug: "plates-soils-and-a-watershed",
    questionType: "multiple_choice",
    prompt:
      "A restoration planting sits on a soil the club names as mostly clay. What irrigation mistake should they expect if they water it like sand?",
    choices: [
      { id: "a", text: "Clay holds water tightly, so extra water can pond and drown roots instead of draining away." },
      { id: "b", text: "Clay cannot hold any water, so plants always wilt in minutes." },
      { id: "c", text: "Texture does not affect water-holding capacity." },
      { id: "d", text: "A soil texture triangle only works on Mars." },
    ],
    answerId: "a",
    explanation:
      "Clay stores water and drains slowly. Watering it like sand ponds the hole. Sand would lose the same dose downward.",
    objectiveCodes: ["ERT-4.C"],
    difficulty: "easy",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "la-nina-and-sierra-snowpack",
    lessonSlug: "atmosphere-winds-and-pacific-swings",
    questionType: "multiple_choice",
    prompt:
      "A water-year planning sheet flags a La Nina-flavored Pacific. For many California interiors, what should the club treat as a raised risk, not a guarantee?",
    choices: [
      { id: "a", text: "A thicker Sierra snowpack and no drought planning." },
      { id: "b", text: "A drier interior and a thinner snowpack, with local exceptions still possible." },
      { id: "c", text: "A guaranteed tropical cyclone over Livermore." },
      { id: "d", text: "The end of the hydrologic cycle." },
    ],
    answerId: "b",
    explanation:
      "La Nina often dries interior California and thins snowpack, but it is a pattern name with exceptions, not a rain switch.",
    objectiveCodes: ["ERT-4.E"],
    difficulty: "hard",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "transform-not-subduction",
    lessonSlug: "plates-soils-and-a-watershed",
    questionType: "multiple_choice",
    prompt:
      "The geology club maps the Hayward trace on a weekend. Which boundary type matches a slide-past fault that does not build a volcanic chain?",
    choices: [
      { id: "a", text: "A divergent mid-ocean ridge under the campus." },
      { id: "b", text: "A convergent subduction zone that must produce an island arc on the same street." },
      { id: "c", text: "A transform boundary, where plates slide past and earthquakes are common." },
      { id: "d", text: "No plate boundary, because California has no earthquakes." },
    ],
    answerId: "c",
    explanation:
      "Hayward and San Andreas are transform neighbors. Convergent and divergent edges have different landforms.",
    objectiveCodes: ["ERT-4.A"],
    difficulty: "medium",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "watershed-is-not-a-pipe",
    lessonSlug: "plates-soils-and-a-watershed",
    questionType: "multiple_choice",
    prompt:
      "A student calls a parking-lot grate a hole to nowhere. What should the Alameda Creek Watershed Club say instead?",
    choices: [
      { id: "a", text: "The grate starts a path that still drains to the creek and then the bay." },
      { id: "b", text: "Stormwater leaves the planet at the first grate." },
      { id: "c", text: "Watersheds only exist above timberline." },
      { id: "d", text: "Pavement increases infiltration and slows peaks." },
    ],
    answerId: "a",
    explanation:
      "A watershed is the land that drains to a common point. Pavement speeds the trip; it does not end the map.",
    objectiveCodes: ["ERT-4.F"],
    difficulty: "easy",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "flood-irrigation-loss",
    lessonSlug: "commons-clearcuts-and-irrigation",
    questionType: "multiple_choice",
    prompt:
      "A drought-year berry row still uses flood irrigation. Which loss should the club expect compared with drip at the roots?",
    choices: [
      { id: "a", text: "Almost no loss, because flood irrigation is the most efficient method." },
      { id: "b", text: "A large share lost to evaporation and tailwater." },
      { id: "c", text: "Loss only of phosphorus gas." },
      { id: "d", text: "Higher equipment cost and no water at the plants." },
    ],
    answerId: "b",
    explanation:
      "Flood irrigation is simple and wasteful. Drip costs more to install and delivers water near roots.",
    objectiveCodes: ["EIN-2.D"],
    difficulty: "easy",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "commons-on-a-shared-well",
    lessonSlug: "commons-clearcuts-and-irrigation",
    questionType: "multiple_choice",
    prompt:
      "Every campus club treats the garden well as free during a drought. What commons failure is underway?",
    choices: [
      { id: "a", text: "Each user takes a little more while the cost is shared, so the well can be pumped past recharge." },
      { id: "b", text: "Sharing always destroys a resource, so wells can never be managed." },
      { id: "c", text: "Only oceans can be commons." },
      { id: "d", text: "The well will refill faster if more clubs pump." },
    ],
    answerId: "a",
    explanation:
      "Open access without rules rewards the first extra pump. Quotas, seasons, and shared logs are the usual fix, not a ban on sharing.",
    objectiveCodes: ["EIN-2.A"],
    difficulty: "medium",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "rain-garden-needs-overflow",
    lessonSlug: "cities-footprints-and-smarter-farms",
    questionType: "multiple_choice",
    prompt:
      "A courtyard rain garden has no overflow path and spills onto the sidewalk in the first design storm. Why is that not yet a runoff method?",
    choices: [
      { id: "a", text: "Rain gardens are forbidden in cities." },
      { id: "b", text: "A working method is sized for a design storm, planted for wet and dry spells, and has a planned overflow." },
      { id: "c", text: "Any planted box automatically shrinks a city's footprint." },
      { id: "d", text: "Overflows prove the garden is storing too little carbon." },
    ],
    answerId: "b",
    explanation:
      "Sustainability methods have to function. An undersized, clogged planter that floods the walk is a failed install.",
    objectiveCodes: ["STB-1.B", "STB-1.E"],
    difficulty: "medium",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "drip-beats-spray-on-berries",
    lessonSlug: "commons-clearcuts-and-irrigation",
    questionType: "multiple_choice",
    prompt:
      "A partner farm puts two berry rows on drip and leaves a control row on sprinklers. What result matches the lesson?",
    choices: [
      { id: "a", text: "Drip rows use less water per kilogram of fruit and need filters the sprinkler row does not." },
      { id: "b", text: "Sprinklers always beat drip because wind never carries spray." },
      { id: "c", text: "Drip irrigation removes the need to think about pests." },
      { id: "d", text: "Both methods lose the same share to evaporation, so the trial is meaningless." },
    ],
    answerId: "a",
    explanation:
      "Drip cuts evaporative loss and adds maintenance. That is a tradeoff the club can measure, not a miracle.",
    objectiveCodes: ["EIN-2.D"],
    difficulty: "easy",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "heat-rate-of-a-gas-plant",
    lessonSlug: "fuels-grids-and-a-club-energy-audit",
    questionType: "multiple_choice",
    prompt:
      "The climate club shifts kiln use off a hot evening when a gas peak plant is likely running. Why can that cut combustion even if the school installs no panels?",
    choices: [
      { id: "a", text: "Efficiency and timing are resources: a kilowatt-hour not demanded may be a kilowatt-hour not burned." },
      { id: "b", text: "Gas plants emit no carbon, so timing cannot matter." },
      { id: "c", text: "Kilns run on stratospheric ozone." },
      { id: "d", text: "The electric bill already lists every power-plant fuel by the minute, so behavior is irrelevant." },
    ],
    answerId: "a",
    explanation:
      "Peak gas units spin up when demand stacks. Moving a load off that hour can cut fuel even without new generation on site.",
    objectiveCodes: ["STB-1.A"],
    difficulty: "medium",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "solar-land-use-tradeoff",
    lessonSlug: "renewables-efficiency-and-tradeoffs",
    questionType: "multiple_choice",
    prompt:
      "The club compares a parking-canopy array with clearing campus oaks for ground mounts. The canopy keeps the trees and produces less nameplate power. What is the honest reading?",
    choices: [
      { id: "a", text: "Renewable energy has no land or wildlife cost." },
      { id: "b", text: "The only correct choice is always maximum megawatts." },
      { id: "c", text: "Students should name which value they ranked first and what they gave up." },
      { id: "d", text: "Oaks generate more electricity than panels, so the grove is a power plant." },
    ],
    answerId: "c",
    explanation:
      "Every source has a footprint. A real decision states the ranking. Pretending there is a no-footprint option loses the debate.",
    objectiveCodes: ["STB-1.B"],
    difficulty: "hard",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "gas-is-not-carbon-free",
    lessonSlug: "fuels-grids-and-a-club-energy-audit",
    questionType: "multiple_choice",
    prompt:
      "A student says natural gas is carbon-free because the flame looks clean. What belongs on the ledger anyway?",
    choices: [
      { id: "a", text: "Stack carbon dioxide plus methane leaks along the supply chain, even if sulfur and particles are lower than coal." },
      { id: "b", text: "Nothing, because a blue flame cannot emit a greenhouse gas." },
      { id: "c", text: "Only the school's electric meter, because upstream leaks are imaginary." },
      { id: "d", text: "Stratospheric ozone destruction by kitchen burners." },
    ],
    answerId: "a",
    explanation:
      "Gas often burns cleaner than coal for some air pollutants and still adds carbon dioxide and leaked methane.",
    objectiveCodes: ["STB-1.A"],
    difficulty: "medium",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "efficiency-before-panels",
    lessonSlug: "renewables-efficiency-and-tradeoffs",
    questionType: "multiple_choice",
    prompt:
      "A south classroom gets more glass without shades and cooling demand rises more than the lighting savings. What energy-quality lesson did the remodel miss?",
    choices: [
      { id: "a", text: "Match the source to the service, and cut the load before sizing new generation." },
      { id: "b", text: "Any extra glass is free energy." },
      { id: "c", text: "Heat-pump water heaters make daylight worse." },
      { id: "d", text: "Insulation is only useful after a battery is installed." },
    ],
    answerId: "a",
    explanation:
      "Daylight without glare control can raise cooling more than it saves. Efficiency and matching come before a larger system.",
    objectiveCodes: ["STB-1.E"],
    difficulty: "hard",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "inversion-traps-wildfire-smoke",
    lessonSlug: "smog-inversions-and-wildfire-smoke",
    questionType: "multiple_choice",
    prompt:
      "Diablo winds push wildfire smoke into a valley under a temperature inversion. Why do cheap particle sensors stay high until afternoon wind mixes the column?",
    choices: [
      { id: "a", text: "The atmosphere is a reliable blender at every hour." },
      { id: "b", text: "A warmer lid over cooler air stops vertical mixing, so particles sit in the breathing zone." },
      { id: "c", text: "Inversions destroy particulates on contact." },
      { id: "d", text: "Smoke cannot travel from a fire the campus did not start." },
    ],
    answerId: "b",
    explanation:
      "An inversion is a lid. Height, temperature structure, and wind decide whether smoke dilutes or sits.",
    objectiveCodes: ["STB-2.A", "STB-2.E"],
    difficulty: "medium",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "ozone-is-not-a-primary-pollutant",
    lessonSlug: "smog-inversions-and-wildfire-smoke",
    questionType: "multiple_choice",
    prompt:
      "A club poster lists tropospheric ozone next to carbon monoxide as if both leave a tailpipe as those molecules. What is wrong?",
    choices: [
      { id: "a", text: "Carbon monoxide is not a pollutant." },
      { id: "b", text: "Ozone is only a problem in the stratosphere." },
      { id: "c", text: "Tropospheric ozone is secondary: nitrogen oxides and volatile organics react in sunlight to make it." },
      { id: "d", text: "Primary and secondary pollutants are the same list." },
    ],
    answerId: "c",
    explanation:
      "Ozone in smog is formed in the air. Carbon monoxide is emitted directly. Mixing those origin stories is the error.",
    objectiveCodes: ["STB-2.A"],
    difficulty: "hard",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "radon-not-a-hepa-job",
    lessonSlug: "indoor-air-acid-rain-and-noise",
    questionType: "multiple_choice",
    prompt:
      "During a smoke week the club runs a HEPA filter. Why is that the wrong tool for a basement radon reading?",
    choices: [
      { id: "a", text: "HEPA filters remove radon gas as their main job." },
      { id: "b", text: "Radon is a soil gas; a particle filter does not vent it, while a radon fan and a test can." },
      { id: "c", text: "Radon is outdoor photochemical smog." },
      { id: "d", text: "No indoor pollutant needs a matched tool." },
    ],
    answerId: "b",
    explanation:
      "Match the tool to the pollutant. HEPA cuts particles. Radon needs testing and venting, not a smoke filter.",
    objectiveCodes: ["STB-2.E"],
    difficulty: "medium",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "acid-rain-is-downwind",
    lessonSlug: "indoor-air-acid-rain-and-noise",
    questionType: "multiple_choice",
    prompt:
      "Sulfur dioxide from a distant stack becomes acid that falls on a poorly buffered lake the club did not visit. Which statement is true?",
    choices: [
      { id: "a", text: "Acid deposition can harm downwind waters and soils even if those places did not burn the fuel." },
      { id: "b", text: "Acids cannot travel as rain, snow, or dry particles." },
      { id: "c", text: "Liming a lake turns off the stack forever." },
      { id: "d", text: "Only carbon monoxide makes lakes acidic." },
    ],
    answerId: "a",
    explanation:
      "Precursors travel. Controls at the source beat a one-time lime bandage.",
    objectiveCodes: ["STB-2.G"],
    difficulty: "easy",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "dead-zone-after-a-first-flush",
    lessonSlug: "runoff-blooms-and-wetland-filters",
    questionType: "multiple_choice",
    prompt:
      "After the first autumn rain, a slough grows a thick algal scum and then fish gasp at the surface. What sequence did nutrients from streets and fields most likely start?",
    choices: [
      { id: "a", text: "Eutrophication: extra nitrogen and phosphorus feed algae; decay then consumes oxygen." },
      { id: "b", text: "A thermal inversion in the mud that creates ozone." },
      { id: "c", text: "Primary succession on bare rock in the channel." },
      { id: "d", text: "A Type I survivorship curve for the algae only." },
    ],
    answerId: "a",
    explanation:
      "A nutrient pulse, a bloom, then microbial oxygen demand is cultural eutrophication. The first flush is a classic nonpoint delivery.",
    objectiveCodes: ["STB-3.B", "STB-3.C"],
    difficulty: "medium",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "bioaccumulation-in-striped-bass",
    lessonSlug: "toxins-waste-and-treatment-choices",
    questionType: "multiple_choice",
    prompt:
      "A persistent chemical is rare in slough water but high in a large striped bass. Which pair of words should the advisory board use?",
    choices: [
      { id: "a", text: "Infiltration and transpiration only." },
      { id: "b", text: "Bioaccumulation in one body over time and biomagnification up the food chain." },
      { id: "c", text: "Primary and secondary succession." },
      { id: "d", text: "El Nino and carrying capacity." },
    ],
    answerId: "b",
    explanation:
      "The chemical builds in one animal and concentrates at higher trophic steps. Water concentration alone understates the fisher's risk.",
    objectiveCodes: ["STB-3.H", "STB-3.I"],
    difficulty: "hard",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "ld50-on-a-lab-poster",
    lessonSlug: "toxins-waste-and-treatment-choices",
    questionType: "multiple_choice",
    prompt:
      "A lab poster treats LD50 as the only number that matters and implies dumping just under that dose is fine. What did the poster miss?",
    choices: [
      { id: "a", text: "LD50 ranks acute lethality in a test population; sublethal and endocrine effects can appear at lower doses." },
      { id: "b", text: "LD50 is a permission slip written for campus creeks." },
      { id: "c", text: "LD50 measures only noise in decibels." },
      { id: "d", text: "Any dose below LD50 is required by the hydrologic cycle." },
    ],
    answerId: "a",
    explanation:
      "LD50 is a comparison of lethal doses, not a safe-dump line. Reproduction and hormone effects can matter sooner.",
    objectiveCodes: ["STB-3.K"],
    difficulty: "medium",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "landfill-food-is-methane",
    lessonSlug: "toxins-waste-and-treatment-choices",
    questionType: "multiple_choice",
    prompt:
      "A campus audit finds food scraps in the landfill dumpster and dirty clamshells in recycling. Which pairing is correct?",
    choices: [
      { id: "a", text: "Food in a landfill is a methane story; dirty recyclables are a contamination story. They need different fixes." },
      { id: "b", text: "Both problems are solved by a louder incinerator only." },
      { id: "c", text: "Food scraps cannot produce methane if the liner is black." },
      { id: "d", text: "Contamination makes recycling more valuable." },
    ],
    answerId: "a",
    explanation:
      "Organics in anaerobic landfill cells make methane. Dirty streams spoil recycling markets. Two bins, two repairs.",
    objectiveCodes: ["STB-3.L", "STB-3.M"],
    difficulty: "easy",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "albedo-after-early-snowmelt",
    lessonSlug: "ozone-greenhouse-and-climate-feedbacks",
    questionType: "multiple_choice",
    prompt:
      "A fictional Sierra gauge shows earlier melt and a longer dry tail. Why can losing bright snow earlier amplify warming at the surface?",
    choices: [
      { id: "a", text: "Darker ground or water absorbs more incoming energy than bright snow, a positive albedo feedback." },
      { id: "b", text: "Snowmelt destroys greenhouse gases on contact." },
      { id: "c", text: "Albedo only matters on the moon." },
      { id: "d", text: "Earlier melt always increases snowpack the same week." },
    ],
    answerId: "a",
    explanation:
      "Bright surfaces reflect. When they vanish earlier, more heat is absorbed and the first warming can amplify.",
    objectiveCodes: ["STB-4.E", "STB-4.F"],
    difficulty: "medium",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "permafrost-feedback",
    lessonSlug: "ozone-greenhouse-and-climate-feedbacks",
    questionType: "multiple_choice",
    prompt:
      "Which process is a positive climate feedback the club should be able to name?",
    choices: [
      { id: "a", text: "A process that stores extra carbon and always cancels emissions the same year." },
      { id: "b", text: "Permafrost thaw that releases methane, which traps more heat and can thaw more ground." },
      { id: "c", text: "One cool foggy July in San Francisco." },
      { id: "d", text: "Buying a classroom cooler without changing gas use." },
    ],
    answerId: "b",
    explanation:
      "A positive feedback amplifies the first change. Methane from thaw is an amplifier. A single cool month is weather.",
    objectiveCodes: ["STB-4.F"],
    difficulty: "hard",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "cfc-and-stratospheric-ozone",
    lessonSlug: "ozone-greenhouse-and-climate-feedbacks",
    questionType: "multiple_choice",
    prompt:
      "Older coolants released chlorine-bearing chemicals that reached the stratosphere. What problem were those chemicals mainly tied to, and what kind of fix worked?",
    choices: [
      { id: "a", text: "Tropospheric smog on a Livermore inversion day, fixed by a HEPA filter." },
      { id: "b", text: "Stratospheric ozone loss, addressed by a global phaseout of the damaging chemicals." },
      { id: "c", text: "A local tree planting that rebuilds the ozone layer in one season." },
      { id: "d", text: "Acid rain on a granite lake, fixed by louder speakers." },
    ],
    answerId: "b",
    explanation:
      "Stratospheric ozone is a different layer and story from smog ozone. The repair was a phaseout, not a campus filter.",
    objectiveCodes: ["STB-4.A", "STB-4.B"],
    difficulty: "medium",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "corridor-beats-a-single-preserve",
    lessonSlug: "invasives-habitat-loss-and-club-response",
    questionType: "multiple_choice",
    prompt:
      "The watershed club can fund one fenced planter or a linked creek buffer, schoolyard patch, and park edge. Which better fights fragmentation?",
    choices: [
      { id: "a", text: "The isolated planter, because islands always hold more species." },
      { id: "b", text: "A connected corridor network, because movement and larger effective habitat beat a postage stamp." },
      { id: "c", text: "Neither, because habitat loss is not a biodiversity driver." },
      { id: "d", text: "Only a captive-breeding program with no wild place to return to." },
    ],
    answerId: "b",
    explanation:
      "Corridors and clustered habitat keep movement. A tiny unconnected preserve is an island with high local-extinction risk.",
    objectiveCodes: ["EIN-4.C"],
    difficulty: "easy",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
  {
    namespace: AP_ENVSCI_NAMESPACE,
    slug: "cap-and-trade-is-not-a-ban",
    lessonSlug: "ozone-greenhouse-and-climate-feedbacks",
    questionType: "multiple_choice",
    prompt:
      "A student claims any climate policy is a total ban on energy use. Which mitigation description is more accurate for a permit-and-limit system?",
    choices: [
      { id: "a", text: "A cap sets a declining total of allowed emissions; trade lets cheaper cuts happen first. It is not a ban on all fuel." },
      { id: "b", text: "Adaptation only: live with the change and never cut gases." },
      { id: "c", text: "A rule that ozone and carbon dioxide are the same molecule." },
      { id: "d", text: "A requirement to clear oaks so panels can erase every tradeoff." },
    ],
    answerId: "a",
    explanation:
      "Mitigation cuts gases. A cap-and-trade design limits the total and lets the market find cheaper reductions. It is not a classroom cooler and not a total energy ban.",
    objectiveCodes: ["STB-4.C"],
    difficulty: "hard",
    sourceBasis: AP_ENVSCI_SOURCE_BASIS,
    version: 1,
  },
];

export default questions;
