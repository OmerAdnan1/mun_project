"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Download, FileText, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface DocumentReviewProps {
  committeeId: string
  documents: any[]
  delegates: any[]
}

export function DocumentReview({ committeeId, documents, delegates }: DocumentReviewProps) {
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleReview = (document: any) => {
    setSelectedDocument(document)
    setFeedback(document.feedback || "")
  }

  const handleApprove = async () => {
    if (!selectedDocument) return
    setLoading(true)

    try {
      // In a real app, this would call the API
      // await reviewDocument(selectedDocument.id, { status: 'approved', feedback })

      toast({
        title: "Document approved",
        description: "The document has been approved successfully.",
      })

      // Reset selection
      setSelectedDocument(null)
      setFeedback("")
    } catch (error) {
      console.error("Approve document error:", error)
      toast({
        variant: "destructive",
        title: "Failed to approve document",
        description: "There was an error approving the document. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedDocument) return
    setLoading(true)

    try {
      // In a real app, this would call the API
      // await reviewDocument(selectedDocument.id, { status: 'rejected', feedback })

      toast({
        title: "Document rejected",
        description: "The document has been rejected successfully.",
      })

      // Reset selection
      setSelectedDocument(null)
      setFeedback("")
    } catch (error) {
      console.error("Reject document error:", error)
      toast({
        variant: "destructive",
        title: "Failed to reject document",
        description: "There was an error rejecting the document. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>[Sample Data] Showing example document review interface.</AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Review submitted documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
                <div className="col-span-5">Title</div>
                <div className="col-span-3">Delegate</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Actions</div>
              </div>
              <div className="divide-y">
                {documents.map((doc) => (
                  <div
                    key={doc.document_id}
                    className={`grid grid-cols-12 px-4 py-3 text-sm ${
                      selectedDocument?.document_id === doc.document_id ? "bg-muted/30" : ""
                    }`}
                  >
                    <div className="col-span-5 font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-blue-500" />
                        <span>{doc.title}</span>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div>{doc.delegate_name}</div>
                    </div>
                    <div className="col-span-2">
                      <Badge
                        variant="outline"
                        className={
                          doc.status === "approved"
                            ? "bg-green-50 text-green-700"
                            : doc.status === "rejected"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }
                      >
                        {doc.status}
                      </Badge>
                    </div>
                    <div className="col-span-2 flex gap-1">
                      <Button variant="ghost" size="icon" title="Download">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Review"
                        onClick={() => handleReview(doc)}
                        disabled={doc.status !== "pending"}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Review</CardTitle>
            <CardDescription>
              {selectedDocument ? `Reviewing: ${selectedDocument.title}` : "Select a document from the list to review"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDocument ? (
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium">{selectedDocument.title}</h3>
                    <Badge variant="outline">
                      {selectedDocument.type === "position_paper" ? "Position Paper" : "Resolution"}
                    </Badge>
                  </div>
                  <div className="mb-4 text-sm text-gray-500">
                    <p>
                      Submitted by {selectedDocument.delegate_name} ({selectedDocument.country}) on{" "}
                      {selectedDocument.submitted_date}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Document
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="feedback" className="text-sm font-medium">
                    Feedback
                  </label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide feedback on this document"
                    rows={4}
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                    onClick={handleReject}
                    disabled={loading}
                  >
                    <X className="mr-2 h-4 w-4" />
                    {loading ? "Rejecting..." : "Reject"}
                  </Button>
                  <Button
                    className="bg-green-600 text-white hover:bg-green-700"
                    onClick={handleApprove}
                    disabled={loading}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {loading ? "Approving..." : "Approve"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium">No Document Selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select a pending document from the list to review</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
