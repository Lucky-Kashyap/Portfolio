import type { Config } from "tailwindcss";

/**
 * Design tokens — visual foundations adapted from
 * https://shahmeer-dev-beta.vercel.app/ (clean light content site).
 * Brand content remains Divyanshu Kashyap.
 *
 * radius.xl extracted as 33554400px → normalized to 9999px (full pill).
 * Page canvas uses surface.muted; surface.base is ink/black for actions.
 */
export const tokens = {
  fontFamily: {
    sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
  },
  fontSize: {
    xs: ["10px", { lineHeight: "1.4" }],
    sm: ["12px", { lineHeight: "1.45" }],
    md: ["12.5px", { lineHeight: "1.5" }],
    lg: ["14px", { lineHeight: "20px" }],
    xl: ["16px", { lineHeight: "1.45" }],
    "2xl": ["18px", { lineHeight: "1.4" }],
    "3xl": ["20px", { lineHeight: "1.3", fontWeight: "600" }],
    "4xl": ["22px", { lineHeight: "1.25", fontWeight: "600" }],
    "display-sm": ["clamp(1.25rem, 2.5vw, 1.5rem)", { lineHeight: "1.25", fontWeight: "600" }],
    "display-md": ["clamp(1.75rem, 4vw, 2.25rem)", { lineHeight: "1.15", fontWeight: "700" }],
    "display-lg": ["clamp(2.25rem, 6vw, 3.5rem)", { lineHeight: "1.05", fontWeight: "700" }],
  },
  colors: {
    text: {
      primary: "#111111",
      secondary: "#5e5e5e",
      tertiary: "#8d8d8d",
      inverse: "#ffffff",
      muted: "#8d8d8d",
    },
    surface: {
      base: "#000000",
      muted: "#f4f4f2",
      raised: "#ffffff",
      strong: "oklab(0.999994 0.0000455678 0.0000200868 / 0.9)",
      overlay: "color-mix(in srgb, #f4f4f2 88%, transparent)",
    },
    border: {
      default: "#111111",
      muted: "color-mix(in srgb, #111111 12%, transparent)",
    },
    action: {
      primary: "#111111",
      "primary-hover": "#2a2a2a",
      "primary-deep": "#5e5e5e",
    },
    focus: {
      ring: "#111111",
      glow: "color-mix(in srgb, #111111 18%, transparent)",
    },
    state: {
      disabled: "color-mix(in srgb, #111111 35%, transparent)",
      error: "#c62828",
      loading: "#5e5e5e",
    },
  },
  spacing: {
    1: "2px",
    2: "4px",
    3: "6px",
    4: "8px",
    5: "12px",
    6: "16px",
    7: "20px",
    8: "24px",
    9: "40px",
    10: "64px",
    11: "88px",
  },
  borderRadius: {
    xs: "8px",
    sm: "14px",
    md: "20px",
    lg: "22px",
    xl: "9999px",
  },
  boxShadow: {
    soft: "0 8px 30px rgba(0, 0, 0, 0.08)",
    card: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
    accent: "0 8px 30px rgba(0, 0, 0, 0.08)",
    "accent-lg": "0 16px 40px rgba(0, 0, 0, 0.1)",
  },
  transitionDuration: {
    instant: "150ms",
    fast: "200ms",
    normal: "300ms",
    slow: "450ms",
  },
  transitionTimingFunction: {
    standard: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  maxWidth: {
    site: "1120px",
  },
  height: {
    header: "64px",
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
        base: "20px",
        tight: "1.15",
        snug: "1.35",
        relaxed: "1.6",
      },
      keyframes: {
        "loader-progress": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "loader-fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "loader-progress": "loader-progress 1.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "loader-fade-out": "loader-fade-out 0.45s ease forwards",
      },
    },
  },
} satisfies Config;

export default config;
