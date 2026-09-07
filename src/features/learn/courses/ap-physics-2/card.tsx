/**
 * Original geometric course art for AP Physics 2.
 * 640×400 (16:10). Design tokens only. source_basis: ORIGINAL.
 */

export function CourseCardArt() {
  return (
    <svg
      viewBox="0 0 640 400"
      width="640"
      height="400"
      role="img"
      aria-label="Geometric art for AP Physics 2: field lines, a thin lens, and a wave"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="640"
        height="400"
        fill="color-mix(in srgb, var(--primary) 8%, transparent)"
      />
      <g
        stroke="color-mix(in srgb, var(--accent) 20%, transparent)"
        strokeWidth="1"
        fill="none"
      >
        <line x1="40" y1="80" x2="600" y2="80" />
        <line x1="40" y1="160" x2="600" y2="160" />
        <line x1="40" y1="240" x2="600" y2="240" />
        <line x1="40" y1="320" x2="600" y2="320" />
        <line x1="128" y1="36" x2="128" y2="364" />
        <line x1="256" y1="36" x2="256" y2="364" />
        <line x1="384" y1="36" x2="384" y2="364" />
        <line x1="512" y1="36" x2="512" y2="364" />
      </g>
      <circle cx="118" cy="168" r="16" fill="var(--primary)" />
      <circle cx="118" cy="248" r="16" fill="var(--accent)" />
      <g fill="none" stroke="var(--course-accent)" strokeWidth="2.5">
        <path d="M134 168 C 188 148, 188 148, 236 128" />
        <path d="M134 168 C 196 168, 196 168, 236 168" />
        <path d="M134 168 C 188 188, 188 188, 236 208" />
        <path d="M134 248 C 188 228, 188 228, 236 208" />
        <path d="M134 248 C 196 248, 196 248, 236 248" />
        <path d="M134 248 C 188 268, 188 268, 236 288" />
      </g>
      <ellipse
        cx="352"
        cy="200"
        rx="14"
        ry="78"
        fill="color-mix(in srgb, var(--course-accent) 22%, transparent)"
        stroke="var(--course-accent)"
        strokeWidth="3"
      />
      <g fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round">
        <line x1="268" y1="132" x2="338" y2="176" />
        <line x1="366" y1="184" x2="468" y2="236" />
        <line x1="268" y1="200" x2="468" y2="200" />
        <line x1="268" y1="268" x2="338" y2="224" />
        <line x1="366" y1="216" x2="468" y2="164" />
      </g>
      <path
        d="M56 348 C 104 320, 152 376, 200 348 C 248 320, 296 376, 344 348 C 392 320, 440 376, 488 348 C 536 320, 584 376, 612 348"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="468" cy="236" r="6" fill="var(--primary)" />
      <circle cx="468" cy="164" r="6" fill="var(--accent)" />
      <circle cx="468" cy="200" r="5" fill="var(--course-accent)" />
    </svg>
  );
}

export default CourseCardArt;
