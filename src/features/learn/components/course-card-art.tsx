/**
 * Original BayAreaClubs catalog art.
 * Atmospheric SVG fallbacks when a signed cover is not available.
 * Not copied from Stellar or any third-party catalog.
 *
 * Photo covers: 1280×720 (16:9), stored as learn/<namespace>/card-cover.jpg.
 * Card chrome: 288×248 tiles, 14px radius, inset 3:1 media (248×83).
 */

import type { JSX, ReactNode } from "react";

export const COURSE_CARD_MEASURE = {
  cssWidth: 288,
  cssHeight: 248,
  mediaCssWidth: 248,
  mediaCssHeight: 83,
  artWidth: 1152,
  artHeight: 640,
  mediaAspectWidth: 3,
  mediaAspectHeight: 1,
  radiusPx: 14,
  titlePx: 16,
  bodyPx: 14,
  chipHeightPx: 40,
  gridGapPx: 16,
} as const;

const W = COURSE_CARD_MEASURE.artWidth;
const H = COURSE_CARD_MEASURE.artHeight;

function Frame({
  children,
  defs,
}: {
  children: ReactNode;
  defs?: ReactNode;
}) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-hidden
      className="size-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>{defs}</defs>
      {children}
    </svg>
  );
}

function ForestChalk({ id }: { id: string }) {
  return (
    <Frame
      defs={
        <>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8fb4c9" />
            <stop offset="0.45" stopColor="#c5d6c4" />
            <stop offset="1" stopColor="#2f4a38" />
          </linearGradient>
          <linearGradient id={`${id}-fog`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f8fafc" stopOpacity="0" />
            <stop offset="1" stopColor="#e2ebe6" stopOpacity="0.55" />
          </linearGradient>
        </>
      }
    >
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <ellipse cx="180" cy="520" rx="220" ry="180" fill="#1b3326" opacity="0.9" />
      <ellipse cx="420" cy="540" rx="260" ry="200" fill="#234433" />
      <ellipse cx="720" cy="500" rx="300" ry="220" fill="#1a3026" />
      <ellipse cx="980" cy="560" rx="240" ry="190" fill="#2a4a38" />
      <path d="M0 430 C 180 390, 320 470, 520 410 S 860 360, 1152 430 V 640 H 0 Z" fill="#163025" />
      <rect width={W} height={H} fill={`url(#${id}-fog)`} />
      <g fill="none" stroke="#f8fafc" strokeOpacity="0.42" strokeWidth="2.2">
        <path d="M80 420 C 200 300, 320 500, 460 360" />
        <path d="M520 200 H 620 M570 150 V 250" />
        <path d="M780 280 C 860 220, 900 360, 980 300" />
      </g>
    </Frame>
  );
}

function CampusTower({ id, dusk }: { id: string; dusk?: boolean }) {
  const sky = dusk ? ["#1e2a4a", "#6b4a5a", "#c9895a"] : ["#7ea4c8", "#d7c4a4", "#e8d8bc"];
  return (
    <Frame
      defs={
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="0.55" stopColor={sky[1]} />
          <stop offset="1" stopColor={sky[2]} />
        </linearGradient>
      }
    >
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <rect x="0" y="470" width={W} height="170" fill={dusk ? "#1a1820" : "#6b5a48"} />
      <rect x="500" y="140" width="150" height="360" fill={dusk ? "#2a2433" : "#c4b49a"} />
      <polygon points="500,140 650,140 575,70" fill={dusk ? "#3a3044" : "#d8c8ae"} />
      <rect x="555" y="88" width="40" height="52" fill={dusk ? "#1a1820" : "#9a8a72"} />
      <rect x="280" y="300" width="180" height="200" fill={dusk ? "#241e2c" : "#b7a58c"} />
      <rect x="700" y="280" width="220" height="220" fill={dusk ? "#2c2434" : "#c9b89d"} />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={530 + (i % 2) * 44}
          y={200 + Math.floor(i / 2) * 70}
          width="28"
          height="36"
          fill={dusk ? "#e8b86d" : "#8aa8c4"}
          opacity={dusk ? 0.85 : 0.55}
        />
      ))}
    </Frame>
  );
}

