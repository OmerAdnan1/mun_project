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
import { getDelegateAssignments, getDelegateScores, getDelegateAttendance, getDelegateDocuments } from "@/lib/api"

export function DelegateDashboard() {
  const { user } = useAuth()
  const [assignment, setAssignment] = useState<any>(null)
  const [scores, setScores] = useState<any[]>([])
  const [attendance, setAttendance] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDelegateData = async () => {
      try {
        if (!user?.id) return

        // Fetch delegate assignment
        const assignmentData = await getDelegateAssignments(user.id)
        setAssignment(assignmentData[0] || null)

        // Fetch scores
        const scoresData = await getDelegateScores(user.id)
        setScores(scoresData)

        // Fetch attendance
        const attendanceData = await getDelegateAttendance(user.id)
        setAttendance(attendanceData)

        // Fetch documents
        const documentsData = await getDelegateDocuments(user.id)
        setDocuments(documentsData)
      } catch (err) {
        console.error("Failed to fetch delegate data:", err)
        setError("Failed to load delegate data")

        // Fallback to mock data for demonstration
        setAssignment({
          assignment_id: "assignment_123",
          committee_name: "United Nations Security Council",
          country_name: "France",
          committee_id: "1",
          topic: "Addressing Conflicts in the Middle East",
        })

        setScores([
          { score_id: "1", category: "Speech", points: 8, date: "2023-10-15", notes: "Excellent opening speech" },
          {
            score_id: "2",
            category: "Resolution",
            points: 10,
            date: "2023-10-16",
            notes: "Primary sponsor of passed resolution",
          },
          { score_id: "3", category: "Diplomacy", points: 7, date: "2023-10-16", notes: "Good coalition building" },
        ])

        setAttendance([
          { id: "1", committee_name: "UNSC", date: "2023-10-15", session: "Morning", status: "present" },
          { id: "2", committee_name: "UNSC", date: "2023-10-15", session: "Afternoon", status: "present" },
          { id: "3", committee_name: "UNSC", date: "2023-10-16", session: "Morning", status: "late" },
          { id: "4", committee_name: "UNSC", date: "2023-10-16", session: "Afternoon", status: "present" },
        ])

        setDocuments([
          {
            document_id: "1",
            title: "Position Paper",
            type: "position_paper",
            status: "approved",
            submitted_date: "2023-10-01",
            feedback: "Well researched",
          },
          {
            document_id: "2",
            title: "Draft Resolution on Peacekeeping",
            type: "resolution",
            status: "pending",
            submitted_date: "2023-10-15",
            feedback: null,
          },
        ])
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
                        <div className="col-span-3 text-gray-500">{score.date}</div>
                        <div className="col-span-3 text-gray-500">{score.notes || "-"}</div>
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
                    <div className="col-span-3">Date</div>
                    <div className="col-span-3">Committee</div>
                    <div className="col-span-3">Session</div>
                    <div className="col-span-3">Status</div>
                  </div>
                  <div className="divide-y">
                    {attendance.map((record) => (
                      <div key={record.id} className="grid grid-cols-12 px-4 py-3 text-sm">
                        <div className="col-span-3">{record.date}</div>
                        <div className="col-span-3">{record.committee_name}</div>
                        <div className="col-span-3">{record.session}</div>
                        <div className="col-span-3">
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
                    <div className="col-span-2">Submitted</div>
                    <div className="col-span-2">Actions</div>
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
                        <div className="col-span-2 text-gray-500">{doc.submitted_date}</div>
                        <div className="col-span-2">
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
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
