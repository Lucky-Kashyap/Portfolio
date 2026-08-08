import type { Config } from "tailwindcss";

/**
 * Design tokens — dark, high-contrast portfolio language inspired by
 * https://portfolio-alpha-lime-53.vercel.app/ (Govind Jangid visual system).
 * Brand content remains Divyanshu Kashyap.
 */
export const tokens = {
  fontFamily: {
    sans: [
      "var(--font-dm-sans)",
      "DM Sans",
      "ui-sans-serif",
      "system-ui",
      "sans-serif",
    ],
    display: [
      "var(--font-syne)",
      "Syne",
      "ui-sans-serif",
      "system-ui",
      "sans-serif",
    ],
  },
  fontSize: {
    xs: ["11px", { lineHeight: "1.4" }],
    sm: ["12px", { lineHeight: "1.45" }],
    md: ["14px", { lineHeight: "1.5" }],
    lg: ["16px", { lineHeight: "24px" }],
    xl: ["20px", { lineHeight: "1.4" }],
    "2xl": ["28px", { lineHeight: "1.25", fontWeight: "600" }],
    "3xl": ["40px", { lineHeight: "1.15", fontWeight: "700" }],
    "4xl": ["52px", { lineHeight: "1.1", fontWeight: "700" }],
    "display-sm": [
      "clamp(1.75rem, 3.5vw, 2.5rem)",
      { lineHeight: "1.15", fontWeight: "700" },
    ],
    "display-md": [
      "clamp(2.75rem, 7vw, 3.75rem)",
      { lineHeight: "1.05", fontWeight: "700" },
    ],
    "display-lg": [
      "clamp(3.25rem, 9vw, 5rem)",
      { lineHeight: "0.98", fontWeight: "700" },
    ],
    "display-xl": [
      "clamp(4rem, 12vw, 6.75rem)",
      { lineHeight: "0.92", fontWeight: "700" },
    ],
  },
  /** Resolved via --theme-* in globals.css so light/dark can swap at runtime */
  colors: {
    text: {
      primary: "var(--theme-text-primary)",
      secondary: "var(--theme-text-secondary)",
      tertiary: "var(--theme-text-tertiary)",
      inverse: "var(--theme-text-inverse)",
      muted: "var(--theme-text-muted)",
    },
    surface: {
      base: "var(--theme-surface-base)",
      muted: "var(--theme-surface-muted)",
      raised: "var(--theme-surface-raised)",
      strong: "var(--theme-surface-strong)",
      overlay: "var(--theme-surface-overlay)",
    },
    border: {
      default: "var(--theme-border-default)",
      muted: "var(--theme-border-muted)",
    },
    action: {
      primary: "var(--theme-action-primary)",
      "primary-hover": "var(--theme-action-primary-hover)",
      "primary-deep": "var(--theme-action-primary-deep)",
    },
    focus: {
      ring: "var(--theme-focus-ring)",
      glow: "var(--theme-focus-glow)",
    },
    accent: {
      cyan: "var(--theme-accent-cyan)",
      amber: "var(--theme-accent-amber)",
      mist: "var(--theme-accent-mist)",
    },
    state: {
      disabled: "var(--theme-state-disabled)",
      error: "var(--theme-state-error)",
      loading: "var(--theme-state-loading)",
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
    /** Align with Tailwind defaults so size-10 / gap-12 / pt-14 stay sane */
    9: "36px",
    10: "40px",
    11: "44px",
    12: "48px",
    13: "52px",
    14: "56px",
  },
  borderRadius: {
    xs: "4px",
    sm: "10px",
    md: "16px",
    lg: "22px",
    xl: "9999px",
  },
  boxShadow: {
    soft: "var(--theme-shadow-soft)",
    card: "var(--theme-shadow-card)",
    accent: "var(--theme-shadow-accent)",
    "accent-lg": "var(--theme-shadow-accent-lg)",
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
    site: "1200px",
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
        base: "24px",
        tight: "1.05",
        snug: "1.25",
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
        "avatar-idle-float": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -10px, 0)" },
        },
        "avatar-glow-pulse": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.85" },
        },
        "wa-wiggle": {
          "0%, 100%": { transform: "rotate(0deg) scale(1)" },
          "20%": { transform: "rotate(-14deg) scale(1.08)" },
          "40%": { transform: "rotate(12deg) scale(1.08)" },
          "60%": { transform: "rotate(-8deg) scale(1.05)" },
          "80%": { transform: "rotate(6deg) scale(1.05)" },
        },
        "wa-ping": {
          "0%": { transform: "scale(1)", opacity: "0.45" },
          "100%": { transform: "scale(1.85)", opacity: "0" },
        },
        "wa-ring": {
          "0%": { transform: "scale(1)", borderColor: "rgba(37,211,102,0.55)" },
          "100%": { transform: "scale(1.55)", borderColor: "rgba(37,211,102,0)" },
        },
      },
      animation: {
        "loader-progress":
          "loader-progress 1.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "loader-fade-out": "loader-fade-out 0.45s ease forwards",
        "avatar-idle-float": "avatar-idle-float 5.5s ease-in-out infinite",
        "avatar-glow-pulse": "avatar-glow-pulse 3.2s ease-in-out infinite",
        "wa-wiggle": "wa-wiggle 0.7s ease-in-out infinite",
        "wa-ping": "wa-ping 0.9s cubic-bezier(0, 0, 0.2, 1) infinite",
        "wa-ring": "wa-ring 0.9s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
} satisfies Config;

export default config;