function BrickHall({ id }: { id: string }) {
  return (
    <Frame
      defs={
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2d3b0" />
          <stop offset="1" stopColor="#8f4a3a" />
        </linearGradient>
      }
    >
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <rect x="80" y="180" width="990" height="380" fill="#8b3f32" />
      {Array.from({ length: 5 }, (_, col) =>
        Array.from({ length: 3 }, (_, row) => (
          <rect
            key={`${col}-${row}`}
            x={140 + col * 180}
            y={220 + row * 90}
            width="70"
            height="54"
            fill="#f3d7a0"
            opacity={0.55 + ((col + row) % 3) * 0.15}
          />
        )),
      )}
      <rect x="0" y="540" width={W} height="100" fill="#4a2a22" opacity="0.55" />
    </Frame>
  );
}

function GlassLab({ id, cool }: { id: string; cool?: boolean }) {
  return (
    <Frame
      defs={
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={cool ? "#0b1c33" : "#143044"} />
          <stop offset="1" stopColor={cool ? "#2a6f9a" : "#1d4e5c"} />
        </linearGradient>
      }
    >
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <polygon points="180,560 420,160 780,160 1020,560" fill="#9fd4e8" opacity="0.28" />
      <path d="M420 160 L 780 160 L 780 560 L 420 560 Z" fill="#d7eef6" opacity="0.22" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={420 + i * 90}
          y1="160"
          x2={420 + i * 90}
          y2="560"
          stroke="#e8f6fb"
          strokeOpacity="0.35"
        />
      ))}
      <rect x="0" y="560" width={W} height="80" fill="#071018" opacity="0.45" />
    </Frame>
  );
}

function Greenhouse({ id }: { id: string }) {
  return (
    <Frame
      defs={
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dcecc4" />
          <stop offset="1" stopColor="#2f5a38" />
        </linearGradient>
      }
    >
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <path d="M160 560 L 576 80 L 992 560 Z" fill="#e7f4d8" opacity="0.35" />
      <path d="M576 80 L 576 560" stroke="#f8fafc" strokeOpacity="0.45" />
      <ellipse cx="360" cy="500" rx="140" ry="90" fill="#1f4a2c" />
      <ellipse cx="760" cy="510" rx="180" ry="100" fill="#245832" />
      <ellipse cx="560" cy="470" rx="90" ry="70" fill="#3a7a48" />
    </Frame>
  );
}

function Atrium({ id }: { id: string }) {
  return (
    <Frame
      defs={
        <radialGradient id={`${id}-glow`} cx="50%" cy="18%" r="70%">
          <stop offset="0" stopColor="#fff7e6" />
          <stop offset="0.45" stopColor="#d5c4b0" />
          <stop offset="1" stopColor="#3d4454" />
        </radialGradient>
      }
    >
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
      <ellipse cx="576" cy="120" rx="220" ry="70" fill="#fffaf0" opacity="0.7" />
      <path d="M80 640 C 280 280, 872 280, 1072 640" fill="none" stroke="#f8fafc" strokeOpacity="0.35" strokeWidth="8" />
    </Frame>
  );
}

function Canopy({ id }: { id: string }) {
  return (
    <Frame
      defs={
        <linearGradient id={`${id}-sky`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#14301c" />
          <stop offset="1" stopColor="#7ea3c2" />
        </linearGradient>
      }
    >
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <ellipse cx="200" cy="-20" rx="280" ry="220" fill="#1d3d24" />
      <ellipse cx="620" cy="-40" rx="340" ry="260" fill="#24512e" />
      <ellipse cx="1000" cy="0" rx="300" ry="240" fill="#183322" />
      <path d="M400 0 C 430 220, 390 400, 420 640" stroke="#4a2a18" strokeWidth="18" fill="none" />
    </Frame>
  );
}

function BenchGlass({ id }: { id: string }) {
  return (
    <Frame
      defs={
        <radialGradient id={`${id}-glow`} cx="40%" cy="40%" r="70%">
          <stop offset="0" stopColor="#7ed0d8" />
          <stop offset="0.5" stopColor="#1b3a44" />
          <stop offset="1" stopColor="#0b1418" />
        </radialGradient>
      }
    >
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
      <ellipse cx="420" cy="300" rx="90" ry="140" fill="#d7f3f6" opacity="0.35" />
      <ellipse cx="620" cy="280" rx="70" ry="160" fill="#f3d7a8" opacity="0.28" />
      <rect x="0" y="480" width={W} height="160" fill="#10181c" />
    </Frame>
  );
}

function BinaryGlass({ id }: { id: string }) {
  return (
    <Frame
      defs={
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#102033" />
          <stop offset="1" stopColor="#3d7ea6" />
        </linearGradient>
      }
    >
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x={80 + i * 130}
          y={80 + (i % 3) * 40}
          width="70"
          height="420"
          fill="#d7eef8"
          opacity={0.08 + (i % 4) * 0.06}
        />
      ))}
      <rect x="0" y="520" width={W} height="120" fill="#0b1520" opacity="0.55" />
    </Frame>
  );
}

