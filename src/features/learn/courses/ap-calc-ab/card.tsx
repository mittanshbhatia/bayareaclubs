/**
 * Original geometric course art for AP Calculus AB.
 * 640×400 (16:10). Design tokens only. source_basis: ORIGINAL.
 */

export function CourseCardArt() {
  return (
    <svg
      viewBox="0 0 640 400"
      width="640"
      height="400"
      role="img"
      aria-label="Geometric art for AP Calculus AB: a curve, a tangent line, and stacked area rectangles"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="640" height="400" fill="color-mix(in srgb, var(--primary) 8%, transparent)" />
      <g stroke="color-mix(in srgb, var(--accent) 22%, transparent)" strokeWidth="1" fill="none">
        <line x1="40" y1="80" x2="600" y2="80" />
        <line x1="40" y1="160" x2="600" y2="160" />
        <line x1="40" y1="240" x2="600" y2="240" />
        <line x1="40" y1="320" x2="600" y2="320" />
        <line x1="120" y1="40" x2="120" y2="360" />
        <line x1="240" y1="40" x2="240" y2="360" />
        <line x1="360" y1="40" x2="360" y2="360" />
        <line x1="480" y1="40" x2="480" y2="360" />
      </g>
      <rect
        x="168"
        y="248"
        width="48"
        height="72"
        fill="color-mix(in srgb, var(--course-accent) 28%, transparent)"
      />
      <rect
        x="224"
        y="204"
        width="48"
        height="116"
        fill="color-mix(in srgb, var(--course-accent) 36%, transparent)"
      />
      <rect
        x="280"
        y="176"
        width="48"
        height="144"
        fill="color-mix(in srgb, var(--primary) 30%, transparent)"
      />
      <rect
        x="336"
        y="164"
        width="48"
        height="156"
        fill="color-mix(in srgb, var(--primary) 38%, transparent)"
      />
      <path
        d="M72 292 C 160 286, 200 210, 280 188 C 360 166, 420 150, 520 96"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="220"
        y1="248"
        x2="400"
        y2="148"
        stroke="var(--accent)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="312" cy="196" r="8" fill="var(--course-accent)" />
      <circle cx="72" cy="292" r="5" fill="var(--primary)" />
      <circle cx="520" cy="96" r="5" fill="var(--accent)" />
    </svg>
  );
}

export default CourseCardArt;
