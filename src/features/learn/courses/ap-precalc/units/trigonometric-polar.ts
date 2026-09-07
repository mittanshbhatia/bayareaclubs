/**
 * Unit 3 lessons. Original BayAreaClubs prose. source_basis: ORIGINAL.
 */

import {
  AP_PRECALC_NAMESPACE,
  AP_PRECALC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-precalc/manifest";

export const trigonometricPolarLessons = [
  {
    namespace: AP_PRECALC_NAMESPACE,
    unitSlug: "trigonometric-polar",
    slug: "periodic-sine-and-transforms",
    title: "Periodic sine models and transformations",
    position: 1,
    estimatedMinutes: 24,
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    objectiveCodes: ["3.1.A", "3.2.A", "3.3.A", "3.4.A", "3.5.A", "3.6.A"],
    bodyPlain: [
      "A process is periodic when its outputs repeat after a fixed horizontal distance called the period. Tides, daylight length, and a spinning robot arm all earn that description when one cycle is a trustworthy copy of the next. Sine and cosine are the basic periodic functions on the unit circle: cosine is the x-coordinate and sine is the y-coordinate of the point reached by an angle from the positive x-axis. Tangent is the ratio sine over cosine wherever cosine is not zero.",
      "The parent graph of y = sin(x) has amplitude 1, period 2π, and midline y = 0. The parent graph of y = cos(x) is the same wave shifted so a peak sits at x = 0. Those two facts let you read a transformed model A sin(B(x − C)) + D without guessing. |A| is the amplitude, the period is 2π / |B|, C is a horizontal shift, and D is the midline. Each of those four numbers should match a sentence in the club story.",
      "Alameda Sailing Club records water height against hours. A model h(t) = 3 + 2 sin((2π / 12.4) t) says the midline is 3 feet, the water swings 2 feet above and below that midline, and one full cycle lasts 12.4 hours. The coefficient 2π / 12.4 is not decoration; it is the B-value that forces the period to match the tide table. Changing B without changing the story breaks the model even if the curve still looks wavy.",
      "A phase shift moves the first convenient peak or zero. The function 3 + 2 cos(x − π/2) has the same amplitude and midline as 3 + 2 cos(x), but the cosine peak slides right by π/2. In a data set that shift is how you honor “high tide was not at t = 0.” Students should name the shift from the equation and then check it against a labeled point, not treat C as a free cosmetic.",
      "When you build a sinusoidal model from a table, list midline, amplitude, period, and a phase anchor before you write the formula. If two of those four disagree with the measurements, rewrite the formula. A sine wave that misses the club’s high-water mark is not “close enough” for a planning decision about when to launch.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    unitSlug: "trigonometric-polar",
    slug: "polar-graphs-and-polar-rates",
    title: "Polar graphs and polar rates",
    position: 2,
    estimatedMinutes: 24,
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    objectiveCodes: ["3.13.A", "3.14.A", "3.15.A"],
    bodyPlain: [
      "Polar coordinates name a point by a directed distance r from the origin and an angle θ from the positive x-axis. The same location can have more than one polar name, because adding 2π to θ walks you around to the same ray, and a negative r points opposite the angle. That flexibility is useful, but it means you must say which pair you are using before you compare two points.",
      "Conversion to rectangular coordinates is a right-triangle rewrite: x = r cos θ and y = r sin θ. The polar point (2, π/3) becomes x = 2 · 1/2 = 1 and y = 2 · √3 / 2 = √3. Going the other way, r^2 = x^2 + y^2 and tan θ = y/x, with the quadrant chosen from the signs of x and y, not from a calculator output alone.",
      "Peninsula Robotics uses a lidar sweep that reports distance versus heading. Those pairs are already polar data. Plotting r as a function of θ can show a circle, a cardioid-like pinch, or a wall that only appears in one sector of the room. A constant r is a circle centered at the origin. A rule such as r = a cos θ is a circle that passes through the origin. The equation decides the shape; the club’s hallway decides whether that shape is a useful model.",
      "Rates of change still exist in polar form. If r increases as θ increases, the tracing point is moving farther from the origin while it turns. An average rate (r(θ2) − r(θ1)) / (θ2 − θ1) tells you how many distance units you gain per radian on that interval. A large positive rate on a short interval is a spike outward; a rate near zero means the path is hugging a circular arc.",
      "When you report a polar graph, give a θ-interval, note any negative-r rays, and convert at least one landmark point to rectangular form so a teammate using (x, y) can check the same location. Polar language is another coordinate system, not a different geometry of the room.",
    ].join("\n\n"),
  },
] as const;
