import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Particle = {
  x: number;
  y: number;
  z: number;
};

function fibonacciSphere(count: number): Particle[] {
  const pts: Particle[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
    });
  }
  return pts;
}

export function ParticleSphere({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compact = window.matchMedia("(max-width: 768px)").matches;
    const points = fibonacciSphere(reduce ? 360 : compact ? 700 : 1100);
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let rotY = 0.55;
    let rotX = 0.22;
    let frame = 0;
    let disposed = false;
    let rafQueued = false;

    let dpr = 0; // 0 forces a bitmap sync on the very first frame
    let lastW = 0;
    let lastH = 0;

    // Keep the canvas bitmap in sync with the laid-out CSS size AND the current
    // devicePixelRatio. On first load the stylesheet/grid/fonts can settle after
    // this effect runs, and browser zoom (or Windows display scaling) changes dpr
    // without touching layout — so a one-shot measure at mount used to freeze a
    // stale, cropped sphere until the next window resize. A per-frame guard for
    // size + dpr, a ResizeObserver, fonts.ready and visibility resyncs remove
    // that dependency entirely.
    const syncBitmap = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w < 2 || h < 2) return false;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const bw = Math.max(1, Math.floor(w * dpr));
      const bh = Math.max(1, Math.floor(h * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastW = w;
      lastH = h;
      return true;
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const schedule = () => {
      if (disposed || rafQueued) return;
      rafQueued = true;
      requestAnimationFrame(step);
    };

    const step = () => {
      rafQueued = false;
      if (disposed) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w < 2 || h < 2) {
        // Layout not settled yet (first frames, font swap, grid resolve) —
        // retry on the next frame. Never bail out permanently: an early
        // return here used to kill the loop and freeze a cropped sphere.
        schedule();
        return;
      }
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
      if (Math.round(w) !== lastW || Math.round(h) !== lastH || nextDpr !== dpr) {
        syncBitmap();
      }
      ctx.clearRect(0, 0, w, h);

      mouse.x += (mouse.tx - mouse.x) * 0.07;
      mouse.y += (mouse.ty - mouse.y) * 0.07;

      if (!reduce) {
        rotY += 0.0044 + mouse.x * 0.006;
        rotX += (mouse.y * 0.25 - rotX) * 0.02;
      }

      const cx = w / 2;
      const cy = h / 2;
      // Interaction values scale with the canvas so the sphere keeps the same
      // safety margin at every size — hover can never push particles out of view.
      const unit = Math.min(w, h);
      const scale = unit * 0.4;
      const shiftX = unit * 0.06;
      const shiftY = unit * 0.045;
      const repelRadius = unit * 0.22;
      const repelPush = unit * 0.035;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const projected: { px: number; py: number; z: number }[] = [];
      for (const p of points) {
        let x = p.x;
        let y = p.y;
        let z = p.z;
        const xz = x * cosY - z * sinY;
        z = x * sinY + z * cosY;
        x = xz;
        const yz = y * cosX - z * sinX;
        z = y * sinX + z * cosX;
        y = yz;
        const perspective = 1.85 / (1.85 + z);
        projected.push({
          px: cx + x * scale * perspective,
          py: cy + y * scale * perspective,
          z,
        });
      }

      for (const p of projected) {
        const t = (p.z + 1) / 2;
        const dx = p.px - (cx + mouse.x * shiftX);
        const dy = p.py - (cy + mouse.y * shiftY);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const push = Math.max(0, 1 - dist / repelRadius) * repelPush;
        const px = p.px + (dx / (dist || 1)) * push;
        const py = p.py + (dy / (dist || 1)) * push;
        const size = Math.max(0.7, (p.z + 1.25) * 1.7);

        if (t > 0.58) {
          ctx.fillStyle = `rgba(225, 27, 20, ${0.55 + t * 0.45})`;
        } else {
          ctx.fillStyle = `rgba(251, 236, 237, ${0.22 + t * 0.75})`;
        }
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (frame === 0) canvas.style.opacity = "1"; // fade in on first painted frame
      frame += 1;
      if (!reduce || frame < 2) schedule();
    };

    // Any external change (resize, zoom, font swap, tab return) re-syncs — and
    // in reduced-motion mode, where the loop has finished, it paints a fresh
    // frame too. For regular motion the live loop self-heals every frame.
    const resync = () => {
      syncBitmap();
      if (reduce) step();
    };

    syncBitmap();
    step();
    const observer = new ResizeObserver(resync);
    observer.observe(canvas);
    window.addEventListener("resize", resync);
    window.addEventListener("load", resync);
    document.addEventListener("visibilitychange", resync);
    document.fonts?.ready.then(resync).catch(() => {});
    canvas.addEventListener("pointermove", onMove);
    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("resize", resync);
      window.removeEventListener("load", resync);
      document.removeEventListener("visibilitychange", resync);
      canvas.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("h-full w-full opacity-0 transition-opacity duration-700 ease-out", className)}
      aria-hidden="true"
    />
  );
}
