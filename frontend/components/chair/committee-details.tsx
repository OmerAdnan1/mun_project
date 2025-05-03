"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Clock, FileText, Users } from "lucide-react"

interface CommitteeDetailsProps {
  committee: any
}

export function CommitteeDetails({ committee }: CommitteeDetailsProps) {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: committee.name,
    topic: committee.topic,
    description:
      committee.description ||
      "The Security Council has primary responsibility for the maintenance of international peace and security.",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // In a real app, this would call the API to update the committee
      // await updateCommittee(committee.committee_id, formData)

      toast({
        title: "Committee updated",
        description: "The committee details have been updated successfully.",
      })

      setEditing(false)
    } catch (error) {
      console.error("Update error:", error)
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating the committee details.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Delegates</CardTitle>
            <CardDescription>Current registration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{committee.current_delegate_count}</span>
              </div>
              <Badge variant="outline">{committee.capacity - committee.current_delegate_count} seats available</Badge>
            </div>
            <div className="mt-2 text-xs text-gray-500">Total capacity: {committee.capacity}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Next Session</CardTitle>
            <CardDescription>Upcoming schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-purple-500" />
                <span className="font-medium">Today</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-purple-500" />
                <span className="font-medium">9:00 AM - 12:00 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Documents</CardTitle>
            <CardDescription>Pending review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-amber-500" />
                <span className="text-2xl font-bold">5</span>
              </div>
              <Button variant="outline" size="sm">
                Review
              </Button>
            </div>
            <div className="mt-2 text-xs text-gray-500">3 position papers, 2 draft resolutions</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Committee Information</CardTitle>
              <CardDescription>Details about this committee</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setEditing(!editing)}>
              {editing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Committee Name
                </label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="topic" className="text-sm font-medium">
                  Topic
                </label>
                <Input id="topic" name="topic" value={formData.topic} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Committee Name</h3>
                <p>{committee.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Topic</h3>
                <p>{committee.topic}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p>{committee.description}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Difficulty Level</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {committee.difficulty}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
