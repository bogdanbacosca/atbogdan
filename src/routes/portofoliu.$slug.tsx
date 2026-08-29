import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { AnimatedChars, AnimatedText, AnimatedWords } from "@/components/motion/animated-text";
import { FadeUp } from "@/components/motion/fade-up";
import { CtaBand } from "@/components/sections/cta";
import { Button } from "@/components/ui/button";
import { getProject, projects } from "@/lib/site";

export const Route = createFileRoute("/portofoliu/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.project.domain ?? "Proiect"} — @Bogdan`,
      },
    ],
  }),
  component: ProjectPage,
});

function ProjectPage() {
  const { project } = Route.useLoaderData();
  const others = projects.filter((p) => p.slug !== project.slug);

  return (
    <SiteShell>
      <article className="mx-auto max-w-[1240px] px-5 pt-8 pb-12 md:px-8 md:pt-12 md:pb-14 lg:px-12">
        <Link
          to="/portofoliu"
          className="link-underline group inline-flex w-fit items-center gap-2 text-sm text-muted hover:text-cream"
        >
          <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Portofoliu
        </Link>
        <FadeUp delay={0.05}>
          <p className="mt-8 font-mono text-sm tracking-[0.18em] text-primary">
            {project.year} · {project.role}
          </p>
        </FadeUp>
        <h1 className="mt-3 font-display text-display text-cream">
          <AnimatedChars text={project.domain} delay={0.18} stagger={0.035} />
        </h1>
        <p className="mt-5 max-w-2xl text-lead text-muted">
          <AnimatedText text={project.services} delay={0.38} stagger={0.01} />
        </p>
        <FadeUp delay={0.5} className="mt-6 w-fit">
          <Button asChild variant="outline">
            <a href={project.url} target="_blank" rel="noreferrer">
              Vizitează site-ul
              <ArrowUpRight className="size-4" />
            </a>
          </Button>
        </FadeUp>

        <div className="mt-10 overflow-hidden rounded-xl border border-border">
          <img
            src={project.image}
            alt={project.domain}
            className="w-full object-cover object-top"
          />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="font-display text-2xl text-cream">
              <AnimatedWords text="Descriere" delay={0.06} stagger={0.05} />
            </h2>
            <p className="mt-4 text-muted">
              <AnimatedText text={project.description} delay={0.14} stagger={0.006} />
            </p>
            <h2 className="mt-10 font-display text-2xl text-cream">
              <AnimatedWords text="Elemente cheie" delay={0.2} stagger={0.045} />
            </h2>
            <ul className="mt-4 space-y-3">
              {project.highlights.map((item, hi) => (
                <FadeUp
                  as="li"
                  key={item}
                  delay={0.24 + hi * 0.06}
                  className="border-l-2 border-primary pl-4 text-muted"
                >
                  {item}
                </FadeUp>
              ))}
            </ul>
          </div>
          <aside className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-display text-2xl text-cream">
              <AnimatedWords text="Rezultat final" delay={0.06} stagger={0.045} />
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              <AnimatedText text={project.result} delay={0.12} stagger={0.006} />
            </p>
          </aside>
        </div>

        {others.length > 0 ? (
          <div className="mt-16">
            <h2 className="font-display text-2xl text-cream">
              <AnimatedWords text="Alte proiecte" delay={0.06} stagger={0.045} />
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {others.map((item, oi) => (
                <FadeUp key={item.slug} delay={oi * 0.08}>
                  <Link
                    to="/portofoliu/$slug"
                    params={{ slug: item.slug }}
                    className="group block overflow-hidden rounded-xl border border-border bg-surface transition-[translate,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_20px_44px_-22px_color-mix(in_oklab,var(--color-primary)_40%,transparent)]"
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="aspect-[16/9] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="p-4">
                      <p className="font-display text-xl text-cream transition-colors duration-300 group-hover:text-blush">
                        <AnimatedWords
                          text={item.domain}
                          delay={0.12 + oi * 0.08}
                          stagger={0.03}
                          innerClassName="transition-colors duration-300"
                        />
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        <FadeUp as="span" delay={0.2 + oi * 0.08}>
                          {item.role}
                        </FadeUp>
                      </p>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        ) : null}
      </article>
      <CtaBand />
    </SiteShell>
  );
}
