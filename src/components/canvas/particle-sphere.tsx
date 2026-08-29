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
    let running = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const draw = () => {
      if (!running) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      mouse.x += (mouse.tx - mouse.x) * 0.07;
      mouse.y += (mouse.ty - mouse.y) * 0.07;

      if (!reduce) {
        rotY += 0.0044 + mouse.x * 0.006;
        rotX += (mouse.y * 0.25 - rotX) * 0.02;
      }

      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) * 0.42;
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
        const dx = p.px - (cx + mouse.x * 30);
        const dy = p.py - (cy + mouse.y * 24);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const push = Math.max(0, 1 - dist / 90) * 16;
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

      frame += 1;
      if (!reduce || frame < 2) requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onMove);
    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className={cn("h-full w-full", className)} aria-hidden="true" />;
}