function Waves({ id }: { id: string }) {
  return (
    <Frame
      defs={
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#10243a" />
          <stop offset="1" stopColor="#3c6d8c" />
        </linearGradient>
      }
    >
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      {[-40, 0, 40, 80].map((offset) => (
        <path
          key={offset}
          d={`M0 ${300 + offset} C 240 ${220 + offset}, 480 ${380 + offset}, 720 ${260 + offset} S 1152 ${320 + offset}, 1152 ${320 + offset}`}
          fill="none"
          stroke="#cfe8f4"
          strokeOpacity="0.35"
          strokeWidth="6"
        />
      ))}
    </Frame>
  );
}

function Arch({ id }: { id: string }) {
  return (
    <Frame
      defs={
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9aa8b8" />
          <stop offset="1" stopColor="#3a4450" />
        </linearGradient>
      }
    >
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <path d="M180 640 V 280 A 396 280 0 0 1 972 280 V 640 Z" fill="#2c333c" />
      <path d="M300 640 V 340 A 276 220 0 0 1 852 340 V 640 Z" fill="#c5ced6" opacity="0.35" />
    </Frame>
  );
}

function NightGlass({ id }: { id: string }) {
  return (
    <Frame
      defs={
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#071018" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      }
    >
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <rect x="260" y="80" width="632" height="480" fill="#93c5fd" opacity="0.18" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect
          key={i}
          x={300 + i * 96}
          y="140"
          width="48"
          height="360"
          fill="#bfdbfe"
          opacity={0.12 + (i % 3) * 0.1}
        />
      ))}
      <rect x="0" y="540" width={W} height="100" fill="#020617" />
    </Frame>
  );
}

const ART: Record<string, () => JSX.Element> = {
  "ap-csp": () => <BinaryGlass id="csp" />,
  "ap-csa": () => <CampusTower id="csa" dusk />,
  "ap-calc-ab": () => <ForestChalk id="cab" />,
  "ap-calc-bc": () => <CampusTower id="cbc" />,
  "ap-stats": () => <BrickHall id="sta" />,
  "ap-precalc": () => <CampusTower id="pre" />,
  "ap-physics-1": () => <Waves id="p1" />,
  "ap-physics-2": () => <GlassLab id="p2" cool />,
  "ap-physics-c-mech": () => <Arch id="pcm" />,
  "ap-physics-c-em": () => <NightGlass id="pce" />,
  "ap-chem": () => <BenchGlass id="chm" />,
  "ap-bio": () => <Greenhouse id="bio" />,
  "ap-envsci": () => <Canopy id="env" />,
  "ap-psych": () => <Atrium id="psy" />,
};

export const ORIGINAL_CARD_NAMESPACES = Object.keys(ART);

const OVERLAY_INK = "#f8fafc";
const OVERLAY_FONT = "ui-sans-serif, system-ui, sans-serif";

function OverlayGlyph({
  x,
  y,
  size = 10,
  children,
}: {
  x: number;
  y: number;
  size?: number;
  children: string;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={OVERLAY_INK}
      fillOpacity="0.95"
      stroke="none"
      fontSize={size}
      fontFamily={OVERLAY_FONT}
      fontWeight="600"
    >
      {children}
    </text>
  );
}

function OverlayCsp() {
  return (
    <>
      <rect x="10" y="16" width="42" height="28" rx="2.5" />
      <path d="M8 46 H54 L58 54 H4 Z" />
      <OverlayGlyph x={18} y={35} size={11}>
        01
      </OverlayGlyph>
      <circle cx="70" cy="16" r="4" />
      <circle cx="80" cy="38" r="4" />
      <circle cx="68" cy="60" r="4" />
      <path d="M52 24 L66 16 M52 36 L76 38 M48 46 L64 58" />
    </>
  );
}

function OverlayCsa() {
  return (
    <>
      <rect x="12" y="10" width="60" height="42" rx="3" />
      <path d="M32 24 L22 31 L32 38" />
      <path d="M52 24 L62 31 L52 38" />
      <path d="M42 52 V58" />
      <path d="M28 62 H56" />
    </>
  );
}

