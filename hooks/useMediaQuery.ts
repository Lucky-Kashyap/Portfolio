"use client";

import { useEffect, useState } from "react";

/** Live media-query match (SSR-safe: false until mounted). */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** True below 640px — use GIF/still instead of WebGL on tiny phones only. */
export function useIsCompactViewport() {
  return useMediaQuery("(max-width: 639px)");
}
