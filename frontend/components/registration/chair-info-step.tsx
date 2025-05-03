"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { updateChairInfo } from "@/lib/api"

interface ChairInfoStepProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function ChairInfoStep({ formData, updateFormData, onNext, onBack }: ChairInfoStepProps) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.evaluation_metrics?.trim()) {
      newErrors.evaluation_metrics = "Evaluation metrics are required"
    }

    if (!formData.chairing_experience?.trim()) {
      newErrors.chairing_experience = "Chairing experience is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Update chair info
      await updateChairInfo(formData.user_id, {
        evaluation_metrics: formData.evaluation_metrics,
        chairing_experience: formData.chairing_experience,
      })

      toast({
        title: "Profile completed",
        description: "Your chair profile has been set up successfully.",
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="chairing_experience">
            Chairing Experience <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="chairing_experience"
            value={formData.chairing_experience || ""}
            onChange={(e) => updateFormData({ chairing_experience: e.target.value })}
            placeholder="Describe your previous experience chairing MUN committees"
            className={errors.chairing_experience ? "border-red-500" : ""}
            rows={4}
          />
          {errors.chairing_experience && <p className="text-xs text-red-500">{errors.chairing_experience}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="evaluation_metrics">
            Evaluation Approach <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="evaluation_metrics"
            value={formData.evaluation_metrics || ""}
            onChange={(e) => updateFormData({ evaluation_metrics: e.target.value })}
            placeholder="Describe your approach to evaluating delegates and awarding points"
            className={errors.evaluation_metrics ? "border-red-500" : ""}
            rows={4}
          />
          {errors.evaluation_metrics && <p className="text-xs text-red-500">{errors.evaluation_metrics}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="committee_preference">
            Committee Preference <span className="text-xs text-gray-500">(Optional)</span>
          </Label>
          <Select
            value={formData.committee_preference || ""}
            onValueChange={(value) => updateFormData({ committee_preference: value })}
          >
            <SelectTrigger id="committee_preference">
              <SelectValue placeholder="Select preferred committee type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="security">Security Council</SelectItem>
              <SelectItem value="economic">Economic Committees</SelectItem>
              <SelectItem value="social">Social & Humanitarian</SelectItem>
              <SelectItem value="environmental">Environmental</SelectItem>
              <SelectItem value="crisis">Crisis Committees</SelectItem>
              <SelectItem value="any">No Preference</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Note: This is a preference only. Final committee assignments will be determined by the Secretariat.
          </p>
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
