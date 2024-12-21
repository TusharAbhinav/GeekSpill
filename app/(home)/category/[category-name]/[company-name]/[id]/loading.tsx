import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="p-2 sm:p-4 text-foreground w-full">
      <Skeleton className="h-8 w-3/4 mb-4" />
      <div className="space-y-4 sm:space-y-6 w-full">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-brand p-2 sm:p-4 rounded-lg shadow-md">
            <div className="mb-2 sm:mb-4 border-b border-gray-700 pb-2">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

