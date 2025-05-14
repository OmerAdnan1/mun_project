"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ThumbsUp, ThumbsDown, Minus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { castVote } from "@/services/api"

type VotingControlsProps = {
  documentId: number
  delegateId: number
  onVote: (vote: "yes" | "no" | "abstain") => void
}

export default function VotingControls({ documentId, delegateId, onVote }: VotingControlsProps) {
  const { toast } = useToast()
  const [selectedVote, setSelectedVote] = useState<"yes" | "no" | "abstain" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  const handleVoteSelect = (vote: "yes" | "no" | "abstain") => {
    setSelectedVote(vote)
  }

  const handleSubmitVote = async () => {
    if (!selectedVote) {
      toast({
        title: "No vote selected",
        description: "Please select your vote before submitting.",
        variant: "destructive",
      })
      return
    }
    try {
      setIsSubmitting(true)
      await castVote({ delegate_id: delegateId, document_id: documentId, vote: selectedVote })
      toast({
        title: "Vote submitted",
        description: "Your vote has been recorded successfully.",
      })
      onVote(selectedVote)
      setHasVoted(true)
    } catch (error) {
      console.error("Error submitting vote:", error)
      toast({
        title: "Submission failed",
        description: "There was an error submitting your vote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cast Your Vote</CardTitle>
        <CardDescription>Vote on this resolution as your country&apos;s representative</CardDescription>
      </CardHeader>
      <CardContent>
        {hasVoted ? (
          <div className="text-center py-6">
            <div className="text-green-600 font-medium mb-2">Your vote has been recorded</div>
            <p className="text-gray-600">Thank you for participating in this vote.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Button
                variant={selectedVote === "yes" ? "default" : "outline"}
                className={`flex flex-col items-center py-6 ${selectedVote === "yes" ? "bg-green-600 hover:bg-green-700" : ""}`}
                onClick={() => handleVoteSelect("yes")}
              >
                <ThumbsUp className="h-8 w-8 mb-2" />
                <span>Yes</span>
              </Button>
              <Button
                variant={selectedVote === "no" ? "default" : "outline"}
                className={`flex flex-col items-center py-6 ${selectedVote === "no" ? "bg-red-600 hover:bg-red-700" : ""}`}
                onClick={() => handleVoteSelect("no")}
              >
                <ThumbsDown className="h-8 w-8 mb-2" />
                <span>No</span>
              </Button>
              <Button
                variant={selectedVote === "abstain" ? "default" : "outline"}
                className={`flex flex-col items-center py-6 ${selectedVote === "abstain" ? "bg-yellow-600 hover:bg-yellow-700" : ""}`}
                onClick={() => handleVoteSelect("abstain")}
              >
                <Minus className="h-8 w-8 mb-2" />
                <span>Abstain</span>
              </Button>
            </div>
            <Button className="w-full" disabled={!selectedVote || isSubmitting} onClick={handleSubmitVote}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Submitting..." : "Submit Vote"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
