import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { CtaBand } from "@/components/sections/cta";
import { Work } from "@/components/sections/work";

export const Route = createFileRoute("/portofoliu/")({
  component: PortfolioPage,
  head: () => ({
    meta: [{ title: "Portofoliu — @Bogdan" }],
  }),
});

function PortfolioPage() {
  return (
    <SiteShell>
      <Work />
      <CtaBand />
    </SiteShell>
  );
}