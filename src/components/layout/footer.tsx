import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-elevated">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-12 md:grid-cols-2 md:px-8 md:py-16 lg:grid-cols-4 lg:px-12">
        <div className="lg:col-span-2">
          <img src={site.logo} alt={site.name} className="h-9 w-auto" />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            {site.tagline}
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.18em] text-muted uppercase">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={site.phoneHref} className="hover:text-primary">
                {site.phonePretty}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-primary">
                {site.email}
              </a>
            </li>
            <li className="text-muted">{site.location}</li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.18em] text-muted uppercase">Navigare</p>
          <ul className="mt-4 space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-primary"
              >
                GitHub <ArrowUpRight className="size-3.5" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-[1240px] px-5 py-5 text-xs text-muted md:px-8 lg:px-12">
          Drepturi de autor © {new Date().getFullYear()} {site.legalName}
        </p>
      </div>
    </footer>
  );
}
