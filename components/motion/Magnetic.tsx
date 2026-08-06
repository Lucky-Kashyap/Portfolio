"use client";

import {
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useMotionPrefs";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** How strongly the element pulls toward the cursor (0–1). */
  strength?: number;
};

/**
 * Framer Motion magnetic button (Olivier Larose pattern).
 * Pulls children toward the cursor on hover with a spring.
 */
export function Magnetic({
  children,
  className,
  strength = 0.35,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reduced = usePrefersReducedMotion();

  const handleMouse = (event: MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const { clientX, clientY } = event;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  if (reduced) {
    return <div className={cn("inline-flex", className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn("relative inline-flex", className)}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
}
