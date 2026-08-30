import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useHydrationSafeReduce } from "@/components/motion/use-hydration-safe-reduce";
import {
  DeployWindow,
  EditorWindow,
  GitWindow,
  StackRing,
  TerminalWindow,
} from "@/components/scroll3d/code-windows";
import { STARS } from "@/components/scroll3d/rand";

/**
 * The fixed 3D stage behind the whole homepage. The entire page scroll is
 * native (window scroll position — works with touch, keyboard and mouse),
 * so this is scroll-linked, never mouse-event driven.
 *
 * Layering:
 *   fixed container (perspective)
 *   └─ screen-space lights + vignette
 *   └─ preserve-3d world
 *        ├─ parallax starfield (translateZ layers)
 *        ├─ far code wall
 *        ├─ perspective floor the camera "flies over"
 *        └─ one hero object per chapter, swapped by scroll progress
 */
export function Scroll3dScene() {
  const reduce = useHydrationSafeReduce();
  return reduce ? <StaticBackdrop /> : <LiveScene />;
}

/* ------------------------------------------------------------------ */
/* Screen-space lights used by both variants                           */
/* ------------------------------------------------------------------ */

function BackdropLights() {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_58%_44%_at_72%_12%,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_46%_38%_at_18%_78%,color-mix(in_oklab,var(--color-primary)_12%,transparent),transparent_62%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_90%_72%_at_50%_34%,transparent_46%,color-mix(in_oklab,var(--color-bg)_92%,transparent)_100%)]"
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Reduced-motion fallback: a static, calm backdrop with no travel.    */
/* ------------------------------------------------------------------ */

function StaticBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <BackdropLights />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--color-primary)_6%,transparent),transparent_38%)]" />
      <div className="grid-floor absolute top-[74%] left-1/2 h-[230vmax] w-[230vmax] origin-top -translate-x-1/2 [transform:rotateX(70deg)]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Live (animated) scene                                               */
/* ------------------------------------------------------------------ */

function LiveScene() {
  const { scrollYProgress } = useScroll();
  // Spring-eased scroll progress: fluid even on fast flicks and cheap trains.
  const sp = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.6 });

  /* Whole-world camera travel across the full page. */
  const rotY = useTransform(sp, [0, 0.5, 1], [-20, 0, 20]);
  const rotX = useTransform(sp, [0, 1], [13, -13]);
  const floorZ = useTransform(sp, [0, 1], ["-680px", "150px"]);
  const wallZ = useTransform(sp, [0, 1], [-90, 60]);

  /* Chapter visibility + hero-object travel.
     The terminal ("bash — atelier@bogdan") leaves the stage early — fully
     gone by ~0.15 progress, before the skills marquee band scrolls through,
     so the two never overlap on screen. */
  const tOp = useTransform(sp, [0.0, 0.05, 0.1, 0.15], [0, 1, 1, 0]);
  const tRot = useTransform(sp, [0, 0.08, 0.15], [14, 5, -8]);
  const tZ = useTransform(sp, [0, 0.15], [60, -70]);
  const tY = useTransform(sp, [0, 0.15], [-16, 20]);

  const sOp = useTransform(sp, [0.2, 0.26, 0.43, 0.49], [0, 1, 1, 0]);
  const sZ = useTransform(sp, [0.2, 0.46], [-80, 60]);
  const sY = useTransform(sp, [0.2, 0.46], [26, -22]);

  const eOp = useTransform(sp, [0.46, 0.53, 0.67, 0.73], [0, 1, 1, 0]);
  const eRot = useTransform(sp, [0.5, 0.7], [10, -8]);
  const eZ = useTransform(sp, [0.46, 0.7], [-60, 80]);
  const eY = useTransform(sp, [0.46, 0.7], [18, -18]);

  const gOp = useTransform(sp, [0.7, 0.75, 0.85, 0.9], [0, 1, 1, 0]);
  const gRot = useTransform(sp, [0.72, 0.88], [-12, 12]);
  const gZ = useTransform(sp, [0.7, 0.88], [-90, 40]);

  const dOp = useTransform(sp, [0.88, 0.93, 0.995, 1], [0, 1, 1, 0]);
  const dZ = useTransform(sp, [0.88, 1], [110, 0]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <BackdropLights />

      <div className="absolute inset-0" style={{ perspective: "1100px", WebkitPerspective: "1100px" }}>
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            rotateX: rotX,
            rotateY: rotY,
          }}
        >
          {/* starfield at parallax depths */}
          {STARS.map((star, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-cream will-change-transform"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
                z: star.z,
              }}
            />
          ))}

          {/* far grid wall (subtle depth, no text) */}
          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ z: wallZ }}
          >
            <div className="grid-wall absolute -inset-x-[60vw] -inset-y-[80vh]" />
          </motion.div>

          {/* perspective floor */}
          <motion.div
            className="grid-floor absolute top-[74%] left-1/2 h-[230vmax] w-[230vmax] origin-top will-change-transform"
            style={{ rotateX: 70, x: "-50%", z: floorZ }}
          />

          {/* ch.1 — terminal */}
          <motion.div
            data-chapter="terminal"
            className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 md:left-[62%] md:top-[48%] lg:left-[70%]"
            style={{ opacity: tOp, rotateY: tRot, z: tZ, y: tY }}
          >
            <TerminalWindow sp={sp} />
          </motion.div>

          {/* ch.2 — stack ring */}
          <motion.div
            data-chapter="ring"
            className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 md:left-[64%] md:top-[52%] lg:left-[68%]"
            style={{ opacity: sOp, z: sZ, y: sY }}
          >
            <StackRing sp={sp} />
          </motion.div>

          {/* ch.3 — editor */}
          <motion.div
            data-chapter="editor"
            className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 md:left-[36%] md:top-[48%] lg:left-[24%]"
            style={{ opacity: eOp, rotateX: eRot, z: eZ, y: eY }}
          >
            <EditorWindow sp={sp} />
          </motion.div>

          {/* ch.4 — git log */}
          <motion.div
            data-chapter="git"
            className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 md:left-[62%] md:top-[50%] lg:left-[70%]"
            style={{ opacity: gOp, rotateY: gRot, z: gZ }}
          >
            <GitWindow sp={sp} />
          </motion.div>

          {/* ch.5 — deploy */}
          <motion.div
            data-chapter="deploy"
            className="absolute left-1/2 top-[26%] -translate-x-1/2 -translate-y-1/2 md:top-[24%]"
            style={{ opacity: dOp, z: dZ }}
          >
            <DeployWindow sp={sp} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}