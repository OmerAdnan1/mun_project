"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DelegateDashboard } from "@/components/dashboards/delegate-dashboard"
import { ChairDashboard } from "@/components/dashboards/chair-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-12 w-1/3" />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
        <Skeleton className="mt-8 h-64 rounded-lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {user?.role === "delegate" && <DelegateDashboard />}
      {user?.role === "chair" && <ChairDashboard />}
      {user?.role === "admin" && <AdminDashboard />}
    </div>
  )
}
