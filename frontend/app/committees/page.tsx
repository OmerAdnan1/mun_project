"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { CommitteesList } from "@/components/committees-list"

export default function CommitteesPage() {
  const [search, setSearch] = useState("")
  const [difficulty, setDifficulty] = useState("all")
  // You can add chair_id and availability filters as needed

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Committees</h1>
        <p className="mt-4 text-lg text-gray-600">Explore all committees available for the upcoming conference.</p>
      </div>

      {/* Filters */}
      <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-lg font-medium text-gray-900">Filter Committees</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <label htmlFor="search" className="mb-1 block text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="search"
                placeholder="Search committees..."
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="difficulty" className="mb-1 block text-sm font-medium text-gray-700">
              Difficulty Level
            </label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="availability" className="mb-1 block text-sm font-medium text-gray-700">
              Availability
            </label>
            <Select>
              <SelectTrigger id="availability">
                <SelectValue placeholder="All Committees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Committees</SelectItem>
                <SelectItem value="available">Seats Available</SelectItem>
                <SelectItem value="full">Full Committees</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Committees List */}
      <div className="mt-8">
        <CommitteesList filters={{ difficulty, search_term: search }} />
      </div>
    </div>
  )
}
