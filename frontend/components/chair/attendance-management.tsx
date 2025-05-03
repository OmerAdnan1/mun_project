"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Clock, Save, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AttendanceManagementProps {
  committeeId: string
}

export function AttendanceManagement({ committeeId }: AttendanceManagementProps) {
  const [delegates] = useState([
    { id: "1", name: "John Smith", country: "France", status: "present" },
    { id: "2", name: "Emma Johnson", country: "Germany", status: "present" },
    { id: "3", name: "Michael Brown", country: "Japan", status: "late" },
    { id: "4", name: "Sophia Garcia", country: "Brazil", status: "present" },
    { id: "5", name: "William Davis", country: "India", status: "absent" },
    { id: "6", name: "Olivia Wilson", country: "South Africa", status: "present" },
    { id: "7", name: "James Miller", country: "Australia", status: "late" },
    { id: "8", name: "Ava Martinez", country: "Canada", status: "present" },
    { id: "9", name: "Alexander Lee", country: "Mexico", status: "absent" },
    { id: "10", name: "Isabella Taylor", country: "Italy", status: "present" },
  ])

  const [attendanceData, setAttendanceData] = useState<Record<string, string>>(
    delegates.reduce(
      (acc, delegate) => {
        acc[delegate.id] = delegate.status
        return acc
      },
      {} as Record<string, string>,
    ),
  )

  const [session, setSession] = useState("morning")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleStatusChange = (delegateId: string, status: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [delegateId]: status,
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      // In a real app, this would call the API
      // await saveAttendance(committeeId, { date, session, attendance: attendanceData })

      toast({
        title: "Attendance saved",
        description: "The attendance record has been saved successfully.",
      })
    } catch (error) {
      console.error("Save attendance error:", error)
      toast({
        variant: "destructive",
        title: "Failed to save attendance",
        description: "There was an error saving the attendance record. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>[Sample Data] Showing example attendance management interface.</AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Record</CardTitle>
          <CardDescription>Mark attendance for committee sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="session" className="text-sm font-medium">
                Session
              </label>
              <Select value={session} onValueChange={setSession}>
                <SelectTrigger id="session">
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning Session (9:00 AM - 12:00 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon Session (2:00 PM - 5:00 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
              <div className="col-span-4">Delegate</div>
              <div className="col-span-3">Country</div>
              <div className="col-span-5">Status</div>
            </div>
            <div className="divide-y">
              {delegates.map((delegate) => (
                <div key={delegate.id} className="grid grid-cols-12 px-4 py-3 text-sm">
                  <div className="col-span-4 font-medium">{delegate.name}</div>
                  <div className="col-span-3">{delegate.country}</div>
                  <div className="col-span-5">
                    <div className="flex gap-2">
                      <Button
                        variant={attendanceData[delegate.id] === "present" ? "default" : "outline"}
                        size="sm"
                        className={attendanceData[delegate.id] === "present" ? "bg-green-600 hover:bg-green-700" : ""}
                        onClick={() => handleStatusChange(delegate.id, "present")}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Present
                      </Button>
                      <Button
                        variant={attendanceData[delegate.id] === "late" ? "default" : "outline"}
                        size="sm"
                        className={attendanceData[delegate.id] === "late" ? "bg-amber-600 hover:bg-amber-700" : ""}
                        onClick={() => handleStatusChange(delegate.id, "late")}
                      >
                        <Clock className="mr-1 h-4 w-4" />
                        Late
                      </Button>
                      <Button
                        variant={attendanceData[delegate.id] === "absent" ? "default" : "outline"}
                        size="sm"
                        className={attendanceData[delegate.id] === "absent" ? "bg-red-600 hover:bg-red-700" : ""}
                        onClick={() => handleStatusChange(delegate.id, "absent")}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Absent
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSubmit} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Attendance"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
