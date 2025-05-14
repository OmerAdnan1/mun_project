"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { apiService, addDelegateExperience, allocateDelegate } from "@/lib/api"

interface Committee {
  committee_id: string;
  name: string;
  topic: string;
  difficulty: string;
  capacity: number;
  current_delegate_count: number;
  chair_name: string;
}

interface DelegateInfoStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function DelegateInfoStep({ formData, updateFormData, onNext, onBack }: DelegateInfoStepProps) {
  const [committees, setCommittees] = useState<Committee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingCommittees, setLoadingCommittees] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newExperience, setNewExperience] = useState({
    conference_name: "",
    year: "",
    committee: "",
    country: "",
    awards: "none"
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        setLoading(true)
        const response = await apiService.getCommittees()
        let committeesArr: Committee[] = []
        if (Array.isArray(response)) {
          committeesArr = response as Committee[]
        } else if (response && Array.isArray(response.data)) {
          committeesArr = response.data as unknown as Committee[]
        }
        setCommittees(committeesArr)
      } catch (err) {
        setError("Failed to load committees")
        setCommittees([])
      } finally {
        setLoading(false)
      }
    }
    fetchCommittees()
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.experience_level?.trim()) {
      newErrors.experience_level = "Experience level is required"
    }

    if (!formData.emergency_contact?.trim()) {
      newErrors.emergency_contact = "Emergency contact is required"
    }

    if (!formData.selected_committee_id) {
      newErrors.selected_committee_id = "Committee selection is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddExperience = () => {
    if (!newExperience.conference_name || !newExperience.year) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Conference name and year are required.",
      })
      return
    }
    // Convert 'none' to empty string/null for awards
    const awardsValue = newExperience.awards === "none" ? "" : newExperience.awards
    const updatedExperiences = [...(formData.past_experiences || []), { ...newExperience, awards: awardsValue }]
    updateFormData({ past_experiences: updatedExperiences })
    setNewExperience({
      conference_name: "",
      year: "",
      committee: "",
      country: "",
      awards: "none"
    })
  }

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = [...formData.past_experiences]
    updatedExperiences.splice(index, 1)
    updateFormData({ past_experiences: updatedExperiences })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Update delegate info
      await apiService.updateDelegateInfo(formData.user_id, {
        experience_level: formData.experience_level,
        emergency_contact: formData.emergency_contact,
      })

      // Add past experiences
      if (formData.past_experiences?.length > 0) {
        for (const experience of formData.past_experiences) {
          await addDelegateExperience(formData.user_id, experience)
        }
      }

      // Allocate committee
      const allocation = await allocateDelegate({
        delegateId: formData.user_id,
        committeeId: formData.selected_committee_id,
      })

      // For demo purposes, we'll simulate a successful response
      const selectedCommittee = committees.find((c) => c.committee_id === formData.selected_committee_id)

      updateFormData({
        assignment_id: allocation?.data?.assignment_id || "assignment_123",
        committee_name: selectedCommittee?.name || "United Nations Security Council",
        country_name: allocation?.data?.country_name || "France",
      })

      toast({
        title: "Profile completed",
        description: "Your delegate profile has been set up successfully.",
      })

      onNext()
    } catch (error) {
      console.error("Profile setup error:", error)
      toast({
        variant: "destructive",
        title: "Setup failed",
        description: "There was an error setting up your profile. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="experience_level">
            MUN Experience Level <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.experience_level || ""}
            onValueChange={(value) => updateFormData({ experience_level: value })}
          >
            <SelectTrigger id="experience_level" className={errors.experience_level ? "border-red-500" : ""}>
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner (0-1 conferences)</SelectItem>
              <SelectItem value="intermediate">Intermediate (2-5 conferences)</SelectItem>
              <SelectItem value="advanced">Advanced (6+ conferences)</SelectItem>
            </SelectContent>
          </Select>
          {errors.experience_level && <p className="text-xs text-red-500">{errors.experience_level}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergency_contact">
            Emergency Contact <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="emergency_contact"
            value={formData.emergency_contact || ""}
            onChange={(e) => updateFormData({ emergency_contact: e.target.value })}
            placeholder="Name, relationship, and phone number"
            className={errors.emergency_contact ? "border-red-500" : ""}
          />
          {errors.emergency_contact && <p className="text-xs text-red-500">{errors.emergency_contact}</p>}
        </div>

        <div className="space-y-2">
          <Label>Past MUN Experience</Label>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Add Past Experience</CardTitle>
              <CardDescription>Add your previous Model UN experiences (optional)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="conference_name">Conference Name</Label>
                    <Input
                      id="conference_name"
                      value={newExperience.conference_name}
                      onChange={(e) => setNewExperience({ ...newExperience, conference_name: e.target.value })}
                      placeholder="e.g., Harvard MUN"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      value={newExperience.year}
                      onChange={(e) => setNewExperience({ ...newExperience, year: e.target.value })}
                      placeholder="e.g., 2023"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="committee">Committee</Label>
                    <Input
                      id="committee"
                      value={newExperience.committee}
                      onChange={(e) => setNewExperience({ ...newExperience, committee: e.target.value })}
                      placeholder="e.g., UNSC"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country/Role</Label>
                    <Input
                      id="country"
                      value={newExperience.country}
                      onChange={(e) => setNewExperience({ ...newExperience, country: e.target.value })}
                      placeholder="e.g., France"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="awards">Award</Label>
                  <Select
                    value={newExperience.awards}
                    onValueChange={(value) => setNewExperience({ ...newExperience, awards: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select award (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="BD">Best Delegate (BD)</SelectItem>
                      <SelectItem value="OD">Outstanding Delegate (OD)</SelectItem>
                      <SelectItem value="HM">Honorable Mention (HM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" variant="outline" className="mt-2" onClick={handleAddExperience}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Experience
                </Button>
              </div>

              {formData.past_experiences?.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-sm font-medium">Added Experiences:</h4>
                  <div className="space-y-2">
                    {formData.past_experiences.map((exp: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border border-gray-200 p-3"
                      >
                        <div>
                          <p className="font-medium">
                            {exp.conference_name} ({exp.year})
                          </p>
                          <p className="text-sm text-gray-500">
                            {exp.committee}
                            {exp.country ? `, ${exp.country}` : ""}
                            {exp.awards && exp.awards !== "none" ? `, Award: ${exp.awards}` : ""}
                          </p>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveExperience(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <Label>Further Information</Label>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Special Needs or Accommodations</CardTitle>
              <CardDescription>Add any special needs or accommodations you require</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="special_needs">Special Needs or Accommodations</Label>
                  <Textarea
                    id="special_needs"
                    value={formData.special_needs || ""}
                    onChange={(e) => updateFormData({ special_needs: e.target.value })}
                    placeholder="Please let us know if you require any special accommodations"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
                  <Textarea
                    id="dietary_restrictions"
                    value={formData.dietary_restrictions || ""}
                    onChange={(e) => updateFormData({ dietary_restrictions: e.target.value })}
                    placeholder="Please let us know if you have any dietary restrictions"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additional_notes">Additional Notes</Label>
                  <Textarea
                    id="additional_notes"
                    value={formData.additional_notes || ""}
                    onChange={(e) => updateFormData({ additional_notes: e.target.value })}
                    placeholder="Any other information you'd like to share"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <Label htmlFor="selected_committee_id">
            Committee Selection <span className="text-red-500">*</span>
          </Label>

          {loading ? (
            <p className="text-sm text-gray-500">Loading committees...</p>
          ) : (
              <Select
                value={formData.selected_committee_id || ""}
              onValueChange={(value) => {
                const selectedCommittee = committees.find((c) => c.committee_id === value);
                updateFormData({ 
                  selected_committee_id: value,
                  selected_committee_name: selectedCommittee?.name || ""
                });
              }}
              >
                <SelectTrigger
                  id="selected_committee_id"
                  className={errors.selected_committee_id ? "border-red-500" : ""}
                >
                <SelectValue placeholder="Select a committee">
                  {formData.selected_committee_name || "Select a committee"}
                </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {committees.map((committee) => {
                  const seatsAvailable = committee.capacity - committee.current_delegate_count;
                  const isAvailable = seatsAvailable > 0;
                    return (
                      <SelectItem key={committee.committee_id} value={committee.committee_id} disabled={!isAvailable}>
                        <div className="flex items-center justify-between">
                          <span>{committee.name}</span>
                          <Badge
                            variant="outline"
                            className={isAvailable ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                          >
                            {isAvailable ? `${seatsAvailable} seats` : "Full"}
                          </Badge>
                        </div>
                      </SelectItem>
                  );
                  })}
                </SelectContent>
              </Select>
          )}
              {errors.selected_committee_id && <p className="text-xs text-red-500">{errors.selected_committee_id}</p>}
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </form>
  )
}
