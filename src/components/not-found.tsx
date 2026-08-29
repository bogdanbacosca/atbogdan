import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/layout/site-shell";

export function NotFound() {
  return (
    <SiteShell>
      <div className="mx-auto flex min-h-[70vh] max-w-[720px] flex-col items-start justify-center px-5 py-20 md:px-8">
        <p className="font-mono text-sm tracking-[0.2em] text-primary">404</p>
        <h1 className="mt-3 font-display text-title text-cream">
          Pagina nu a fost găsită
        </h1>
        <p className="mt-4 text-muted">
          Linkul este greșit sau pagina a fost mutată. Hai înapoi la început.
        </p>
        <Button asChild className="mt-8">
          <Link to="/">Acasă</Link>
        </Button>
      </div>
    </SiteShell>
  );
}
