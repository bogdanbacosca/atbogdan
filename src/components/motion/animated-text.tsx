import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useHydrationSafeReduce } from "./use-hydration-safe-reduce";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "-8% 0px" } as const;

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Extra classes on each animated token (e.g. hover color transitions). */
  innerClassName?: string;
  /** Overrides the shared whileInView rootMargin. A positive bottom margin
      (e.g. "0px 0px 10% 0px") triggers earlier — while the element is still
      below the fold; a more-negative one triggers later. */
  margin?: string;
};

/**
 * Word-level masked rise for headings: each word rises out of an overflow
 * mask and unblurs, staggered left to right. The full string stays available
 * to screen readers via aria-label.
 */
export function AnimatedWords({ text, className, delay = 0, stagger = 0.05, innerClassName, margin }: SplitTextProps) {
  const reduce = useHydrationSafeReduce();
  const words = text.split(" ");

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: margin ?? VIEWPORT.margin }}
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
            className={cn("inline-block will-change-transform", innerClassName)}
            variants={{
              hidden: { y: "112%", opacity: 0, filter: "blur(5px)" },
              visible: {
                y: "0%",
                opacity: 1,
                filter: "blur(0px)",
                transition: { duration: 0.65, ease: EASE },
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

/**
 * Character-level masked rise for short display text (kickers, domain names,
 * indexes): every character rises out of its own mask and unblurs. Spaces are
 * kept as plain, non-animated gaps.
 */
export function AnimatedChars({ text, className, delay = 0, stagger = 0.025, innerClassName, margin }: SplitTextProps) {
  const reduce = useHydrationSafeReduce();
  const chars = Array.from(text);

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: margin ?? VIEWPORT.margin }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {chars.map((char, index) =>
        char === " " ? (
          <span key={`space-${index}`} aria-hidden="true">
            {"\u00A0"}
          </span>
        ) : (
          <span
            key={`char-${index}`}
            aria-hidden="true"
            className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em]"
          >
            <motion.span
              className={cn("inline-block will-change-transform", innerClassName)}
              variants={{
                hidden: { y: "115%", opacity: 0, filter: "blur(6px)" },
                visible: {
                  y: "0%",
                  opacity: 1,
                  filter: "blur(0px)",
                  transition: { duration: 0.5, ease: EASE },
                },
              }}
            >
              {char}
            </motion.span>
          </span>
        ),
      )}
    </motion.span>
  );
}

/**
 * Word-level soft cascade for paragraphs and bodies: each word fades in and
 * rises a few pixels while unblurring, in a fast stagger so long copy reads
 * as a gentle wave rather than a distraction.
 */
export function AnimatedText({ text, className, delay = 0, stagger = 0.012, innerClassName, margin }: SplitTextProps) {
  const reduce = useHydrationSafeReduce();
  const words = text.split(" ");

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: margin ?? VIEWPORT.margin }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          className={cn("inline-block will-change-transform", innerClassName)}
          variants={{
            hidden: { opacity: 0, y: 8, filter: "blur(3px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.4, ease: EASE },
            },
          }}
        >
          {word}
          {index < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
