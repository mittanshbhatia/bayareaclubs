/**
 * Unit 4 lessons. Original BayAreaClubs prose. source_basis: ORIGINAL.
 * Unit 4 is optional on the AP exam; these lessons still ship.
 */

import {
  AP_PRECALC_NAMESPACE,
  AP_PRECALC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-precalc/manifest";

export const parametricVectorsMatricesLessons = [
  {
    namespace: AP_PRECALC_NAMESPACE,
    unitSlug: "parametric-vectors-matrices",
    slug: "parametric-motion-in-the-plane",
    title: "Parametric motion in the plane",
    position: 1,
    estimatedMinutes: 24,
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    objectiveCodes: ["4.1.A", "4.2.A", "4.3.A", "4.4.A"],
    bodyPlain: [
      "A parametric description uses one input, often called t, to produce two outputs at once: x(t) and y(t). The pair (x(t), y(t)) is a point in the plane, and as t runs the point traces a path. That is a better language than y = f(x) when a drone flies over a courtyard and later retraces x-values, or when time—not the x-coordinate—is the natural clock.",
      "Mission Drone Club might send a craft along x(t) = 2t and y(t) = t + 1, with t in seconds and distances in meters from the northwest bench. At t = 3 the craft is at (6, 4). Eliminating t gives y = x/2 + 1, a line, but the parametric form also says when the craft occupies each point. Two teams can fly the same line at different speeds by changing how t is scaled.",
      "Average rates of change still apply, now one per coordinate. From t = 1 to t = 3, Δx/Δt and Δy/Δt describe the average eastward and northward speeds. Those two numbers form a direction for the secant of the path. If the club needs a tighter heading, it shortens the time interval. A circle can be written x(t) = r cos t, y(t) = r sin t; the path is circular even though neither coordinate is a circular formula by itself.",
      "Lines and circles are the parametric workhorses in this unit. A line through (x0, y0) with direction (a, b) is x(t) = x0 + a t, y(t) = y0 + b t. A circle of radius r centered at the origin is the cosine-sine pair above. Changing the interval of t can trace only an arc. The same geometric curve can therefore represent a full lap or a single corner approach, depending on the t-domain the club chooses.",
      "When you report a parametric model, give the functions, the units of t, and the interval. Saying “it is a circle” without the parameterization hides speed and starting point. Saying “x = 2t, y = t + 1 for 0 ≤ t ≤ 5” is a complete flight plan a second pilot can replay.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PRECALC_NAMESPACE,
    unitSlug: "parametric-vectors-matrices",
    slug: "vectors-and-matrix-functions",
    title: "Vectors and matrices as functions",
    position: 2,
    estimatedMinutes: 24,
    sourceBasis: AP_PRECALC_SOURCE_BASIS,
    objectiveCodes: ["4.8.A", "4.10.A", "4.11.A", "4.12.A", "4.13.A"],
    bodyPlain: [
      "A vector in the plane is an arrow with a length and a direction, written in components as (a, b) or as a column. The magnitude is √(a^2 + b^2). The vector (3, 4) has magnitude 5. Adding two vectors adds components; geometrically you place the tail of the second at the tip of the first. Peninsula Theater Club uses that sum when one lighting move is “3 meters stage-right and 4 meters upstage” followed by another shift.",
      "A 2-by-2 matrix is a function that takes a vector and returns a vector. If M = [[2, 0], [0, 3]] and v = (1, 1), then M v = (2, 3). The first row mixes the inputs into the first output; the second row mixes them into the second output. Scaling, stretching, reflecting, and rotating are all matrix actions of this kind. The matrix is the rule; the vector is the point or arrow being rewritten.",
      "Linear transformations keep the origin fixed and send lines through the origin to lines through the origin. That is why a graphics club can rotate a logo by multiplying every corner by the same matrix and the shape stays a linear image of the original. If two different input vectors land on the same output, the transformation has collapsed a direction and cannot be undone.",
      "The determinant of [[a, b], [c, d]] is ad − bc. If the determinant is not zero, the matrix is invertible: there is a partner matrix that undoes the mapping. For [[2, 1], [4, 3]] the determinant is 6 − 4 = 2, so a unique inverse exists. A determinant of zero means the transformation squishes the plane onto a line or a point, and no inverse function can restore the lost direction.",
      "Treat a matrix as a machine with a contract. Name the input vector, compute the output, and say whether the machine is reversible. A club that stretches stage coordinates by different factors on each axis is using a diagonal matrix; a club that cannot recover the original mark after a transform has chosen a singular matrix. The arithmetic is short so that the meaning—function, inverse, collapse—stays in front.",
    ].join("\n\n"),
  },
] as const;
