import { Suspense } from "react"
import { CommitteeManagementClient } from "./committee-management-client"
import { Skeleton } from "@/components/ui/skeleton"

interface PageProps {
  params: {
    id: string
  }
}

// Server Component
export default async function CommitteeManagementPage({ params }: PageProps) {
  return (
    <Suspense fallback={<CommitteeManagementSkeleton />}>
      <CommitteeManagementClient committeeId={params.id} />
    </Suspense>
  )
      }

function CommitteeManagementSkeleton() {
    return (
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="mt-4 h-6 w-1/4" />
        <div className="mt-8">
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="mt-6 h-64 rounded-lg" />
        </div>
    </div>
  )
}
