/**
 * Original geometric hero for AP Computer Science Principles.
 * No photos, no third-party art, no text logos.
 */

export function CourseCardArt(props?: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 400"
      role="img"
      aria-hidden
      className={props?.className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="640" height="400" fill="currentColor" opacity="0.08" />
      <rect x="24" y="24" width="592" height="352" rx="28" fill="#0f5c44" />
      <circle cx="168" cy="200" r="118" fill="#086874" opacity="0.9" />
      <circle cx="168" cy="200" r="72" fill="#0f5c44" />
      <circle cx="168" cy="200" r="28" fill="currentColor" opacity="0.35" />
      <polygon
        points="412,86 508,142 508,258 412,314 316,258 316,142"
        fill="#086874"
        opacity="0.85"
      />
      <polygon
        points="412,128 470,162 470,238 412,272 354,238 354,162"
        fill="#0f5c44"
      />
      <rect x="396" y="184" width="32" height="32" fill="currentColor" opacity="0.4" />
      <g stroke="currentColor" strokeWidth="6" fill="none" opacity="0.45">
        <line x1="248" y1="200" x2="316" y2="168" />
        <line x1="248" y1="200" x2="316" y2="232" />
        <line x1="508" y1="142" x2="560" y2="110" />
        <line x1="508" y1="258" x2="560" y2="290" />
      </g>
      <circle cx="560" cy="110" r="14" fill="currentColor" opacity="0.55" />
      <circle cx="560" cy="290" r="14" fill="currentColor" opacity="0.55" />
      <circle cx="96" cy="96" r="10" fill="#086874" />
      <circle cx="128" cy="80" r="7" fill="currentColor" opacity="0.4" />
      <rect x="72" y="300" width="18" height="18" fill="#086874" />
      <rect x="98" y="312" width="12" height="12" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export default CourseCardArt;
