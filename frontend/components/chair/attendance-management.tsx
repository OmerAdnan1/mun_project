"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Clock, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { apiService } from "@/lib/api"

interface AttendanceManagementProps {
  committeeId: string
  attendance: any[]
  delegates: any[]
}

export function AttendanceManagement({ committeeId, attendance, delegates }: AttendanceManagementProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [localAttendance, setLocalAttendance] = useState<Record<string, string>>({})

  // Reset local attendance when date changes
  useEffect(() => {
    setLocalAttendance({})
  }, [date])

  // Create attendance map from API data
  const attendanceMap = attendance.reduce((acc, record) => {
    const recordDate = record.date.split('T')[0]
    acc[record.delegate_id + '_' + recordDate] = record.status
    return acc
  }, {} as Record<string, string>)

  // Show all delegates, default to absent if no record for date
  const filteredAttendance = delegates.map((delegate) => {
    const key = delegate.delegate_id + '_' + date
    const status = localAttendance[delegate.delegate_id] ?? attendanceMap[key] ?? "absent"
    return { ...delegate, status }
  })

  // Handle status change: if no record, create one via API
  const handleStatusChange = async (delegateId: string, status: string) => {
    setLoading(true)
    try {
      await apiService.markAttendance({
        user_id: delegateId,
        committee_id: committeeId,
        date,
        status,
      })
      setLocalAttendance((prev) => ({ ...prev, [delegateId]: status }))
      toast({ title: "Attendance updated", description: `Marked as ${status}` })
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to update attendance" })
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
          </div>

          <div className="rounded-md border">
            <div className="grid grid-cols-12 border-b bg-muted/50 px-4 py-2 text-sm font-medium">
              <div className="col-span-4">Delegate</div>
              <div className="col-span-3">Country</div>
              <div className="col-span-5">Status</div>
            </div>
            <div className="divide-y">
              {filteredAttendance.map((delegate) => (
                <div key={delegate.delegate_id} className="grid grid-cols-12 px-4 py-3 text-sm">
                  <div className="col-span-4 font-medium">{delegate.delegate_name}</div>
                  <div className="col-span-3">{delegate.country_name}</div>
                  <div className="col-span-5">
                    <div className="flex gap-2">
                      <Button
                        variant={delegate.status === "present" ? "default" : "outline"}
                        size="sm"
                        className={delegate.status === "present" ? "bg-green-600 hover:bg-green-700" : ""}
                        onClick={() => handleStatusChange(delegate.delegate_id, "present")}
                        disabled={loading}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Present
                      </Button>
                      <Button
                        variant={delegate.status === "late" ? "default" : "outline"}
                        size="sm"
                        className={delegate.status === "late" ? "bg-amber-600 hover:bg-amber-700" : ""}
                        onClick={() => handleStatusChange(delegate.delegate_id, "late")}
                        disabled={loading}
                      >
                        <Clock className="mr-1 h-4 w-4" />
                        Late
                      </Button>
                      <Button
                        variant={delegate.status === "absent" ? "default" : "outline"}
                        size="sm"
                        className={delegate.status === "absent" ? "bg-red-600 hover:bg-red-700" : ""}
                        onClick={() => handleStatusChange(delegate.delegate_id, "absent")}
                        disabled={loading}
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
        </CardContent>
      </Card>
    </div>
  )
}
