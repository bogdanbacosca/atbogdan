import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight, ArrowUpRight, ChevronDown, Mail, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { AnimatedChars, AnimatedText, AnimatedWords } from "@/components/motion/animated-text";
import { FadeUp } from "@/components/motion/fade-up";
import { Button } from "@/components/ui/button";
import { PulseIcon } from "@/components/scroll3d/animated-svg";
import { SkillsMarquee } from "@/components/sections/skills-marquee";
import { about, cta, differentiators, hero, projects, services, site, skills } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Chapter scaffolding                                                 */
/* ------------------------------------------------------------------ */

function Chapter({
  id,
  className,
  children,
  gridClassName,
}: {
  id: string;
  className?: string;
  children: ReactNode;
  gridClassName?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative z-10 flex min-h-svh scroll-mt-24 items-center py-24 md:py-28",
        className,
      )}
    >
      <div className={cn("mx-auto w-full max-w-[1240px] px-5 md:px-8 lg:px-12", gridClassName)}>
        {children}
      </div>
    </section>
  );
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs tracking-[0.22em] text-primary uppercase">
      <AnimatedChars text={String(children)} stagger={0.018} />
    </p>
  );
}

function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("scroll-panel p-6 sm:p-8 lg:p-10", className)}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Ch. 1 — Terminal / hero                                             */
/* ------------------------------------------------------------------ */

function HeroChapter() {
  return (
    <Chapter id="start">
      <div className="mx-auto grid w-full max-w-[1240px] items-center gap-8 md:grid-cols-[1.05fr_0.95fr] lg:pr-24">
        <div className="text-glow">
          <Kicker>// import &#123; site &#125; din &quot;@bogdan&quot;</Kicker>
          <h1 className="mt-4 font-display text-display text-cream">
            <AnimatedWords text={hero.title} delay={0.15} stagger={0.05} />
          </h1>
          <p className="mt-5 max-w-xl text-lead text-muted">
            <AnimatedText text={hero.subtitle} delay={0.5} stagger={0.012} />
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <FadeUp delay={0.7} className="w-fit">
              <Button asChild size="lg">
                <Link to="/contact">
                  {hero.cta}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </FadeUp>
            <FadeUp delay={0.82} className="w-fit">
              <Button asChild variant="outline" size="lg">
                <Link to="/portofoliu">
                  {hero.secondary}
                  <ArrowDownRight className="size-4" />
                </Link>
              </Button>
            </FadeUp>
          </div>
        </div>

          <FadeUp delay={0.55} className="self-start">
            {/* Top-aligned with the text column, so it sits right next to the
                top of the left container. Centered on mobile, pushed to the
                right edge from md up — visible on every breakpoint now. */}
            <div className="float-slow relative w-fit justify-self-center md:justify-self-end">
              <div className="scroll-panel !p-2.5">
                <img
                  src="/brand/profile.jpg"
                  alt="Poză de profil — Bogdan"
                  className="aspect-[4/3] w-full max-w-[320px] rounded-xl object-cover sm:max-w-[400px] md:max-w-[460px]"
                  loading="eager"
                />
              </div>
            </div>
          </FadeUp>
        </div>

      <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2">
        <a
          href="#stack"
          className="flex flex-col items-center gap-2 font-mono text-xs tracking-[0.18em] text-muted uppercase transition-colors hover:text-cream"
        >
          derulează pentru a explora
          <ChevronDown className="nudge size-4 text-primary" />
        </a>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* Ch. 2 — Stack / despre                                              */
/* ------------------------------------------------------------------ */

function StackChapter() {
  return (
    <Chapter id="stack" gridClassName="md:grid md:grid-cols-[1.05fr_0.95fr] lg:pr-24">
      <div className="max-w-xl">
        <Panel>
          <Kicker>// about.ts — despre mine</Kicker>
          <h2 className="mt-3 font-display text-title text-cream">{about.title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-lead">{about.body}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <FadeUp key={skill} delay={0.15 + i * 0.04} y={6}>
                <span className="inline-block rounded-full border border-border bg-bg-elevated px-3.5 py-1.5 font-mono text-xs text-cream/85">
                  {skill}
                </span>
              </FadeUp>
            ))}
          </div>
        </Panel>
      </div>
      <FadeUp
        delay={0.35}
        className="mt-12 flex flex-col items-center justify-center gap-7 md:mt-0 md:gap-9"
      >
        {differentiators.slice(0, 2).map((item, i) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "group w-full max-w-[340px] lg:max-w-[380px]",
              i === 0 ? "float-slower" : "float-slow",
            )}
          >
            <div className="scroll-panel overflow-hidden !p-3 transition-transform duration-300 group-hover:-translate-y-1">
              <img
                src={item.image}
                alt={item.title}
                className="aspect-[16/10] w-full rounded-lg object-cover"
                loading="lazy"
              />
              <div className="px-2 pb-1 pt-3.5 text-center">
                <p className="font-mono text-[11px] tracking-[0.16em] text-primary uppercase">
                  {item.eyebrow}
                </p>
                <h3 className="mt-1 font-display text-lg text-cream md:text-xl">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.body}</p>
                <span className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.1em] text-cream uppercase transition-colors group-hover:text-primary">
                  {item.cta}
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </FadeUp>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* Ch. 3 — Editor / servicii                                           */
/* ------------------------------------------------------------------ */

