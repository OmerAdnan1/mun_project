"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Users, BookOpen, Award, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createCommittee, getAllUsers } from "@/lib/api"
import { cn } from "@/lib/utils"

export function AddCommitteeDialog({
  open,
  onClose,
  onCommitteeAdded,
}: { open: boolean; onClose: () => void; onCommitteeAdded: (committee: any) => void }) {
  // ...existing code from your AddCommitteeDialog component...
  const [form, setForm] = useState({
    name: "",
    description: "",
    topic: "",
    difficulty: "Beginner",
    capacity: 20,
    location: "",
    start_date: "",
    end_date: "",
    chair_id: "",
  })
  const [chairs, setChairs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    if (open) {
      getAllUsers().then((res) => {
        if (res.success) setChairs(res.data.filter((u: any) => u.role === "chair"))
      })
    }
  }, [open])

  const handleChange = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const response = await createCommittee(form)
    if (response.success && response.data) {
      onCommitteeAdded(response.data)
      onClose()
      setForm({
        name: "",
        description: "",
        topic: "",
        difficulty: "Beginner",
        capacity: 20,
        location: "",
        start_date: "",
        end_date: "",
        chair_id: "",
      })
      setCurrentStep(1)
    } else {
      setError(response.message || "Failed to add committee.")
    }
    setLoading(false)
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const difficultyColors = {
    Beginner: "bg-green-100 text-green-800 border-green-200",
    Intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Advanced: "bg-red-100 text-red-800 border-red-200",
  }

  const isStepComplete = (step: number) => {
    if (step === 1) {
      return !!form.name && !!form.description && !!form.topic
    } else if (step === 2) {
      return !!form.difficulty && !!form.capacity && !!form.location
    }
    return true
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white rounded-xl">
        <div className="flex flex-col md:flex-row">
          {/* Left sidebar with progress */}
          <div className="w-full md:w-64 bg-gradient-to-b from-blue-600 to-blue-800 p-6 text-white">
            <h3 className="text-xl font-bold mb-6">New Committee</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    currentStep >= 1 ? "bg-white text-blue-700" : "bg-blue-500/50 text-white/70",
                  )}
                >
                  1
                </div>
                <span className={currentStep >= 1 ? "font-medium" : "text-white/70"}>Basic Info</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    currentStep >= 2 ? "bg-white text-blue-700" : "bg-blue-500/50 text-white/70",
                  )}
                >
                  2
                </div>
                <span className={currentStep >= 2 ? "font-medium" : "text-white/70"}>Details</span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    currentStep >= 3 ? "bg-white text-blue-700" : "bg-blue-500/50 text-white/70",
                  )}
                >
                  3
                </div>
                <span className={currentStep >= 3 ? "font-medium" : "text-white/70"}>Schedule</span>
              </div>
            </div>
            <div className="mt-auto pt-8">
              <div className="text-xs text-white/70 mb-2">Committee Creation</div>
              <div className="w-full bg-blue-500/30 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300 ease-out"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>
          {/* Main content */}
          <div className="flex-1 p-6">
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-bold text-gray-800">
                  {currentStep === 1 && "Committee Information"}
                  {currentStep === 2 && "Committee Details"}
                  {currentStep === 3 && "Schedule & Assignment"}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {currentStep === 1 && "Enter the basic information about your new committee."}
                  {currentStep === 2 && "Specify the details and requirements for this committee."}
                  {currentStep === 3 && "Set the timeline and assign a chair to the committee."}
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto">
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Committee Name</Label>
                      <Input
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                        placeholder="Enter committee name..."
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Topic</Label>
                      <Input
                        value={form.topic}
                        onChange={(e) => handleChange("topic", e.target.value)}
                        required
                        placeholder="Main topic of discussion..."
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Description</Label>
                      <Textarea
                        value={form.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        required
                        placeholder="Provide a detailed description of the committee..."
                        className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </motion.div>
                )}
                {/* Step 2: Details */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Difficulty Level</Label>
                      <Select value={form.difficulty} onValueChange={(v) => handleChange("difficulty", v)}>
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">
                            <div className="flex items-center gap-2">
                              <span className={cn("px-2 py-1 rounded-full text-xs font-medium", difficultyColors.Beginner)}>
                                Beginner
                              </span>
                              <span className="text-gray-600">- For new participants</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="Intermediate">
                            <div className="flex items-center gap-2">
                              <span className={cn("px-2 py-1 rounded-full text-xs font-medium", difficultyColors.Intermediate)}>
                                Intermediate
                              </span>
                              <span className="text-gray-600">- Some experience required</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="Advanced">
                            <div className="flex items-center gap-2">
                              <span className={cn("px-2 py-1 rounded-full text-xs font-medium", difficultyColors.Advanced)}>
                                Advanced
                              </span>
                              <span className="text-gray-600">- For experienced participants</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Capacity</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                        <Input
                          type="number"
                          min={5}
                          max={100}
                          value={form.capacity}
                          onChange={(e) => handleChange("capacity", Number.parseInt(e.target.value))}
                          required
                          placeholder="Maximum number of participants..."
                          className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                        <Input
                          value={form.location}
                          onChange={(e) => handleChange("location", e.target.value)}
                          required
                          placeholder="Room or hall location..."
                          className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                {/* Step 3: Schedule & Chair */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Start Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                          <Input
                            type="date"
                            value={form.start_date}
                            onChange={(e) => handleChange("start_date", e.target.value)}
                            required
                            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">End Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                          <Input
                            type="date"
                            value={form.end_date}
                            onChange={(e) => handleChange("end_date", e.target.value)}
                            required
                            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Committee Chair</Label>
                      <Select value={form.chair_id} onValueChange={(v) => handleChange("chair_id", v)}>
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select chair" />
                        </SelectTrigger>
                        <SelectContent>
                          {chairs.length === 0 ? (
                            <SelectItem value="" disabled>
                              No chairs available
                            </SelectItem>
                          ) : (
                            chairs.map((chair: any) => (
                              <SelectItem key={chair.user_id} value={chair.user_id}>
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                                    <User size={14} />
                                  </div>
                                  <span>{chair.full_name}</span>
                                  <span className="text-xs text-gray-500">({chair.email})</span>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Summary card */}
                    {form.name && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-800 mb-2">Committee Summary</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <BookOpen size={16} />
                            <span>{form.topic || "Topic not set"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Award size={16} />
                            <span className={cn("px-2 py-0.5 rounded-full text-xs", difficultyColors[form.difficulty as keyof typeof difficultyColors])}>
                              {form.difficulty}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users size={16} />
                            <span>Capacity: {form.capacity}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={16} />
                            <span>{form.location || "Location not set"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 col-span-2">
                            <Clock size={16} />
                            <span>
                              {form.start_date && form.end_date
                                ? `${new Date(form.start_date).toLocaleDateString()} - ${new Date(form.end_date).toLocaleDateString()}`
                                : "Dates not set"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                    {error}
                  </div>
                )}
              </div>
              <DialogFooter className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200">
                {currentStep > 1 ? (
                  <Button type="button" variant="outline" onClick={prevStep} className="border-gray-300 text-gray-700">
                    Back
                  </Button>
                ) : (
                  <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 text-gray-700">
                    Cancel
                  </Button>
                )}
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepComplete(currentStep)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading || !form.chair_id || !form.start_date || !form.end_date}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      "Create Committee"
                    )}
                  </Button>
                )}
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
