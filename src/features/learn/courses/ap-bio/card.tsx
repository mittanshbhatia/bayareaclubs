/**
 * Original geometric course hero. 640×400, 16:10. No photos or third-party art.
 */

export function ApBioCourseCard() {
  return (
    <svg
      viewBox="0 0 640 400"
      width="640"
      height="400"
      role="img"
      aria-label="Geometric cells, membranes, and energy nodes for AP Biology"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="640" height="400" fill="var(--learning-surface, #0f1c16)" />
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
        cx="168"
        cy="196"
        r="118"
        fill="none"
        stroke="var(--course-accent)"
        strokeWidth="3"
      />
      <circle
        cx="168"
        cy="196"
        r="78"
        fill="color-mix(in srgb, var(--course-accent) 18%, transparent)"
        stroke="var(--primary)"
        strokeWidth="2"
      />
      <circle cx="168" cy="196" r="22" fill="var(--primary)" />
      <rect
        x="320"
        y="72"
        width="248"
        height="140"
        rx="18"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3"
      />
      <rect
        x="344"
        y="96"
        width="88"
        height="56"
        rx="8"
        fill="color-mix(in srgb, var(--accent) 22%, transparent)"
      />
      <rect
        x="448"
        y="96"
        width="96"
        height="88"
        rx="8"
        fill="color-mix(in srgb, var(--primary) 16%, transparent)"
      />
      <polygon
        points="356,268 404,248 452,268 452,332 356,332"
        fill="none"
        stroke="var(--course-accent)"
        strokeWidth="3"
      />
      <polygon
        points="480,252 548,284 480,316 412,284"
        fill="color-mix(in srgb, var(--course-accent) 20%, transparent)"
        stroke="var(--primary)"
        strokeWidth="2"
      />
      <line
        x1="286"
        y1="196"
        x2="320"
        y2="142"
        stroke="var(--accent)"
        strokeWidth="2"
      />
      <line
        x1="286"
        y1="220"
        x2="356"
        y2="292"
        stroke="var(--primary)"
        strokeWidth="2"
      />
      <circle cx="88" cy="72" r="8" fill="var(--accent)" />
      <circle cx="552" cy="348" r="8" fill="var(--course-accent)" />
    </svg>
  );
}

export default ApBioCourseCard;
