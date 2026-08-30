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