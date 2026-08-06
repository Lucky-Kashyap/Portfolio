import type { Config } from "tailwindcss";

/**
 * Single source of truth for portfolio design tokens.
 * Edit values here — utilities and CSS vars follow automatically.
 */
export const tokens = {
  fontFamily: {
    sans: ["var(--font-kanit)", "Kanit", "sans-serif"],
  },
  fontSize: {
    xs: ["10px", { lineHeight: "1.4" }],
    sm: ["12px", { lineHeight: "1.45" }],
    md: ["14px", { lineHeight: "1.5" }],
    lg: ["16px", { lineHeight: "1.5" }],
    xl: ["18px", { lineHeight: "1.4" }],
    "2xl": ["20px", { lineHeight: "1.35" }],
    "3xl": ["20.8px", { lineHeight: "1.3" }],
    "4xl": ["22.4px", { lineHeight: "1.25" }],
    "display-sm": [
      "clamp(1.75rem, 4vw, 2.5rem)",
      { lineHeight: "1.2", fontWeight: "600" },
    ],
    "display-md": [
      "clamp(2.25rem, 6vw, 3.5rem)",
      { lineHeight: "1.15", fontWeight: "600" },
    ],
    "display-lg": [
      "clamp(2.75rem, 8vw, 4.5rem)",
      { lineHeight: "1.1", fontWeight: "600" },
    ],
  },
  colors: {
    text: {
      primary: "#d7e2ea",
      secondary: "#ffffff",
      tertiary: "#0c0c0c",
      muted: "rgba(215, 226, 234, 0.65)",
    },
    surface: {
      base: "#000000",
      raised: "#131317",
      overlay: "rgba(19, 19, 23, 0.92)",
    },
    border: {
      default: "#e5e7eb",
      muted: "#2d2d34",
    },
    action: {
      primary: "#b801a7",
      "primary-hover": "#d414c0",
      "primary-deep": "#7721b1",
    },
    focus: {
      ring: "#e5e7eb",
      glow: "rgba(184, 0, 160, 0.45)",
    },
    state: {
      disabled: "rgba(215, 226, 234, 0.4)",
      error: "#ff6b7a",
      loading: "rgba(215, 226, 234, 0.55)",
    },
  },
  spacing: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "14px",
    5: "16px",
    6: "24px",
    7: "32px",
    8: "40px",
    9: "56px",
    10: "80px",
  },
  borderRadius: {
    xs: "60px",
    sm: "9999px",
    md: "16px",
    lg: "24px",
  },
  boxShadow: {
    accent:
      "rgba(181, 1, 167, 0.25) 0px 4px 4px 0px, rgb(119, 33, 177) 4px 4px 12px 0px inset",
    "accent-lg":
      "rgba(184, 0, 160, 0.4) 0px 10px 25px -5px, rgba(255, 255, 255, 0.2) 0px 2px 4px 0px inset",
  },
  transitionDuration: {
    instant: "150ms",
    fast: "200ms",
    normal: "300ms",
  },
  transitionTimingFunction: {
    standard: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  maxWidth: {
    site: "1120px",
  },
  height: {
    header: "72px",
  },
} as const;

const config = {
  theme: {
    extend: {
      fontFamily: tokens.fontFamily,
      fontSize: tokens.fontSize,
      colors: tokens.colors,
      spacing: tokens.spacing,
      borderRadius: tokens.borderRadius,
      boxShadow: tokens.boxShadow,
      transitionDuration: tokens.transitionDuration,
      transitionTimingFunction: tokens.transitionTimingFunction,
      maxWidth: tokens.maxWidth,
      height: tokens.height,
      lineHeight: {
        base: "24px",
        tight: "1.2",
        snug: "1.35",
        relaxed: "1.6",
      },
    },
  },
} satisfies Config;

export default config;
