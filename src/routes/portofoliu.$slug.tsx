import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
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
      <article className="mx-auto max-w-[1240px] px-5 pt-10 pb-16 md:px-8 md:pt-16 lg:px-12">
        <Link
          to="/portofoliu"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-cream"
        >
          <ArrowLeft className="size-4" />
          Portofoliu
        </Link>
        <p className="mt-8 font-mono text-sm tracking-[0.18em] text-primary">
          {project.year} · {project.role}
        </p>
        <h1 className="mt-3 font-display text-display text-cream">
          {project.domain}
        </h1>
        <p className="mt-5 max-w-2xl text-lead text-muted">{project.services}</p>
        <div className="mt-6">
          <Button asChild variant="outline">
            <a href={project.url} target="_blank" rel="noreferrer">
              Vizitează site-ul
              <ArrowUpRight className="size-4" />
            </a>
          </Button>
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-border">
          <img
            src={project.image}
            alt={project.domain}
            className="w-full object-cover object-top"
          />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="font-display text-2xl text-cream">Descriere</h2>
            <p className="mt-4 text-muted">{project.description}</p>
            <h2 className="mt-10 font-display text-2xl text-cream">
              Elemente cheie
            </h2>
            <ul className="mt-4 space-y-3">
              {project.highlights.map((item) => (
                <li
                  key={item}
                  className="border-l-2 border-primary pl-4 text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <aside className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-display text-2xl text-cream">Rezultat final</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {project.result}
            </p>
          </aside>
        </div>

        {others.length > 0 ? (
          <div className="mt-16">
            <h2 className="font-display text-2xl text-cream">Alte proiecte</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {others.map((item) => (
                <Link
                  key={item.slug}
                  to="/portofoliu/$slug"
                  params={{ slug: item.slug }}
                  className="group overflow-hidden rounded-xl border border-border"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="aspect-[16/9] w-full object-cover object-top transition-[transform] duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="p-4">
                    <p className="font-display text-xl text-cream">{item.domain}</p>
                    <p className="mt-1 text-sm text-muted">{item.role}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </article>
      <CtaBand />
    </SiteShell>
  );
}
