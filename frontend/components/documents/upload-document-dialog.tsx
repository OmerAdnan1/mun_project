"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface UploadDocumentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  delegateId: number
  committeeId: number
  onSuccess: () => void
}

export function UploadDocumentDialog({
  open,
  onOpenChange,
  delegateId,
  committeeId,
  onSuccess
}: UploadDocumentDialogProps) {
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [docType, setDocType] = useState("")
  const [docLink, setDocLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!title.trim() || !docType || !docLink.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    // Validate Google Doc link
    if (!docLink.includes("docs.google.com")) {
      toast({
        title: "Invalid document link",
        description: "Please provide a valid Google Docs link",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await apiService.uploadDocument({
        delegate_id: delegateId,
        committee_id: committeeId,
        title: title.trim(),
        type: docType,
        doc_link: docLink.trim()
      })

      if (response.success) {
        toast({
          title: "Document uploaded",
          description: "Your document has been submitted for review",
        })
        setTitle("")
        setDocType("")
        setDocLink("")
        onOpenChange(false)
        onSuccess()
      } else {
        toast({
          title: "Upload failed",
          description: response.message || "There was an error uploading your document",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Document upload error:", error)
      toast({
        title: "Upload failed",
        description: "There was an error connecting to the server",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Document Type</Label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="position_paper">Position Paper</SelectItem>
                <SelectItem value="resolution">Resolution</SelectItem>
                <SelectItem value="working_paper">Working Paper</SelectItem>
                <SelectItem value="amendment">Amendment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="link">Google Docs Link</Label>
            <Input
              id="link"
              value={docLink}
              onChange={(e) => setDocLink(e.target.value)}
              placeholder="Paste your Google Docs link here"
            />
            <p className="text-xs text-muted-foreground">
              Please share your document with edit access to the committee chair
            </p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Document"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
