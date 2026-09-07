/**
 * Unit 3 lessons. source_basis: ORIGINAL. Public CED codes only.
 */

import {
  AP_CALC_AB_NAMESPACE,
  AP_CALC_AB_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-ab/manifest";
import type { ApCalcAbLesson } from "@/features/learn/courses/ap-calc-ab/units/limits-and-continuity";

export const lessons: readonly ApCalcAbLesson[] = [
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "chain-rule-in-layers",
    title: "Chain rule in layers",
    unitSlug: "differentiation-composite",
    position: 1,
    estimatedMinutes: 23,
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
    objectiveCodes: ["FUN-3.B", "FUN-3.C"],
    bodyPlain: [
      "A composition is a function inside a function. The theater club fades a lamp with brightness B = sin(3t), where the 3t is an inner clock. You cannot differentiate this with the sine rule alone, because the input to sine is not the bare variable t. The chain rule says: differentiate the outside, leave the inside in place, then multiply by the derivative of the inside.",
      "In symbols, if y = f(g(x)), then dy/dx = f'(g(x)) * g'(x). For B = sin(3t), the outside derivative is cosine, the inside stays 3t, and the inside derivative is 3, so B'(t) = 3 cos(3t). The extra factor 3 is the inner rate. Dropping it is the most common chain-rule error in a homework set.",
      "Nested functions can have more than two layers. A temperature model T = sqrt(1 + 4t^2) is a square root around a quadratic. Differentiate the square root first, keep 1 + 4t^2 inside, then multiply by 8t. Work from the outside in, and write each factor before you simplify. Simplifying too early hides a missing piece.",
      "The chain rule also explains why a table of an outer function and a table of an inner function can still produce a derivative at one point. If you know g(2) and g'(2) and you know f' at g(2), you can compute (f compose g)' at 2 without a closed formula for either function. Club sensors often give exactly that: a reading and a local rate, not a pretty equation.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CALC_AB_NAMESPACE,
    slug: "implicit-and-inverse-derivatives",
    title: "Implicit and inverse derivatives",
    unitSlug: "differentiation-composite",
    position: 2,
    estimatedMinutes: 23,
    sourceBasis: AP_CALC_AB_SOURCE_BASIS,
    objectiveCodes: ["FUN-3.D", "FUN-3.E", "FUN-3.F"],
    bodyPlain: [
      "Some relations do not arrive solved for y. The circle x^2 + y^2 = 25 is a relation between x and y, not a single function y = f(x). Implicit differentiation treats y as a differentiable function of x anyway. Differentiate both sides with respect to x, and every y term picks up a dy/dx by the chain rule. Then solve the resulting equation for dy/dx.",
      "On x^2 + y^2 = 25, the differentiated equation is 2x + 2y y' = 0, so y' = -x/y wherever y is not zero. The slope depends on the point. At (3, 4) the tangent slope is -3/4. At (3, -4) it is 3/4. One equation, two local functions, two slopes. That is why you substitute the point after you differentiate, not before.",
      "Inverse functions reverse input and output. If f and g are inverses, their graphs reflect across y = x, and their derivatives at matching points are reciprocals: g'(a) = 1 / f'(b) when f(b) = a and f'(b) is not zero. The bike club's elevation function along Skyline can be inverted on a stretch where elevation keeps rising. The inverse tells you position from elevation, and its derivative is the reciprocal of the original slope at the matching point.",
      "The same idea produces the derivatives of inverse trigonometric and logarithmic functions once you know the derivatives of the originals. You do not memorize a new definition each time. You differentiate the identity f(g(x)) = x with the chain rule and solve for g'(x). Implicit and inverse work are the same habit: differentiate a relationship you already trust, then isolate the rate you want.",
    ].join("\n\n"),
  },
];
