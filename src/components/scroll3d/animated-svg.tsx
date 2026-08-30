import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Small animated SVG set for the scroll experience. All glyphs are geometric
 * (strokes / lucide icons) — no hand-drawn illustration — and animate
 * transform/opacity/stroke only, so they are cheap to render. `motion`
 * animates them on the client after SSR, which keeps hydration identical.
 */

/** Animated `</>` dev glyph: the strokes draw themselves in an infinite loop. */
export function DevGlyph({ className }: { className?: string }) {
  const draw = {
    pathLength: [0, 1, 1, 0],
    transition: {
      duration: 3.8,
      repeat: Infinity,
      ease: "easeInOut" as const,
      times: [0, 0.3, 0.7, 1],
    },
  };
  const delay = (d: number) => ({ ...draw, transition: { ...draw.transition, delay: d } });
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
      <motion.path
        d="M24 17 L11 32 L24 47"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={draw}
      />
      <motion.path
        d="M40 17 L53 32 L40 47"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={delay(0.2)}
      />
      <motion.line
        x1="36"
        y1="14"
        x2="28"
        y2="50"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={delay(0.4)}
      />
    </svg>
  );
}

/** Softly pulses any SVG-based icon (lucide etc.) — an understated loop. */
export function PulseIcon({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.span
      aria-hidden="true"
      className={cn("inline-flex shrink-0", className)}
      animate={{ scale: [1, 1.14, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.span>
  );
}

/* Shared "draw itself in a loop" animation used by the service glyphs. */
const drawLoop = (delay = 0, duration = 2.8) => ({
  pathLength: [0, 1, 1, 0],
  opacity: [0.35, 1, 1, 0.35],
  transition: {
    duration,
    repeat: Infinity,
    ease: "easeInOut" as const,
    times: [0, 0.35, 0.75, 1],
    delay,
  },
});

/** Browser window whose content lines type themselves — "creare site-uri web". */
export function BrowserGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
      <rect x="7" y="11" width="50" height="42" rx="6" stroke="currentColor" strokeWidth="3" />
      <line x1="7" y1="21" x2="57" y2="21" stroke="currentColor" strokeWidth="3" />
      <circle cx="14" cy="16" r="1.6" fill="currentColor" />
      <circle cx="19.5" cy="16" r="1.6" fill="currentColor" />
      <circle cx="25" cy="16" r="1.6" fill="currentColor" />
      <motion.line
        x1="14"
        y1="30"
        x2="42"
        y2="30"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={drawLoop(0)}
      />
      <motion.line
        x1="14"
        y1="38"
        x2="50"
        y2="38"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={drawLoop(0.3)}
      />
      <motion.line
        x1="14"
        y1="46"
        x2="32"
        y2="46"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={drawLoop(0.6)}
      />
    </svg>
  );
}

/** Terminal prompt with a running command and blinking caret — "programare". */
export function TerminalGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
      <rect x="7" y="11" width="50" height="42" rx="6" stroke="currentColor" strokeWidth="3" />
      <motion.path
        d="M15 27 L23 34 L15 41"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={drawLoop(0, 3)}
      />
      <motion.line
        x1="28"
        y1="41"
        x2="44"
        y2="41"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={drawLoop(0.5, 3)}
      />
      <motion.rect
        x="49"
        y="37"
        width="4.5"
        height="8"
        rx="1"
        fill="currentColor"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
      />
    </svg>
  );
}

/** Palette with swatches pulsing in sequence — "design grafic". */
export function PaletteGlyph({ className }: { className?: string }) {
  const swatches = [
    { cx: 21, cy: 23 },
    { cx: 43, cy: 23 },
    { cx: 21, cy: 41 },
    { cx: 43, cy: 41 },
  ];
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
      <rect x="7" y="11" width="50" height="42" rx="6" stroke="currentColor" strokeWidth="3" />
      <motion.circle
        cx="32"
        cy="32"
        r="19"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="3 7"
        opacity="0.45"
        animate={{ strokeDashoffset: [0, -40] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      {swatches.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r="6.5"
          stroke="currentColor"
          strokeWidth="3"
          animate={{ r: [6.5, 8, 6.5], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        />
      ))}
    </svg>
  );
}