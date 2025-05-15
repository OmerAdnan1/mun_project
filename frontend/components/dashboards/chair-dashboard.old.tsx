"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowRight, Clock, FileText, Users } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { apiService } from "@/lib/api"

interface Committee {
  id: string
  name: string
  topic: string
  delegate_count: number
  next_session: string
  pending_documents: number
}

export function ChairDashboard() {
  const { user } = useAuth()
  const [committees, setCommittees] = useState<Committee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChairData = async () => {
      try {
        if (!user?.id) return

        // Fetch committees assigned to chair
        const response = await apiService.getChairCommittees(user.id)
        if (response.success && response.data) {
          setCommittees(
            response.data.map((committee: any) => ({
              id: committee.id || committee.committee_id,
              name: committee.name,
              topic: committee.topic,
              delegate_count: committee.delegate_count || committee.current_delegate_count,
              next_session: committee.next_session || "-",
              pending_documents: committee.pending_documents || 0,
            }))
          )
        } else {
          throw new Error(response.message || "Failed to fetch committees")
        }
      } catch (err) {
        console.error("Failed to fetch chair data:", err)
        setError("Failed to load chair data")
        setCommittees([])
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load chair data"
        })
      }
          },
          {
            id: "2",
            name: "World Health Organization",
            topic: "Global Pandemic Response",
            delegate_count: 20,
            next_session: "Tomorrow, 10:00 AM",
            pending_documents: 5,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchChairData()
  }, [user?.id])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Chair Dashboard</h1>

      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>[Sample Data] Showing example chair data.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {committees.length > 0 ? (
          committees.map((committee) => (
            <Card key={committee.id}>
              <CardHeader>
                <CardTitle>{committee.name}</CardTitle>
                <CardDescription>{committee.topic}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Delegates</p>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-blue-500" />
                      <p className="font-medium">{committee.delegate_count}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Next Session</p>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-purple-500" />
                      <p className="font-medium">{committee.next_session}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Pending Documents</p>
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-amber-500" />
                    <p className="font-medium">{committee.pending_documents} documents need review</p>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link href={`/chair/committee/${committee.id}/manage`}>
                    Manage Committee
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>No Committees Assigned</CardTitle>
              <CardDescription>You have not been assigned to chair any committees yet</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Committee assignments will appear here once they are made by the Secretariat. If you believe this is an
                error, please contact the conference organizers.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
