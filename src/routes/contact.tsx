import { createFileRoute } from "@tanstack/react-router";
import { Github, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { SiteShell } from "@/components/layout/site-shell";
import { AnimatedWords } from "@/components/motion/animated-text";
import { Reveal } from "@/components/motion/reveal";
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
          <Reveal>
            <p className="text-xs tracking-[0.22em] text-primary uppercase">{contactCopy.talk}</p>
          </Reveal>
          <h1 className="mt-3 font-display text-title text-cream">
            <AnimatedWords text={contactCopy.title} stagger={0.055} />
          </h1>
          <Reveal delay={0.2}>
            <p className="mt-4 text-lead text-muted">{contactCopy.body}</p>
          </Reveal>

          <ul className="mt-10 space-y-5">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-xs tracking-[0.16em] text-muted uppercase">Telefon</p>
                <a
                  href={site.phoneHref}
                  className="link-underline w-fit text-cream hover:text-primary"
                >
                  {site.phonePretty}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-xs tracking-[0.16em] text-muted uppercase">Email</p>
                <a
                  href={`mailto:${site.email}`}
                  className="link-underline w-fit text-cream hover:text-primary"
                >
                  {site.email}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-xs tracking-[0.16em] text-muted uppercase">Adresă</p>
                <p className="text-cream">{site.location}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Github className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-xs tracking-[0.16em] text-muted uppercase">
                  {contactCopy.follow}
                </p>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline w-fit text-cream hover:text-primary"
                >
                  github.com/bogdanbacosca
                </a>
              </div>
            </li>
          </ul>

          <Reveal delay={0.3}>
            <p className="mt-10 text-sm text-muted">
              {contactCopy.leave} sau {contactCopy.call}{" "}
              <a
                href={site.phoneHref}
                className="link-underline w-fit text-cream hover:text-primary"
              >
                {site.phonePretty}
              </a>
            </p>
          </Reveal>
        </div>
        <ContactForm />
      </section>
    </SiteShell>
  );
}
