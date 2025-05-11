"use client"

import { useEffect, useState } from "react"
import { registerUser, getAllUsers } from "@/lib/api"
import { apiService } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"

export function AdminUserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({ user_id: "", full_name: "", email: "", phone: "" })
  const [editing, setEditing] = useState(false)
  const [editError, setEditError] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers()
        if (response.success) {
          setUsers(
            response.data.map((u: any) => ({
              user_id: u.user_id || u.id,
              full_name: u.full_name || u.name,
              email: u.email,
              phone: u.phone || "",
              role: u.role,
              is_active: u.is_active !== undefined ? u.is_active : true,
            }))
          )
        }
      } catch (error) {
        setUsers([])
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditing(true)
    setEditError("")
    try {
      const response = await apiService.updateUser(editForm.user_id, {
        full_name: editForm.full_name,
        email: editForm.email,
        phone: editForm.phone,
      })
      if (response.success && response.data) {
        setUsers(users.map(u => u.user_id === editForm.user_id ? { ...u, ...editForm } : u))
        setEditDialogOpen(false)
      } else {
        setEditError(response.message || "Failed to update user.")
      }
    } catch (error) {
      setEditError("Failed to update user. Please try again.")
    } finally {
      setEditing(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      (user.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.role || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage users and their roles</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Phone</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Actions</div>
          </div>
          <div className="divide-y">
            {loading ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">Loading users...</div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.user_id} className="grid grid-cols-12 px-4 py-3 text-sm">
                  <div className="col-span-3 font-medium">{user.full_name}</div>
                  <div className="col-span-3 text-gray-500">{user.email}</div>
                  <div className="col-span-2 text-gray-500">{user.phone}</div>
                  <div className="col-span-2">
                    <Badge
                      variant="outline"
                      className={
                        user.role === "admin"
                          ? "bg-purple-50 text-purple-700"
                          : user.role === "chair"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-green-50 text-green-700"
                      }
                    >
                      {user.role}
                    </Badge>
                  </div>
                  <div className="col-span-1">
                    <Badge
                      variant="outline"
                      className={user.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="col-span-1">
                    <Button variant="ghost" size="sm" onClick={() => {
                      setEditForm({ user_id: user.user_id, full_name: user.full_name, email: user.email, phone: user.phone || "" })
                      setEditDialogOpen(true)
                    }}>
                      Edit
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No users found matching your search criteria
              </div>
            )}
          </div>
        </div>
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user details below.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <Input value={editForm.full_name} onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))} required className="mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <Input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} required className="mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <Input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} className="mt-1" />
              </div>
              {editError && <div className="text-sm text-red-500">{editError}</div>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={editing}>{editing ? "Saving..." : "Save Changes"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
