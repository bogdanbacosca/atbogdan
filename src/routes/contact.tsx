import { createFileRoute } from "@tanstack/react-router";
import { Github, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { SiteShell } from "@/components/layout/site-shell";
import { AnimatedChars, AnimatedText, AnimatedWords } from "@/components/motion/animated-text";
import { FadeUp } from "@/components/motion/fade-up";
import { contactCopy, site } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [{ title: "Contact — @Bogdan" }],
  }),
});

function ContactPage() {
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-[1240px] gap-10 px-5 py-10 md:px-8 md:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-16">
        <div>
          <p className="text-xs tracking-[0.22em] text-primary uppercase">
            <AnimatedChars text={contactCopy.talk} delay={0} stagger={0.025} />
          </p>
          <h1 className="mt-3 font-display text-title text-cream">
            <AnimatedWords text={contactCopy.title} delay={0.1} stagger={0.055} />
          </h1>
          <p className="mt-4 text-lead text-muted">
            <AnimatedText text={contactCopy.body} delay={0.3} />
          </p>

          <ul className="mt-10 space-y-5">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-xs tracking-[0.16em] text-muted uppercase">
                  <AnimatedChars text="Telefon" delay={0.5} stagger={0.02} />
                </p>
                <FadeUp as="span" delay={0.6} className="mt-0.5 block w-fit">
                  <a href={site.phoneHref} className="link-underline text-cream hover:text-primary">
                    {site.phonePretty}
                  </a>
                </FadeUp>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-xs tracking-[0.16em] text-muted uppercase">
                  <AnimatedChars text="Email" delay={0.7} stagger={0.02} />
                </p>
                <FadeUp as="span" delay={0.78} className="mt-0.5 block w-fit">
                  <a
                    href={`mailto:${site.email}`}
                    className="link-underline text-cream hover:text-primary"
                  >
                    {site.email}
                  </a>
                </FadeUp>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-xs tracking-[0.16em] text-muted uppercase">
                  <AnimatedChars text="Adresă" delay={0.9} stagger={0.02} />
                </p>
                <FadeUp as="span" delay={0.98} className="mt-0.5 block w-fit text-cream">
                  {site.location}
                </FadeUp>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Github className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-xs tracking-[0.16em] text-muted uppercase">
                  <AnimatedChars text={contactCopy.follow} delay={1.1} stagger={0.018} />
                </p>
                <FadeUp as="span" delay={1.18} className="mt-0.5 block w-fit">
                  <a
                    href={site.github}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline text-cream hover:text-primary"
                  >
                    github.com/bogdanbacosca
                  </a>
                </FadeUp>
              </div>
            </li>
          </ul>

          <FadeUp delay={1.3}>
            <p className="mt-10 text-sm text-muted">
              {contactCopy.leave} sau {contactCopy.call}{" "}
              <a
                href={site.phoneHref}
                className="link-underline w-fit text-cream hover:text-primary"
              >
                {site.phonePretty}
              </a>
            </p>
          </FadeUp>
        </div>
        <ContactForm />
      </section>
    </SiteShell>
  );
}
