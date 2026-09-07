/**
 * Original geometric course card. 640×400, 16:10.
 * Uses design tokens only. No photos or third-party art.
 */

type ApPrecalcCourseCardProps = {
  className?: string;
};

export function ApPrecalcCourseCard({ className }: ApPrecalcCourseCardProps) {
  return (
    <svg
      viewBox="0 0 640 400"
      role="img"
      className={className}
      aria-labelledby="ap-precalc-card-title ap-precalc-card-desc"
    >
      <title id="ap-precalc-card-title">AP Precalculus</title>
      <desc id="ap-precalc-card-desc">
        Geometric card with a coordinate grid, a cubic curve, a sine wave, polar
        arcs, and two vectors.
      </desc>
      <rect width="640" height="400" fill="var(--course-accent)" opacity="0.12" />
      <rect
        x="24"
        y="24"
        width="592"
        height="352"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
        opacity="0.35"
      />
      {Array.from({ length: 9 }, (_, index) => {
        const x = 80 + index * 56;
        return (
          <line
            key={`v-${x}`}
            x1={x}
            y1="48"
            x2={x}
            y2="352"
            stroke="var(--primary)"
            strokeWidth="1"
            opacity="0.16"
          />
        );
      })}
      {Array.from({ length: 6 }, (_, index) => {
        const y = 64 + index * 48;
        return (
          <line
            key={`h-${y}`}
            x1="64"
            y1={y}
            x2="576"
            y2={y}
            stroke="var(--primary)"
            strokeWidth="1"
            opacity="0.16"
          />
        );
      })}
      <line
        x1="64"
        y1="208"
        x2="576"
        y2="208"
        stroke="var(--primary)"
        strokeWidth="2"
        opacity="0.55"
      />
      <line
        x1="200"
        y1="48"
        x2="200"
        y2="352"
        stroke="var(--primary)"
        strokeWidth="2"
        opacity="0.55"
      />
      <path
        d="M72 268 C 140 40, 220 360, 300 120 S 460 40, 560 300"
        fill="none"
        stroke="var(--course-accent)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M80 208 C 140 128, 180 128, 240 208 S 340 288, 400 208 500 128, 560 208"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle
        cx="200"
        cy="208"
        r="72"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
        opacity="0.45"
      />
      <circle
        cx="200"
        cy="208"
        r="40"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        opacity="0.7"
      />
      <path
        d="M200 208 L 286 164"
        stroke="var(--course-accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <polygon points="286,164 268,158 276,176" fill="var(--course-accent)" />
      <path
        d="M200 208 L 248 268"
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <polygon points="248,268 230,256 250,250" fill="var(--primary)" />
      <g transform="translate(488 56)">
        <rect
          width="28"
          height="28"
          fill="var(--course-accent)"
          opacity="0.35"
          stroke="var(--primary)"
          strokeWidth="1.5"
        />
        <rect
          x="32"
          width="28"
          height="28"
          fill="var(--accent)"
          opacity="0.28"
          stroke="var(--primary)"
          strokeWidth="1.5"
        />
        <rect
          y="32"
          width="28"
          height="28"
          fill="var(--accent)"
          opacity="0.28"
          stroke="var(--primary)"
          strokeWidth="1.5"
        />
        <rect
          x="32"
          y="32"
          width="28"
          height="28"
          fill="var(--course-accent)"
          opacity="0.35"
          stroke="var(--primary)"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

export default ApPrecalcCourseCard;
