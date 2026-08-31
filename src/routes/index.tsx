import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Scroll3dChrome } from "@/components/scroll3d/scroll3d-chrome";
import { Scroll3dScene } from "@/components/scroll3d/scroll3d-scene";
import { Scroll3dSections } from "@/components/scroll3d/scroll3d-sections";

export const Route = createFileRoute("/")({ component: Home });

/**
 * Home — a whole-page 3D scroll experience themed around the dev workspace:
 * a fixed preserve-3d stage (terminal → editor → git log →
 * launch seal) is fly-through driven by the native scroll position, with the five
 * content chapters wrapped around it. No mouse/wheel event handling: touch,
 * keyboard, scrollbar and anchor links all drive the same animation.
 */
function Home() {
  return (
    <SiteShell>
      <Scroll3dScene />
      <Scroll3dSections />
      <Scroll3dChrome />
    </SiteShell>
  );
}
