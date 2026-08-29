import { services } from "@/lib/site";
import { Reveal } from "@/components/motion/reveal";
import { AnimatedWords } from "@/components/motion/animated-text";

export function Services() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-10 md:px-8 md:py-14 lg:px-12">
      <Reveal>
        <p className="text-xs tracking-[0.22em] text-primary uppercase">Servicii</p>
      </Reveal>
      <h2 className="mt-3 max-w-2xl font-display text-title text-cream">
        <AnimatedWords text="De la identitate vizuală la un site care vinde" stagger={0.05} />
      </h2>

      <div className="mt-10 divide-y divide-border border-y border-border">
        {services.map((item, i) => (
          <Reveal key={item.index} delay={i * 0.06}>
            <article className="group -mx-3 grid gap-6 rounded-xl px-3 py-8 transition-colors duration-300 hover:bg-cream/[0.035] md:grid-cols-[88px_1fr] md:py-10 lg:grid-cols-[88px_1fr_280px] lg:items-center">
              <p className="font-mono text-sm tracking-[0.18em] text-primary transition-colors duration-300 group-hover:text-cream">
                {item.index}
              </p>
              <div>
                <h3 className="font-display text-2xl text-cream transition-colors duration-300 group-hover:text-blush md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-2xl text-muted">{item.body}</p>
              </div>
              <div className="hidden overflow-hidden rounded-lg lg:block">
                <img
                  src={item.image}
                  alt=""
                  className="h-36 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
