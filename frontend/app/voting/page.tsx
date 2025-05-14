"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, FileText, Vote } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import VotingResults from "@/components/voting/VotingResults"
import VotingControls from "@/components/voting/VotingControls"
import { fetchResolutionsForVoting, fetchVotingResults, updateVotingStatus } from "@/services/api"

export default function VotingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resolutionId = searchParams.get("resolution") ? Number.parseInt(searchParams.get("resolution")!) : null
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [resolutions, setResolutions] = useState<any[]>([])
  const [votingData, setVotingData] = useState<any>(null)
  const [userHasVoted, setUserHasVoted] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      try {
        setLoading(true)
        setError("")
        // Fetch all resolutions available for voting
        const resolutionsResponse = await fetchResolutionsForVoting(1) // TODO: Replace 1 with actual committee ID
        if (resolutionsResponse && resolutionsResponse.data) {
          setResolutions(Array.isArray(resolutionsResponse.data) ? resolutionsResponse.data : [])
        }
        // If a resolution is selected, fetch its voting data
        if (resolutionId) {
          const votingResponse = await fetchVotingResults(resolutionId)
          if (votingResponse && votingResponse.data) {
            setVotingData(votingResponse.data)
            setUserHasVoted(false) // TODO: Replace with real check if user has voted
          }
        }
      } catch (err) {
        setError("Failed to load voting information. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user, resolutionId])

  const handleStartVoting = async (id: number) => {
    if (user?.role === "chair") {
      try {
        setLoading(true)
        await updateVotingStatus(id, "in_progress")
      } catch (err) {
        setError("Failed to start voting. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    router.push(`/voting?resolution=${id}`)
  }

  const handleEndVoting = async (id: number) => {
    if (user?.role !== "chair") return
    try {
      setLoading(true)
      await updateVotingStatus(id, "completed")
      const votingResponse = await fetchVotingResults(id)
      if (votingResponse && votingResponse.data) {
        setVotingData({ ...votingResponse.data, voting_status: "completed" })
      }
    } catch (err) {
      setError("Failed to end voting. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVote = (vote: "yes" | "no" | "abstain") => {
    if (!votingData || !resolutionId) return
    setVotingData((prev: any) => {
      const updatedVotes = { ...prev.votes }
      updatedVotes[vote] += 1
      return { ...prev, votes: updatedVotes }
    })
    setUserHasVoted(true)
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert>
          <AlertDescription>You must be logged in to view this page. Please log in to continue.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Resolution Voting</h1>
        <p className="text-gray-600">
          {user.role === "chair" ? "Manage voting on committee resolutions" : "Cast your vote on committee resolutions"}
        </p>
      </div>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
          <span>Loading voting information...</span>
        </div>
      ) : (
        <>
          {!resolutionId ? (
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Vote className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Voting Information</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Select a resolution below to view details and participate in voting.
                      </p>
                      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                        <li>Chairs can start and end voting sessions</li>
                        <li>Delegates can cast votes (Yes/No/Abstain) on active resolutions</li>
                        <li>Results are displayed in real-time</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <h2 className="text-xl font-semibold mt-8 mb-4">Available Resolutions</h2>
              {resolutions.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {resolutions.map((resolution) => (
                    <Card key={resolution.resolution_id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{resolution.title}</CardTitle>
                            <CardDescription>
                              Submitted by: {resolution.author} ({resolution.country})
                            </CardDescription>
                          </div>
                          <Badge
                            className={
                              resolution.voting_status === "active"
                                ? "bg-green-100 text-green-800"
                                : resolution.voting_status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {resolution.voting_status === "active"
                              ? "Voting Active"
                              : resolution.voting_status === "completed"
                              ? "Voting Completed"
                              : "Pending"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 mb-4">{resolution.description}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <span>Submitted on: {new Date(resolution.submitted_at).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50 border-t flex justify-end py-3">
                        <Button
                          onClick={() => handleStartVoting(resolution.resolution_id)}
                          variant={resolution.voting_status === "completed" ? "outline" : "default"}
                        >
                          {resolution.voting_status === "completed"
                            ? "View Results"
                            : resolution.voting_status === "active"
                            ? "Join Voting"
                            : user.role === "chair"
                            ? "Start Voting"
                            : "View Details"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No resolutions available for voting at this time.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {votingData && (
                <div className="space-y-8">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-blue-600" />
                            {votingData.title}
                          </CardTitle>
                          <CardDescription>{votingData.committee_name}</CardDescription>
                        </div>
                        <Badge
                          className={
                            votingData.voting_status === "in_progress" || votingData.voting_status === "active"
                              ? "bg-green-100 text-green-800"
                              : votingData.voting_status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {votingData.voting_status === "in_progress" || votingData.voting_status === "active"
                            ? "Voting Active"
                            : votingData.voting_status === "completed"
                            ? "Voting Completed"
                            : "Pending"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-4">{votingData.description}</p>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            Submitted by: <span className="font-medium">{votingData.author}</span> ({votingData.country})
                          </p>
                          <p className="text-sm text-gray-600">
                            Total Votes: <span className="font-medium">{votingData.votes?.yes + votingData.votes?.no + votingData.votes?.abstain || 0}</span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {user.role === "chair" &&
                            (votingData.voting_status === "in_progress" || votingData.voting_status === "active") && (
                              <Button variant="destructive" size="sm" onClick={() => handleEndVoting(resolutionId!)}>
                                End Voting
                              </Button>
                            )}
                          <Button variant="outline" onClick={() => router.push("/voting")} size="sm">
                            Back to All Resolutions
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {user.role === "delegate" &&
                      (votingData.voting_status === "in_progress" || votingData.voting_status === "active") &&
                      !userHasVoted && (
                        <VotingControls documentId={resolutionId!} delegateId={user.id} onVote={handleVote} />
                      )}
                    {userHasVoted && user.role === "delegate" && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Thank You for Voting</CardTitle>
                          <CardDescription>Your vote has been recorded</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-center py-6">
                            <div className="bg-green-100 text-green-800 p-3 rounded-full">
                              <Vote className="h-6 w-6" />
                            </div>
                          </div>
                          <p className="text-center text-gray-600">
                            Your participation helps shape the outcome of this resolution. Thank you for contributing to the democratic process.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                    <VotingResults
                      votingData={votingData}
                      showDetailed={user.role === "chair" || votingData.voting_status === "completed"}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
