/**
 * Original geometric course art for AP CSA.
 * Greens and teals: #0f5c44, #086874. Not third-party art.
 */

export function CourseCardArt() {
  return (
    <svg
      viewBox="0 0 640 400"
      width="100%"
      height="100%"
      role="img"
      aria-label="Geometric illustration for AP Computer Science A"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="640" height="400" fill="var(--course-accent, #0f5c44)" />
      <circle cx="520" cy="70" r="150" fill="var(--accent, #086874)" opacity="0.88" />
      <circle cx="80" cy="340" r="120" fill="#086874" opacity="0.55" />
      <rect
        x="72"
        y="88"
        width="168"
        height="112"
        rx="10"
        fill="var(--primary, #0f5c44)"
        stroke="color-mix(in srgb, #ffffff 28%, #086874)"
        strokeWidth="2"
      />
      <rect
        x="116"
        y="132"
        width="168"
        height="112"
        rx="10"
        fill="#086874"
        opacity="0.92"
      />
      <rect
        x="160"
        y="176"
        width="168"
        height="112"
        rx="10"
        fill="color-mix(in srgb, #0f5c44 70%, #ffffff)"
      />
      <g fill="color-mix(in srgb, #ffffff 22%, #086874)">
        <rect x="392" y="168" width="36" height="36" rx="4" />
        <rect x="440" y="168" width="36" height="36" rx="4" />
        <rect x="488" y="168" width="36" height="36" rx="4" />
        <rect x="392" y="216" width="36" height="36" rx="4" />
        <rect x="440" y="216" width="36" height="36" rx="4" />
        <rect x="488" y="216" width="36" height="36" rx="4" />
        <rect x="392" y="264" width="36" height="36" rx="4" />
        <rect x="440" y="264" width="36" height="36" rx="4" />
        <rect x="488" y="264" width="36" height="36" rx="4" />
      </g>
      <path
        d="M356 96h72v16H356z M356 120h48v16H356z"
        fill="color-mix(in srgb, #ffffff 34%, #0f5c44)"
      />
      <circle cx="300" cy="300" r="44" fill="none" stroke="#086874" strokeWidth="10" />
      <circle cx="300" cy="300" r="18" fill="#0f5c44" />
    </svg>
  );
}

export default CourseCardArt;
