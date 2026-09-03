import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight, ArrowUpRight, ChevronDown, GitBranch, Github, Mail, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { AnimatedChars, AnimatedText, AnimatedWords } from "@/components/motion/animated-text";
import { FadeUp } from "@/components/motion/fade-up";
import { Magnetic } from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";
import { CustomCodeGlyph, PenToolGlyph, PulseIcon, ResponsiveGlyph } from "@/components/scroll3d/animated-svg";
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
  paddingClassName,
}: {
  id: string;
  className?: string;
  children: ReactNode;
  gridClassName?: string;
  /** Overrides the default vertical padding (used to open a wider gutter
      where the background skill ring shows through). */
  paddingClassName?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative z-10 flex min-h-svh scroll-mt-24 items-center",
        paddingClassName ?? "py-24 md:py-28",
        className,
      )}
    >
      <div className={cn("mx-auto w-full max-w-[1240px] px-5 md:px-8 lg:px-12", gridClassName)}>
        {children}
      </div>
    </section>
  );
}

function Kicker({ children, margin }: { children: ReactNode; margin?: string }) {
  return (
    <p className="font-mono text-xs tracking-[0.22em] text-primary uppercase">
      <AnimatedChars text={String(children)} stagger={0.018} margin={margin} />
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
          <Kicker>// import &#123; site &#125; din "@bogdan"</Kicker>
          <h1 className="mt-4 font-display text-display text-cream">
            <AnimatedWords text={hero.title} delay={0.15} stagger={0.05} />
          </h1>
          <p className="mt-5 max-w-xl text-lead text-muted">
            <AnimatedText text={hero.subtitle} delay={0.5} stagger={0.012} />
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <FadeUp delay={0.7} className="w-fit">
              <Magnetic>
                <Button asChild size="lg">
                  <Link to="/contact">
                    {hero.cta}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </Magnetic>
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
                top of the left container. Left-aligned on mobile, pushed to
                the right edge from md up — visible on every breakpoint now. */}
            <div className="float-slow relative w-fit justify-self-start md:justify-self-end">
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
          <AnimatedChars text="derulează pentru a explora" delay={1.05} stagger={0.02} />
          <ChevronDown className="nudge size-4 text-primary" />
        </a>
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* Ch. 2 — Stack / despre                                              */
/* ------------------------------------------------------------------ */

function PaperclipMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 44" fill="none" aria-hidden="true" className={className}>
      <path
        d="M10 16V8.5c0-3.3 2.7-5.5 5.5-5.5S21 5.2 21 8.5v23c0 5-4 8.5-8.5 8.5S4 36.5 4 31.5V14c0-2.5 2-4.5 4.5-4.5S13 11.5 13 14v16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DiplomaSeal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <circle cx="24" cy="24" r="22" fill="currentColor" />
      <circle cx="24" cy="24" r="16.5" fill="none" stroke="var(--color-cream)" strokeWidth="1.4" />
      <circle cx="24" cy="24" r="11" fill="none" stroke="var(--color-cream)" strokeWidth="1" />
      <path
        d="M18 24.5 L22 28.5 L31 18"
        fill="none"
        stroke="var(--color-cream)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const GH_HEAT = [
  0.18, 0.42, 0.72, 0.28, 0.95, 0.55, 0.22, 0.8,
  0.35, 0.88, 0.48, 0.16, 0.64, 0.32, 0.84, 0.5,
  0.22, 0.76, 0.4, 1, 0.3, 0.58, 0.2, 0.9,
];

