/**
 * Original geometric SVG hero for AP Chemistry.
 * 640×400 (16:10). Uses --course-accent, --primary, --accent.
 * Greens and teals: #0f5c44, #086874. Not third-party art.
 */

export function CourseCardArt() {
  return (
    <svg
      viewBox="0 0 640 400"
      width="640"
      height="400"
      role="img"
      aria-label="AP Chemistry geometric course art with electron shells, a hex lattice, and a flask silhouette"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>AP Chemistry</title>
      <rect width="640" height="400" fill="var(--primary, #0f5c44)" />
      <rect
        x="24"
        y="20"
        width="592"
        height="360"
        fill="none"
        stroke="var(--course-accent, #086874)"
        strokeWidth="2"
        opacity="0.45"
      />
      <circle
        cx="168"
        cy="196"
        r="118"
        fill="none"
        stroke="var(--accent, #086874)"
        strokeWidth="2"
        opacity="0.55"
      />
      <circle
        cx="168"
        cy="196"
        r="78"
        fill="none"
        stroke="var(--course-accent, #086874)"
        strokeWidth="2"
        opacity="0.7"
      />
      <circle
        cx="168"
        cy="196"
        r="42"
        fill="none"
        stroke="var(--accent, #086874)"
        strokeWidth="2"
      />
      <circle cx="168" cy="196" r="14" fill="var(--course-accent, #086874)" />
      <circle cx="246" cy="196" r="7" fill="var(--accent, #086874)" />
      <circle cx="90" cy="196" r="7" fill="var(--accent, #086874)" />
      <circle cx="168" cy="118" r="7" fill="var(--course-accent, #086874)" />
      <circle cx="168" cy="274" r="7" fill="var(--course-accent, #086874)" />
      <circle cx="223" cy="141" r="6" fill="var(--accent, #086874)" />
      <circle cx="113" cy="251" r="6" fill="var(--accent, #086874)" />

      <g
        fill="none"
        stroke="var(--course-accent, #086874)"
        strokeWidth="2"
        opacity="0.8"
      >
        <polygon points="392,86 424,104 424,140 392,158 360,140 360,104" />
        <polygon points="456,86 488,104 488,140 456,158 424,140 424,104" />
        <polygon points="424,158 456,176 456,212 424,230 392,212 392,176" />
        <polygon points="488,158 520,176 520,212 488,230 456,212 456,176" />
        <polygon points="392,230 424,248 424,284 392,302 360,284 360,248" />
        <polygon points="456,230 488,248 488,284 456,302 424,284 424,248" />
      </g>
      <circle cx="424" cy="194" r="8" fill="var(--accent, #086874)" />
      <circle cx="456" cy="176" r="5" fill="var(--course-accent, #086874)" />
      <circle cx="392" cy="212" r="5" fill="var(--course-accent, #086874)" />

      <path
        d="M548 92 L548 148 L590 236 L590 308 L506 308 L506 236 L548 148 Z"
        fill="color-mix(in srgb, var(--accent, #086874) 22%, transparent)"
        stroke="var(--accent, #086874)"
        strokeWidth="3"
      />
      <rect
        x="536"
        y="72"
        width="24"
        height="24"
        fill="none"
        stroke="var(--course-accent, #086874)"
        strokeWidth="3"
      />
      <line
        x1="514"
        y1="268"
        x2="582"
        y2="268"
        stroke="var(--primary, #0f5c44)"
        strokeWidth="8"
        opacity="0.35"
      />
    </svg>
  );
}

export const ApChemCourseCard = CourseCardArt;

export default CourseCardArt;
