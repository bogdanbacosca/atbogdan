import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type AnimatedWordsProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
};

/**
 * Splits a heading into words and reveals each one with a staggered
 * rise-from-below mask animation when it scrolls into view.
 * The full string stays available to screen readers via aria-label.
 */
export function AnimatedWords({ text, className, delay = 0, stagger = 0.05 }: AnimatedWordsProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em]"
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "112%", opacity: 0 },
              visible: {
                y: "0%",
                opacity: 1,
                transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
