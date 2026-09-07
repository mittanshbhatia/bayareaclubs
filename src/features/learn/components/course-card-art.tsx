/**
 * Original BayAreaClubs catalog illustrations.
 * Geometric SVG only. Not copied from Stellar or any third-party catalog.
 *
 * Measured from the public catalog at 1440×900 (input only, /tmp):
 * - Card CSS: 300 × 336 (aspect 0.893)
 * - Media CSS: 296 × 112 (aspect 2.643)
 * - 2× art: 592 × 224
 * - Radius 8px · title 16px/800 · body 12px/600 · chips 40px · grid gap 16px
 * - Observed page/card: near-white. Accent family was blue/violet — mapped to
 *   Peninsula green/teal. No purple fonts or buttons. No proprietary fonts.
 */

import type { JSX, ReactNode } from "react";

export const COURSE_CARD_MEASURE = {
  cssWidth: 300,
  cssHeight: 336,
  mediaCssWidth: 296,
  mediaCssHeight: 112,
  artWidth: 592,
  artHeight: 224,
  radiusPx: 8,
  titlePx: 16,
  bodyPx: 12,
  chipHeightPx: 40,
  gridGapPx: 16,
} as const;

const PALETTE = {
  primary: "#0f5c44",
  accent: "#086874",
  primaryMuted: "#d7ebe2",
  accentMuted: "#d4f0f4",
  ink: "#121a16",
  surface: "#ffffff",
} as const;

