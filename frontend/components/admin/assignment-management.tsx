"use client"

import { useEffect, useState } from "react"
import { apiService } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, RefreshCw } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { useToast } from "../ui/use-toast"

export function AdminAssignmentManagement() {
  const [assignments, setAssignments] = useState<any[]>([])
  const [committees, setCommittees] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCommittee, setFilterCommittee] = useState("all")
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<any | null>(null)
  const [editForm, setEditForm] = useState({ committeeId: "", countryId: "" })
  const [adding, setAdding] = useState(false)
  const { toast } = useToast()
  const [delegates, setDelegates] = useState<any[]>([])
  const [availableCountries, setAvailableCountries] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentsRes, committeesRes, delegatesRes] = await Promise.all([
          apiService.getAllDelegateAssignments(),
          apiService.getCommittees(),
          apiService.getDelegates()
        ])
        if (assignmentsRes.success) setAssignments(assignmentsRes.data)
        if (committeesRes.success) setCommittees(committeesRes.data)
        if (delegatesRes.success) setDelegates(delegatesRes.data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDelete = async (assignmentId: string) => {
    try {
      const response = await apiService.deleteDelegateAssignment(assignmentId)
      if (response.success) {
        setAssignments(assignments.filter(a => a.assignment_id !== assignmentId))
        toast({ title: "Assignment deleted successfully" })
      }
    } catch (error) {
      console.error('Failed to delete assignment:', error)
      toast({ 
        variant: "destructive",
        title: "Failed to delete assignment",
        description: "Please try again later"
      })
    }
  }

  const handleEditClick = async (assignment: any) => {
    setEditingAssignment(assignment)
    setEditForm({
      committeeId: assignment.committee_id || "",
      countryId: assignment.country_id || ""
    })
    // Fetch available countries for the selected committee
    if (assignment.committee_id) {
      try {
        const res = await apiService.api.get(`/countries/available?committee_id=${assignment.committee_id}`)
        setAvailableCountries(res.data.data || [])
      } catch (err) {
        setAvailableCountries([])
      }
    } else {
      setAvailableCountries([])
    }
    setEditDialogOpen(true)
  }

  const handleUpdateAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAssignment) return
    setAdding(true)
    try {
      const response = await apiService.updateDelegateAssignment(editingAssignment.assignment_id, {
        committeeId: editForm.committeeId,
        countryId: editForm.countryId
      })
      if (response.success && response.data) {
        setAssignments(assignments.map(a => a.assignment_id === editingAssignment.assignment_id ? { ...a, ...response.data } : a))
        setEditDialogOpen(false)
        setEditingAssignment(null)
        toast({ title: "Assignment updated successfully" })
      } else {
        toast({ variant: "destructive", title: "Failed to update assignment", description: response.message || "Please try again later" })
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to update assignment", description: "Please try again later" })
    } finally {
      setAdding(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = (
      (assignment.delegate_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (assignment.committee_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (assignment.country_name || "").toLowerCase().includes(searchQuery.toLowerCase())
    )
    const matchesCommittee = filterCommittee === "all" || assignment.committee_name === filterCommittee
    return matchesSearch && matchesCommittee
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Delegate Assignments</CardTitle>
            <CardDescription>Manage delegate assignments to committees</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search assignments..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterCommittee} onValueChange={setFilterCommittee}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by committee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Committees</SelectItem>
              {committees.map((committee) => (
                <SelectItem key={committee.committee_id} value={committee.name}>
                  {committee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
            <div className="col-span-3">Delegate</div>
            <div className="col-span-3">Committee</div>
            <div className="col-span-2">Country</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Actions</div>
          </div>
          <div className="divide-y">
            {loading ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">Loading assignments...</div>
            ) : filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => (
                <div key={assignment.assignment_id} className="grid grid-cols-12 px-4 py-3 text-sm">
                  <div className="col-span-3 font-medium">{assignment.delegate_name}</div>
                  <div className="col-span-3 text-gray-500">{assignment.committee_name}</div>
                  <div className="col-span-2">{assignment.country_name}</div>
                  <div className="col-span-2 text-gray-500">
                    {assignment.assignment_date ? formatDate(assignment.assignment_date) : "-"}
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditClick(assignment)}
                    >
                      Update
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(assignment.assignment_id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No assignments found matching your search criteria
              </div>
            )}
          </div>
        </div>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Assignment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Committee</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={editForm.committeeId}
                  onChange={e => setEditForm(f => ({ ...f, committeeId: e.target.value }))}
                  required
                >
                  <option value="">Select committee</option>
                  {committees.map((c) => (
                    <option key={c.committee_id || c.id} value={c.committee_id || c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={editForm.countryId}
                  onChange={e => setEditForm(f => ({ ...f, countryId: e.target.value }))}
                  required
                >
                  <option value="">Select country</option>
                  {availableCountries.map((country) => (
                    <option key={country.country_id} value={country.country_id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)} disabled={adding}>Cancel</Button>
                <Button type="submit" disabled={adding}>{adding ? "Updating..." : "Update Assignment"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
