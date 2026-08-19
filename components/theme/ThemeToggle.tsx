"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { IconButton } from "@/components/ui";
import { useTheme } from "@/components/theme/ThemeProvider";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  size?: "md" | "lg";
};

export function ThemeToggle({ className, size = "md" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const reduced = usePrefersReducedMotion();
  const isDark = theme === "dark";
  const tooltip = isDark ? "Light theme" : "Dark theme";

  return (
    <IconButton
      className={cn(
        "group relative !size-7 !min-h-7 !min-w-7 border-border-muted text-text-secondary hover:border-accent-cyan/70 hover:text-accent-cyan",
        className,
      )}
      size={size}
      label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={!isDark}
      onClick={toggleTheme}
    >
      <span className="relative inline-flex size-[15px] items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            className="absolute inset-0 inline-flex items-center justify-center"
            initial={reduced ? false : { opacity: 0, rotate: -40, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, rotate: 40, scale: 0.7 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {isDark ? (
              <Sun size={15} strokeWidth={2.1} aria-hidden />
            ) : (
              <Moon size={15} strokeWidth={2.1} aria-hidden />
            )}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="pointer-events-none absolute top-[calc(100%+8px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-xs border border-border-muted bg-surface-base px-2 py-1 text-[10px] font-medium tracking-[0.14em] text-text-secondary uppercase opacity-0 shadow-soft transition-opacity duration-fast group-hover:opacity-100 group-focus-visible:opacity-100">
        {tooltip}
      </span>
    </IconButton>
  );
}
