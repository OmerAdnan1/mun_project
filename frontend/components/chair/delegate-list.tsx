"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Download, Search, Loader2 } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface DelegateListProps {
  committeeId: string
  delegates?: any[]
}

export function DelegateList({ committeeId, delegates: propDelegates }: DelegateListProps) {
  const [delegates, setDelegates] = useState<any[]>(propDelegates || [])
  const [loading, setLoading] = useState(!propDelegates)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (propDelegates) {
      setDelegates(propDelegates)
      setLoading(false)
      return
    }

    const fetchDelegates = async () => {
      setLoading(true)
      try {
        // Get delegates assigned to this committee
        const response = await apiService.getDelegatesByCommittee(committeeId)
        
        if (response.success) {
          setDelegates(response.data)
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load delegates"
          })
          setDelegates([])
        }
      } catch (error) {
        console.error("Failed to fetch committee delegates:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load delegates"
        })
        setDelegates([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchDelegates()
  }, [committeeId, propDelegates, toast])

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

  if (delegates.length === 0) {
    return (
      <Alert variant="default" className="bg-muted">
        <AlertTitle>No delegates found</AlertTitle>
        <AlertDescription>
          There are no delegates assigned to this committee yet.
        </AlertDescription>
      </Alert>
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
            <AlertDescription>{error}</AlertDescription>
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
