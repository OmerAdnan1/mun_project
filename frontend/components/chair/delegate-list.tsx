"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Download, Search } from "lucide-react"

interface DelegateListProps {
  committeeId: string
  delegates?: any[]
}

export function DelegateList({ committeeId, delegates: propDelegates }: DelegateListProps) {
  const [delegates, setDelegates] = useState<any[]>(propDelegates || [])
  const [loading, setLoading] = useState(!propDelegates)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (propDelegates) {
      setDelegates(propDelegates)
      setLoading(false)
      return
    }

    const fetchDelegates = async () => {
      try {
        // In a real app, this would call the API
        // const data = await getDelegatesByCommittee(committeeId)
        // setDelegates(data)

        // Mock data for demonstration
        setTimeout(() => {
          setDelegates([
            {
              delegate_id: "1",
              name: "John Smith",
              country: "France",
              email: "john.smith@example.com",
              status: "active",
              position_paper: true,
            },
            {
              delegate_id: "2",
              name: "Emma Johnson",
              country: "Germany",
              email: "emma.johnson@example.com",
              status: "active",
              position_paper: true,
            },
            {
              delegate_id: "3",
              name: "Michael Brown",
              country: "Japan",
              email: "michael.brown@example.com",
              status: "active",
              position_paper: false,
            },
            {
              delegate_id: "4",
              name: "Sophia Garcia",
              country: "Brazil",
              email: "sophia.garcia@example.com",
              status: "active",
              position_paper: true,
            },
            {
              delegate_id: "5",
              name: "William Davis",
              country: "India",
              email: "william.davis@example.com",
              status: "inactive",
              position_paper: false,
            },
            {
              delegate_id: "6",
              name: "Olivia Wilson",
              country: "South Africa",
              email: "olivia.wilson@example.com",
              status: "active",
              position_paper: true,
            },
            {
              delegate_id: "7",
              name: "James Miller",
              country: "Australia",
              email: "james.miller@example.com",
              status: "active",
              position_paper: false,
            },
            {
              delegate_id: "8",
              name: "Ava Martinez",
              country: "Canada",
              email: "ava.martinez@example.com",
              status: "active",
              position_paper: true,
            },
            {
              delegate_id: "9",
              name: "Alexander Lee",
              country: "Mexico",
              email: "alexander.lee@example.com",
              status: "inactive",
              position_paper: false,
            },
            {
              delegate_id: "10",
              name: "Isabella Taylor",
              country: "Italy",
              email: "isabella.taylor@example.com",
              status: "active",
              position_paper: true,
            },
          ])
          setLoading(false)
        }, 1000)
      } catch (err) {
        console.error("Failed to fetch delegates:", err)
        setError("Failed to load delegates")
        setLoading(false)
      }
    }

    fetchDelegates()
  }, [committeeId, propDelegates])

  // Normalize delegates for rendering
  const normalizedDelegates = delegates.map((d) => ({
    delegate_id: d.delegate_id || d.id,
    name: d.name || d.delegate_name || "",
    country: d.country || d.country_name || "",
    email: d.email || "",
    status: d.status || "active",
    position_paper: d.position_paper ?? true,
  }))

  const filteredDelegates = normalizedDelegates.filter(
    (delegate) =>
      (delegate.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (delegate.country || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (delegate.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delegates</CardTitle>
          <CardDescription>Loading delegate information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delegates</CardTitle>
        <CardDescription>Manage delegates in this committee</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Note</AlertTitle>
            <AlertDescription>[Sample Data] Showing example delegate list.</AlertDescription>
          </Alert>
        )}

        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search delegates..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="rounded-md border">
          <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
            <div className="col-span-3">Name</div>
            <div className="col-span-2">Country</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Position Paper</div>
          </div>
          <div className="divide-y">
            {filteredDelegates.length > 0 ? (
              filteredDelegates.map((delegate) => (
                <div key={delegate.delegate_id} className="grid grid-cols-12 px-4 py-3 text-sm">
                  <div className="col-span-3 font-medium">{delegate.name}</div>
                  <div className="col-span-2">{delegate.country}</div>
                  <div className="col-span-3 text-gray-500">{delegate.email}</div>
                  <div className="col-span-2">
                    <Badge
                      variant="outline"
                      className={delegate.status === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                    >
                      {delegate.status}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    {delegate.position_paper ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Submitted
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No delegates found matching your search criteria
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
