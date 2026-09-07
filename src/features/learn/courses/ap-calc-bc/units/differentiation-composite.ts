import {
  AP_CALC_BC_NAMESPACE,
  AP_CALC_BC_SOURCE_BASIS,
} from "@/features/learn/courses/ap-calc-bc/manifest";
import type { ApCalcBcLesson } from "@/features/learn/courses/ap-calc-bc/lesson-types";

export const differentiationCompositeLessons: readonly ApCalcBcLesson[] = [
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "differentiation-composite",
    slug: "chain-rule-for-nested-motions",
    title: "Chain rule for nested motions",
    position: 1,
    estimatedMinutes: 22,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["FUN-3.A", "FUN-3.B"],
    bodyPlain: [
      "Nested functions change in layers. If a hiking club records elevation as a function of distance, and distance as a function of time, the elevation-versus-time rate is the product of the two layer rates. That product is the chain rule: differentiate the outer function, leave the inner input in place, then multiply by the inner derivative. Forgetting the inner factor is the most common BC algebra error and it wrecks later polar and parametric work, where every rate is already a composition.",
      "Write the layers before you differentiate. For sin of 3t, the outer layer is sine and the inner layer is 3t. The derivative is cosine of 3t, times 3. For e to the power x-squared, the outer layer is the exponential and the inner layer is x-squared, so the derivative is e to the x-squared times 2x. A composition with three layers gets three factors. Check by expanding a simple polynomial composition: (2x+1) cubed differentiates the same way whether you expand first or use the chain rule.",
      "The chain rule also explains related rates before they are named. If a quantity depends on a radius, and the radius depends on time, the time-rate is the radius-rate times d(quantity)/d(radius). Unit 4 will stage full related-rate stories; this unit is where the multiplication itself must become automatic. Practice until you can point to each factor and name which layer produced it.",
      "Parametric and polar units will ask for dy/dx as (dy/dt) divided by (dx/dt). That quotient is two chain-rule rates compared. If you cannot see the chain rule in a single-variable composition, those later quotients will feel like a new subject. They are not. They are the same layered rates with a parameter playing the role of the inner input.",
    ].join("\n\n"),
  },
  {
    namespace: AP_CALC_BC_NAMESPACE,
    unitSlug: "differentiation-composite",
    slug: "implicit-curves-and-inverse-rates",
    title: "Implicit curves and inverse rates",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_CALC_BC_SOURCE_BASIS,
    objectiveCodes: ["FUN-3.B", "FUN-3.C", "FUN-3.D"],
    bodyPlain: [
      "An implicit relation, such as x-squared plus y-squared equals 25, does not introduce y as a single formula in x. Differentiating both sides with respect to x still works if every y is treated as a function of x. The derivative of y-squared is 2y times y-prime. After differentiating, collect y-prime terms and solve. At a point on the circle, that algebra prints the tangent slope without ever writing the two explicit semicircle formulas.",
      "Implicit differentiation is the right tool when a club constraint ties two variables together: a rope length, a circular track, a budget identity. Differentiate the constraint, then substitute the known rates or the known point. If a problem gives a point that does not satisfy the original relation, stop. The derivative formula is only meaningful on the curve.",
      "Inverse functions swap inputs and outputs, so their derivatives are reciprocal slopes. If f is invertible and differentiable with nonzero derivative at a, then the inverse derivative at f(a) is 1 over f-prime of a. Graphically that is the reflection of the tangent across the line y equals x. Logarithmic differentiation, including the derivative of the natural log, is the inverse story for the exponential. Inverse trigonometric derivatives follow the same reciprocal-slope idea after a triangle or identity cleans the remaining cosine or cosine-squared term.",
      "BC later needs inverse rates for logs inside series and for arctangent antiderivatives. Treat the inverse derivative as a computed slope, not as a memorized sticker that never connects to the original function. When you can recover d/dx of arcsin x from the identity y equals arcsin x implies sin y equals x, you are ready to invent the next inverse derivative instead of waiting for a table.",
    ].join("\n\n"),
  },
];
