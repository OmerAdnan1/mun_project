"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, RefreshCw } from "lucide-react"

export function AdminAssignmentManagement() {
  const [assignments] = useState([
    {
      id: "1",
      delegate_name: "John Smith",
      committee_name: "United Nations Security Council",
      country_name: "France",
      assigned_date: "2023-09-20",
      status: "active",
    },
    {
      id: "2",
      delegate_name: "Emma Johnson",
      committee_name: "World Health Organization",
      country_name: "Germany",
      assigned_date: "2023-09-21",
      status: "active",
    },
    {
      id: "3",
      delegate_name: "Michael Brown",
      committee_name: "UN Environment Programme",
      country_name: "Japan",
      assigned_date: "2023-09-22",
      status: "active",
    },
    {
      id: "4",
      delegate_name: "Sophia Garcia",
      committee_name: "UN Human Rights Council",
      country_name: "Brazil",
      assigned_date: "2023-09-23",
      status: "active",
    },
    {
      id: "5",
      delegate_name: "William Davis",
      committee_name: "International Monetary Fund",
      country_name: "India",
      assigned_date: "2023-09-24",
      status: "pending",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterCommittee, setFilterCommittee] = useState("")

  const filteredAssignments = assignments.filter(
    (assignment) =>
      (assignment.delegate_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.committee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.country_name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterCommittee === "" || assignment.committee_name === filterCommittee),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Assignment Management</CardTitle>
            <CardDescription>Manage delegate-committee-country assignments</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Auto-Assign
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Assignment
            </Button>
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
              <SelectItem value="United Nations Security Council">United Nations Security Council</SelectItem>
              <SelectItem value="World Health Organization">World Health Organization</SelectItem>
              <SelectItem value="UN Environment Programme">UN Environment Programme</SelectItem>
              <SelectItem value="UN Human Rights Council">UN Human Rights Council</SelectItem>
              <SelectItem value="International Monetary Fund">International Monetary Fund</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
            <div className="col-span-3">Delegate</div>
            <div className="col-span-3">Committee</div>
            <div className="col-span-2">Country</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Actions</div>
          </div>
          <div className="divide-y">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => (
                <div key={assignment.id} className="grid grid-cols-12 px-4 py-3 text-sm">
                  <div className="col-span-3 font-medium">{assignment.delegate_name}</div>
                  <div className="col-span-3 text-gray-500">{assignment.committee_name}</div>
                  <div className="col-span-2">{assignment.country_name}</div>
                  <div className="col-span-2 text-gray-500">{assignment.assigned_date}</div>
                  <div className="col-span-1">
                    <Badge
                      variant="outline"
                      className={
                        assignment.status === "active" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      }
                    >
                      {assignment.status}
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
                No assignments found matching your search criteria
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
