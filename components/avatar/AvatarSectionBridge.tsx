"use client";

import type { ReactNode } from "react";
import { AvatarScrollStage } from "@/components/avatar/AvatarScrollStage";

/**
 * Wraps Hero + About so one avatar video can morph across both sections.
 */
export function AvatarSectionBridge({ children }: { children: ReactNode }) {
  return (
    <div data-avatar-scroll-range className="relative">
      <AvatarScrollStage />
      {children}
    </div>
  );
}
