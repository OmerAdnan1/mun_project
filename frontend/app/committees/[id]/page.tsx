"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Calendar, FileText, Globe, Users } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { getCommitteeById } from "@/lib/api"

export default function CommitteeDetailPage({ params }: { params: { id: string } }) {
  const [committee, setCommittee] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCommittee = async () => {
      try {
        // Using a try-catch to handle any potential errors
        const data = await getCommitteeById(params.id)

        // If we got data back, use it
        if (data) {
          setCommittee(data)
        } else {
          // If no data, show an error
          setError("Failed to load committee details")
          // We'll still set mock data for demonstration
          setCommittee({
            committee_id: params.id,
            name: "United Nations Security Council",
            description:
              "The Security Council has primary responsibility for the maintenance of international peace and security. It takes the lead in determining the existence of a threat to the peace or act of aggression.",
            topic: "Addressing Conflicts in the Middle East",
            difficulty: "Advanced",
            capacity: 15,
            current_delegate_count: 10,
            chair_name: "Alex Johnson",
            background_guide_url: "#",
            schedule: [
              { day: "Friday", time: "9:00 AM - 12:00 PM", activity: "Opening Session" },
              { day: "Friday", time: "2:00 PM - 5:00 PM", activity: "Debate Session 1" },
              { day: "Saturday", time: "9:00 AM - 12:00 PM", activity: "Debate Session 2" },
              { day: "Saturday", time: "2:00 PM - 5:00 PM", activity: "Voting Procedures" },
            ],
          })
        }
      } catch (err) {
        console.error("Failed to fetch committee:", err)
        setError("Failed to load committee details")
        // Fallback to mock data for demonstration
        setCommittee({
          committee_id: params.id,
          name: "United Nations Security Council",
          description:
            "The Security Council has primary responsibility for the maintenance of international peace and security. It takes the lead in determining the existence of a threat to the peace or act of aggression.",
          topic: "Addressing Conflicts in the Middle East",
          difficulty: "Advanced",
          capacity: 15,
          current_delegate_count: 10,
          chair_name: "Alex Johnson",
          background_guide_url: "#",
          schedule: [
            { day: "Friday", time: "9:00 AM - 12:00 PM", activity: "Opening Session" },
            { day: "Friday", time: "2:00 PM - 5:00 PM", activity: "Debate Session 1" },
            { day: "Saturday", time: "9:00 AM - 12:00 PM", activity: "Debate Session 2" },
            { day: "Saturday", time: "2:00 PM - 5:00 PM", activity: "Voting Procedures" },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCommittee()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="mt-4 h-6 w-1/2" />
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
          </div>
          <Skeleton className="mt-8 h-64 rounded-lg" />
        </div>
      </div>
    )
  }

  if (!committee) {
    return (
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load committee details. Please try again later.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const seatsAvailable = committee.capacity - committee.current_delegate_count

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Note</AlertTitle>
            <AlertDescription>[Sample Data] Showing example committee details.</AlertDescription>
          </Alert>
        )}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{committee.name}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {committee.difficulty}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {seatsAvailable} Seats Available
              </Badge>
            </div>
          </div>
          <Link href="/register">
            <Button className="bg-slate-800 text-white hover:bg-slate-700">Register as Delegate</Button>
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Committee Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Topic: {committee.topic}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Capacity: {committee.capacity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Chair: {committee.chair_name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Registration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Total Seats:</span>
                  <span className="font-medium">{committee.capacity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Registered Delegates:</span>
                  <span className="font-medium">{committee.current_delegate_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Seats Available:</span>
                  <span className="font-medium text-green-600">{seatsAvailable}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${(committee.current_delegate_count / committee.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={committee.background_guide_url || "#"}>
                    <FileText className="mr-2 h-4 w-4" />
                    Background Guide
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="#">
                    <FileText className="mr-2 h-4 w-4" />
                    Rules of Procedure
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="#">
                    <FileText className="mr-2 h-4 w-4" />
                    Country Matrix
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="countries">Countries</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-700">{committee.description}</p>
                  <h3 className="mt-6 text-lg font-medium">Topic Overview</h3>
                  <p className="mt-2 text-gray-700">
                    {committee.topic} - This topic addresses critical international security concerns and requires
                    delegates to navigate complex geopolitical relationships while working toward sustainable peace
                    solutions.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="schedule" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {committee.schedule?.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col border-b border-gray-200 pb-4 last:border-0 sm:flex-row"
                      >
                        <div className="mb-2 w-full font-medium sm:mb-0 sm:w-1/3">
                          {item.day}, {item.time}
                        </div>
                        <div className="w-full sm:w-2/3">{item.activity}</div>
                      </div>
                    )) || <p className="text-gray-500">Schedule information not available.</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="countries" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {[
                      "United States",
                      "Russia",
                      "China",
                      "United Kingdom",
                      "France",
                      "Germany",
                      "Japan",
                      "India",
                      "Brazil",
                      "South Africa",
                      "Australia",
                      "Canada",
                      "Mexico",
                      "Italy",
                      "Spain",
                    ].map((country) => (
                      <Badge key={country} variant="outline" className="justify-center py-1.5">
                        {country}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
