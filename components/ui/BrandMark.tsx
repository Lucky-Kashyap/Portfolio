import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  size?: number;
  title?: string;
};

/** Inline D mark — reliable in loader/header (avoids Next/Image SVG gaps). */
export function BrandMark({
  className,
  size = 40,
  title = "D",
}: BrandMarkProps) {
  const labelled = Boolean(title);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role={labelled ? "img" : "presentation"}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
      className={cn("shrink-0", className)}
    >
      <rect width="32" height="32" rx="8" fill="#f4f4f2" />
      <path
        fill="#111111"
        d="M9 7h7.2c4.85 0 8.3 3.35 8.3 9s-3.45 9-8.3 9H9V7zm3.4 3.2v11.6h3.7c2.95 0 4.9-2.05 4.9-5.8s-1.95-5.8-4.9-5.8H12.4z"
      />
    </svg>
  );
}
