import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/site";
import { Reveal } from "@/components/motion/reveal";
import { AnimatedWords } from "@/components/motion/animated-text";
import { Button } from "@/components/ui/button";

export function Work({ limit }: { limit?: number }) {
  const list = limit ? projects.slice(0, limit) : projects;
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-10 md:px-8 md:py-14 lg:px-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal>
            <p className="text-xs tracking-[0.22em] text-primary uppercase">Portofoliu</p>
          </Reveal>
          <h2 className="mt-3 font-display text-title text-cream">
            <AnimatedWords text="Proiecte selectate" stagger={0.055} />
          </h2>
        </div>
        {limit ? (
          <Reveal delay={0.08}>
            <Button asChild variant="outline">
              <Link to="/portofoliu">Toate proiectele</Link>
            </Button>
          </Reveal>
        ) : null}
      </div>

      <div className="mt-10 flex flex-col gap-8 lg:gap-14">
        {list.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.05}>
            <div className="group grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <Link
                to="/portofoliu/$slug"
                params={{ slug: project.slug }}
                className="block overflow-hidden rounded-xl border border-border bg-surface transition-[translate,border-color,box-shadow] duration-300 ease-out group-hover:-translate-y-1 group-hover:border-border-strong group-hover:shadow-[0_24px_50px_-24px_color-mix(in_oklab,var(--color-primary)_40%,transparent)]"
              >
                <img
                  src={project.image}
                  alt={project.domain}
                  className="aspect-[16/9] w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                />
              </Link>
              <div className="lg:pl-6">
                <Link
                  to="/portofoliu/$slug"
                  params={{ slug: project.slug }}
                  className="block"
                >
                  <p className="font-mono text-sm tracking-[0.18em] text-primary transition-colors duration-300 group-hover:text-cream">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-3xl text-cream transition-colors duration-300 group-hover:text-blush md:text-4xl">
                    {project.domain}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{project.role}</p>
                  <p className="mt-4 line-clamp-4 text-muted">{project.description}</p>
                </Link>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-1 text-sm text-cream transition-colors duration-300 group-hover:text-primary"
                >
                  Vezi proiectul
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
