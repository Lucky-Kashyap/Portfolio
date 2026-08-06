import { Container, Text } from "@/components/ui";
import { site } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-muted py-8">
      <Container className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm tracking-[0.12em] text-text-muted uppercase">
          {site.mark}
        </p>
        <Text tone="muted" size="sm">
          © {year} {site.brand}. All rights reserved.
        </Text>
      </Container>
    </footer>
  );
}
