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

/** Original white line-art over Storage photos. Not a third-party bitmap. */
export function CourseSubjectOverlay({ namespace }: { namespace: string }) {
  const family = namespace.includes("calc") || namespace.includes("precalc") || namespace.includes("stats")
    ? "math"
    : namespace.includes("phys") || namespace.includes("chem")
      ? "science"
      : namespace.includes("bio") || namespace.includes("env")
        ? "life"
        : namespace.includes("csp") || namespace.includes("csa")
          ? "cs"
          : "general";

  return (
    <svg
      viewBox="0 0 300 100"
      className="size-full"
      aria-hidden
      preserveAspectRatio="xMinYMid meet"
    >
      <g fill="none" stroke="#f8fafc" strokeOpacity="0.88" strokeWidth="1.6">
        {family === "math" ? (
          <>
            <circle cx="38" cy="50" r="18" />
            <text
              x="38"
              y="55"
              textAnchor="middle"
              fill="#f8fafc"
              fillOpacity="0.92"
              stroke="none"
              fontSize="12"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight="700"
            >
              {namespace.includes("bc") ? "BC" : namespace.includes("pre") ? "PR" : namespace.includes("stat") ? "ST" : "AB"}
            </text>
            <path d="M68 72 C 74 28, 82 28, 86 72" />
            <path d="M86 38 H 118" />
            <path d="M96 32 C 108 28, 118 44, 132 40" />
            <rect x="148" y="34" width="28" height="36" rx="3" />
            <path d="M154 44 H 170 M154 52 H 170 M154 60 H 164" />
          </>
        ) : family === "cs" ? (
          <>
            <path d="M28 28 L 16 50 L 28 72" />
            <path d="M52 28 L 64 50 L 52 72" />
            <path d="M80 36 H 130 M80 50 H 118 M80 64 H 124" />
          </>
        ) : family === "science" ? (
          <>
            <path d="M36 24 V 40 L 20 72 H 52 L 36 40" />
            <circle cx="36" cy="62" r="6" />
            <path d="M70 70 C 90 20, 130 20, 150 70" />
          </>
        ) : family === "life" ? (
          <>
            <path d="M40 78 C 40 40, 18 36, 40 18 C 62 36, 40 40, 40 78 Z" />
            <path d="M70 30 C 88 18, 110 28, 118 48 C 96 44, 82 56, 70 30 Z" />
          </>
        ) : (
          <>
            <circle cx="40" cy="50" r="16" />
            <path d="M70 32 H 140 M70 50 H 124 M70 68 H 132" />
          </>
        )}
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
