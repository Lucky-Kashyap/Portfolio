export function scrollToId(id: string, offset = -72) {
  if (typeof document === "undefined") return;

  const el = document.getElementById(id);
  if (!el) return;

  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(el, {
      offset,
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    });
    return;
  }

  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function scrollToTop() {
  if (typeof window === "undefined") return;

  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(0, {
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    });
    return;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}
