"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { CommitteeDetails } from "@/components/chair/committee-details"
import { DelegateList } from "@/components/chair/delegate-list"
import { ScoreManagement } from "@/components/chair/score-management"
import { AttendanceManagement } from "@/components/chair/attendance-management"
import { DocumentReview } from "@/components/chair/document-review"
import { getCommitteeById } from "@/lib/api"

export default function CommitteeManagementPage({ params }: { params: { id: string } }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [committee, setCommittee] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    } else if (!isLoading && isAuthenticated && user?.role !== "chair") {
      router.push("/dashboard")
    }
  }, [isLoading, isAuthenticated, user, router])

  useEffect(() => {
    const fetchCommittee = async () => {
      try {
        const data = await getCommitteeById(params.id)
        setCommittee(data)
      } catch (err) {
        console.error("Failed to fetch committee:", err)
        setError("Failed to load committee details")
        // Fallback to mock data for demonstration
        setCommittee({
          committee_id: params.id,
          name: "United Nations Security Council",
          description:
            "The Security Council has primary responsibility for the maintenance of international peace and security.",
          topic: "Addressing Conflicts in the Middle East",
          difficulty: "Advanced",
          capacity: 15,
          current_delegate_count: 10,
          chair_name: user?.name || "Alex Johnson",
        })
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && user?.role === "chair") {
      fetchCommittee()
    }
  }, [params.id, isAuthenticated, user])

  if (isLoading || loading) {
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

  if (!isAuthenticated || user?.role !== "chair") {
    return null // Will redirect
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Committee: {committee.name}</h1>
        <p className="mt-2 text-gray-600">Topic: {committee.topic}</p>
      </div>

      {error && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>[Sample Data] Showing example committee management interface.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="delegates">Delegates</TabsTrigger>
          <TabsTrigger value="scores">Scores</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <CommitteeDetails committee={committee} />
        </TabsContent>

        <TabsContent value="delegates" className="mt-6">
          <DelegateList committeeId={params.id} />
        </TabsContent>

        <TabsContent value="scores" className="mt-6">
          <ScoreManagement committeeId={params.id} />
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <AttendanceManagement committeeId={params.id} />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentReview committeeId={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
