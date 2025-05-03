"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { registerUser } from "@/lib/api"

interface AccountCreationStepProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
}

export function AccountCreationStep({ formData, updateFormData, onNext }: AccountCreationStepProps) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.full_name?.trim()) {
      newErrors.full_name = "Full name is required"
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password?.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match"
    }

    if (!formData.role) {
      newErrors.role = "Role selection is required"
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
      // In a real app, this would call the API
      const response = await registerUser({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone,
        role: formData.role,
      })

      // For demo purposes, we'll simulate a successful response
      updateFormData({
        user_id: response?.data?.user_id || "user_123", // Fallback for demo
      })

      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      })

      onNext()
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="full_name"
            value={formData.full_name || ""}
            onChange={(e) => updateFormData({ full_name: e.target.value })}
            placeholder="Enter your full name"
            className={errors.full_name ? "border-red-500" : ""}
          />
          {errors.full_name && <p className="text-xs text-red-500">{errors.full_name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="Enter your email"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Password <span className="text-red-500">*</span>
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password || ""}
            onChange={(e) => updateFormData({ password: e.target.value })}
            placeholder="Create a password"
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm_password">
            Confirm Password <span className="text-red-500">*</span>
          </Label>
          <Input
            id="confirm_password"
            type="password"
            value={formData.confirm_password || ""}
            onChange={(e) => updateFormData({ confirm_password: e.target.value })}
            placeholder="Confirm your password"
            className={errors.confirm_password ? "border-red-500" : ""}
          />
          {errors.confirm_password && <p className="text-xs text-red-500">{errors.confirm_password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-xs text-gray-500">(Optional)</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="space-y-2">
          <Label>
            Role <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.role || ""}
            onValueChange={(value) => updateFormData({ role: value })}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="delegate" id="delegate" />
              <Label htmlFor="delegate" className="cursor-pointer">
                Delegate
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="chair" id="chair" />
              <Label htmlFor="chair" className="cursor-pointer">
                Chair
              </Label>
            </div>
          </RadioGroup>
          {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Continue"}
        </Button>
      </div>
    </form>
  )
}
