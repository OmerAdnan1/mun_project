"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Calendar, CheckCircle, Clock, Download, FileText, Flag, Globe, MapPin, X } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { apiService } from "@/lib/api"

interface Assignment {
  assignment_id: string;
  delegate_id: string;
  committee_id: string;
  country_id: string;
  committee_name: string;
  country_name: string;
  topic: string;
  position: string;
}

interface Score {
  score_id: string;
  category: string;
  points: number;
  timestamp: string;
  comments: string;
}

interface Attendance {
  id: string;
  committee_name: string;
  date: string;
  status: string;
}

interface Document {
  document_id: string;
  title: string;
  type: string;
  status: string;
  feedback: string | null;
}

export function DelegateDashboard() {
  const { user } = useAuth()
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [scores, setScores] = useState<Score[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDelegateData = async () => {
      try {
        if (!user?.id) {
          console.log("No user ID available")
          return
        }

        console.log("Fetching data for user ID:", user.id)

        // Fetch delegate assignment
        console.log("Fetching delegate assignments...")
        const assignmentResponse = await apiService.getDelegateAssignments(user.id)
        console.log("Delegate assignments response:", JSON.stringify(assignmentResponse, null, 2))
        if (assignmentResponse.success && assignmentResponse.data.length > 0) {
          setAssignment(assignmentResponse.data[0])
        } else {
          console.log("No assignments found or error in response")
        }

        // Fetch scores
        console.log("Fetching scores...")
        const scoresResponse = await apiService.getDelegateScores(user.id)
        console.log("Scores response:", JSON.stringify(scoresResponse, null, 2))
        if (scoresResponse.success) {
          // Map legacy fields to expected fields
          setScores(
            scoresResponse.data.map((score: any) => ({
              ...score,
              timestamp: score.timestamp || score.date || null,
              comments: score.comments || score.notes || null,
            }))
          )
        } else {
          console.log("No scores found or error in response")
        }

        // Fetch attendance
        console.log("Fetching attendance...")
        const attendanceResponse = await apiService.getDelegateAttendance(user.id)
        console.log("Attendance response:", JSON.stringify(attendanceResponse, null, 2))
        if (attendanceResponse.success) {
          setAttendance(attendanceResponse.data)
        } else {
          console.log("No attendance records found or error in response")
        }

        // Fetch documents
        console.log("Fetching documents...")
        const documentsResponse = await apiService.getDelegateDocuments(user.id)
        console.log("Documents response:", JSON.stringify(documentsResponse, null, 2))
        if (documentsResponse.success) {
          setDocuments(documentsResponse.data)
        } else {
          console.log("No documents found or error in response")
        }
      } catch (err) {
        console.error("Failed to fetch delegate data:", err)
        setError("Failed to load delegate data")
      } finally {
        setLoading(false)
      }
    }

    fetchDelegateData()
  }, [user?.id])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    )
  }

  const totalScore = scores.reduce((sum, score) => sum + score.points, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Delegate Dashboard</h1>

      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>[Sample Data] Showing example delegate data.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Assignment</CardTitle>
            <CardDescription>Your committee and country</CardDescription>
          </CardHeader>
          <CardContent>
            {assignment ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">{assignment.committee_name}</p>
                    <p className="text-sm text-gray-500">{assignment.topic}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Representing: {assignment.country_name}</p>
                    <p className="text-sm text-gray-500">Position: {assignment.position || "Delegate"}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/committees/${assignment.committee_id}`}>View Committee Details</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <MapPin className="h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm font-medium">No assignment yet</p>
                <p className="text-xs text-gray-500">You have not been assigned to a committee</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Performance</CardTitle>
            <CardDescription>Your current scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Total Score</p>
                <p className="text-2xl font-bold">{totalScore}</p>
              </div>
              <div className="space-y-2">
                {scores.slice(0, 2).map((score) => (
                  <div key={score.score_id} className="flex items-center justify-between">
                    <p className="text-sm">{score.category}</p>
                    <Badge variant="outline">{score.points} pts</Badge>
                  </div>
                ))}
                {scores.length > 2 && (
                  <p className="text-xs text-gray-500 text-right">+{scores.length - 2} more categories</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
            <CardDescription>Your schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Committee Session</p>
                  <p className="text-sm text-gray-500">Today, 9:00 AM - 12:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Committee Session</p>
                  <p className="text-sm text-gray-500">Today, 2:00 PM - 5:00 PM</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Full Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scores">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scores">Scores</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="scores" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Scores</CardTitle>
              <CardDescription>Your scores across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              {scores.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
                    <div className="col-span-4">Category</div>
                    <div className="col-span-2 text-center">Points</div>
                    <div className="col-span-3">Date</div>
                    <div className="col-span-3">Notes</div>
                  </div>
                  <div className="divide-y">
                    {scores.map((score) => (
                      <div key={score.score_id} className="grid grid-cols-12 px-4 py-3 text-sm">
                        <div className="col-span-4 font-medium">{score.category}</div>
                        <div className="col-span-2 text-center">
                          <Badge variant="outline">{score.points}</Badge>
                        </div>
                        <div className="col-span-3 text-gray-500">
                          {score.timestamp ? new Date(score.timestamp).toLocaleDateString() : "-"}
                        </div>
                        <div className="col-span-3 text-gray-500">{score.comments || "-"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-gray-500">No scores recorded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Record</CardTitle>
              <CardDescription>Your attendance for committee sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {attendance.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
                    <div className="col-span-4">Date</div>
                    <div className="col-span-4">Committee</div>
                    <div className="col-span-4">Status</div>
                  </div>
                  <div className="divide-y">
                    {attendance.map((record, idx) => (
                      <div
                        key={record.id || `${record.committee_name}-${record.date}-${idx}`}
                        className="grid grid-cols-12 px-4 py-3 text-sm"
                      >
                        <div className="col-span-4">
                          {record.date ? new Date(record.date).toLocaleDateString() : "-"}
                        </div>
                        <div className="col-span-4">{record.committee_name}</div>
                        <div className="col-span-4">
                          {record.status === "present" ? (
                            <span className="inline-flex items-center text-green-600">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Present
                            </span>
                          ) : record.status === "late" ? (
                            <span className="inline-flex items-center text-amber-600">
                              <Clock className="mr-1 h-4 w-4" />
                              Late
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-red-600">
                              <X className="mr-1 h-4 w-4" />
                              Absent
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-gray-500">No attendance records yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Your submitted documents and their status</CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
                    <div className="col-span-4">Title</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-4">Feedback</div>
                  </div>
                  <div className="divide-y">
                    {documents.map((doc) => (
                      <div key={doc.document_id} className="grid grid-cols-12 px-4 py-3 text-sm">
                        <div className="col-span-4 font-medium">{doc.title}</div>
                        <div className="col-span-2 capitalize">{doc.type.replace("_", " ")}</div>
                        <div className="col-span-2">
                          <Badge
                            variant="outline"
                            className={
                              doc.status === "approved"
                                ? "bg-green-50 text-green-700"
                                : doc.status === "rejected"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-amber-50 text-amber-700"
                            }
                          >
                            {doc.status}
                          </Badge>
                        </div>
                        <div className="col-span-4 text-gray-500">{doc.feedback || "-"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm font-medium">No documents yet</p>
                  <p className="text-xs text-gray-500">Upload your position paper to get started</p>
                  <Button className="mt-4" size="sm">
                    Upload Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
