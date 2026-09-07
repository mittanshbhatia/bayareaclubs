/**
 * Original geometric-optics lessons. Public CED codes only. source_basis: ORIGINAL.
 */

import {
  AP_PHYSICS_2_NAMESPACE,
  AP_PHYSICS_2_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-2/manifest";
import type { ApPhysics2Lesson } from "@/features/learn/courses/ap-physics-2/units/types";

export const geometricOpticsLessons: readonly ApPhysics2Lesson[] = [
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    unitSlug: "geometric-optics",
    slug: "reflection-and-mirror-images",
    title: "Reflection and mirror images",
    position: 9,
    estimatedMinutes: 24,
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    objectiveCodes: ["13.1.A", "13.2.A"],
    bodyPlain: [
      "A light ray hitting a smooth mirror reflects so the angle of incidence equals the angle of reflection, both measured from the normal. That single rule, plus straight-line travel in air, is enough to locate images. The photography club uses it when they angle a bounce card: the card is a rough reflector that spreads light, while a dressing-room mirror is a specular reflector that keeps the angles tight enough to form a sharp image.",
      "A plane mirror forms a virtual image as far behind the glass as the object is in front, with the same height, and reversed front to back. You cannot put a screen on that image, but your eye traces the reflected rays backward and the brain reports an object behind the wall. Two plane mirrors at a right angle make extra images because each image of one mirror can act as an object for the other. Count the rays, do not guess the count.",
      "A concave spherical mirror converges parallel rays toward a focal point. The focal length is half the radius of curvature for a small-angle paraxial model. An object farther than the center of curvature makes a real, inverted, reduced image between C and F. Move the object to C and the image sits at C, inverted and the same size. Between C and F the image is real, inverted, and enlarged. Inside F there is no real image: the outgoing rays diverge, and the virtual image is upright and enlarged, which is the makeup-mirror case.",
      "A convex mirror diverges parallel rays. Its focal point is virtual, behind the glass. The image of a real object is always virtual, upright, and reduced, which is why a hallway safety mirror shows a wide field. The mirror equation 1/f = 1/d_o + 1/d_i and the magnification m = -d_i / d_o handle all of these if you keep a sign convention. In the common convention, f is positive for concave and negative for convex, and a negative d_i means a virtual image. Draw the principal rays first. The numbers should match the sketch, not replace it.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PHYSICS_2_NAMESPACE,
    unitSlug: "geometric-optics",
    slug: "refraction-and-lens-images",
    title: "Refraction and lens images",
    position: 10,
    estimatedMinutes: 24,
    sourceBasis: AP_PHYSICS_2_SOURCE_BASIS,
    objectiveCodes: ["13.3.A", "13.4.A"],
    bodyPlain: [
      "Light slows when it enters glass or water. The index of refraction n is c divided by the speed in the material. Snell's law, n1 sinθ1 = n2 sinθ2, steers the ray. Entering a higher-n material bends the ray toward the normal. Leaving into a lower-n material bends it away. If the exit angle would need to exceed 90 degrees, the ray totally internally reflects. That is the trick inside a plastic light-pipe used on a theater set: the beam stays trapped until it reaches the end.",
      "Apparent depth is a refraction effect, not a mystery. A coin on the floor of a club aquarium looks closer than it is because rays leaving the water bend away from the normal at the surface, and your eye traces them backward as if they came from a shallower point. The same bending makes a straw look kinked at the water line. Measure angles from the normal, not from the surface, or Snell's law will look broken when it is not.",
      "A converging lens is two convex surfaces that refract rays toward a real focal point. A diverging lens spreads them so they appear to come from a virtual focus. The thin-lens equation has the same algebraic shape as the mirror equation. An object beyond 2f of a converging lens makes a real, inverted, reduced image, which is the usual projector-to-screen geometry for a club film night. Place the object at 2f and the image is at 2f, same size. Between 2f and f the image is real and enlarged. Inside f you get a virtual, upright, enlarged image: a magnifying glass.",
      "Ray diagrams need three standard rays: through the center (undeviated), parallel to the axis then through the far focal point, and through the near focal point then out parallel. Where the outgoing rays meet, or where they meet when extended backward, is the image. Chromatic blur and thick-lens errors exist, but AP Physics 2 stays with the thin-lens model. If a calculated image distance is negative, the image is virtual. If magnification is negative, the image is inverted. Say those sentences out loud while you label the sketch so the signs stay attached to meaning.",
    ].join("\n\n"),
  },
];