function AttachmentCard({
  item,
  variant,
}: {
  item: (typeof differentiators)[number];
  variant: "cert" | "github";
}) {
  const isCert = variant === "cert";
  return (
    <div className="relative">
      {/* Each card is pinned with its own mark: a paperclip for the paper
          document, a GitHub monogram for the open-source profile. */}
      {isCert ? (
        <PaperclipMark className="pointer-events-none absolute -top-4 left-5 z-20 h-11 w-7 -rotate-[18deg] text-ink/75 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" />
      ) : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-3 left-6 z-20 flex size-9 items-center justify-center rounded-full border border-primary/40 bg-bg-elevated text-primary shadow-[0_6px_18px_-6px_rgba(0,0,0,0.7)]"
        >
          <Github className="size-4" />
        </span>
      )}
      <div
        className={cn(
          "relative transition-[transform,box-shadow] duration-300 ease-out group-hover:-translate-y-1",
          isCert
            ? "rounded-[6px] bg-cream text-ink shadow-[2px_2px_0_0_color-mix(in_oklab,var(--color-ink)_14%,transparent),6px_6px_0_0_color-mix(in_oklab,var(--color-primary)_58%,transparent)] ring-1 ring-ink/15 group-hover:shadow-[3px_3px_0_0_color-mix(in_oklab,var(--color-ink)_14%,transparent),10px_10px_0_0_color-mix(in_oklab,var(--color-primary)_72%,transparent)]"
            : "rounded-[6px] bg-bg-elevated text-cream shadow-[2px_2px_0_0_color-mix(in_oklab,var(--color-cream)_18%,transparent),6px_6px_0_0_color-mix(in_oklab,var(--color-primary)_55%,transparent)] ring-1 ring-cream/15 group-hover:shadow-[3px_3px_0_0_color-mix(in_oklab,var(--color-cream)_22%,transparent),10px_10px_0_0_color-mix(in_oklab,var(--color-primary)_70%,transparent)]",
        )}
      >
        <span
          className={cn(
            "absolute -top-2.5 right-6 z-10 rounded-t-md px-2.5 py-0.5 font-mono text-[10px] tracking-[0.18em] uppercase",
            isCert ? "bg-primary text-cream" : "border border-primary/40 bg-bg text-primary",
          )}
        >
          {isCert ? "cert." : "github"}
        </span>
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 rounded-l-[6px] bg-primary" />

        <div className="relative overflow-hidden rounded-[6px] pl-1.5">
          {isCert ? (
            <>
              {/* classic certificate double-rule frame */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-[6px] z-10 rounded-[3px] border border-ink/10"
              />
              {/* folded page corner */}
              <span
                aria-hidden="true"
                className="absolute right-0 bottom-0 z-10 size-0 border-b-[12px] border-l-[12px] border-b-ink/10 border-l-transparent"
              />
              <div className="p-1.5 pb-0">
                <div className="relative overflow-hidden rounded-[4px] ring-1 ring-ink/10">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="aspect-[21/9] w-full object-cover outline outline-1 -outline-offset-1 outline-ink/15 transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <DiplomaSeal className="absolute right-2 bottom-2 size-10 text-primary drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2 border-b border-cream/10 bg-bg px-3 py-1.5 font-mono text-[10px] tracking-wide text-muted">
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
                  bogdanbacosca
                  <span className="text-cream/25">/</span>
                  <span className="text-cream/80">open-source</span>
                </span>
                <GitBranch aria-hidden="true" className="size-3 text-muted/70" />
              </div>
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="aspect-[21/9] w-full object-cover opacity-90 outline outline-1 -outline-offset-1 outline-cream/10 transition-[transform,opacity] duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-wrap justify-between px-3 py-2" aria-hidden="true">
                {GH_HEAT.map((op, i) => (
                  <span
                    key={i}
                    className="size-2 rounded-[2px] bg-primary ring-1 ring-inset ring-cream/10"
                    style={{ opacity: op }}
                  />
                ))}
              </div>
            </>
          )}

          <div className={cn("px-4 pb-4", isCert ? "pt-3" : "pt-1")}>
            <p
              className={cn(
                "font-mono text-[10px] tracking-[0.18em] uppercase",
                isCert ? "text-primary" : "text-primary",
              )}
            >
              {item.eyebrow}
            </p>
            <h3
              className={cn(
                "mt-1.5 font-display text-lg md:text-xl",
                isCert ? "text-ink" : "text-cream",
              )}
            >
              {item.title}
            </h3>
            <p
              className={cn(
                "mt-1 text-sm leading-relaxed",
                isCert ? "text-ink/60" : "text-muted",
              )}
            >
              {item.body}
            </p>
            <span
              className={cn(
                "mt-2.5 inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.1em] uppercase transition-colors",
                isCert ? "text-ink group-hover:text-primary" : "text-cream group-hover:text-primary",
              )}
            >
              {item.cta}
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StackChapter() {
  return (
    <Chapter
      id="stack"
      paddingClassName="py-24 pb-48 md:pb-64"
      gridClassName="md:grid md:grid-cols-[1.05fr_0.95fr] lg:pr-24"
    >
      <div className="max-w-xl">
        <Panel>
          <Kicker>// about.ts — despre mine</Kicker>
          <h2 className="mt-3 font-display text-title text-cream">
            <AnimatedWords text={about.title} delay={0.1} />
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-lead">
            <AnimatedText text={about.body} delay={0.2} stagger={0.008} />
          </p>

        </Panel>
      </div>
      <div className="mt-12 flex flex-col items-center justify-center gap-7 md:mt-0 md:gap-10">
        {differentiators.slice(0, 2).map((item, i) => (
          <FadeUp
            key={item.id}
            /* Individual entrances: the cert paper lands first, the GitHub
               card follows from a touch further away. */
            delay={i === 0 ? 0.3 : 0.5}
            y={i === 0 ? 18 : 28}
            className="w-full max-w-[350px] lg:max-w-[340px]"
          >
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "group block w-full",
                i === 0 ? "float-slower" : "float-slow",
              )}
            >
              <AttachmentCard item={item} variant={item.id === "meta" ? "cert" : "github"} />
            </a>
          </FadeUp>
        ))}
      </div>
    </Chapter>
  );
}

