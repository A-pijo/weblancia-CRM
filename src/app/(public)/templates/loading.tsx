import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container-page py-24">
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-64 w-full rounded-radius-lg" />
      </div>
    </div>
  )
}
