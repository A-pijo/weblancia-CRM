import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container-page py-24">
      <Skeleton className="h-10 w-1/3 mb-4" />
      <Skeleton className="h-6 w-2/3" />
    </div>
  )
}
