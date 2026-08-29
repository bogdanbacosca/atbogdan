import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { About } from "@/components/sections/about";
import { CtaBand } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { Packages } from "@/components/sections/packages";
import { Services } from "@/components/sections/services";
import { SkillsMarquee } from "@/components/sections/skills-marquee";
import { Work } from "@/components/sections/work";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <SiteShell>
      <Hero />
      <SkillsMarquee />
      <About />
      <Services />
      <Work limit={3} />
      <Packages />
      <CtaBand />
    </SiteShell>
  );
}
