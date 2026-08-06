"use client";

import type { ReactNode } from "react";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Header } from "@/components/layout/Header";
import { PageLoader } from "@/components/layout/PageLoader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <SmoothScroll>
      <PageLoader />
      <Header />
      {children}
      <FloatingActions />
    </SmoothScroll>
  );
}
