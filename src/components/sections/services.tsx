import { services } from "@/lib/site";
import { Reveal } from "@/components/motion/reveal";

export function Services() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-16 md:px-8 md:py-24 lg:px-12">
      <Reveal>
        <p className="text-xs tracking-[0.22em] text-primary uppercase">Servicii</p>
        <h2 className="mt-3 max-w-2xl font-display text-title text-cream">
          De la identitate vizuală la un site care vinde
        </h2>
      </Reveal>

      <div className="mt-10 divide-y divide-border border-y border-border">
        {services.map((item, i) => (
          <Reveal key={item.index} delay={i * 0.06}>
            <article className="group grid gap-6 py-8 md:grid-cols-[88px_1fr] md:py-10 lg:grid-cols-[88px_1fr_280px] lg:items-center">
              <p className="font-mono text-sm tracking-[0.18em] text-primary">
                {item.index}
              </p>
              <div>
                <h3 className="font-display text-2xl text-cream md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-2xl text-muted">{item.body}</p>
              </div>
              <div className="hidden overflow-hidden rounded-lg lg:block">
                <img
                  src={item.image}
                  alt=""
                  className="h-36 w-full object-cover transition-[transform] duration-500 ease-out group-hover:scale-[1.05]"
                />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
