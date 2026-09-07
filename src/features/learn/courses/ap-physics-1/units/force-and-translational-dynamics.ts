import {
  AP_PHYSICS_1_NAMESPACE,
  AP_PHYSICS_1_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-1/manifest";
import type { ApPhysics1Lesson } from "@/features/learn/courses/ap-physics-1/lesson-types";

export const forceAndTranslationalDynamicsLessons: readonly ApPhysics1Lesson[] = [
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    unitSlug: "force-and-translational-dynamics",
    slug: "forces-free-body-diagrams-and-newtons-laws",
    title: "Forces, free-body diagrams, and Newton's laws",
    position: 1,
    estimatedMinutes: 23,
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    objectiveCodes: ["2.1.A", "2.2.A", "2.3.A", "2.4.A", "2.5.A"],
    bodyPlain: [
      "A force is a push or pull on a chosen system by something in the surroundings. Weight, tension, the normal force, friction, and a spring force are common contact or field forces in this course. The system is whatever you draw a dashed boundary around. A cart-plus-fan on a hallway track is one system. The cart alone is another. Center of mass is the average position of the system's mass. For a uniform meter stick, it sits at the midpoint. External forces change the motion of that center of mass. Internal forces between pieces of the same system cancel in pairs and do not accelerate the center of mass.",
      "A free-body diagram shows one system as a dot or simple outline and draws every external force as an arrow from that system. Do not draw velocity on a free-body diagram. Do not draw a net-force arrow as if it were a separate extra push. After the arrows are labeled, choose axes, resolve any tilted forces into components, and write Newton's second law for each axis: F_net,x = m a_x and F_net,y = m a_y. Algebra, not a new law, does the rest.",
      "Newton's third law is about pairs of forces on two different objects. If the floor pushes up on a backpack with 40 N, the backpack pushes down on the floor with 40 N. Those two forces never appear on the same free-body diagram, because they act on different objects. They also do not cancel each other for the backpack's motion. The forces that cancel, if any, are different forces that happen to have equal size on the same object.",
      "Newton's first law is the special case of the second law when net force is zero: the velocity stays constant, which includes remaining at rest. A club crate sliding at steady speed on a long table still has forces on it. Those forces add to zero. A crate at rest on a table has weight and a normal force that add to zero. Zero net force is not the same as zero forces.",
      "Newton's second law says net force equals mass times acceleration of the center of mass. Doubling the net force doubles the acceleration if mass is unchanged. Doubling the mass halves the acceleration if the net force is unchanged. A hallway experiment that hangs a 0.20 kg cart from a string over a pulley, with a 0.050 kg hanging mass, has a system mass of 0.25 kg if both objects accelerate together. The net force on that two-object system is the hanging weight, so a = (0.050)(9.8) / 0.25. Treating only the cart as the system requires including the string tension explicitly.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    unitSlug: "force-and-translational-dynamics",
    slug: "friction-springs-and-circular-motion",
    title: "Friction, springs, and circular motion",
    position: 2,
    estimatedMinutes: 23,
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    objectiveCodes: ["2.6.A", "2.7.A", "2.8.A", "2.9.A"],
    bodyPlain: [
      "Near Earth's surface, gravitational force on an object of mass m is mg downward, with g = 9.8 N/kg, which has the same SI units as m/s^2. For two point masses the more general size is G m1 m2 / r^2, directed along the line joining them. In this algebra-based course you use that inverse-square size when the problem names two separated masses. You do not integrate a field. Weight on a scale in an elevator is the normal force, not mg, whenever the elevator accelerates.",
      "Kinetic friction has size μ_k N and points opposite the sliding velocity. Static friction can take any size up to μ_s N and points in whatever direction prevents slipping. A crate of weight 80 N on a level floor with μ_s = 0.40 will not start to slide until a horizontal pull exceeds 32 N. A smaller pull is balanced by static friction of that same smaller size. Once sliding, if μ_k = 0.30, kinetic friction is 24 N, which is not the same number as the maximum static value.",
      "An ideal spring pushes or pulls along its length with size k |x| and direction toward the unstretched length. In vector form along a chosen axis, F_s = -k x, where x is the displacement from that unstretched length. The minus sign is the restoring character. A club launcher with k = 250 N/m compressed 0.080 m exerts 20 N. The force is not constant while the spring expands, so you cannot treat that 20 N as the force throughout a later flight. Dynamics while in contact use the instantaneous x. Energy methods in the next unit handle the changing force more cleanly.",
      "Uniform circular motion has constant speed and constantly changing direction, so it has centripetal acceleration of size v^2 / r toward the center. There is no extra centrifugal force on the moving object in an inertial frame. The net force toward the center equals m v^2 / r. A 0.15 kg tethered mass swung in a horizontal circle of radius 0.80 m at 2.0 m/s needs 0.75 N of net inward force, supplied by the string's horizontal component. On a banked curve or a vertical loop, the free-body diagram changes; the centripetal requirement does not.",
      "A common club-lab mistake is to write F = m v^2 / r as if it were a new kind of force. It is a bookkeeping statement about the net force. Draw the real forces first. Then set their radial sum equal to m v^2 / r, with the toward-center direction chosen as positive for that axis.",
    ].join("\n\n"),
  },
];
