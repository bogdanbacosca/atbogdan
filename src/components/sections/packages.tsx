import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { packages } from "@/lib/site";
import { Reveal } from "@/components/motion/reveal";
import { AnimatedWords } from "@/components/motion/animated-text";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Packages() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-10 md:px-8 md:py-14 lg:px-12">
      <Reveal>
        <p className="text-xs tracking-[0.22em] text-primary uppercase">Pachete de servicii</p>
      </Reveal>
      <h2 className="mt-3 font-display text-title text-cream">
        <AnimatedWords text="Alege planul potrivit" stagger={0.055} />
      </h2>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((plan, i) => (
          <Reveal key={plan.id} delay={i * 0.08}>
            <article
              className={cn(
                "group flex h-full flex-col rounded-xl border p-6 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1.5 md:p-7",
                plan.featured
                  ? "border-primary bg-primary text-cream shadow-[var(--shadow-glow)] hover:shadow-[0_28px_80px_-20px_color-mix(in_oklab,var(--color-primary)_60%,transparent)]"
                  : "border-border bg-surface hover:border-border-strong hover:shadow-[0_24px_50px_-24px_color-mix(in_oklab,var(--color-primary)_35%,transparent)]",
              )}
            >
              <p
                className={cn(
                  "text-xs tracking-[0.18em] uppercase",
                  plan.featured ? "text-cream/80" : "text-primary",
                )}
              >
                {plan.subtitle}
              </p>
              <h3 className="mt-2 font-display text-3xl">{plan.name}</h3>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 w-full" variant={plan.featured ? "cream" : "outline"}>
                <Link to="/contact">Alege plan</Link>
              </Button>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
