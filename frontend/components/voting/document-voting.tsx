"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ThumbsUp, ThumbsDown, Pause, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

interface DocumentVotingProps {
  committeeId: string
  delegateId: string
}

export function DocumentVoting({ committeeId, delegateId }: DocumentVotingProps) {
  const [documents, setDocuments] = useState<any[]>([])
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [votingDialogOpen, setVotingDialogOpen] = useState(false)
  const [vote, setVote] = useState<'for' | 'against' | 'abstain' | null>(null)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [documentDetails, setDocumentDetails] = useState<any | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true)
      try {
        const res = await apiService.getVotingEligibleDocuments(committeeId)
        if (res.success) {
          setDocuments(res.data)
        }
      } catch (error) {
        console.error('Failed to fetch voting documents:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load documents eligible for voting"
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchDocuments()
  }, [committeeId, toast])

  const handleVoteClick = async (document: any) => {
    setSelectedDocument(document)
    
    try {
      // Check if delegate has already voted
      const voteCheck = await apiService.checkUserVote(delegateId, document.document_id)
      
      if (voteCheck.success && voteCheck.data.hasVoted) {
        toast({
          title: "Already voted",
          description: "You have already cast a vote for this document"
        })
        return
      }
      
      setVotingDialogOpen(true)
    } catch (error) {
      console.error('Vote check error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check voting status"
      })
    }
  }

  const handleDetailsClick = async (document: any) => {
    setSelectedDocument(document)
    
    try {
      // Get vote count
      const voteCountRes = await apiService.getVoteCount(document.document_id)
      const votesRes = await apiService.getVotesForDocument(document.document_id)
      
      if (voteCountRes.success && votesRes.success) {
        setDocumentDetails({
          ...document,
          voteCount: voteCountRes.data,
          votes: votesRes.data
        })
        setDetailsDialogOpen(true)
      }
    } catch (error) {
      console.error('Document details error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load document details"
      })
    }
  }

  const submitVote = async () => {
    if (!selectedDocument || !vote) return
    
    setSubmitting(true)
    try {
      const res = await apiService.voteForDocument({
        delegate_id: delegateId,
        document_id: selectedDocument.document_id,
        vote,
        notes: notes || undefined
      })
      
      if (res.success) {
        toast({
          title: "Vote recorded",
          description: `Your vote has been successfully recorded`
        })
        setVotingDialogOpen(false)
        setVote(null)
        setNotes("")
      }
    } catch (error) {
      console.error('Vote submission error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to record your vote"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Voting</CardTitle>
          <CardDescription>Loading documents eligible for voting...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Voting</CardTitle>
        <CardDescription>Cast your vote on submitted documents</CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No documents are currently available for voting
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.document_id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-lg">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Submitted by {doc.delegate_name} ({doc.country_name}) on {formatDate(doc.uploaded_at)}
                    </p>
                  </div>
                  <Badge>{doc.type}</Badge>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button onClick={() => handleVoteClick(doc)} className="flex items-center gap-1">
                    Cast Vote
                  </Button>
                  <Button variant="outline" onClick={() => handleDetailsClick(doc)} className="flex items-center gap-1">
                    <Info className="h-4 w-4" /> Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Voting Dialog */}
        <Dialog open={votingDialogOpen} onOpenChange={setVotingDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cast Your Vote</DialogTitle>
            </DialogHeader>
            {selectedDocument && (
              <div className="py-4">
                <h3 className="font-medium text-lg mb-2">{selectedDocument.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Submitted by {selectedDocument.delegate_name} ({selectedDocument.country_name})
                </p>
                
                <div className="flex justify-center gap-4 my-6">
                  <Button 
                    variant={vote === 'for' ? "default" : "outline"} 
                    className={`flex flex-col items-center p-4 h-auto ${vote === 'for' ? 'border-green-500' : ''}`}
                    onClick={() => setVote('for')}
                  >
                    <ThumbsUp className={`h-8 w-8 mb-2 ${vote === 'for' ? 'text-green-500' : ''}`} />
                    <span>For</span>
                  </Button>
                  
                  <Button 
                    variant={vote === 'against' ? "default" : "outline"} 
                    className={`flex flex-col items-center p-4 h-auto ${vote === 'against' ? 'border-red-500' : ''}`}
                    onClick={() => setVote('against')}
                  >
                    <ThumbsDown className={`h-8 w-8 mb-2 ${vote === 'against' ? 'text-red-500' : ''}`} />
                    <span>Against</span>
                  </Button>
                  
                  <Button 
                    variant={vote === 'abstain' ? "default" : "outline"} 
                    className={`flex flex-col items-center p-4 h-auto ${vote === 'abstain' ? 'border-yellow-500' : ''}`}
                    onClick={() => setVote('abstain')}
                  >
                    <Pause className={`h-8 w-8 mb-2 ${vote === 'abstain' ? 'text-yellow-500' : ''}`} />
                    <span>Abstain</span>
                  </Button>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                  <Textarea
                    placeholder="Add any comments about your vote"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setVotingDialogOpen(false)}>Cancel</Button>
              <Button onClick={submitVote} disabled={!vote || submitting}>
                {submitting ? "Submitting..." : "Submit Vote"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Document Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Document Details</DialogTitle>
            </DialogHeader>
            {documentDetails && (
              <div className="py-4">
                <h3 className="font-medium text-lg mb-2">{documentDetails.title}</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Author:</span> {documentDetails.delegate_name} ({documentDetails.country_name})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Type:</span> {documentDetails.type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Submitted:</span> {formatDate(documentDetails.uploaded_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Status:</span> {documentDetails.status}
                    </p>
                    {documentDetails.file_url && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">File:</span>{" "}
                        <Link href={documentDetails.file_url} target="_blank" className="text-blue-500 hover:underline">
                          View Document
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
                
                {documentDetails.voteCount && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Vote Summary</h4>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div className="border rounded-md p-3">
                        <p className="text-2xl font-bold text-green-500">{documentDetails.voteCount.votes_for}</p>
                        <p className="text-sm text-muted-foreground">For</p>
                      </div>
                      <div className="border rounded-md p-3">
                        <p className="text-2xl font-bold text-red-500">{documentDetails.voteCount.votes_against}</p>
                        <p className="text-sm text-muted-foreground">Against</p>
                      </div>
                      <div className="border rounded-md p-3">
                        <p className="text-2xl font-bold text-yellow-500">{documentDetails.voteCount.votes_abstain}</p>
                        <p className="text-sm text-muted-foreground">Abstain</p>
                      </div>
                      <div className="border rounded-md p-3">
                        <p className="text-2xl font-bold">{documentDetails.voteCount.total_votes}</p>
                        <p className="text-sm text-muted-foreground">Total</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {documentDetails.content && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Content</h4>
                    <div className="border rounded-md p-4 bg-muted/30 whitespace-pre-wrap">
                      {documentDetails.content}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
