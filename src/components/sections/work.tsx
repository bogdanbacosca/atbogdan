import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/site";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export function Work({ limit }: { limit?: number }) {
  const list = limit ? projects.slice(0, limit) : projects;
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-16 md:px-8 md:py-24 lg:px-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <p className="text-xs tracking-[0.22em] text-primary uppercase">Portofoliu</p>
          <h2 className="mt-3 font-display text-title text-cream">
            Proiecte selectate
          </h2>
        </Reveal>
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
            <Link
              to="/portofoliu/$slug"
              params={{ slug: project.slug }}
              className="group grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-center"
            >
              <div className="overflow-hidden rounded-xl border border-border bg-surface">
                <img
                  src={project.image}
                  alt={project.domain}
                  className="aspect-[16/9] w-full object-cover object-top transition-[transform] duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="lg:pl-6">
                <p className="font-mono text-sm tracking-[0.18em] text-primary">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-3xl text-cream md:text-4xl">
                  {project.domain}
                </h3>
                <p className="mt-2 text-sm text-muted">{project.role}</p>
                <p className="mt-4 line-clamp-4 text-muted">{project.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm text-cream">
                  Vezi proiectul
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
