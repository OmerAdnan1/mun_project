"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"

export function AdminCommitteeManagement() {
  const [committees] = useState([
    {
      id: "1",
      name: "United Nations Security Council",
      topic: "Addressing Conflicts in the Middle East",
      difficulty: "Advanced",
      capacity: 15,
      current_delegate_count: 10,
      chair_name: "Alex Johnson",
    },
    {
      id: "2",
      name: "World Health Organization",
      topic: "Global Pandemic Response",
      difficulty: "Intermediate",
      capacity: 20,
      current_delegate_count: 15,
      chair_name: "Sarah Chen",
    },
    {
      id: "3",
      name: "UN Environment Programme",
      topic: "Climate Change Mitigation",
      difficulty: "Beginner",
      capacity: 25,
      current_delegate_count: 18,
      chair_name: "Michael Rodriguez",
    },
    {
      id: "4",
      name: "UN Human Rights Council",
      topic: "Protecting Rights of Refugees",
      difficulty: "Intermediate",
      capacity: 20,
      current_delegate_count: 12,
      chair_name: "Emily Wilson",
    },
    {
      id: "5",
      name: "International Monetary Fund",
      topic: "Economic Recovery Post-Pandemic",
      difficulty: "Advanced",
      capacity: 15,
      current_delegate_count: 8,
      chair_name: "David Kim",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")

  const filteredCommittees = committees.filter(
    (committee) =>
      committee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      committee.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      committee.chair_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Committee Management</CardTitle>
            <CardDescription>Manage committees and their details</CardDescription>
          </div>
          <Button>
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
            {filteredCommittees.length > 0 ? (
              filteredCommittees.map((committee) => (
                <div key={committee.id} className="grid grid-cols-12 px-4 py-3 text-sm">
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
                    <Button variant="ghost" size="sm">
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
    </Card>
  )
}
