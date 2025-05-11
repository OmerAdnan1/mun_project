"use client"

import React, { use, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Calendar, FileText, Globe, Users } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { getCommitteeById } from "@/lib/api"

export default function CommitteeDetailPage({ params }: { params: any }) {
  const { id } = use(params as { id: string })
  const [committee, setCommittee] = useState<any>(null)
  const [delegates, setDelegates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCommittee = async () => {
      try {
        const apiData = await getCommitteeById(id)
        console.log('Committee API data:', apiData)
        if (apiData && apiData.success && apiData.data) {
          // Use both committee and delegates from API
          setCommittee(apiData.data.committee)
          setDelegates(apiData.data.delegates || [])
        } else {
          setError("Failed to load committee details")
        }
      } catch (err) {
        console.error('Error fetching committee:', err)
        setError("Failed to load committee details")
      } finally {
        setLoading(false)
      }
    }
    fetchCommittee()
  }, [id])

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

  const seatsAvailable = Number(committee.capacity ?? 0) - Number(delegates.length)

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{committee.name}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">{committee.difficulty}</Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">{seatsAvailable} Seats Available</Badge>
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
                  <span className="font-medium">{delegates.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Seats Available:</span>
                  <span className="font-medium text-green-600">{isNaN(seatsAvailable) ? "N/A" : seatsAvailable}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${(delegates.length / committee.capacity) * 100}%` }}
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
              <TabsTrigger value="delegates">Delegates</TabsTrigger>
              <TabsTrigger value="countries">Countries</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-gray-700">{committee.description}</p>
                  <h3 className="mt-6 text-lg font-medium">Topic Overview</h3>
                  <p className="mt-2 text-gray-700">{committee.topic}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="delegates" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delegates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Delegate (Country)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {delegates.length > 0 ? (
                          delegates.map((d) => (
                            <tr key={d.delegate_id} className="border-b">
                              <td className="px-4 py-2 whitespace-nowrap">
                                {d.delegate_name}
                                {d.country_name ? ` (${d.country_name})` : ""}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={1} className="px-4 py-4 text-center text-gray-500">No delegates registered yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="countries" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {[...new Set(delegates.map((d) => d.country_name))].map((country) => (
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
