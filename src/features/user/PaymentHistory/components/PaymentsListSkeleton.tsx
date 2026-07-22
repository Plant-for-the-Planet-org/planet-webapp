import { Skeleton } from '@/components/ui/skeleton';

/** Loading placeholder that roughly matches a payments row. */
export const PaymentsListSkeleton = ({ rows = 6 }: { rows?: number }) => (
  <div className="flex flex-col">
    {Array.from({ length: rows }).map((_, index) => (
      <div
        key={index}
        className="flex items-center gap-3 border-b border-border py-4 last:border-b-0"
      >
        <Skeleton className="size-8 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="hidden h-4 w-16 sm:block" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    ))}
  </div>
);
