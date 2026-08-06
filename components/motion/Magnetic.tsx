"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** Soften pull so the control doesn’t jump too far (0–1). */
  strength?: number;
  disabled?: boolean;
  /** @deprecated Framer spring is the only path now; kept for call-site compat. */
  variant?: "spring" | "elastic";
};

/**
 * Framer Motion magnetic wrapper — cursor offset spring (desktop / fine pointer).
 */
export function Magnetic({
  children,
  className,
  strength = 0.45,
  disabled = false,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || reduceMotion || !ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = (clientX - (left + width / 2)) * strength;
    const middleY = (clientY - (top + height / 2)) * strength;
    setPosition({ x: middleX, y: middleY });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  if (disabled || reduceMotion) {
    return <div className={cn("relative inline-flex", className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn("relative inline-flex", className)}
      style={{ position: "relative" }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
}
