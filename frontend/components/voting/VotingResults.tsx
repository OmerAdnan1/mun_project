"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react"

export type VotingResultsProps = {
  votingData: any
  showDetailed: boolean
}

export default function VotingResults({ votingData, showDetailed }: VotingResultsProps) {
  const { votes } = votingData

  // Calculate total votes
  const total_votes = votes.yes + votes.no + votes.abstain

  // Calculate percentages
  const yesPercentage = total_votes > 0 ? (votes.yes / total_votes) * 100 : 0
  const noPercentage = total_votes > 0 ? (votes.no / total_votes) * 100 : 0
  const abstainPercentage = total_votes > 0 ? (votes.abstain / total_votes) * 100 : 0

  const getVoteBadge = (vote: string) => {
    switch (vote) {
      case "yes":
        return <Badge className="bg-green-100 text-green-800">Yes</Badge>
      case "no":
        return <Badge className="bg-red-100 text-red-800">No</Badge>
      case "abstain":
        return <Badge className="bg-yellow-100 text-yellow-800">Abstain</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Not Voted</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voting Results</CardTitle>
        <CardDescription>
          {votingData.voting_status === "completed"
            ? "Final results of the vote"
            : votingData.voting_status === "in_progress"
            ? "Current voting progress"
            : "Voting has not started yet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-2">
                <ThumbsUp className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">{votes.yes}</div>
              <div className="text-sm text-gray-500">Yes</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-2">
                <ThumbsDown className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">{votes.no}</div>
              <div className="text-sm text-gray-500">No</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 mb-2">
                <Minus className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">{votes.abstain}</div>
              <div className="text-sm text-gray-500">Abstain</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Yes ({Math.round(yesPercentage)}%)</span>
              <span>{votes.yes} / {total_votes}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${yesPercentage}%` }}></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span>No ({Math.round(noPercentage)}%)</span>
              <span>{votes.no} / {total_votes}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${noPercentage}%` }}></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Abstain ({Math.round(abstainPercentage)}%)</span>
              <span>{votes.abstain} / {total_votes}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: `${abstainPercentage}%` }}></div>
            </div>
          </div>

          {showDetailed && votingData.delegateVotes && votingData.delegateVotes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Detailed Voting Record</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Delegate</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead className="text-right">Vote</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {votingData.delegateVotes.map((vote: any) => (
                      <TableRow key={vote.vote_id}>
                        <TableCell className="font-medium">{vote.delegate_name}</TableCell>
                        <TableCell>{vote.country_name}</TableCell>
                        <TableCell className="text-right">{getVoteBadge(vote.vote)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