/* ------------------------------------------------------------------ */
/* Ch. 3 — Editor / servicii                                           */
/* ------------------------------------------------------------------ */

/* One small animated glyph per service, matched by the service index
   in site.ts (01 = creare site-uri web, 02 = programare, 03 = design grafic). */
const SERVICE_GLYPHS: Record<(typeof services)[number]["index"], typeof ResponsiveGlyph> = {
  "01": ResponsiveGlyph,
  "02": CustomCodeGlyph,
  "03": PenToolGlyph,
};

function ServicesChapter() {
  return (
    <Chapter id="servicii" paddingClassName="py-24 pt-48 md:pt-64" gridClassName="lg:pr-24">
      {/* Casetă aliniată la dreapta: fereastra de editor care se animă în
          stânga scenei rămâne vizibilă, iar mr-ul ține distanța față de
          rail-ul de capitole. */}
      <div className="max-w-2xl md:ml-auto lg:mr-12">
        <Panel>
          <Kicker>// services.ts — ce construiesc</Kicker>
          <h2 className="mt-3 font-display text-title text-cream">
            <AnimatedWords text="De la idee la site live" delay={0.1} />
          </h2>
          <ul className="mt-6 space-y-5">
            {services.map((service, i) => {
              const Glyph = SERVICE_GLYPHS[service.index];
              return (
                <FadeUp key={service.index} delay={0.12 + i * 0.08} as="li">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-elevated text-primary lg:size-14">
                      <Glyph className="size-7 lg:size-8" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-cream md:text-xl">
                        <span className="mr-2 font-mono text-sm text-primary">{service.index}</span>
                        {service.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{service.body}</p>
                    </div>
                  </div>
                </FadeUp>
              );
            })}
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
          {/* Trigger earlier than the shared -8% margin: the kicker starts
              typing while the chapter is still sliding into view, in step
              with the git-log window animating behind it. */}
          <Kicker margin="0px 0px 10% 0px">// git log --oneline</Kicker>
          <h2 className="mt-3 font-display text-title text-cream">
            <AnimatedWords text="Proiecte recente" delay={0.1} />
          </h2>
          <ul className="mt-6 space-y-3">
            {projects.map((project, i) => (
              <FadeUp key={project.slug} delay={0.12 + i * 0.08} as="li">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-bg-elevated px-4 py-3 transition-colors hover:border-primary/60"
                >
                  <img
                    src={project.image}
                    alt={`Captură ${project.domain}`}
                    className="h-11 w-16 shrink-0 rounded-lg border border-border object-cover"
                    loading="lazy"
                  />
                  <span className="font-mono text-sm text-muted">{project.year}</span>
                  <span className="flex-1 truncate text-sm font-medium text-cream group-hover:text-blush md:text-base">
                    {project.domain}
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
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
          <h2 className="mt-3 font-display text-title text-cream">
            <AnimatedWords text={cta.title} delay={0.1} />
          </h2>
          <p className="mt-3 text-lead text-muted">
            <AnimatedText text={cta.body} delay={0.2} />
          </p>
          <FadeUp delay={0.25} className="mt-7 flex justify-center">
            <Magnetic>
              <Button asChild size="lg">
                <Link to="/contact">
                  {cta.button}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Magnetic>
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
      {/* The 3D skill ring lives in the fixed background stage, visible in
          the spacious gutter opened by the padding above and below — it reads
          as part of the page instead of its own isolated band. */}
      <ServicesChapter />
      <PortfolioChapter />
      <ContactChapter />
    </>
  );
}
