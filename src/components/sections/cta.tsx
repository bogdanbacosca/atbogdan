import { Link } from "@tanstack/react-router";
import { cta, site } from "@/lib/site";
import { AnimatedText, AnimatedWords } from "@/components/motion/animated-text";
import { FadeUp } from "@/components/motion/fade-up";
import { Magnetic } from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="border-y border-border bg-bg-elevated">
      <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-6 px-5 py-12 md:flex-row md:items-center md:px-8 md:py-14 lg:px-12">
        <div>
          <h2 className="font-display text-title text-cream">
            <AnimatedWords text={cta.title} stagger={0.055} />
          </h2>
          <p className="mt-3 text-lead text-muted">
            <AnimatedText text={cta.body} delay={0.2} />
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <FadeUp delay={0.2} className="w-fit">
            <Magnetic>
              <Button asChild size="lg">
                <Link to="/contact">{cta.button}</Link>
              </Button>
            </Magnetic>
          </FadeUp>
          <FadeUp delay={0.3} className="w-fit">
            <Button asChild variant="outline" size="lg">
              <a href={site.phoneHref}>Sună {site.phonePretty}</a>
            </Button>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
