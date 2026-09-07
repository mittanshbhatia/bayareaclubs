/**
 * Original 640 by 400 geometric hero for AP Environmental Science.
 * Uses design tokens only. No photos or third-party art.
 */

export function ApEnvsciCourseCard() {
  return (
    <svg
      viewBox="0 0 640 400"
      width="640"
      height="400"
      role="img"
      aria-label="Geometric wetlands, hills, and air layers for AP Environmental Science"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="640" height="400" fill="var(--course-accent)" opacity="0.08" />
      <rect x="0" y="0" width="640" height="118" fill="var(--accent)" opacity="0.16" />
      <polygon
        points="0,168 96,98 188,148 286,72 392,132 486,64 640,128 640,220 0,220"
        fill="var(--primary)"
        opacity="0.22"
      />
      <polygon
        points="0,214 140,154 248,196 360,140 470,188 640,150 640,268 0,268"
        fill="var(--course-accent)"
        opacity="0.28"
      />
      <rect x="0" y="248" width="640" height="152" fill="var(--accent)" opacity="0.2" />
      <path
        d="M0 292 C 80 268, 140 312, 220 296 S 360 264, 430 292 S 560 320, 640 288 L 640 400 L 0 400 Z"
        fill="var(--primary)"
        opacity="0.34"
      />
      <circle cx="118" cy="86" r="28" fill="var(--accent)" opacity="0.45" />
      <rect x="72" y="318" width="86" height="10" fill="var(--primary)" opacity="0.55" />
      <rect x="178" y="330" width="54" height="8" fill="var(--course-accent)" opacity="0.7" />
      <rect x="478" y="304" width="72" height="8" fill="var(--primary)" opacity="0.5" />
      <rect x="562" y="318" width="40" height="8" fill="var(--accent)" opacity="0.65" />
    </svg>
  );
}

export default ApEnvsciCourseCard;
