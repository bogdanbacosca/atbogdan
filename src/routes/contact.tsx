import { createFileRoute } from "@tanstack/react-router";
import { Github, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { SiteShell } from "@/components/layout/site-shell";
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
      <section className="mx-auto grid max-w-[1240px] gap-10 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-20">
        <div>
          <p className="text-xs tracking-[0.22em] text-primary uppercase">
            {contactCopy.talk}
          </p>
          <h1 className="mt-3 font-display text-title text-cream">
            {contactCopy.title}
          </h1>
          <p className="mt-4 text-lead text-muted">{contactCopy.body}</p>

          <ul className="mt-10 space-y-5">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-xs tracking-[0.16em] text-muted uppercase">
                  Telefon
                </p>
                <a href={site.phoneHref} className="text-cream hover:text-primary">
                  {site.phonePretty}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-xs tracking-[0.16em] text-muted uppercase">
                  Email
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="text-cream hover:text-primary"
                >
                  {site.email}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-xs tracking-[0.16em] text-muted uppercase">
                  Adresă
                </p>
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
                  className="text-cream hover:text-primary"
                >
                  github.com/bogdanbacosca
                </a>
              </div>
            </li>
          </ul>

          <p className="mt-10 text-sm text-muted">
            {contactCopy.leave} sau {contactCopy.call}{" "}
            <a href={site.phoneHref} className="text-cream">
              {site.phonePretty}
            </a>
          </p>
        </div>
        <ContactForm />
      </section>
    </SiteShell>
  );
}
