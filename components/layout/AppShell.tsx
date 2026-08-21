"use client";

import type { ReactNode } from "react";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { ScrollProgressGlow } from "@/components/motion/ScrollProgressGlow";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Header } from "@/components/layout/Header";
import { PageLoader } from "@/components/layout/PageLoader";
import { SiteReveal } from "@/components/layout/SiteReveal";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AnalyticsProvider } from "@/hooks/useSiteAnalytics";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <ThemeProvider>
      <AnalyticsProvider>
        <SmoothScroll>
          <PageLoader />
          <ScrollProgressGlow />
          <CustomCursor />
          <Header />
          <SiteReveal>{children}</SiteReveal>
          <FloatingActions />
        </SmoothScroll>
      </AnalyticsProvider>
    </ThemeProvider>
  );
}
