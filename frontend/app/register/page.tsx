"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Stepper } from "@/components/stepper"
import { AccountCreationStep } from "@/components/registration/account-creation-step"
import { DelegateInfoStep } from "@/components/registration/delegate-info-step"
import { ChairInfoStep } from "@/components/registration/chair-info-step"
import { ConfirmationStep } from "@/components/registration/confirmation-step"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Account creation
    email: "",
    password: "",
    full_name: "",
    phone: "",
    role: "delegate", // delegate or chair

    // Delegate specific
    experience_level: "",
    emergency_contact: "",
    past_experiences: [] as { conference_name: string; year: string; committee: string; country: string }[],
    selected_committee_id: "",

    // Chair specific
    evaluation_metrics: "",
    chairing_experience: "",

    // System data
    user_id: "",
    assignment_id: "",
    committee_name: "",
    country_name: "",
  })
  const { toast } = useToast()

  const steps = [
    { title: "Account", description: "Create your account" },
    { title: "Profile", description: formData.role === "delegate" ? "Delegate information" : "Chair information" },
    { title: "Confirmation", description: "Review and confirm" },
  ]

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <AccountCreationStep formData={formData} updateFormData={updateFormData} onNext={handleNext} />
      case 1:
        return formData.role === "delegate" ? (
          <DelegateInfoStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        ) : (
          <ChairInfoStep formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />
        )
      case 2:
        return <ConfirmationStep formData={formData} onBack={handleBack} />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Register for MUN Conference</CardTitle>
            <CardDescription>Complete the registration process to participate in the conference</CardDescription>
          </CardHeader>
          <CardContent>
            <Stepper steps={steps} currentStep={currentStep} />
            <div className="mt-8">{renderStepContent()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
