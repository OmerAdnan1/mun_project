import { CheckCircle2 } from "lucide-react"

interface Step {
  title: string
  description: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="relative flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                index < currentStep
                  ? "border-green-500 bg-green-500 text-white"
                  : index === currentStep
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-500"
              }`}
            >
              {index < currentStep ? <CheckCircle2 className="h-6 w-6" /> : <span>{index + 1}</span>}
            </div>
            <div className="mt-2 text-center">
              <div className={`text-sm font-medium ${index <= currentStep ? "text-gray-900" : "text-gray-500"}`}>
                {step.title}
              </div>
              <div className={`text-xs ${index <= currentStep ? "text-gray-600" : "text-gray-400"}`}>
                {step.description}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`absolute left-[calc(100%+0.5rem)] top-5 h-0.5 w-[calc(100%-2rem)] -translate-y-1/2 ${
                  index < currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
