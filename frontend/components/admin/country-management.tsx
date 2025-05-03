"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"

export function AdminCountryManagement() {
  const [countries] = useState([
    {
      id: "1",
      name: "United States",
      region: "North America",
      available: true,
      assigned: true,
    },
    {
      id: "2",
      name: "Russia",
      region: "Europe/Asia",
      available: true,
      assigned: true,
    },
    {
      id: "3",
      name: "China",
      region: "Asia",
      available: true,
      assigned: true,
    },
    {
      id: "4",
      name: "United Kingdom",
      region: "Europe",
      available: true,
      assigned: true,
    },
    {
      id: "5",
      name: "France",
      region: "Europe",
      available: true,
      assigned: true,
    },
    {
      id: "6",
      name: "Germany",
      region: "Europe",
      available: true,
      assigned: true,
    },
    {
      id: "7",
      name: "Japan",
      region: "Asia",
      available: true,
      assigned: true,
    },
    {
      id: "8",
      name: "India",
      region: "Asia",
      available: true,
      assigned: true,
    },
    {
      id: "9",
      name: "Brazil",
      region: "South America",
      available: true,
      assigned: true,
    },
    {
      id: "10",
      name: "South Africa",
      region: "Africa",
      available: true,
      assigned: false,
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.region.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Country Management</CardTitle>
            <CardDescription>Manage countries for committee assignments</CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Country
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search countries..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
            <div className="col-span-4">Name</div>
            <div className="col-span-3">Region</div>
            <div className="col-span-2">Available</div>
            <div className="col-span-2">Assigned</div>
            <div className="col-span-1">Actions</div>
          </div>
          <div className="divide-y">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div key={country.id} className="grid grid-cols-12 px-4 py-3 text-sm">
                  <div className="col-span-4 font-medium">{country.name}</div>
                  <div className="col-span-3 text-gray-500">{country.region}</div>
                  <div className="col-span-2">
                    <Badge
                      variant="outline"
                      className={country.available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                    >
                      {country.available ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <Badge
                      variant="outline"
                      className={country.assigned ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-700"}
                    >
                      {country.assigned ? "Yes" : "No"}
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
                No countries found matching your search criteria
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
