/**
 * Original geometric course hero. viewBox 640×400 (16:10).
 * Uses design tokens only. No photos or third-party art.
 */

export function CourseCardArt() {
  return (
    <svg
      viewBox="0 0 640 400"
      width="640"
      height="400"
      role="img"
      aria-label="Geometric illustration of a smooth curve, tangent, polar petals, vector arrows, and nested remainder rings for AP Calculus BC"
    >
      <rect
        x="0"
        y="0"
        width="640"
        height="400"
        fill="color-mix(in srgb, var(--course-accent) 8%, transparent)"
      />
      <g
        stroke="color-mix(in srgb, var(--primary) 18%, transparent)"
        strokeWidth="1"
        fill="none"
      >
        <line x1="40" y1="80" x2="600" y2="80" />
        <line x1="40" y1="160" x2="600" y2="160" />
        <line x1="40" y1="240" x2="600" y2="240" />
        <line x1="40" y1="320" x2="600" y2="320" />
        <line x1="120" y1="40" x2="120" y2="360" />
        <line x1="240" y1="40" x2="240" y2="360" />
        <line x1="360" y1="40" x2="360" y2="360" />
        <line x1="480" y1="40" x2="480" y2="360" />
      </g>
      <path
        d="M48 292 C 120 300, 160 210, 220 188 C 290 160, 330 248, 400 176 C 460 120, 520 96, 596 84"
        fill="none"
        stroke="var(--course-accent)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="330"
        y1="248"
        x2="470"
        y2="132"
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="400" cy="176" r="6" fill="var(--primary)" />
      <g
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        opacity="0.85"
      >
        <ellipse cx="168" cy="128" rx="46" ry="22" transform="rotate(-18 168 128)" />
        <ellipse cx="168" cy="128" rx="46" ry="22" transform="rotate(42 168 128)" />
        <ellipse cx="168" cy="128" rx="46" ry="22" transform="rotate(102 168 128)" />
      </g>
      <circle
        cx="168"
        cy="128"
        r="5"
        fill="var(--accent)"
      />
      <g
        fill="none"
        stroke="var(--course-accent)"
        strokeWidth="2"
        opacity="0.7"
      >
        <circle cx="524" cy="268" r="28" />
        <circle cx="524" cy="268" r="44" />
        <circle cx="524" cy="268" r="62" />
      </g>
      <path
        d="M524 268 L 586 236"
        stroke="var(--primary)"
        strokeWidth="3"
        markerEnd="url(#ap-calc-bc-arrow)"
      />
      <path
        d="M524 268 L 560 318"
        stroke="var(--accent)"
        strokeWidth="3"
        markerEnd="url(#ap-calc-bc-arrow)"
      />
      <defs>
        <marker
          id="ap-calc-bc-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
        >
          <path d="M0 0 L8 4 L0 8 Z" fill="var(--primary)" />
        </marker>
      </defs>
    </svg>
  );
}

export default CourseCardArt;
