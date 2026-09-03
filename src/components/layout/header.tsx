import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "motion/react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/fade-up";
import { Magnetic } from "@/components/motion/magnetic";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const velocity = useRef(0);
  const logoRotation = useMotionValue(0);
  const stopTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      velocity.current = delta;
      lastScrollY.current = currentY;

      // Telephone dial: rotate based on scroll delta (slow, smooth)
      const rotationAmount = delta * 0.8;
      logoRotation.set(logoRotation.get() + rotationAmount);

      // Clear any pending stop timeout
      if (stopTimeout.current) {
        clearTimeout(stopTimeout.current);
      }

      // Set timeout to snap back quickly when scrolling stops
      stopTimeout.current = setTimeout(() => {
        animate(logoRotation, 0, { duration: 0.3, ease: "easeOut" });
      }, 200);

      setScrolled(currentY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (stopTimeout.current) {
        clearTimeout(stopTimeout.current);
      }
    };
  }, [logoRotation]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-200 ease-out",
        scrolled || open
          ? "border-b border-border bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 md:h-[4.5rem] md:px-8 lg:px-12">
        <Link
          to="/"
          aria-label={site.name}
          className="relative z-50 cursor-pointer"
          onClick={scrollToTop}
        >
          <motion.img
            src="/brand/logo-mark.svg"
            alt={site.name}
            width={38}
            height={38}
            className="h-9 w-auto md:h-10"
            style={{ rotate: logoRotation }}
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex lg:gap-8" aria-label="Principal">
          {nav.map((item, ni) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <FadeUp as="span" key={item.href} delay={0.1 + ni * 0.06}>
                <Link
                  to={item.href}
                  className={cn(
                    "link-underline text-sm tracking-wide transition-colors duration-200",
                    active ? "text-cream" : "text-muted hover:text-cream",
                  )}
                >
                  {item.label}
                </Link>
              </FadeUp>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <FadeUp delay={0.3} className="w-fit">
            <Magnetic>
              <Button asChild size="sm">
                <Link to="/contact">Contactează-mă</Link>
              </Button>
            </Magnetic>
          </FadeUp>
        </div>

        <button
          type="button"
          className="relative z-50 flex size-11 items-center justify-center rounded-md text-cream md:hidden"
          aria-label={open ? "Închide meniul" : "Deschide meniul"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-border bg-bg transition-[max-height,opacity] duration-200 ease-out",
          open ? "max-h-[100dvh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="flex min-h-[calc(100dvh-4rem)] flex-col justify-between px-5 py-8 md:px-8">
          <div className="flex flex-col gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="font-display text-4xl tracking-tight text-cream"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Button asChild size="lg" className="w-full">
            <Link to="/contact">Contactează-mă</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