function OverlayCalcAb() {
  return (
    <>
      <path d="M28 8 C 14 14, 16 34, 28 40 C 40 46, 42 66, 24 74" />
      <path d="M44 64 C 54 48, 62 20, 80 14" />
      <path d="M48 64 V52" />
      <OverlayGlyph x={46} y={76} size={9}>
        dx
      </OverlayGlyph>
    </>
  );
}

function OverlayCalcBc() {
  return (
    <>
      <path d="M58 12 H20 L40 40 L20 68 H58" />
      <path d="M28 76 C 28 70, 36 70, 40 76 C 44 82, 36 82, 28 76" />
      <path d="M40 76 C 40 70, 48 70, 52 76 C 56 82, 48 82, 40 76" />
      <path d="M64 22 C 58 28, 60 40, 70 46 C 80 52, 78 64, 68 70" />
    </>
  );
}

function OverlayStats() {
  return (
    <>
      <path d="M8 62 H82" />
      <rect x="10" y="44" width="8" height="18" />
      <rect x="20" y="30" width="8" height="32" />
      <rect x="30" y="38" width="8" height="24" />
      <path d="M44 62 C 48 62, 52 16, 66 16 C 80 16, 82 62, 86 62" />
      <path d="M66 14 V62" />
    </>
  );
}

function OverlayPrecalc() {
  return (
    <>
      <circle cx="34" cy="40" r="24" />
      <path d="M10 40 H58" />
      <path d="M34 16 V64" />
      <path d="M34 40 L52 26" />
      <path d="M64 40 Q 70 24, 76 40 T 88 40" />
    </>
  );
}

function OverlayPhysics1() {
  return (
    <>
      <path d="M6 28 C 16 12, 28 10, 38 22 C 52 6, 70 16, 60 36 C 54 48, 34 54, 24 40 C 18 28, 34 24, 44 32 C 56 42, 72 36, 84 26" />
      <rect x="10" y="18" width="11" height="6" rx="1.2" transform="rotate(-22 15.5 21)" />
      <rect x="58" y="52" width="22" height="20" rx="1.5" />
      <path d="M62 64 L65 68 L71 56 H78" />
      <OverlayGlyph x={71} y={66} size={9}>
        h
      </OverlayGlyph>
    </>
  );
}

function OverlayPhysics2() {
  return (
    <>
      <path d="M44 10 L70 62 H18 Z" />
      <path d="M4 34 L26 42" />
      <path d="M54 30 L82 16" />
      <path d="M56 40 L84 40" />
      <path d="M54 50 L82 64" />
    </>
  );
}

function OverlayPhysicsCMech() {
  return (
    <>
      <path d="M16 8 H72" />
      <path d="M44 8 V48" />
      <circle cx="44" cy="58" r="10" />
      <path d="M20 50 Q 44 72, 68 50" />
    </>
  );
}

function OverlayPhysicsCEm() {
  return (
    <>
      <rect x="16" y="30" width="52" height="20" rx="2" />
      <path d="M42 30 V50" />
      <OverlayGlyph x={22} y={44} size={10}>
        N
      </OverlayGlyph>
      <OverlayGlyph x={52} y={44} size={10}>
        S
      </OverlayGlyph>
      <path d="M20 30 C 20 10, 64 10, 64 30" />
      <path d="M26 30 C 26 16, 58 16, 58 30" />
      <path d="M20 50 C 20 70, 64 70, 64 50" />
      <path d="M26 50 C 26 64, 58 64, 58 50" />
    </>
  );
}

function OverlayChem() {
  return (
    <>
      <path d="M34 6 H50 M38 6 V20 H32 L18 62 Q 18 74, 42 74 Q 66 74, 66 62 L52 20 H46 V6" />
      <path d="M24 54 Q 42 48, 60 54" />
      <circle cx="36" cy="44" r="2.2" />
      <circle cx="46" cy="38" r="1.7" />
      <circle cx="40" cy="48" r="1.5" />
    </>
  );
}

function OverlayBio() {
  return (
    <>
      <path d="M24 6 C 24 18, 60 18, 60 30 C 60 42, 24 42, 24 54 C 24 66, 60 66, 60 78" />
      <path d="M60 6 C 60 18, 24 18, 24 30 C 24 42, 60 42, 60 54 C 60 66, 24 66, 24 78" />
      <path d="M28 18 H56 M26 42 H58 M28 66 H56" />
    </>
  );
}

