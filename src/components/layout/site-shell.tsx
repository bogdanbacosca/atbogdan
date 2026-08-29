import type { ReactNode } from "react";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-bg text-fg">
      <div className="grain" />
      <CustomCursor />
      <Header />
      <main className="pt-16 md:pt-[4.5rem]">{children}</main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
