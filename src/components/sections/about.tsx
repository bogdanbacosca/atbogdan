import { about, differentiators } from "@/lib/site";
import { Reveal } from "@/components/motion/reveal";
import { ArrowUpRight } from "lucide-react";

export function About() {
  return (
    <section id="despre" className="mx-auto max-w-[1240px] px-5 py-16 md:px-8 md:py-24 lg:px-12">
      <Reveal>
        <p className="text-xs tracking-[0.22em] text-primary uppercase">{about.eyebrow}</p>
        <h2 className="mt-3 max-w-3xl font-display text-title text-cream">
          {about.title}
        </h2>
      </Reveal>
      <Reveal delay={0.08}>
        <p className="mt-6 max-w-3xl text-lead text-muted">{about.body}</p>
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {differentiators.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.08}>
            <a
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-[border-color,transform] duration-200 ease-out hover:border-border-strong"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={item.image}
                  alt=""
                  className="h-full w-full object-cover transition-[transform] duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <p className="text-xs tracking-[0.16em] text-primary uppercase">
                  {item.eyebrow}
                </p>
                <h3 className="mt-2 font-display text-2xl text-cream">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm text-cream">
                  {item.cta}
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
