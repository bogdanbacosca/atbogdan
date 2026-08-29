import { Link } from "@tanstack/react-router";
import { ArrowDownRight } from "lucide-react";
import { motion } from "motion/react";
import { ParticleSphere } from "@/components/canvas/particle-sphere";
import { Magnetic } from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";
import { hero, stats } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,color-mix(in_oklab,var(--color-primary)_22%,transparent),transparent_55%)]" />
      <div className="mx-auto grid max-w-[1240px] items-center gap-8 px-5 pt-10 pb-12 md:gap-12 md:px-8 md:pt-16 md:pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-12 lg:pt-20 lg:pb-8">
        <div>
          <motion.p
            className="text-xs tracking-[0.22em] text-primary uppercase"
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {hero.kicker}
          </motion.p>
          <motion.h1
            className="mt-4 font-display text-display text-cream"
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {hero.title}
          </motion.h1>
          <motion.p
            className="mt-5 max-w-xl text-lead text-muted"
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            {hero.subtitle}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <Magnetic>
              <Button asChild size="lg">
                <Link to="/contact">{hero.cta}</Link>
              </Button>
            </Magnetic>
            <Button asChild variant="outline" size="lg">
              <Link to="/portofoliu">
                {hero.secondary}
                <ArrowDownRight className="size-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[520px] lg:max-w-none">
          <div className="absolute inset-[12%] rounded-full bg-primary/20 blur-3xl" />
          <ParticleSphere className="relative z-10" />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1240px] gap-px border-y border-border bg-border px-0 md:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.label}
            className="bg-bg px-5 py-6 md:px-8 md:py-8 lg:px-12"
          >
            <p className="font-mono text-sm tracking-[0.18em] text-primary uppercase">
              {item.value}
            </p>
            <p className="mt-2 font-display text-xl text-cream">{item.label}</p>
            <p className="mt-2 max-w-xs text-sm text-muted">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
