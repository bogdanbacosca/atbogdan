import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const CHAPTERS = [
  { id: "start", label: "terminal" },
  { id: "stack", label: "stack" },
  { id: "servicii", label: "services" },
  { id: "portofoliu", label: "git" },
  { id: "contact", label: "deploy" },
] as const;

/** End of each chapter on the 0→1 scroll progress scale (mirrors the scene). */
const EDGES = [0.22, 0.46, 0.7, 0.88, 1.01];

/**
 * Fixed navigation chrome for the scroll experience: a scroll-linked progress
 * bar under the header, a chapter rail (native anchor links + CSS smooth
 * scroll — no wheel/touch event handling anywhere) and a live chapter label.
 */
export function Scroll3dChrome() {
  const { scrollYProgress } = useScroll();
  const sp = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.6 });
  const [active, setActive] = useState(0);

  /* The chapter counter fades away before the footer text arrives. */
  const counterFade = useTransform(sp, [0.93, 0.985], [1, 0]);

  useMotionValueEvent(sp, "change", (v) => {
    const idx = EDGES.findIndex((edge) => v < edge);
    setActive(idx === -1 ? CHAPTERS.length - 1 : idx);
  });

  return (
    <>
      {/* scroll progress bar right under the fixed header */}
      <div
        aria-hidden="true"
        className="fixed inset-x-5 top-16 z-30 h-[3px] overflow-hidden rounded-full bg-border md:inset-x-8 md:top-[4.5rem] lg:inset-x-12"
      >
        <motion.div className="h-full origin-left rounded-full bg-primary" style={{ scaleX: sp }} />
      </div>

      {/* chapter rail (desktop) */}
      <nav
        aria-label="Capitole"
        className="fixed top-1/2 right-6 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex xl:right-8"
      >
        {CHAPTERS.map((chapter, i) => {
          const isActive = i === active;
          const isPassed = i < active;
          return (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-full py-1 pl-3 pr-1 transition-colors",
                isActive ? "text-cream" : "text-muted hover:text-cream",
              )}
            >
              <span
                className={cn(
                  "font-mono text-xs uppercase tracking-[0.16em] transition-opacity",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70",
                )}
              >
                {chapter.label}
              </span>
              <span
                className={cn(
                  "size-2.5 rounded-full border transition-all duration-300",
                  isActive
                    ? "border-primary bg-primary shadow-[0_0_14px_color-mix(in_oklab,var(--color-primary)_70%,transparent)]"
                    : isPassed
                      ? "border-primary/70 bg-primary/70"
                      : "border-border-strong bg-transparent",
                )}
              />
            </a>
          );
        })}
      </nav>

      {/* live chapter counter — fades out as the footer scrolls into view */}
      <motion.div
        style={{ opacity: counterFade }}
        className="pointer-events-none fixed bottom-5 left-5 z-30 font-mono text-xs tracking-[0.18em] text-muted uppercase md:bottom-6 md:left-8 lg:left-12"
      >
        <span className="text-primary">ch.0{active + 1}</span>
        <span className="text-border-strong"> / 05</span>
        <span className="ml-3 hidden sm:inline">— {CHAPTERS[active].label}</span>
      </motion.div>
    </>
  );
}