"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  AlertCircle, CheckCircle, FileText, Download, X, Info, Eye, 
  Clock, Upload, CheckCheck, Send, ArrowUpRight
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api"
import Link from "next/link"

interface DocumentManagementProps {
  committeeId: string
  chairId: string
}

export function DocumentManagement({ committeeId, chairId }: DocumentManagementProps) {
  // Document states
  const [documents, setDocuments] = useState<any[]>([])
  const [pendingDocuments, setPendingDocuments] = useState<any[]>([])
  const [approvedDocuments, setApprovedDocuments] = useState<any[]>([])
  const [publishableDocuments, setPublishableDocuments] = useState<any[]>([])
  const [rejectedDocuments, setRejectedDocuments] = useState<any[]>([])
  const [publishedDocuments, setPublishedDocuments] = useState<any[]>([])
  
  // State for selected document and UI
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null)
  const [documentDetails, setDocumentDetails] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [feedback, setFeedback] = useState("")
  
  // Dialog states
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  
  const { toast } = useToast()

  // Fetch all documents for this committee
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true)
      try {
        // Try to get real data from the API first
        let response: any
        try {
          response = await apiService.getCommitteeDocuments(committeeId)
          if (!response.success) {
            throw new Error("API did not return success")
          }
        } catch (error) {
          console.error("Failed to fetch committee documents:", error)
          response = { success: false, data: [], message: "Failed to fetch documents" }
        }
        
        if (response.success) {
          const docs = response.data
          setDocuments(docs)
          
          // Filter documents by status
          setPendingDocuments(docs.filter((doc: any) => doc.status === 'submitted'))
          setApprovedDocuments(docs.filter((doc: any) => doc.status === 'approved'))
          setRejectedDocuments(docs.filter((doc: any) => doc.status === 'rejected'))
          setPublishedDocuments(docs.filter((doc: any) => doc.status === 'published'))
          
          // Check which approved documents have enough votes to be published
          const approvedDocs = docs.filter((doc: any) => doc.status === 'approved')
          
          const publishableDocs = []
          for (const doc of approvedDocs) {
            try {
              // Try to get real vote data first
              let voteCountRes
              let votesRes
              try {
                voteCountRes = await apiService.getVoteCount(doc.document_id)
                votesRes = await apiService.getVotesForDocument(doc.document_id)
                
                if (!voteCountRes.success || !votesRes.success) {
                  throw new Error("API did not return success")
                }
              } catch (error) {
                console.error(`Failed to get vote data for document ${doc.document_id}:`, error)
                voteCountRes = { success: false, data: { votes_for: 0, votes_against: 0, votes_abstain: 0, total_votes: 0 } }
                votesRes = { success: false, data: [] }
                continue
              }
              
              if (voteCountRes.success && voteCountRes.data.total_votes >= 2) {
                publishableDocs.push({
                  ...doc,
                  voteCount: voteCountRes.data
                })
              }
            } catch (error) {
              console.error(`Failed to get vote count for document ${doc.document_id}:`, error)
            }
          }
          
          setPublishableDocuments(publishableDocs)
        }
      } catch (error) {
        console.error('Failed to fetch committee documents:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load committee documents"
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchDocuments()
  }, [committeeId, toast])

  // Handle opening the review dialog
  const handleReviewClick = (document: any) => {
    setSelectedDocument(document)
    setFeedback(document.feedback || "")
    setReviewDialogOpen(true)
  }
  
  // Handle opening the details dialog
  const handleDetailsClick = async (document: any) => {
    setSelectedDocument(document)
    
    try {
      // Try to get real vote data first
      let voteCountRes
      let votesRes
      try {
        voteCountRes = await apiService.getVoteCount(document.document_id)
        votesRes = await apiService.getVotesForDocument(document.document_id)
        
        if (!voteCountRes.success || !votesRes.success) {
          throw new Error("API did not return success")
        }
      } catch (error) {
        console.error('Failed to get vote data for details:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load voting details"
        })
        return
      }
      
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
  
  // Handle opening the publish dialog
  const handlePublishClick = (document: any) => {
    setSelectedDocument(document)
    setPublishDialogOpen(true)
  }
  
  // Handle approving a document
  const handleApprove = async () => {
    if (!selectedDocument) return
    setActionLoading(true)
    
    try {
      // Try the real API call first
      let response
      try {
        response = await apiService.changeDocumentStatus(
          selectedDocument.document_id, 
          'approved'
        )
        
        if (!response.success) {
          throw new Error("API did not return success")
        }
      } catch (error) {
        console.error("Failed to approve document:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to approve document"
        })
        setActionLoading(false)
        return
      }
      
      if (response.success) {
        toast({
          title: "Document approved",
          description: "The document has been approved successfully"
        })
        
        // Update document lists
        const updatedDoc = { ...selectedDocument, status: 'approved', feedback }
        
        setDocuments(prev => 
          prev.map(doc => doc.document_id === updatedDoc.document_id ? updatedDoc : doc)
        )
        
        setPendingDocuments(prev => 
          prev.filter(doc => doc.document_id !== updatedDoc.document_id)
        )
        
        setApprovedDocuments(prev => [...prev, updatedDoc])
        
        // Close the dialog
        setReviewDialogOpen(false)
        setFeedback("")
      }
    } catch (error) {
      console.error('Approve document error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve document"
      })
    } finally {
      setActionLoading(false)
    }
  }
  
  // Handle rejecting a document
  const handleReject = async () => {
    if (!selectedDocument) return
    setActionLoading(true)
    
    try {
      // Try the real API call first
      let response
      try {
        response = await apiService.changeDocumentStatus(
          selectedDocument.document_id, 
          'rejected'
        )
        
        if (!response.success) {
          throw new Error("API did not return success")
        }
      } catch (error) {
        console.error("Failed to reject document:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to reject document"
        })
        setActionLoading(false)
        return
      }
      
      if (response.success) {
        toast({
          title: "Document rejected",
          description: "The document has been rejected successfully"
        })
        
        // Update document lists
        const updatedDoc = { ...selectedDocument, status: 'rejected', feedback }
        
        setDocuments(prev => 
          prev.map(doc => doc.document_id === updatedDoc.document_id ? updatedDoc : doc)
        )
        
        setPendingDocuments(prev => 
          prev.filter(doc => doc.document_id !== updatedDoc.document_id)
        )
        
        setRejectedDocuments(prev => [...prev, updatedDoc])
        
        // Close the dialog
        setReviewDialogOpen(false)
        setFeedback("")
      }
    } catch (error) {
      console.error('Reject document error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject document"
      })
    } finally {
      setActionLoading(false)
    }
  }
  
  // Handle publishing a document
  const handlePublish = async () => {
    if (!selectedDocument) return
    setActionLoading(true)
    
    try {
      // Try the real API call first
      let response
      try {
        response = await apiService.publishDocument(selectedDocument.document_id)
        
        if (!response.success) {
          throw new Error("API did not return success")
        }
      } catch (error) {
        console.error("Failed to publish document:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to publish document"
        })
        setActionLoading(false)
        return
      }
      
      if (response.success) {
        toast({
          title: "Document published",
          description: "The document has been published successfully"
        })
        
        // Update document lists
        const updatedDoc = { ...selectedDocument, status: 'published' }
        
        setDocuments(prev => 
          prev.map(doc => doc.document_id === updatedDoc.document_id ? updatedDoc : doc)
        )
        
        setApprovedDocuments(prev => 
          prev.filter(doc => doc.document_id !== updatedDoc.document_id)
        )
        
        setPublishableDocuments(prev => 
          prev.filter(doc => doc.document_id !== updatedDoc.document_id)
        )
        
        setPublishedDocuments(prev => [...prev, updatedDoc])
        
        // Close the dialog
        setPublishDialogOpen(false)
      }
    } catch (error) {
      console.error('Publish document error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to publish document"
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Document card component to reduce duplication
  const DocumentCard = ({ document, actions, showStatus = true }: { document: any, actions: React.ReactNode, showStatus?: boolean }) => (
    <Card key={document.document_id} className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-lg">{document.title}</h3>
            <p className="text-sm text-muted-foreground">
              Submitted by {document.delegate_name} ({document.country_name}) on {formatDate(document.uploaded_at)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="capitalize">{document.type.replace('_', ' ')}</Badge>
            {showStatus && (
              <Badge
                variant="outline"
                className={
                  document.status === "approved"
                    ? "bg-green-50 text-green-700"
                    : document.status === "rejected"
                      ? "bg-red-50 text-red-700"
                      : document.status === "published"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-amber-50 text-amber-700"
                }
              >
                {document.status}
              </Badge>
            )}
          </div>
        </div>
        {actions}
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
          <CardDescription>Loading documents...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
          <CardDescription>Review, approve, and publish committee documents</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending" className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> 
                Pending Review
                {pendingDocuments.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{pendingDocuments.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> 
                Approved
                {approvedDocuments.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{approvedDocuments.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="publishable" className="flex items-center gap-1">
                <ArrowUpRight className="h-4 w-4" /> 
                Ready to Publish
                {publishableDocuments.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{publishableDocuments.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="published" className="flex items-center gap-1">
                <CheckCheck className="h-4 w-4" /> 
                Published
                {publishedDocuments.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{publishedDocuments.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-1">
                <X className="h-4 w-4" /> 
                Rejected
                {rejectedDocuments.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{rejectedDocuments.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            {/* Pending Documents */}
            <TabsContent value="pending">
              {pendingDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No documents pending review
                </div>
              ) : (
                <div>
                  {pendingDocuments.map((doc) => (
                    <DocumentCard 
                      key={doc.document_id}
                      document={doc}
                      showStatus={false}
                      actions={
                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="default" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleReviewClick(doc)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Review
                          </Button>
                          <Button variant="outline" onClick={() => handleDetailsClick(doc)}>
                            <Info className="mr-2 h-4 w-4" />
                            Details
                          </Button>
                          {doc.file_url && (
                            <Button variant="outline" asChild>
                              <Link href={doc.file_url} target="_blank">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Link>
                            </Button>
                          )}
                        </div>
                      }
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Approved Documents */}
            <TabsContent value="approved">
              {approvedDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No approved documents
                </div>
              ) : (
                <div>
                  {approvedDocuments.map((doc) => (
                    <DocumentCard 
                      key={doc.document_id}
                      document={doc}
                      actions={
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" onClick={() => handleDetailsClick(doc)}>
                            <Info className="mr-2 h-4 w-4" />
                            Details
                          </Button>
                          {doc.file_url && (
                            <Button variant="outline" asChild>
                              <Link href={doc.file_url} target="_blank">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Link>
                            </Button>
                          )}
                        </div>
                      }
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Publishable Documents */}
            <TabsContent value="publishable">
              {publishableDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No documents ready to be published</p>
                  <p className="text-sm mt-2">
                    Documents must be approved and have at least 2 votes to be published
                  </p>
                </div>
              ) : (
                <div>
                  {publishableDocuments.map((doc) => (
                    <DocumentCard 
                      key={doc.document_id}
                      document={doc}
                      actions={
                        <div>
                          <div className="mt-4 mb-4 grid grid-cols-4 gap-2 text-center">
                            <div className="border rounded-md p-2">
                              <p className="text-xl font-bold text-green-500">{doc.voteCount.votes_for}</p>
                              <p className="text-xs text-muted-foreground">For</p>
                            </div>
                            <div className="border rounded-md p-2">
                              <p className="text-xl font-bold text-red-500">{doc.voteCount.votes_against}</p>
                              <p className="text-xs text-muted-foreground">Against</p>
                            </div>
                            <div className="border rounded-md p-2">
                              <p className="text-xl font-bold text-yellow-500">{doc.voteCount.votes_abstain}</p>
                              <p className="text-xs text-muted-foreground">Abstain</p>
                            </div>
                            <div className="border rounded-md p-2">
                              <p className="text-xl font-bold">{doc.voteCount.total_votes}</p>
                              <p className="text-xs text-muted-foreground">Total</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="default" 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handlePublishClick(doc)}
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Publish
                            </Button>
                            <Button variant="outline" onClick={() => handleDetailsClick(doc)}>
                              <Info className="mr-2 h-4 w-4" />
                              Details
                            </Button>
                            {doc.file_url && (
                              <Button variant="outline" asChild>
                                <Link href={doc.file_url} target="_blank">
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      }
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Published Documents */}
            <TabsContent value="published">
              {publishedDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No published documents
                </div>
              ) : (
                <div>
                  {publishedDocuments.map((doc) => (
                    <DocumentCard 
                      key={doc.document_id}
                      document={doc}
                      actions={
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" onClick={() => handleDetailsClick(doc)}>
                            <Info className="mr-2 h-4 w-4" />
                            Details
                          </Button>
                          {doc.file_url && (
                            <Button variant="outline" asChild>
                              <Link href={doc.file_url} target="_blank">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Link>
                            </Button>
                          )}
                        </div>
                      }
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Rejected Documents */}
            <TabsContent value="rejected">
              {rejectedDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No rejected documents
                </div>
              ) : (
                <div>
                  {rejectedDocuments.map((doc) => (
                    <DocumentCard 
                      key={doc.document_id}
                      document={doc}
                      actions={
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" onClick={() => handleDetailsClick(doc)}>
                            <Info className="mr-2 h-4 w-4" />
                            Details
                          </Button>
                          {doc.file_url && (
                            <Button variant="outline" asChild>
                              <Link href={doc.file_url} target="_blank">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Link>
                            </Button>
                          )}
                        </div>
                      }
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Document</DialogTitle>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="py-4">
              <div className="rounded-md border p-4 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-lg">{selectedDocument.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Submitted by {selectedDocument.delegate_name} ({selectedDocument.country_name})
                    </p>
                  </div>
                  <Badge className="capitalize">{selectedDocument.type.replace('_', ' ')}</Badge>
                </div>
                
                {selectedDocument.file_url && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={selectedDocument.file_url} target="_blank">
                      <Download className="mr-2 h-4 w-4" />
                      View Document
                    </Link>
                  </Button>
                )}
              </div>
              
              <div className="space-y-3 mb-4">
                <label htmlFor="feedback" className="text-sm font-medium">
                  Feedback
                </label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide feedback on this document (required for rejections, optional for approvals)"
                  rows={4}
                />
              </div>
              
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Review carefully</AlertTitle>
                <AlertDescription>
                  This action will either approve or reject the document. 
                  {selectedDocument.type === 'draft_resolution' || selectedDocument.type === 'amendment' ? 
                    " If approved, the document will need to receive at least 2 votes before it can be published." : 
                    " If approved, the document will be available for viewing by committee members."}
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                  onClick={handleReject}
                  disabled={actionLoading || !feedback.trim()}
                >
                  <X className="mr-2 h-4 w-4" />
                  {actionLoading ? "Rejecting..." : "Reject Document"}
                </Button>
                <Button
                  className="bg-green-600 text-white hover:bg-green-700"
                  onClick={handleApprove}
                  disabled={actionLoading}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {actionLoading ? "Approving..." : "Approve Document"}
                </Button>
              </div>
            </div>
          )}
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
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-medium text-lg mb-2">{documentDetails.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Author:</span> {documentDetails.delegate_name} ({documentDetails.country_name})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Type:</span> {documentDetails.type.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Submitted:</span> {formatDate(documentDetails.uploaded_at)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm">Status:</span>
                    <Badge
                      variant="outline"
                      className={
                        documentDetails.status === "approved"
                          ? "bg-green-50 text-green-700"
                          : documentDetails.status === "rejected"
                            ? "bg-red-50 text-red-700"
                            : documentDetails.status === "published"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-amber-50 text-amber-700"
                      }
                    >
                      {documentDetails.status}
                    </Badge>
                  </div>
                  {documentDetails.feedback && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Feedback:</span> {documentDetails.feedback}
                    </p>
                  )}
                  {documentDetails.file_url && (
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link href={documentDetails.file_url} target="_blank">
                        <Download className="mr-2 h-4 w-4" />
                        View Document
                      </Link>
                    </Button>
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
              
              {documentDetails.votes && documentDetails.votes.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Individual Votes</h4>
                  <div className="border rounded-md">
                    <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
                      <div className="col-span-4">Delegate</div>
                      <div className="col-span-2">Vote</div>
                      <div className="col-span-3">Date/Time</div>
                      <div className="col-span-3">Comments</div>
                    </div>
                    <div className="divide-y">
                      {documentDetails.votes.map((vote: any) => (
                        <div key={vote.vote_id} className="grid grid-cols-12 px-4 py-3 text-sm">
                          <div className="col-span-4">{vote.delegate_name}</div>
                          <div className="col-span-2">
                            <Badge
                              variant="outline"
                              className={
                                vote.vote === "for"
                                  ? "bg-green-50 text-green-700"
                                  : vote.vote === "against"
                                    ? "bg-red-50 text-red-700"
                                    : "bg-yellow-50 text-yellow-700"
                              }
                            >
                              {vote.vote}
                            </Badge>
                          </div>
                          <div className="col-span-3 text-muted-foreground">
                            {new Date(vote.timestamp).toLocaleString()}
                          </div>
                          <div className="col-span-3 text-muted-foreground truncate">
                            {vote.notes || "-"}
                          </div>
                        </div>
                      ))}
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
      
      {/* Publish Dialog */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Document</DialogTitle>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="py-4">
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ready to Publish</AlertTitle>
                <AlertDescription>
                  This document has been approved and has received {selectedDocument.voteCount?.total_votes || '2+'} votes.
                  Publishing will make it available to all delegates as an official committee document.
                </AlertDescription>
              </Alert>
              
              <div className="rounded-md border p-4 mb-4">
                <h3 className="font-medium">{selectedDocument.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Submitted by {selectedDocument.delegate_name} ({selectedDocument.country_name})
                </p>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setPublishDialogOpen(false)}>Cancel</Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handlePublish}
                  disabled={actionLoading}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {actionLoading ? "Publishing..." : "Publish Document"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
