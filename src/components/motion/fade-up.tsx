import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useHydrationSafeReduce } from "./use-hydration-safe-reduce";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type FadeUpProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Element to render — "span" gets inline-block so transforms apply. */
  as?: "span" | "div" | "li";
};

/**
 * Single-element entrance: fades up with a soft blur when it scrolls into
 * view. Use it to animate individual text elements (labels, links, list
 * items) instead of relying on a parent block animation.
 */
export function FadeUp({ children, className, delay = 0, y = 12, as = "div" }: FadeUpProps) {
  const reduce = useHydrationSafeReduce();

  if (reduce) {
    if (as === "span") {
      return <span className={cn("inline-block", className)}>{children}</span>;
    }
    if (as === "li") {
      return <li className={cn(className)}>{children}</li>;
    }
    return <div className={cn(className)}>{children}</div>;
  }

  const Comp =
    as === "span" ? motion.span : as === "li" ? motion.li : motion.div;

  return (
    <Comp
      className={cn(as === "span" && "inline-block", className)}
      initial={{ opacity: 0, y, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}