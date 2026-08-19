"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
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
 * Framer Motion magnetic wrapper — desktop / fine pointer only.
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
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || reduceMotion || !finePointer || !ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = (clientX - (left + width / 2)) * strength;
    const middleY = (clientY - (top + height / 2)) * strength;
    setPosition({ x: middleX, y: middleY });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  if (disabled || reduceMotion || !finePointer) {
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
      transition={{ type: "spring", stiffness: 160, damping: 16, mass: 0.12 }}
    >
      {children}
    </motion.div>
  );
}
