"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Phone } from "lucide-react";
import { IconButton, TextLink } from "@/components/ui";
import { site } from "@/lib/content";
import { scrollToTop } from "@/lib/scroll";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3 md:right-6 md:bottom-6">
      <IconButton
        variant="raised"
        size="md"
        label="Back to top"
        className={cn(
          "size-12 transition-[opacity,transform] duration-fast",
          showTop
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0",
        )}
        onClick={scrollToTop}
      >
        <ArrowUp size={18} aria-hidden />
      </IconButton>

      <TextLink
        href={site.phone ? `tel:${site.phone.replace(/\s/g, "")}` : "#contact"}
        className="inline-flex size-14 items-center justify-center rounded-xs bg-action-primary text-text-inverse shadow-soft hover:bg-action-primary-hover hover:shadow-accent-lg active:scale-[0.98]"
        aria-label={site.phone ? "Call Divyanshu" : "Go to contact section"}
      >
        <Phone size={22} aria-hidden />
      </TextLink>
    </div>
  );
}
