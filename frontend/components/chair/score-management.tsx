"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ScoreManagementProps {
  committeeId: string
}

export function ScoreManagement({ committeeId }: ScoreManagementProps) {
  const [delegates] = useState([
    { id: "1", name: "John Smith", country: "France" },
    { id: "2", name: "Emma Johnson", country: "Germany" },
    { id: "3", name: "Michael Brown", country: "Japan" },
    { id: "4", name: "Sophia Garcia", country: "Brazil" },
    { id: "5", name: "William Davis", country: "India" },
  ])

  const [scores] = useState([
    {
      id: "1",
      delegate_id: "1",
      delegate_name: "John Smith",
      country: "France",
      category: "Speech",
      points: 8,
      date: "2023-10-15",
      notes: "Excellent opening speech",
    },
    {
      id: "2",
      delegate_id: "1",
      delegate_name: "John Smith",
      country: "France",
      category: "Resolution",
      points: 10,
      date: "2023-10-16",
      notes: "Primary sponsor of passed resolution",
    },
    {
      id: "3",
      delegate_id: "2",
      delegate_name: "Emma Johnson",
      country: "Germany",
      category: "Diplomacy",
      points: 7,
      date: "2023-10-16",
      notes: "Good coalition building",
    },
    {
      id: "4",
      delegate_id: "3",
      delegate_name: "Michael Brown",
      country: "Japan",
      category: "Speech",
      points: 6,
      date: "2023-10-15",
      notes: "Solid arguments but could improve delivery",
    },
  ])

  const [formData, setFormData] = useState({
    delegate_id: "",
    category: "",
    points: "",
    notes: "",
  })

  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // In a real app, this would call the API
      // await addScore(committeeId, formData)

      toast({
        title: "Score added",
        description: "The score has been added successfully.",
      })

      // Reset form
      setFormData({
        delegate_id: "",
        category: "",
        points: "",
        notes: "",
      })
    } catch (error) {
      console.error("Add score error:", error)
      toast({
        variant: "destructive",
        title: "Failed to add score",
        description: "There was an error adding the score. Please try again.",
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
        <AlertDescription>[Sample Data] Showing example score management interface.</AlertDescription>
      </Alert>

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
                    {delegates.map((delegate) => (
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
                    <SelectItem value="Speech">Speech</SelectItem>
                    <SelectItem value="Resolution">Resolution</SelectItem>
                    <SelectItem value="Diplomacy">Diplomacy</SelectItem>
                    <SelectItem value="Position Paper">Position Paper</SelectItem>
                    <SelectItem value="Participation">Participation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="points" className="text-sm font-medium">
                  Points (1-10)
                </label>
                <Input
                  id="points"
                  type="number"
                  min="1"
                  max="10"
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
                  rows={1}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              {loading ? "Adding Score..." : "Add Score"}
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
              <div className="col-span-2">Country</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1">Points</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Notes</div>
            </div>
            <div className="divide-y">
              {scores.map((score) => (
                <div key={score.id} className="grid grid-cols-12 px-4 py-3 text-sm">
                  <div className="col-span-3 font-medium">{score.delegate_name}</div>
                  <div className="col-span-2">{score.country}</div>
                  <div className="col-span-2">{score.category}</div>
                  <div className="col-span-1">
                    <Badge variant="outline">{score.points}</Badge>
                  </div>
                  <div className="col-span-2 text-gray-500">{score.date}</div>
                  <div className="col-span-2 truncate text-gray-500" title={score.notes}>
                    {score.notes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