function Frame({
  children,
  wash,
}: {
  children: ReactNode;
  wash: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${COURSE_CARD_MEASURE.artWidth} ${COURSE_CARD_MEASURE.artHeight}`}
      role="img"
      aria-hidden
      className="size-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={COURSE_CARD_MEASURE.artWidth} height={COURSE_CARD_MEASURE.artHeight} fill={wash} />
      {children}
    </svg>
  );
}

function CspArt() {
  return (
    <Frame wash={PALETTE.primaryMuted}>
      {Array.from({ length: 3 }, (_, row) =>
        Array.from({ length: 14 }, (_, col) => (
          <rect
            key={`${row}-${col}`}
            x={16 + col * 41}
            y={18 + row * 68}
            width="28"
            height="28"
            rx="3"
            fill={col % 3 === row % 2 ? PALETTE.primary : PALETTE.accent}
            opacity={0.22 + ((row + col) % 4) * 0.14}
          />
        )),
      )}
    </Frame>
  );
}

function CsaArt() {
  return (
    <Frame wash={PALETTE.accentMuted}>
      <rect x="28" y="28" width="168" height="72" rx="8" fill={PALETTE.primary} opacity="0.2" />
      <rect x="212" y="28" width="168" height="72" rx="8" fill={PALETTE.accent} opacity="0.24" />
      <rect x="396" y="28" width="168" height="72" rx="8" fill={PALETTE.primary} opacity="0.3" />
      <rect x="120" y="124" width="168" height="72" rx="8" fill={PALETTE.accent} opacity="0.22" />
      <rect x="304" y="124" width="168" height="72" rx="8" fill={PALETTE.primary} opacity="0.28" />
      <path d="M112 108 H 480" fill="none" stroke={PALETTE.accent} strokeWidth="3" />
    </Frame>
  );
}

function CalcAbArt() {
  return (
    <Frame wash={PALETTE.primaryMuted}>
      <path
        d="M16 168 C 96 168, 140 40, 220 88 S 360 200, 576 36"
        fill="none"
        stroke={PALETTE.primary}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line x1="160" y1="140" x2="320" y2="52" stroke={PALETTE.accent} strokeWidth="4" />
      <circle cx="236" cy="92" r="6" fill={PALETTE.ink} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={80 + i * 72}
          y={148 - i * 10}
          width="48"
          height={52 + i * 10}
          fill={PALETTE.accent}
          opacity={0.16 + i * 0.06}
        />
      ))}
    </Frame>
  );
}

function CalcBcArt() {
  return (
    <Frame wash={PALETTE.accentMuted}>
      {[28, 52, 76, 100].map((r, i) => (
        <ellipse
          key={r}
          cx="296"
          cy="112"
          rx={r * 2.1}
          ry={r}
          fill="none"
          stroke={i % 2 ? PALETTE.accent : PALETTE.primary}
          strokeWidth="4"
          opacity={0.32 + i * 0.12}
        />
      ))}
      <path d="M296 112 L 470 56" stroke={PALETTE.ink} strokeWidth="3" />
      <circle cx="470" cy="56" r="5" fill={PALETTE.primary} />
    </Frame>
  );
}

function StatsArt() {
  const bars = [48, 96, 140, 84, 124, 64, 108, 76];
  return (
    <Frame wash={PALETTE.primaryMuted}>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={36 + i * 70}
          y={188 - h}
          width="44"
          height={h}
          rx="4"
          fill={i % 2 ? PALETTE.accent : PALETTE.primary}
          opacity="0.58"
        />
      ))}
      <line x1="24" y1="196" x2="568" y2="196" stroke={PALETTE.ink} strokeWidth="2.5" />
    </Frame>
  );
}

function PrecalcArt() {
  return (
    <Frame wash={PALETTE.accentMuted}>
      <path
        d="M8 112 C 80 16, 140 208, 220 112 S 360 16, 440 112 520 176, 584 72"
        fill="none"
        stroke={PALETTE.accent}
        strokeWidth="5"
      />
      <path
        d="M24 168 Q 140 24 260 132 T 560 56"
        fill="none"
        stroke={PALETTE.primary}
        strokeWidth="4"
        opacity="0.72"
      />
    </Frame>
  );
}

function Physics1Art() {
  return (
    <Frame wash={PALETTE.primaryMuted}>
      <circle cx="120" cy="120" r="28" fill={PALETTE.primary} opacity="0.75" />
      <path d="M148 108 L 500 48" stroke={PALETTE.accent} strokeWidth="6" />
      <path d="M478 34 L 516 44 L 490 70" fill={PALETTE.accent} />
      <path
        d="M120 120 A 210 90 0 0 1 500 48"
        fill="none"
        stroke={PALETTE.ink}
        strokeWidth="2.5"
        strokeDasharray="6 8"
      />
    </Frame>
  );
}

function Physics2Art() {
  return (
    <Frame wash={PALETTE.accentMuted}>
      {[-48, -24, 0, 24, 48].map((offset) => (
        <path
          key={offset}
          d={`M32 ${112 + offset} C 180 ${64 + offset}, 400 ${160 + offset}, 560 ${112 + offset}`}
          fill="none"
          stroke={PALETTE.accent}
          strokeWidth="4"
          opacity="0.42"
        />
      ))}
      <circle cx="140" cy="112" r="14" fill={PALETTE.primary} />
      <circle cx="452" cy="112" r="14" fill={PALETTE.ink} opacity="0.7" />
    </Frame>
  );
}

function ChemArt() {
  return (
    <Frame wash={PALETTE.primaryMuted}>
      <polygon
        points="296,16 420,64 420,160 296,208 172,160 172,64"
        fill={PALETTE.accent}
        opacity="0.2"
        stroke={PALETTE.primary}
        strokeWidth="5"
      />
      <circle cx="296" cy="112" r="22" fill={PALETTE.primary} />
      <circle cx="172" cy="64" r="12" fill={PALETTE.accent} />
      <circle cx="420" cy="160" r="12" fill={PALETTE.accent} />
      <circle cx="80" cy="168" r="10" fill={PALETTE.primary} opacity="0.45" />
      <circle cx="512" cy="48" r="10" fill={PALETTE.accent} opacity="0.5" />
    </Frame>
  );
}

function BioArt() {
  return (
    <Frame wash={PALETTE.accentMuted}>
      <path
        d="M80 188 C 140 40, 220 40, 280 112 S 400 200, 512 56"
        fill="none"
        stroke={PALETTE.primary}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="168" cy="72" r="14" fill={PALETTE.accent} />
      <circle cx="280" cy="112" r="10" fill={PALETTE.primary} />
      <circle cx="400" cy="168" r="12" fill={PALETTE.accent} />
      <circle cx="512" cy="56" r="8" fill={PALETTE.ink} />
    </Frame>
  );
}

function EnvsciArt() {
  return (
    <Frame wash={PALETTE.primaryMuted}>
      <rect x="0" y="0" width="592" height="48" fill={PALETTE.accent} opacity="0.16" />
      <rect x="0" y="48" width="592" height="52" fill={PALETTE.primary} opacity="0.14" />
      <rect x="0" y="100" width="592" height="56" fill={PALETTE.accent} opacity="0.26" />
      <rect x="0" y="156" width="592" height="68" fill={PALETTE.primary} opacity="0.38" />
      <path d="M0 112 C 160 80, 320 150, 592 96" fill="none" stroke={PALETTE.ink} strokeWidth="3" />
    </Frame>
  );
}

function PsychArt() {
  return (
    <Frame wash={PALETTE.accentMuted}>
      {[36, 64, 92].map((r, i) => (
        <ellipse
          key={r}
          cx="296"
          cy="112"
          rx={r * 2.4}
          ry={r}
          fill="none"
          stroke={i % 2 ? PALETTE.primary : PALETTE.accent}
          strokeWidth="4"
          opacity={0.34 + i * 0.12}
        />
      ))}
      <circle cx="296" cy="112" r="16" fill={PALETTE.primary} />
    </Frame>
  );
}

function PhysicsCMechArt() {
  return (
    <Frame wash={PALETTE.primaryMuted}>
      <path d="M32 176 H 560" stroke={PALETTE.ink} strokeWidth="3" />
      <path d="M96 176 A 200 140 0 0 1 496 176" fill="none" stroke={PALETTE.primary} strokeWidth="6" />
      <circle cx="496" cy="176" r="12" fill={PALETTE.accent} />
      <circle cx="96" cy="176" r="8" fill={PALETTE.ink} />
    </Frame>
  );
}

function PhysicsCEmArt() {
  return (
    <Frame wash={PALETTE.accentMuted}>
      <rect x="268" y="24" width="56" height="176" rx="6" fill={PALETTE.primary} opacity="0.22" />
      {Array.from({ length: 5 }, (_, i) => (
        <path
          key={i}
          d={`M40 ${36 + i * 36} C 180 ${16 + i * 36}, 400 ${56 + i * 36}, 552 ${36 + i * 36}`}
          fill="none"
          stroke={PALETTE.accent}
          strokeWidth="4"
        />
      ))}
    </Frame>
  );
}

const ART: Record<string, () => JSX.Element> = {
  "ap-csp": CspArt,
  "ap-csa": CsaArt,
  "ap-calc-ab": CalcAbArt,
  "ap-calc-bc": CalcBcArt,
  "ap-stats": StatsArt,
  "ap-precalc": PrecalcArt,
  "ap-physics-1": Physics1Art,
  "ap-physics-2": Physics2Art,
  "ap-physics-c-mech": PhysicsCMechArt,
  "ap-physics-c-em": PhysicsCEmArt,
  "ap-chem": ChemArt,
  "ap-bio": BioArt,
  "ap-envsci": EnvsciArt,
  "ap-psych": PsychArt,
};

export const ORIGINAL_CARD_NAMESPACES = Object.keys(ART);

export function CourseCardArt({ namespace }: { namespace: string }) {
  const Art = ART[namespace];
  if (!Art) return null;
  return <Art />;
}
