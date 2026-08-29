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
            <AnimatedChars text={contactCopy.talk} stagger={0.025} />
          </p>
          <h1 className="mt-3 font-display text-title text-cream">
            <AnimatedWords text={contactCopy.title} stagger={0.055} />
          </h1>
          <p className="mt-4 text-lead text-muted">
            <AnimatedText text={contactCopy.body} delay={0.18} />
          </p>

          <ul className="mt-10 space-y-5">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-xs tracking-[0.16em] text-muted uppercase">
                  <AnimatedChars text="Telefon" delay={0.12} stagger={0.02} />
                </p>
                <FadeUp as="span" delay={0.2} className="mt-0.5 block w-fit">
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
                  <AnimatedChars text="Email" delay={0.2} stagger={0.02} />
                </p>
                <FadeUp as="span" delay={0.28} className="mt-0.5 block w-fit">
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
                  <AnimatedChars text="Adresă" delay={0.28} stagger={0.02} />
                </p>
                <FadeUp as="span" delay={0.36} className="mt-0.5 block w-fit text-cream">
                  {site.location}
                </FadeUp>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Github className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-xs tracking-[0.16em] text-muted uppercase">
                  <AnimatedChars text={contactCopy.follow} delay={0.36} stagger={0.018} />
                </p>
                <FadeUp as="span" delay={0.44} className="mt-0.5 block w-fit">
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

          <FadeUp delay={0.3}>
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
