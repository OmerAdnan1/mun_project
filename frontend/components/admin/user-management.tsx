"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus } from "lucide-react"

export function AdminUserManagement() {
  const [users] = useState([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      role: "delegate",
      status: "active",
      created_at: "2023-09-15",
    },
    {
      id: "2",
      name: "Emma Johnson",
      email: "emma.johnson@example.com",
      role: "delegate",
      status: "active",
      created_at: "2023-09-16",
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      role: "delegate",
      status: "active",
      created_at: "2023-09-17",
    },
    {
      id: "4",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      role: "chair",
      status: "active",
      created_at: "2023-09-10",
    },
    {
      id: "5",
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      role: "chair",
      status: "active",
      created_at: "2023-09-11",
    },
    {
      id: "6",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      status: "active",
      created_at: "2023-09-01",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage users and their roles</CardDescription>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
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
            <div className="col-span-4">Email</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Actions</div>
          </div>
          <div className="divide-y">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id} className="grid grid-cols-12 px-4 py-3 text-sm">
                  <div className="col-span-3 font-medium">{user.name}</div>
                  <div className="col-span-4 text-gray-500">{user.email}</div>
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
                  <div className="col-span-2">
                    <Badge
                      variant="outline"
                      className={user.status === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                    >
                      {user.status}
                    </Badge>
                  </div>
                  <div className="col-span-1">
                    <Button variant="ghost" size="sm">
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
      </CardContent>
    </Card>
  )
}
