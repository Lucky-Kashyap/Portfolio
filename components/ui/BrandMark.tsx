import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  size?: number;
  /** Accessible name — defaults to the site brand */
  title?: string;
};

/**
 * Site brand mark — anime coding illustration
 * (from portfolio-alpha-lime-53.vercel.app/svgs/favicon.svg).
 */
export function BrandMark({
  className,
  size = 40,
  title = "Divyanshu Kashyap brand mark",
}: BrandMarkProps) {
  const label = title.trim() || "Divyanshu Kashyap brand mark";

  return (
    <Image
      src="/svgs/brand-mark.webp"
      alt={label}
      title={label}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-sm object-cover", className)}
      unoptimized
    />
  );
}
