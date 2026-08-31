import { cn } from "@/lib/utils";

/**
 * The 3D skill ring — now back in the fixed background stage, anchored to the
 * flow between the stack and services chapters. The generous padding added to
 * those two sections creates a visual gutter where the ring shines through, so
 * it reads as part of the page instead of an isolated band.
 *
 * Every card shows the skill name plus a short, real description — the stack
 * itself comes straight from this project (React, TanStack, Tailwind, Vite,
 * Node.js…).
 */

const STACK = [
  { label: "HTML5", tint: "text-primary", tag: "structură semantică" },
  { label: "CSS3", tint: "text-blush", tag: "layout & animații" },
  { label: "JS", tint: "text-cream", tag: "interactivitate" },
  { label: "TypeScript", tint: "text-primary", tag: "types la scară" },
  { label: "React", tint: "text-cream", tag: "interfețe dinamice" },
  { label: "Tailwind", tint: "text-blush", tag: "stilare rapidă" },
  { label: "Vite", tint: "text-primary", tag: "build instant" },
  { label: "Node.js", tint: "text-cream", tag: "backend & tooling" },
  { label: "TanStack", tint: "text-blush", tag: "router + query" },
  { label: "Git", tint: "text-primary", tag: "versionare curată" },
  { label: "SEO", tint: "text-blush", tag: "vizibilitate Google" },
  { label: "Meta", tint: "text-cream", tag: "certificat front-end" },
] as const;

function StackCard({
  label,
  tint,
  tag,
  index,
  total,
}: {
  label: string;
  tint: string;
  tag: string;
  index: number;
  total: number;
}) {
  const angle = (index / total) * 360;
  return (
    <div
      aria-hidden="true"
      className="absolute top-1/2 left-1/2 flex h-16 w-16 flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border border-border-strong bg-bg-elevated/95 shadow-[0_28px_64px_-26px_rgba(0,0,0,0.9),0_0_26px_color-mix(in_oklab,var(--color-primary)_20%,transparent),inset_0_1px_0_color-mix(in_oklab,white_10%,transparent)] will-change-transform md:h-24 md:w-24"
      style={{
        transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(var(--wheel-r))`,
      }}
    >
      <span className={cn("max-w-full px-0.5 text-center font-display text-xs leading-tight md:text-lg", tint)}>
        {label}
      </span>
      <span className="max-w-[4.5rem] px-0.5 text-center text-[8px] leading-tight tracking-[0.04em] text-muted md:max-w-[6rem] md:text-[10px]">
        {tag}
      </span>
    </div>
  );
}

export function SkillsRing() {
  return (
    <div className="flex h-[min(84vw,520px)] w-[min(84vw,520px)] items-center justify-center">
      <div className="relative h-full w-full" style={{ perspective: "1000px", WebkitPerspective: "1000px" }}>
        <div className="wheel-ring wheel-spin absolute inset-0">
          {STACK.map((item, i) => (
            <StackCard
              key={item.label}
              label={item.label}
              tint={item.tint}
              tag={item.tag}
              index={i}
              total={STACK.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
}