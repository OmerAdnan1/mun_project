"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ArrowRight, Users } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getCommittees } from "@/lib/api"

// Define the expected structure of committee data
interface Committee {
  committee_id: string;
  name: string;
  topic: string;
  difficulty: string;
  capacity: number;
  current_delegate_count: number;
  chair_name: string;
}

interface CommitteesListProps {
  filters?: {
    difficulty?: string;
    chair_id?: string;
    search_term?: string;
  };
}

export function CommitteesList({ filters }: CommitteesListProps) {
  const [committees, setCommittees] = useState<Committee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const data: any = await getCommittees(filters);
        // Use data.data if present (API returns { success, count, data })
        const committeesArray = Array.isArray(data) ? data : data?.data;
        if (!Array.isArray(committeesArray)) {
          setCommittees([]);
          setError("No committees data found");
          return;
        }
        // Log the actual data for debugging
        console.log("Committees API data:", committeesArray);
        const normalizedData = committeesArray.map((committee: Committee) => ({
          committee_id: committee.committee_id,
          name: committee.name,
          topic: committee.topic,
          difficulty: committee.difficulty,
          capacity: committee.capacity,
          current_delegate_count: committee.current_delegate_count,
          chair_name: committee.chair_name,
        }));
        setCommittees(normalizedData);
      } catch (err) {
        console.error("Failed to fetch committees:", err);
        setError("Failed to load committees");
        setCommittees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommittees();
  }, [filters])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  // If we have no committees data, show a message
  if (committees.length === 0) {
    return (
      <>
        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Note</AlertTitle>
            <AlertDescription>[Sample Data] Unable to load committees. Showing placeholder.</AlertDescription>
          </Alert>
        )}

        <div className="rounded-md border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No Committees Found</h3>
          <p className="mt-2 text-sm text-gray-500">There are no committees available at the moment.</p>
        </div>
      </>
    )
  }

  return (
    <>
      {error && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>[Sample Data] Showing example committees.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {committees.map((committee) => {
          const seatsAvailable = committee.capacity - committee.current_delegate_count

          return (
            <Card key={committee.committee_id}>
              <CardHeader>
                <CardTitle className="line-clamp-1">{committee.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-gray-600">{committee.topic}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {committee.difficulty}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={seatsAvailable > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                  >
                    {seatsAvailable > 0 ? `${seatsAvailable} Seats Available` : "Full"}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Users className="mr-1 h-4 w-4" />
                  Chair: {committee.chair_name}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/committees/${committee.committee_id}`} className="w-full">
                  <Button variant="outline" className="w-full justify-between">
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </>
  )
}
