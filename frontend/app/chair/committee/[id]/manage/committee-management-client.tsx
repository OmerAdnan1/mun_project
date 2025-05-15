"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { CommitteeDetails } from "@/components/chair/committee-details"
import { DelegateList } from "@/components/chair/delegate-list"
import { ScoreManagement } from "@/components/chair/score-management"
import { AttendanceManagement } from "@/components/chair/attendance-management"
import { DocumentManagement } from "@/components/chair/document-management"
import { getCommitteeOverview } from "@/lib/api"

interface Committee {
  id: string
  name: string
  description: string
  topic: string
  difficulty: string
  capacity: number
  current_delegate_count: number
  chair_name: string
  background_guide_url?: string
  schedule?: Array<{
    day: string
    time: string
    activity: string
  }>
}

interface CommitteeManagementClientProps {
  committeeId: string
}

export function CommitteeManagementClient({ committeeId }: CommitteeManagementClientProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [committee, setCommittee] = useState<Committee | null>(null)
  const [delegates, setDelegates] = useState<any[]>([])
  const [scores, setScores] = useState<any[]>([])
  const [attendance, setAttendance] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    } else if (!isLoading && isAuthenticated && user?.role !== "chair") {
      router.push("/dashboard")
    }
  }, [isLoading, isAuthenticated, user, router])

  const fetchCommittee = async () => {
    try {
      const response = await getCommitteeOverview(committeeId)
      if (response.success && response.data) {
        const c = response.data.committee
        setCommittee({
          id: c.committee_id,
          name: c.name,
          description: c.description,
          topic: c.topic,
          difficulty: c.difficulty,
          capacity: c.capacity,
          current_delegate_count: response.data.delegates?.length || 0,
          chair_name: c.chair_name,
        })
        setDelegates(response.data.delegates || [])
        setScores(response.data.scores || [])
        setAttendance(response.data.attendance || [])
        setDocuments(response.data.documents || [])
      } else {
        throw new Error(response.message || "Failed to fetch committee overview")
      }
    } catch (err) {
      setError("Failed to load committee details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user?.role === "chair") {
      fetchCommittee()
    }
  }, [committeeId, isAuthenticated, user])

  if (isLoading || loading) {
    return null // The skeleton is handled by the parent Suspense
  }

  if (!isAuthenticated || user?.role !== "chair" || !committee) {
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
          <CommitteeDetails committee={committee} refreshCommittee={fetchCommittee} />
        </TabsContent>

        <TabsContent value="delegates" className="mt-6">
          <DelegateList committeeId={committeeId} delegates={delegates} />
        </TabsContent>

        <TabsContent value="scores" className="mt-6">
          <ScoreManagement committeeId={committeeId} scores={scores} delegates={delegates} />
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <AttendanceManagement committeeId={committeeId} attendance={attendance} delegates={delegates} />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentManagement committeeId={committeeId} chairId={user?.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}