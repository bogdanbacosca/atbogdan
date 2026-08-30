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

/** Desktop + phone wireframe drawing themselves — "creare site-uri web", pe desktop și mobil. */
export function ResponsiveGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
      {/* monitor */}
      <rect x="5" y="9" width="38" height="28" rx="4" stroke="currentColor" strokeWidth="3" />
      {/* stand draws in after the screen */}
      <motion.path
        d="M24 37 V43"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={drawLoop(0.9, 2.8)}
      />
      <motion.line
        x1="16"
        y1="46"
        x2="32"
        y2="46"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={drawLoop(1.05, 2.8)}
      />
      {/* screen content */}
      <motion.line
        x1="11"
        y1="17"
        x2="30"
        y2="17"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={drawLoop(0)}
      />
      <motion.line
        x1="11"
        y1="23"
        x2="37"
        y2="23"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={drawLoop(0.3)}
      />
      <motion.line
        x1="11"
        y1="29"
        x2="24"
        y2="29"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={drawLoop(0.6)}
      />
      {/* phone beside the monitor */}
      <rect x="45" y="24" width="14" height="27" rx="3.5" stroke="currentColor" strokeWidth="3" />
      <motion.line
        x1="49"
        y1="31"
        x2="55"
        y2="31"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={drawLoop(1.2)}
      />
      <motion.line
        x1="49"
        y1="36"
        x2="53"
        y2="36"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={drawLoop(1.4)}
      />
      <circle cx="52" cy="46.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

/** Curly braces with a blinking caret — "programare și elemente custom". */
export function CustomCodeGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
      <motion.path
        d="M25 11 C20 11 18 14 18 18 V25 C18 29 16 31 12 32 C16 33 18 35 18 39 V46 C18 50 20 53 25 53"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={drawLoop(0, 3.2)}
      />
      <motion.path
        d="M39 11 C44 11 46 14 46 18 V25 C46 29 48 31 52 32 C48 33 46 35 46 39 V46 C46 50 44 53 39 53"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={drawLoop(0.35, 3.2)}
      />
      {/* caret blinking between the braces */}
      <motion.line
        x1="32"
        y1="26"
        x2="32"
        y2="38"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
      />
    </svg>
  );
}

/** Bezier curve with anchors and handles — "design grafic" (vector / logo). */
export function PenToolGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" className={className}>
      {/* the curve draws itself */}
      <motion.path
        d="M10 50 C20 16 44 16 54 50"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={drawLoop(0, 3.4)}
      />
      {/* control handles */}
      <motion.path
        d="M10 50 L24 27"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ opacity: [0.3, 0.85, 0.3] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M54 50 L40 27"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ opacity: [0.3, 0.85, 0.3] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.circle
        cx="24"
        cy="27"
        r="3"
        stroke="currentColor"
        strokeWidth="2.5"
        animate={{ r: [3, 4.2, 3], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.circle
        cx="40"
        cy="27"
        r="3"
        stroke="currentColor"
        strokeWidth="2.5"
        animate={{ r: [3, 4.2, 3], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
      />
      {/* anchor points pulsing in turn */}
      <motion.rect
        x="7"
        y="47"
        width="6"
        height="6"
        rx="1.5"
        fill="currentColor"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.rect
        x="51"
        y="47"
        width="6"
        height="6"
        rx="1.5"
        fill="currentColor"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
    </svg>
  );
}