"use client"

import { useEffect, useState } from "react"
import { apiService, createCommittee, getAllUsers } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddCommitteeDialog } from "@/components/admin/add-committee-dialog"

export function AdminCommitteeManagement() {
  const [committees, setCommittees] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [editingCommittee, setEditingCommittee] = useState<any>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    name: "",
    description: "",
    topic: "",
    difficulty: "Beginner",
    capacity: 20,
    location: "",
    start_date: "",
    end_date: "",
    chair_id: ""
  })
  const [addError, setAddError] = useState("")
  const [addLoading, setAddLoading] = useState(false)
  const [chairs, setChairs] = useState<any[]>([])

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const response = await apiService.getCommittees()
        if (response.success) {
          setCommittees(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch committees:', error)
        setCommittees([])
      } finally {
        setLoading(false)
      }
    }
    fetchCommittees()

    // Fetch all users and filter for chairs
    getAllUsers().then(res => {
      if (res.success) {
        setChairs(res.data.filter((u: any) => u.role === "chair"))
      }
    })
  }, [])

  const handleEdit = async (committee: any) => {
    // Open dialog for editing capacity, difficulty, or topic
    setEditingCommittee(committee)
  }

  const handleUpdate = async (updatedData: any) => {
    try {
      const response = await apiService.updateCommittee(editingCommittee.committee_id, updatedData)
      if (response.success) {
        setCommittees(committees.map(c => 
          c.committee_id === editingCommittee.committee_id 
            ? { ...c, ...updatedData }
            : c
        ))
        setEditingCommittee(null)
      }
    } catch (error) {
      console.error('Failed to update committee:', error)
    }
  }

  const handleAddCommittee = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddLoading(true)
    setAddError("")
    try {
      const response = await createCommittee(addForm)
      if (response.success && response.data) {
        setCommittees([...committees, response.data])
        setAddDialogOpen(false)
        setAddForm({
          name: "",
          description: "",
          topic: "",
          difficulty: "Beginner",
          capacity: 20,
          location: "",
          start_date: "",
          end_date: "",
          chair_id: ""
        })
      } else {
        setAddError(response.message || "Failed to add committee.")
      }
    } catch (error) {
      setAddError("Failed to add committee. Please try again.")
    } finally {
      setAddLoading(false)
    }
  }

  const filteredCommittees = committees.filter(
    (committee) =>
      committee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (committee.topic || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Committee Management</CardTitle>
            <CardDescription>Manage Model UN committees</CardDescription>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Committee
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search committees..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Topic</div>
            <div className="col-span-2">Difficulty</div>
            <div className="col-span-2">Capacity</div>
            <div className="col-span-2">Actions</div>
          </div>
          <div className="divide-y">
            {loading ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">Loading committees...</div>
            ) : filteredCommittees.length > 0 ? (
              filteredCommittees.map((committee) => (
                <div key={committee.committee_id} className="grid grid-cols-12 px-4 py-3 text-sm">
                  <div className="col-span-3 font-medium">{committee.name}</div>
                  <div className="col-span-3 text-gray-500">{committee.topic}</div>
                  <div className="col-span-2">
                    <Badge
                      variant="outline"
                      className={
                        committee.difficulty === "Advanced"
                          ? "bg-red-50 text-red-700"
                          : committee.difficulty === "Intermediate"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-green-50 text-green-700"
                      }
                    >
                      {committee.difficulty}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    {committee.current_delegate_count}/{committee.capacity}
                  </div>
                  <div className="col-span-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(committee)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No committees found matching your search criteria
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <AddCommitteeDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onCommitteeAdded={newCommittee => setCommittees([...committees, newCommittee])}
      />

      {/* Edit Dialog */}
      {editingCommittee && (
        <Dialog open={!!editingCommittee} onOpenChange={() => setEditingCommittee(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Committee</DialogTitle>
              <DialogDescription>
                Update committee details. Committee name cannot be changed.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleUpdate({
                topic: formData.get('topic'),
                difficulty: formData.get('difficulty'),
                capacity: parseInt(formData.get('capacity') as string)
              })
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Topic</Label>
                  <Input
                    name="topic"
                    defaultValue={editingCommittee.topic}
                    placeholder="Committee topic..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Difficulty</Label>
                  <Select name="difficulty" defaultValue={editingCommittee.difficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Capacity</Label>
                  <Input
                    name="capacity"
                    type="number"
                    defaultValue={editingCommittee.capacity}
                    min={5}
                    max={50}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}
