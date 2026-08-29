import { useEffect, useState } from "react";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    setEnabled(true);
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    if (!dot || !ring) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let hovering = false;
    let raf = 0;
    let running = true;

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      hovering = Boolean(
        target?.closest("a, button, [role='button'], input, textarea, label"),
      );
    };

    const loop = () => {
      if (!running) return;
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${hovering ? 1.7 : 1})`;
      ring.style.opacity = hovering ? "0.55" : "1";
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    document.documentElement.classList.add("has-custom-cursor");
    loop();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <style>{`
        html.has-custom-cursor, html.has-custom-cursor * { cursor: none !important; }
      `}</style>
      <div
        id="cursor-dot"
        className="pointer-events-none fixed top-0 left-0 z-50 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
      />
      <div
        id="cursor-ring"
        className="pointer-events-none fixed top-0 left-0 z-50 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream/70"
      />
    </>
  );
}
