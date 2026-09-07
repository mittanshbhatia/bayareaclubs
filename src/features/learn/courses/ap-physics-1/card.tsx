/**
 * Original geometric card art for AP Physics 1.
 * viewBox 640×400 (16:10). No photos, no third-party art.
 */

export function ApPhysics1Card() {
  return (
    <svg
      viewBox="0 0 640 400"
      width="640"
      height="400"
      role="img"
      aria-labelledby="ap-physics-1-card-title"
    >
      <title id="ap-physics-1-card-title">AP Physics 1 geometric card</title>
      <rect width="640" height="400" fill="var(--course-accent)" opacity="0.12" />
      <rect x="24" y="24" width="592" height="352" fill="none" stroke="var(--primary)" strokeWidth="2" />
      <line
        x1="64"
        y1="320"
        x2="576"
        y2="320"
        stroke="var(--primary)"
        strokeWidth="2"
        opacity="0.45"
      />
      <line
        x1="96"
        y1="56"
        x2="96"
        y2="320"
        stroke="var(--primary)"
        strokeWidth="2"
        opacity="0.45"
      />
      <path
        d="M96 280 C 200 40, 360 40, 520 280"
        fill="none"
        stroke="var(--course-accent)"
        strokeWidth="4"
      />
      <circle cx="200" cy="112" r="10" fill="var(--accent)" />
      <circle cx="360" cy="88" r="8" fill="var(--primary)" />
      <circle cx="480" cy="168" r="9" fill="var(--course-accent)" />
      <polygon points="520,280 508,262 536,268" fill="var(--accent)" />
      <line
        x1="200"
        y1="112"
        x2="248"
        y2="96"
        stroke="var(--accent)"
        strokeWidth="3"
      />
      <polygon points="248,96 232,88 234,108" fill="var(--accent)" />
      <circle
        cx="500"
        cy="86"
        r="36"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="3"
      />
      <line
        x1="500"
        y1="86"
        x2="528"
        y2="70"
        stroke="var(--primary)"
        strokeWidth="3"
      />
      <path
        d="M64 360 Q 128 330 192 360 T 320 360 T 448 360 T 576 360"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3"
      />
      <rect
        x="120"
        y="292"
        width="36"
        height="20"
        fill="var(--primary)"
        opacity="0.35"
      />
      <circle cx="128" cy="316" r="6" fill="var(--primary)" />
      <circle cx="148" cy="316" r="6" fill="var(--primary)" />
    </svg>
  );
}

export default ApPhysics1Card;
