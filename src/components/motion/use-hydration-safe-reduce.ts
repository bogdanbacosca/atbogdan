import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Hydration-safe reduced-motion flag: SSR and the first client render always
 * report `false` so they match the server HTML exactly, then the value settles
 * to the real user preference after mount. Branching directly on
 * `useReducedMotion()` in a component's return type causes a hydration
 * mismatch (and a full client regeneration) for reduced-motion users.
 */
export function useHydrationSafeReduce() {
  const reduce = useReducedMotion();
  const [settledReduce, setSettledReduce] = useState(false);
  useEffect(() => {
    setSettledReduce(reduce === true);
  }, [reduce]);
  return settledReduce;
}
