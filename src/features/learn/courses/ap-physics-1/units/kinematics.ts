import {
  AP_PHYSICS_1_NAMESPACE,
  AP_PHYSICS_1_SOURCE_BASIS,
} from "@/features/learn/courses/ap-physics-1/manifest";
import type { ApPhysics1Lesson } from "@/features/learn/courses/ap-physics-1/lesson-types";

export const kinematicsLessons: readonly ApPhysics1Lesson[] = [
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    unitSlug: "kinematics",
    slug: "scalars-vectors-and-one-d-motion",
    title: "Scalars, vectors, and one-dimensional motion",
    position: 1,
    estimatedMinutes: 22,
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    objectiveCodes: ["1.1.A", "1.2.A", "1.2.B"],
    bodyPlain: [
      "A scalar has size only. Distance, time, speed, and mass are scalars. A vector has size and direction. Displacement, velocity, and acceleration are vectors. On a hallway tape, a robotics cart that rolls 4 m toward the gym and then 1 m back toward the library has traveled 5 m of distance but only 3 m of displacement toward the gym. The sign you assign to the gym direction is a convention, not a law. Once the team picks a positive axis, every vector component on that axis must use the same convention.",
      "Average velocity is displacement divided by the time interval. Instantaneous velocity is the velocity at one clock reading. For motion with constant acceleration along a line, three algebra relations are enough for this course: v = v0 + a t, x = x0 + v0 t + (1/2) a t^2, and v^2 = v0^2 + 2 a (x - x0). You do not derive these with calculus here. You choose the equation that matches the knowns. If time is missing, the third relation is usually the cleanest path.",
      "Acceleration is the rate of change of velocity, not a measure of how fast something already is. A cart can have a large speed and zero acceleration if that speed is not changing. A cart rolling up a gentle ramp toward the gym, slowing from 2.0 m/s to rest, has acceleration pointed away from the gym even while its velocity still points toward the gym. Velocity and acceleration can point opposite ways. That opposite pairing is how an object slows down.",
      "A free-fall object near Earth's surface, with air resistance ignored, has a downward acceleration of magnitude g = 9.8 m/s^2. The value is the same on the way up and on the way down. At the top of a toss, the instantaneous velocity is zero for a purely vertical throw, but the acceleration is still g downward. Treating the top as a special force-free pause is a common error. Gravity does not switch off because the velocity happens to be zero for an instant.",
      "When a club records motion, it also chooses origin, axis, and units. A phone timer that starts after the cart has already moved 0.30 m will give a wrong x0 if the team pretends the origin is the start line. Write the knowns with signs before substituting. Algebra-based kinematics rewards careful bookkeeping more than clever new formulas.",
    ].join("\n\n"),
  },
  {
    namespace: AP_PHYSICS_1_NAMESPACE,
    unitSlug: "kinematics",
    slug: "graphs-relative-motion-and-projectiles",
    title: "Graphs, relative motion, and projectiles",
    position: 2,
    estimatedMinutes: 22,
    sourceBasis: AP_PHYSICS_1_SOURCE_BASIS,
    objectiveCodes: ["1.3.A", "1.4.A", "1.5.A"],
    bodyPlain: [
      "A position-versus-time graph stores displacement in its vertical change and velocity in its slope. A straight line means constant velocity. A curve that gets steeper means speed is increasing along that direction. A velocity-versus-time graph stores acceleration in its slope and displacement in the signed area between the curve and the time axis. If a cart's v-t graph is a straight line from +1.2 m/s to +0.4 m/s over 2.0 s, the acceleration is -0.40 m/s^2 and the displacement is the trapezoid area, not the endpoint speed.",
      "Relative velocity compares two objects that may both be moving. If a student walks 1.5 m/s toward the front of a Caltrain car that is itself moving 20 m/s north relative to the tracks, the student's velocity relative to the tracks is 21.5 m/s north. Subtracting vectors requires the same axis convention. In one dimension, relative velocity is just signed subtraction. In two dimensions, you add or subtract components. The ground, the train, and the walker are three reference frames. Physics equations work in any inertial frame; the numbers change when the frame changes.",
      "Projectile motion splits into two independent problems that share time. Horizontal acceleration is zero when air resistance is ignored, so horizontal velocity stays constant. Vertical motion is free fall with acceleration g downward. A water-balloon toss from a physics-club balcony with launch speed 8.0 m/s at 30 degrees above the horizontal has v_x = 8.0 cos 30° and v_y = 8.0 sin 30°. Time of flight comes from the vertical equation. Range then comes from that time multiplied by the unchanging v_x.",
      "The path is a parabola in the x-y plane, but you never need a special parabola formula if you keep the components separate. The speed at a later time is not the average of the launch components; it is the magnitude of the velocity vector at that time, sqrt(v_x^2 + v_y^2). At the highest point, v_y is zero and v_x is unchanged, so the velocity is horizontal, not zero, unless the launch was straight up.",
      "Club experiments on a field should name the frame. A balloon thrown from a moving wagon has a different ground range than the same throw from rest, even if the thrower's arm motion relative to the wagon is identical. Write every velocity with the phrase relative to before adding components.",
    ].join("\n\n"),
  },
];
