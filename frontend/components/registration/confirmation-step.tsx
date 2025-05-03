"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

interface ConfirmationStepProps {
  formData: any
  onBack: () => void
}

export function ConfirmationStep({ formData, onBack }: ConfirmationStepProps) {
  const { login } = useAuth()

  // Auto-login the user
  useEffect(() => {
    if (formData.email && formData.password) {
      login(formData.email, formData.password).catch((err) => {
        console.error("Auto-login failed:", err)
      })
    }
  }, [formData.email, formData.password, login])

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="mt-4 text-xl font-bold">Registration Complete!</h2>
        <p className="mt-1 text-gray-600">Your {formData.role} account has been successfully created.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your registration details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <User className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="font-medium">{formData.full_name}</p>
              <p className="text-sm text-gray-500">{formData.email}</p>
              <Badge className="mt-1">{formData.role === "delegate" ? "Delegate" : "Chair"}</Badge>
            </div>
          </div>

          {formData.role === "delegate" && formData.committee_name && (
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium">Committee Assignment</h3>
              <p className="mt-1 text-sm">
                You have been assigned to <strong>{formData.committee_name}</strong> representing{" "}
                <strong>{formData.country_name}</strong>.
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Your assignment details and materials will be available in your dashboard.
              </p>
            </div>
          )}

          {formData.role === "chair" && (
            <div className="rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium">Chair Registration</h3>
              <p className="mt-1 text-sm">
                Your chair application has been received. The Secretariat will review your information and assign you to
                a committee.
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Committee assignments will be visible in your dashboard once processed.
              </p>
            </div>
          )}

          <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
            <h3 className="font-medium">Next Steps</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
              <li>Check your email for a confirmation message</li>
              <li>Log in to your dashboard to view your details</li>
              <li>Complete any pending tasks or forms</li>
              <li>Review conference schedule and prepare accordingly</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Link href="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
