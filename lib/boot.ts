declare global {
  interface Window {
    __portfolioReady?: boolean;
  }
}

export const PORTFOLIO_READY_EVENT = "portfolio:ready";
export const PORTFOLIO_LOADER_START_EVENT = "portfolio:loader-start";
/** Must stay above load + hold + exit so fallbacks never cut the intro short. */
export const BOOT_SAFETY_MS = 9000;

type NavigatorConnection = {
  saveData?: boolean;
  effectiveType?: string;
};

export type LoaderTimings = {
  loadMs: number;
  holdMs: number;
  exitMs: number;
  lite: boolean;
};

export function isCoarsePointer() {
  return window.matchMedia("(pointer: coarse)").matches;
}

export function isLiteBoot() {
  const connection = (
    navigator as Navigator & { connection?: NavigatorConnection }
  ).connection;
  const slow = ["slow-2g", "2g", "3g"].includes(
    connection?.effectiveType ?? "",
  );
  return isCoarsePointer() || Boolean(connection?.saveData) || slow;
}

/** Visible intro — long enough to read, short enough not to stall. */
export function getLoaderTimings(): LoaderTimings {
  if (isLiteBoot()) {
    return { loadMs: 3400, holdMs: 380, exitMs: 640, lite: true };
  }
  return { loadMs: 4400, holdMs: 520, exitMs: 780, lite: false };
}

export function markPortfolioReady() {
  window.__portfolioReady = true;
  window.dispatchEvent(new Event(PORTFOLIO_READY_EVENT));
}

export function isPortfolioReady() {
  return Boolean(window.__portfolioReady);
}

export function onPortfolioReady(callback: () => void) {
  if (isPortfolioReady()) {
    callback();
    return () => {};
  }
  const run = () => callback();
  window.addEventListener(PORTFOLIO_READY_EVENT, run);
  return () => window.removeEventListener(PORTFOLIO_READY_EVENT, run);
}
