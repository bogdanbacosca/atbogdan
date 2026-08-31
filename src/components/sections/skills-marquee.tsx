import { FadeUp } from "@/components/motion/fade-up";

/** High-level service story scrolling in the band under the hero — the
    offering, not the raw library names (those live on the 3D tech ring). */
const MARQUEE_ITEMS = [
  "Site-uri Web",
  "Web Design",
  "Programare",
  "Design Grafic",
  "Branding",
  "UI/UX",
  "SEO",
  "Promovare",
  "E-commerce",
  "Optimizare",
  "Maintenance",
  "Identitate vizuală",
] as const;

export function SkillsMarquee() {
  const loop = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <FadeUp className="overflow-hidden border-y border-border bg-bg-elevated py-4" y={0} margin="-18% 0px">
      <div className="marquee-track gap-8 px-4">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-8 font-display text-xl text-cream/80 md:text-2xl"
          >
            {item}
            <span className="size-1.5 rounded-full bg-primary" />
          </span>
        ))}
      </div>
    </FadeUp>
  );
}
