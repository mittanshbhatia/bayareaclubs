/**
 * Original geometric hero for AP Statistics.
 * viewBox 640×400 (16:10). No photos, no third-party art.
 */

export function ApStatsCard() {
  return (
    <svg
      viewBox="0 0 640 400"
      role="img"
      aria-label="Geometric illustration for AP Statistics: a scatter field, a fitted line, and histogram bars"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="640" height="400" fill="var(--learning-surface, #f6f4ef)" />
      <rect
        x="36"
        y="28"
        width="568"
        height="344"
        rx="8"
        fill="none"
        stroke="var(--course-accent)"
        strokeOpacity="0.28"
        strokeWidth="2"
      />
      <line
        x1="84"
        y1="320"
        x2="596"
        y2="320"
        stroke="var(--primary)"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      <line
        x1="84"
        y1="56"
        x2="84"
        y2="320"
        stroke="var(--primary)"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      <polyline
        points="84,56 596,56 596,320"
        fill="none"
        stroke="var(--course-accent)"
        strokeOpacity="0.12"
        strokeWidth="1"
      />
      <rect x="112" y="214" width="36" height="106" fill="var(--course-accent)" fillOpacity="0.22" />
      <rect x="160" y="168" width="36" height="152" fill="var(--course-accent)" fillOpacity="0.34" />
      <rect x="208" y="126" width="36" height="194" fill="var(--primary)" fillOpacity="0.28" />
      <rect x="256" y="152" width="36" height="168" fill="var(--accent)" fillOpacity="0.32" />
      <rect x="304" y="198" width="36" height="122" fill="var(--course-accent)" fillOpacity="0.2" />
      <line
        x1="360"
        y1="286"
        x2="572"
        y2="96"
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="388" cy="248" r="7" fill="var(--accent)" />
      <circle cx="424" cy="214" r="7" fill="var(--course-accent)" />
      <circle cx="458" cy="198" r="7" fill="var(--primary)" />
      <circle cx="494" cy="164" r="7" fill="var(--accent)" />
      <circle cx="528" cy="142" r="7" fill="var(--course-accent)" />
      <circle cx="556" cy="118" r="7" fill="var(--primary)" />
      <circle cx="412" cy="268" r="5" fill="var(--primary)" fillOpacity="0.55" />
      <circle cx="480" cy="232" r="5" fill="var(--accent)" fillOpacity="0.55" />
      <path
        d="M96 112 C 140 48, 188 48, 232 112 C 276 176, 324 176, 368 112"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default ApStatsCard;
