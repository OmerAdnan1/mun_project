"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Plus, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { apiService } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

interface ScoreManagementProps {
  committeeId: string
  scores: any[]
  delegates: any[]
}

export function ScoreManagement({ committeeId, scores: initialScores, delegates }: ScoreManagementProps) {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const [scores, setScores] = useState<any[]>(initialScores || [])

  // Normalize delegates for consistent data structure
  const normalizedDelegates = delegates.map((d) => ({
    id: d.delegate_id || d.id,
    name: d.name || d.delegate_name || "",
    country: d.country || d.country_name || "",
  }))

  const [formData, setFormData] = useState({
    delegate_id: "",
    category: "",
    points: "",
    notes: "",
  })

  // Fetch scores when component mounts or when committeeId changes
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await apiService.getScoresByCommittee(committeeId)
        if (response.success) {
          setScores(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch scores:", error)
        toast({
          title: "Error",
          description: "Failed to load scores. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (!initialScores || initialScores.length === 0) {
      fetchScores()
    } else {
      setScores(initialScores)
      setLoading(false)
    }
  }, [committeeId, initialScores, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.delegate_id || !formData.category || !formData.points) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await apiService.addScore({
        committee_id: committeeId,
        delegate_id: formData.delegate_id,
        chair_id: user?.id,
        category: formData.category,
        points: parseFloat(formData.points),
        comments: formData.notes
      })

      if (response.success) {
        // Refresh the scores list
        const updatedScores = await apiService.getScoresByCommittee(committeeId)
        if (updatedScores.success) {
          setScores(updatedScores.data)
        }

        toast({
          title: "Success",
          description: "Score added successfully.",
      })

      // Reset form
      setFormData({
        delegate_id: "",
        category: "",
        points: "",
        notes: "",
      })
      }
    } catch (error) {
      console.error("Add score error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add score. Please try again.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Score</CardTitle>
          <CardDescription>Award points to delegates for their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="delegate" className="text-sm font-medium">
                  Delegate
                </label>
                <Select
                  value={formData.delegate_id}
                  onValueChange={(value) => setFormData({ ...formData, delegate_id: value })}
                >
                  <SelectTrigger id="delegate">
                    <SelectValue placeholder="Select delegate" />
                  </SelectTrigger>
                  <SelectContent>
                    {normalizedDelegates.map((delegate) => (
                      <SelectItem key={delegate.id} value={delegate.id}>
                        {delegate.name} ({delegate.country})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="speech">Speech</SelectItem>
                    <SelectItem value="motion">Motion</SelectItem>
                    <SelectItem value="resolution">Resolution</SelectItem>
                    <SelectItem value="diplomacy">Diplomacy</SelectItem>
                    <SelectItem value="position_paper">Position Paper</SelectItem>
                    <SelectItem value="working_paper">Working Paper</SelectItem>
                    <SelectItem value="draft_resolution">Draft Resolution</SelectItem>
                    <SelectItem value="amendment">Amendment</SelectItem>
                    <SelectItem value="overall">Overall</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="points" className="text-sm font-medium">
                  Points (0-10)
                </label>
                <Input
                  id="points"
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                  placeholder="Enter points"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notes
                </label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add notes about this score"
                  rows={3}
                />
              </div>
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              {submitting ? "Adding Score..." : "Add Score"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Score History</CardTitle>
          <CardDescription>Recent scores awarded to delegates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
              <div className="col-span-3">Delegate</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1">Points</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-4">Notes</div>
            </div>
            <div className="divide-y">
              {scores.length > 0 ? (
                scores.map((score) => (
                <div key={score.score_id} className="grid grid-cols-12 px-4 py-3 text-sm">
                  <div className="col-span-3 font-medium">{score.delegate_name}</div>
                    <div className="col-span-2 capitalize">{score.category}</div>
                  <div className="col-span-1">
                    <Badge variant="outline">{score.points}</Badge>
                    </div>
                    <div className="col-span-2 text-gray-500">
                      {score.timestamp ? new Date(score.timestamp).toLocaleDateString() : "-"}
                    </div>
                    <div className="col-span-4 truncate text-gray-500" title={score.comments}>
                      {score.comments || "-"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-sm text-gray-500">No scores found</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
