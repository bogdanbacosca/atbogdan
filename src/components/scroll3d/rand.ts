/**
 * Tiny seeded PRNG so the decorative starfield is deterministic at build
 * time — SSR and client render identical bytes, and nothing depends on
 * `Math.random()` during render.
 */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Star = {
  left: number;
  top: number;
  size: number;
  z: number;
  opacity: number;
  delay: number;
  duration: number;
};

/**
 * Deterministic parallax starfield (module-level, computed once).
 * Deliberately sparse and dim — depth without visual noise.
 */
export const STARS: Star[] = Array.from({ length: 14 }, (_, i) => {
  const rnd = mulberry32(i + 11);
  return {
    left: rnd() * 100,
    top: rnd() * 100,
    size: 2 + (i % 3),
    z: -180 - (i % 5) * 140,
    opacity: 0.05 + rnd() * 0.14,
    delay: rnd() * 6,
    duration: 5 + rnd() * 5,
  };
});