function ServicesChapter() {
  return (
    <Chapter id="servicii">
      <div className="mx-auto max-w-xl">
        <Panel>
          <Kicker>// services.ts — ce construiesc</Kicker>
          <h2 className="mt-3 font-display text-title text-cream">De la idee la site live</h2>
          <ul className="mt-6 space-y-5">
            {services.map((service, i) => (
              <FadeUp key={service.index} delay={0.12 + i * 0.08} as="li">
                <div className="flex gap-4">
                  <span className="font-mono text-sm text-primary">{service.index}</span>
                  <div>
                    <h3 className="font-display text-lg text-cream md:text-xl">{service.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{service.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </ul>
        </Panel>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* Ch. 4 — Git / portofoliu                                            */
/* ------------------------------------------------------------------ */

function PortfolioChapter() {
  return (
    <Chapter id="portofoliu" gridClassName="md:grid md:grid-cols-[1.05fr_0.95fr] lg:pr-24">
      <div className="max-w-xl">
        <Panel>
          <Kicker>// git log --oneline</Kicker>
          <h2 className="mt-3 font-display text-title text-cream">Proiecte recente</h2>
          <ul className="mt-6 space-y-3">
            {projects.map((project, i) => (
              <FadeUp key={project.slug} delay={0.12 + i * 0.08} as="li">
                <Link
                  to="/portofoliu/$slug"
                  params={{ slug: project.slug }}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-bg-elevated px-4 py-3 transition-colors hover:border-primary/60"
                >
                  <img
                    src={project.image}
                    alt={`Captură ${project.domain}`}
                    className="h-11 w-16 shrink-0 rounded-lg border border-border object-cover"
                    loading="lazy"
                  />
                  <span className="font-mono text-sm text-muted">{project.year}</span>
                  <span className="flex-1 text-sm font-medium text-cream group-hover:text-blush md:text-base">
                    {project.domain}
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                </Link>
              </FadeUp>
            ))}
          </ul>
          <FadeUp delay={0.45} className="mt-6 w-fit">
            <Button asChild variant="outline">
              <Link to="/portofoliu">
                Toate proiectele
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </FadeUp>
        </Panel>
      </div>
      <div aria-hidden="true" className="hidden md:block" />
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* Ch. 5 — Deploy / contact                                            */
/* ------------------------------------------------------------------ */

function ContactChapter() {
  return (
    <Chapter id="contact">
      <div className="mx-auto max-w-2xl text-center">
        <Panel>
          <Kicker>// deploy.sh — lansare</Kicker>
          <h2 className="mt-3 font-display text-title text-cream">{cta.title}</h2>
          <p className="mt-3 text-lead text-muted">{cta.body}</p>
          <FadeUp delay={0.25} className="mt-7 flex justify-center">
            <Button asChild size="lg">
              <Link to="/contact">
                {cta.button}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </FadeUp>
          <FadeUp delay={0.4} className="mt-7">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs text-muted">
              <a href={site.phoneHref} className="link-underline inline-flex items-center gap-2 hover:text-cream">
                <PulseIcon>
                  <Phone className="size-3.5 text-primary" />
                </PulseIcon>{" "}
                {site.phonePretty}
              </a>
              <a href={`mailto:${site.email}`} className="link-underline inline-flex items-center gap-2 hover:text-cream">
                <PulseIcon delay={1.2}>
                  <Mail className="size-3.5 text-primary" />
                </PulseIcon>{" "}
                {site.email}
              </a>
            </div>
          </FadeUp>
        </Panel>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* Public sections                                                     */
/* ------------------------------------------------------------------ */

export function Scroll3dSections() {
  return (
    <>
      <HeroChapter />
      {/* Skills marquee restored from the previous layout: an endless band
          drifting left edge-to-edge. Sits in normal flow between chapters,
          lifted above the fixed 3D stage like the chapters themselves. */}
      <div className="relative z-10">
        <SkillsMarquee />
      </div>
      <StackChapter />
      <ServicesChapter />
      <PortfolioChapter />
      <ContactChapter />
    </>
  );
}