/**
 * Original geometric course hero. 640×400 (16:10).
 * Uses design tokens only. No photos or third-party art.
 */

export function ApPsychCard() {
  return (
    <svg
      viewBox="0 0 640 400"
      width="640"
      height="400"
      role="img"
      aria-labelledby="ap-psych-card-title ap-psych-card-desc"
    >
      <title id="ap-psych-card-title">AP Psychology</title>
      <desc id="ap-psych-card-desc">
        Geometric nodes and arcs suggesting linked biological, cognitive, and
        social systems.
      </desc>
      <rect width="640" height="400" fill="var(--learning-surface, #0f172a)" />
      <rect
        x="24"
        y="24"
        width="592"
        height="352"
        fill="none"
        stroke="var(--course-accent)"
        strokeWidth="2"
        opacity="0.35"
      />
      <circle
        cx="200"
        cy="200"
        r="118"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="3"
        opacity="0.55"
      />
      <circle
        cx="320"
        cy="168"
        r="96"
        fill="none"
        stroke="var(--course-accent)"
        strokeWidth="3"
        opacity="0.7"
      />
      <circle
        cx="430"
        cy="220"
        r="108"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3"
        opacity="0.55"
      />
      <circle cx="200" cy="200" r="10" fill="var(--primary)" />
      <circle cx="320" cy="168" r="10" fill="var(--course-accent)" />
      <circle cx="430" cy="220" r="10" fill="var(--accent)" />
      <circle cx="268" cy="250" r="7" fill="var(--primary)" opacity="0.85" />
      <circle cx="372" cy="132" r="7" fill="var(--accent)" opacity="0.85" />
      <line
        x1="200"
        y1="200"
        x2="320"
        y2="168"
        stroke="var(--primary)"
        strokeWidth="2"
        opacity="0.45"
      />
      <line
        x1="320"
        y1="168"
        x2="430"
        y2="220"
        stroke="var(--course-accent)"
        strokeWidth="2"
        opacity="0.45"
      />
      <line
        x1="200"
        y1="200"
        x2="268"
        y2="250"
        stroke="var(--accent)"
        strokeWidth="2"
        opacity="0.4"
      />
      <polyline
        points="80,320 140,280 200,300 260,240 320,260 380,210 440,230 500,180 560,200"
        fill="none"
        stroke="var(--course-accent)"
        strokeWidth="2.5"
        opacity="0.5"
      />
    </svg>
  );
}

export default ApPsychCard;
