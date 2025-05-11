"use client"

import { useEffect, useState } from "react"
import { apiService } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export function AdminCountryManagement() {
  const [countries, setCountries] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [editingCountry, setEditingCountry] = useState<any>(null)
  const [editForm, setEditForm] = useState({ name: "", importance: 1 })
  const [saving, setSaving] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addForm, setAddForm] = useState({ name: "", importance: 1 })
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await apiService.getCountries()
        if (response.success) {
          setCountries(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch countries:', error)
        setCountries([])
      } finally {
        setLoading(false)
      }
    }
    fetchCountries()
  }, [])

  const handleEdit = (country: any) => {
    setEditingCountry(country)
    setEditForm({ name: country.name, importance: country.importance })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCountry) return
    setSaving(true)
    try {
      const response = await apiService.updateCountry(editingCountry.country_id, {
        name: editForm.name,
        importance: editForm.importance
      })
      if (response.success) {
        setCountries(countries.map(c => c.country_id === editingCountry.country_id ? { ...c, ...editForm } : c))
        setEditingCountry(null)
      }
    } catch (error) {
      // Optionally show error toast
      console.error('Failed to update country:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddCountry = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    try {
      const response = await apiService.addCountry({
        name: addForm.name,
        importance: addForm.importance
      })
      if (response.success && response.data) {
        setCountries([...countries, response.data])
        setAddDialogOpen(false)
        setAddForm({ name: "", importance: 1 })
      }
    } catch (error) {
      // Optionally show error toast
      console.error('Failed to add country:', error)
    } finally {
      setAdding(false)
    }
  }

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(country.importance).includes(searchQuery)
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Country Management</CardTitle>
            <CardDescription>Manage countries for committee assignments</CardDescription>
          </div>
          <Button onClick={() => setAddDialogOpen(true)}>
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
            <div className="col-span-3">Importance</div>
            <div className="col-span-3">Assignments</div>
            <div className="col-span-2">Actions</div>
          </div>
          <div className="divide-y">
            {loading ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">Loading countries...</div>
            ) : filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div key={country.country_id} className="grid grid-cols-12 px-4 py-3 text-sm">
                  <div className="col-span-4 font-medium">{country.name}</div>
                  <div className="col-span-3">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {country.importance}
                    </Badge>
                  </div>
                  <div className="col-span-3">
                    <Badge variant="outline" className={country.delegate_count > 0 ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"}>
                      {country.delegate_count || 0} delegates
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <Button variant="ghost" size="sm" className="mr-2" onClick={() => handleEdit(country)}>
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
        {/* Edit Dialog */}
        {editingCountry && (
          <Dialog open={!!editingCountry} onOpenChange={() => setEditingCountry(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Country</DialogTitle>
                <DialogDescription>Update country details. Name cannot be changed.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <Input value={editForm.name} disabled className="mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Importance</label>
                  <Input type="number" min={1} value={editForm.importance} onChange={e => setEditForm(f => ({ ...f, importance: Number(e.target.value) }))} className="mt-1" />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setEditingCountry(null)}>Cancel</Button>
                  <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
        {/* Add Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Country</DialogTitle>
              <DialogDescription>Enter details for the new country.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCountry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <Input value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} required className="mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium">Importance</label>
                <Input type="number" min={1} value={addForm.importance} onChange={e => setAddForm(f => ({ ...f, importance: Number(e.target.value) }))} required className="mt-1" />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={adding}>{adding ? "Adding..." : "Add Country"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
