export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`shimmer ${className}`} />
}

/** Matches the final card dimensions so loading causes no layout shift. */
export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="mt-3 h-3 w-1/3" />
      <Skeleton className="mt-2 h-5 w-4/5" />
      <Skeleton className="mt-2 h-4 w-1/4" />
    </div>
  )
}
