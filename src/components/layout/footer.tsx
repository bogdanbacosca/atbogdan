import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { nav, site } from "@/lib/site";
import { AnimatedChars, AnimatedText } from "@/components/motion/animated-text";
import { FadeUp } from "@/components/motion/fade-up";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-bg">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-12 md:grid-cols-2 md:px-8 md:py-16 lg:grid-cols-4 lg:px-12">
        <div className="lg:col-span-2">
          <FadeUp delay={0} y={10}>
            <span className="footer-logo-wrap">
              <img
                src="/brand/logo.svg"
                alt={site.name}
                className="footer-logo h-12 w-auto md:h-14"
              />
            </span>
          </FadeUp>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            <AnimatedText text={site.tagline} stagger={0.01} />
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.18em] text-muted uppercase">
            <AnimatedChars text="Contact" delay={0.08} stagger={0.025} />
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <FadeUp as="li" delay={0.13}>
              <a href={site.phoneHref} className="link-underline w-fit hover:text-primary">
                {site.phonePretty}
              </a>
            </FadeUp>
            <FadeUp as="li" delay={0.18}>
              <a href={`mailto:${site.email}`} className="link-underline w-fit hover:text-primary">
                {site.email}
              </a>
            </FadeUp>
            <FadeUp as="li" delay={0.23} className="text-muted">
              {site.location}
            </FadeUp>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.18em] text-muted uppercase">
            <AnimatedChars text="Navigare" delay={0.32} stagger={0.025} />
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {nav.map((item, ni) => (
              <FadeUp as="li" key={item.href} delay={0.38 + ni * 0.05}>
                <Link to={item.href} className="link-underline w-fit hover:text-primary">
                  {item.label}
                </Link>
              </FadeUp>
            ))}
            <FadeUp as="li" delay={0.38 + nav.length * 0.05}>
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer"
                className="link-underline inline-flex w-fit items-center gap-1 hover:text-primary"
              >
                GitHub <ArrowUpRight className="size-3.5" />
              </a>
            </FadeUp>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-[1240px] px-5 py-5 text-xs text-muted md:px-8 lg:px-12">
          Drepturi de autor © {new Date().getFullYear()} Bogdan Bacoșcă
        </p>
      </div>
    </footer>
  );
}