function OverlayEnvsci() {
  return (
    <>
      <circle cx="34" cy="44" r="26" />
      <ellipse cx="34" cy="44" rx="26" ry="9" />
      <path d="M34 18 C 42 28, 42 60, 34 70" />
      <path d="M20 32 C 28 26, 40 28, 44 36 C 36 40, 26 40, 20 32" />
      <path d="M62 14 C 78 10, 84 26, 70 40 C 66 28, 62 22, 62 14 Z" />
      <path d="M62 14 L54 26" />
    </>
  );
}

function OverlayPsych() {
  return (
    <>
      <path d="M18 38 C 14 16, 34 8, 44 20 C 40 28, 30 36, 18 38" />
      <path d="M44 20 C 52 6, 76 12, 72 34 C 70 44, 54 40, 44 28" />
      <path d="M20 40 C 16 56, 28 68, 42 64 C 36 52, 26 46, 20 40" />
      <path d="M46 40 C 56 44, 70 48, 68 34" />
      <path d="M40 64 C 42 72, 40 76, 44 78" />
      <path d="M26 24 C 32 28, 38 24, 42 20" />
      <path d="M52 20 C 56 26, 62 28, 66 24" />
    </>
  );
}

function OverlayFallback() {
  return (
    <>
      <path d="M18 28 L42 16 L66 28 V62 L42 72 L18 62 Z" />
      <path d="M42 16 V72" />
    </>
  );
}

const SUBJECT_OVERLAYS: Record<string, () => JSX.Element> = {
  "ap-csp": OverlayCsp,
  "ap-csa": OverlayCsa,
  "ap-calc-ab": OverlayCalcAb,
  "ap-calc-bc": OverlayCalcBc,
  "ap-stats": OverlayStats,
  "ap-precalc": OverlayPrecalc,
  "ap-physics-1": OverlayPhysics1,
  "ap-physics-2": OverlayPhysics2,
  "ap-physics-c-mech": OverlayPhysicsCMech,
  "ap-physics-c-em": OverlayPhysicsCEm,
  "ap-chem": OverlayChem,
  "ap-bio": OverlayBio,
  "ap-envsci": OverlayEnvsci,
  "ap-psych": OverlayPsych,
};

export const SUBJECT_OVERLAY_NAMESPACES = Object.keys(SUBJECT_OVERLAYS);

/** Original white line-art over Storage photos. Not a third-party bitmap. */
export function CourseSubjectOverlay({ namespace }: { namespace: string }) {
  const Figure = SUBJECT_OVERLAYS[namespace] ?? OverlayFallback;
  return (
    <svg
      viewBox="0 0 88 80"
      className="size-full"
      aria-hidden
      data-course-overlay={namespace}
      preserveAspectRatio="xMinYMid meet"
    >
      <defs>
        <filter id={`overlay-halo-${namespace}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="0.55"
            floodColor="#0f172a"
            floodOpacity="0.45"
          />
        </filter>
      </defs>
      <g
        fill="none"
        stroke={OVERLAY_INK}
        strokeOpacity="0.95"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#overlay-halo-${namespace})`}
      >
        <Figure />
      </g>
    </svg>
  );
}

export function CourseCardArt({ namespace }: { namespace: string }) {
  const Art = ART[namespace];
  if (!Art) return null;
  return <Art />;
}

/** Original atmospheric SVG for Storage fallback. Not a third-party asset. */
export function courseCardSvgMarkup(namespace: string): string {
  const seed = [...namespace].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const sky = namespace.includes("calc")
    ? ["#8fb4c9", "#2f4a38"]
    : namespace.includes("phys")
      ? ["#10243a", "#3c6d8c"]
      : namespace.includes("bio") || namespace.includes("env")
        ? ["#dcecc4", "#2f5a38"]
        : ["#7ea4c8", "#2a2433"];
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${sky[0]}"/>
      <stop offset="1" stop-color="${sky[1]}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <ellipse cx="${220 + (seed % 400)}" cy="520" rx="280" ry="200" fill="#1a2430" opacity="0.55"/>
  <path d="M0 430 C 180 390, 320 470, 520 410 S 860 360, 1152 430 V 640 H 0 Z" fill="#163025" opacity="0.72"/>
  <path d="M80 420 C 200 300, 320 500, 460 360" fill="none" stroke="#f8fafc" stroke-opacity="0.35" stroke-width="3"/>
</svg>`;
}
