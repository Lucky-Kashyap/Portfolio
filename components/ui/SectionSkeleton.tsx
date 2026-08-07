export function SectionSkeleton({ label = "Loading" }: { label?: string }) {
  return (
    <div
      className="section-pad container-site"
      aria-busy="true"
      aria-label={label}
    >
      <div className="h-3 w-24 animate-pulse bg-white/10" />
      <div className="mt-4 h-8 w-[min(100%,18rem)] animate-pulse bg-white/10" />
      <div className="mt-8 h-48 w-full animate-pulse bg-white/[0.06] md:h-72" />
    </div>
  );
}
