"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Award, BarChart3, FileText, Globe, Settings, Users } from "lucide-react"
import { AdminUserManagement } from "@/components/admin/user-management"
import { AdminCommitteeManagement } from "@/components/admin/committee-management"
import { AdminCountryManagement } from "@/components/admin/country-management"
import { AdminAssignmentManagement } from "@/components/admin/assignment-management"
import { apiService } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award as AwardIcon } from "lucide-react"
import { getCommittees } from "@/lib/api"

export function AdminDashboard() {
  const [counts, setCounts] = useState({
    delegate_count: 0,
    committee_count: 0,
    assignment_count: 0,
    document_count: 0,
    country_count: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [committees, setCommittees] = useState<any[]>([])
  const [selectedCommittee, setSelectedCommittee] = useState<string>("1")
  const [awards, setAwards] = useState<any[]>([])
  const [awardsLoading, setAwardsLoading] = useState(false)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Use fetch instead of apiService.api.get
        const res = await fetch("/api/admins/dashboard-counts")
        const data = await res.json()
        if (data && data.success) {
          setCounts(data.data)
        } else {
          setError("Failed to load dashboard counts")
        }
      } catch (err) {
        setError("Failed to load dashboard counts")
      } finally {
        setLoading(false)
      }
    }
    fetchCounts()

    // Fetch all committees for dropdown
    getCommittees().then((res: any) => {
      const data = Array.isArray(res) ? res : res?.data
      setCommittees(data || [])
    })
  }, [])

  useEffect(() => {
    // Fetch awards for selected committee
    async function fetchAwards() {
      setAwardsLoading(true)
      try {
        const res = await fetch("/api/admins/awards/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ committeeId: Number(selectedCommittee), topDelegates: 3 })
        })
        const data = await res.json()
        if (data.success) setAwards(data.data)
        else setAwards([])
      } catch (err) {
        setAwards([])
      } finally {
        setAwardsLoading(false)
      }
    }
    if (selectedCommittee) fetchAwards()
  }, [selectedCommittee])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>

      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Delegates</CardTitle>
            <CardDescription>Total registered delegates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{counts.delegate_count}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Committees</CardTitle>
            <CardDescription>Active committees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="mr-2 h-5 w-5 text-purple-500" />
                <span className="text-2xl font-bold">{counts.committee_count}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Assignments</CardTitle>
            <CardDescription>Delegate assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">{counts.assignment_count}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Documents</CardTitle>
            <CardDescription>Uploaded documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-amber-500" />
                <span className="text-2xl font-bold">{counts.document_count}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conference Overview</CardTitle>
          <CardDescription>Key metrics and statistics for the current conference</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{counts.delegate_count}</div>
                <div className="text-sm text-gray-500">Delegates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{counts.committee_count}</div>
                <div className="text-sm text-gray-500">Committees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{counts.country_count}</div>
                <div className="text-sm text-gray-500">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{counts.document_count}</div>
                <div className="text-sm text-gray-500">Documents</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="committees">Committees</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="awards">Awards</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <AdminUserManagement />
        </TabsContent>

        <TabsContent value="committees" className="mt-6">
          <AdminCommitteeManagement />
        </TabsContent>

        <TabsContent value="countries" className="mt-6">
          <AdminCountryManagement />
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <AdminAssignmentManagement />
        </TabsContent>

        <TabsContent value="awards" className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AwardIcon className="h-5 w-5 text-yellow-500" /> Awards
              </CardTitle>
              <CardDescription>Top 3 delegates by committee</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={selectedCommittee} onValueChange={setSelectedCommittee}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select committee" />
                  </SelectTrigger>
                  <SelectContent>
                    {committees.map((c: any) => (
                      <SelectItem key={c.committee_id} value={String(c.committee_id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {awardsLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Delegate</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Award</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {awards.length > 0 ? (
                        awards.map((a: any, i: number) => (
                          <tr key={a.delegate_id} className="border-b">
                            <td className="px-4 py-2 whitespace-nowrap">{i + 1}</td>
                            <td className="px-4 py-2 whitespace-nowrap font-medium">{a.delegate_name}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{a.country_name}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{a.award}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{a.overall_score}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-4 text-center text-gray-500">No awards data</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Configure system-wide settings for the MUN platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Open Settings Panel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
