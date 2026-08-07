import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  size?: number;
  title?: string;
};

/**
 * Site brand mark — anime coding illustration
 * (from portfolio-alpha-lime-53.vercel.app/svgs/favicon.svg).
 */
export function BrandMark({
  className,
  size = 40,
  title = "Divyanshu Kashyap",
}: BrandMarkProps) {
  const labelled = Boolean(title);

  return (
    <Image
      src="/svgs/brand-mark.webp"
      alt={labelled ? title : ""}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-sm object-cover", className)}
      aria-hidden={labelled ? undefined : true}
      unoptimized
    />
  );
}
