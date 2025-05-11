"use client"

import { useState, useEffect } from "react"
import { format, addDays } from "date-fns"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Coffee,
  Award,
  Utensils,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

async function fetchCommitteesFromBackend() {
  const res = await fetch("/api/committees")
  if (!res.ok) throw new Error("Failed to fetch committees")
  const data = await res.json()
  return data.data
}

export default function SchedulePage() {
  const [currentDay, setCurrentDay] = useState<number>(1)
  const [activeDay, setActiveDay] = useState<number>(1)
  const [schedule, setSchedule] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [committees, setCommittees] = useState<any[]>([])
  const [committeeStartDate, setCommitteeStartDate] = useState<Date | null>(null)

  useEffect(() => {
    const getScheduleData = async () => {
      try {
        setLoading(true)
        // Fetch committees from backend
        const backendCommittees = await fetchCommitteesFromBackend()
        setCommittees(backendCommittees)
        // Get start date from first committee (all have same start date)
        if (backendCommittees && backendCommittees.length > 0 && backendCommittees[0].start_date) {
          setCommitteeStartDate(new Date(backendCommittees[0].start_date))
        } else {
          setCommitteeStartDate(new Date(2023, 5, 15))
        }
        // Hardcoded schedule structure, but use real committees for committee sessions
        setSchedule(generateScheduleForDay(1, backendCommittees))
        setCurrentDay(1)
        setActiveDay(1)
      } catch (err) {
        setError("Failed to load schedule. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    getScheduleData()
  }, [])

  const handleDayChange = async (day: number) => {
    setLoading(true)
    setActiveDay(day)
    setSchedule(generateScheduleForDay(day, committees))
    setLoading(false)
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "committee-session":
        return <Users className="h-5 w-5 text-blue-600" />
      case "break":
        return <Coffee className="h-5 w-5 text-amber-600" />
      case "meal":
        return <Utensils className="h-5 w-5 text-green-600" />
      case "ceremony":
        return <Award className="h-5 w-5 text-purple-600" />
      case "plenary":
        return <MessageCircle className="h-5 w-5 text-indigo-600" />
      default:
        return <Calendar className="h-5 w-5 text-gray-600" />
    }
  }

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case "committee-session":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "break":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "meal":
        return "bg-green-100 text-green-800 border-green-200"
      case "ceremony":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "plenary":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getConferenceDate = (day: number) => {
    if (committeeStartDate) {
      const date = addDays(committeeStartDate, day - 1)
      return format(date, "EEEE, MMMM d, yyyy")
    }
    const startDate = new Date(2023, 5, 15)
    const date = addDays(startDate, day - 1)
    return format(date, "EEEE, MMMM d, yyyy")
  }

  // Helper: generate schedule using real committees
  function generateScheduleForDay(day: number, committees: any[]) {
    // ...same structure as before, but use committees for committee-session events...
    if (day === 1) {
      return [
        { title: "Registration & Check-in", type: "ceremony", startTime: "08:00", endTime: "09:00", duration: "1 hour", location: "Main Lobby", description: "Delegate registration, badge collection, and welcome packets" },
        { title: "Opening Ceremony", type: "ceremony", startTime: "09:15", endTime: "10:30", duration: "1 hour 15 minutes", location: "Grand Hall", description: "Welcome addresses, keynote speech, and conference overview" },
        { title: "Coffee Break", type: "break", startTime: "10:30", endTime: "11:00", duration: "30 minutes", location: "Foyer" },
        { title: "Committee Session I", type: "committee-session", startTime: "11:00", endTime: "13:00", duration: "2 hours", description: "Roll call, setting the agenda, and opening speeches", committees },
        { title: "Lunch", type: "meal", startTime: "13:00", endTime: "14:00", duration: "1 hour", location: "Dining Hall" },
        { title: "Committee Session II", type: "committee-session", startTime: "14:00", endTime: "16:30", duration: "2 hours 30 minutes", description: "General speakers list and moderated caucus", committees },
        { title: "Coffee Break", type: "break", startTime: "16:30", endTime: "17:00", duration: "30 minutes", location: "Foyer" },
        { title: "Committee Session III", type: "committee-session", startTime: "17:00", endTime: "19:00", duration: "2 hours", description: "Unmoderated caucus and working paper development", committees },
        { title: "Delegate Social", type: "ceremony", startTime: "20:00", endTime: "22:00", duration: "2 hours", location: "University Courtyard", description: "Informal networking event for delegates" },
      ]
    } else if (day === 2) {
      return [
        { title: "Breakfast", type: "meal", startTime: "08:00", endTime: "09:00", duration: "1 hour", location: "Dining Hall" },
        { title: "Committee Session IV", type: "committee-session", startTime: "09:00", endTime: "11:30", duration: "2 hours 30 minutes", description: "Working paper presentations and feedback", committees },
        { title: "Coffee Break", type: "break", startTime: "11:30", endTime: "12:00", duration: "30 minutes", location: "Foyer" },
        { title: "Guest Speaker Panel", type: "plenary", startTime: "12:00", endTime: "13:00", duration: "1 hour", location: "Grand Hall", description: "Distinguished diplomats discuss current global challenges" },
        { title: "Lunch", type: "meal", startTime: "13:00", endTime: "14:00", duration: "1 hour", location: "Dining Hall" },
        { title: "Committee Session V", type: "committee-session", startTime: "14:00", endTime: "16:30", duration: "2 hours 30 minutes", description: "Draft resolution development and amendments", committees },
        { title: "Coffee Break", type: "break", startTime: "16:30", endTime: "17:00", duration: "30 minutes", location: "Foyer" },
        { title: "Committee Session VI", type: "committee-session", startTime: "17:00", endTime: "19:00", duration: "2 hours", description: "Continued resolution development and voting procedures", committees },
        { title: "Cultural Night", type: "ceremony", startTime: "20:00", endTime: "22:00", duration: "2 hours", location: "University Auditorium", description: "Performances and cultural showcase from participating countries" },
      ]
    } else {
      return [
        { title: "Breakfast", type: "meal", startTime: "08:00", endTime: "09:00", duration: "1 hour", location: "Dining Hall" },
        { title: "Committee Session VII", type: "committee-session", startTime: "09:00", endTime: "11:30", duration: "2 hours 30 minutes", description: "Final resolution voting and amendments", committees },
        { title: "Coffee Break", type: "break", startTime: "11:30", endTime: "12:00", duration: "30 minutes", location: "Foyer" },
        { title: "Committee Session VIII", type: "committee-session", startTime: "12:00", endTime: "13:30", duration: "1 hour 30 minutes", description: "Committee wrap-up and final proceedings", committees },
        { title: "Lunch", type: "meal", startTime: "13:30", endTime: "14:30", duration: "1 hour", location: "Dining Hall" },
        { title: "General Assembly Plenary", type: "plenary", startTime: "14:30", endTime: "16:30", duration: "2 hours", location: "Grand Hall", description: "Presentation of committee resolutions to the General Assembly" },
        { title: "Coffee Break", type: "break", startTime: "16:30", endTime: "17:00", duration: "30 minutes", location: "Foyer" },
        { title: "Closing Ceremony & Awards", type: "ceremony", startTime: "17:00", endTime: "19:00", duration: "2 hours", location: "Grand Hall", description: "Presentation of awards, closing remarks, and farewell" },
      ]
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Conference Schedule</h1>
          <p className="text-gray-600">Plan your MUN experience with our detailed daily schedule</p>
        </div>
        {/* Day Navigation */}
        <div className="mb-8">
          <Tabs
            value={activeDay.toString()}
            onValueChange={(value) => handleDayChange(Number.parseInt(value))}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{getConferenceDate(activeDay)}</h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDayChange(Math.max(1, activeDay - 1))}
                  disabled={activeDay === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDayChange(Math.min(3, activeDay + 1))}
                  disabled={activeDay === 3}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="1" className="relative">Day 1</TabsTrigger>
              <TabsTrigger value="2" className="relative">Day 2</TabsTrigger>
              <TabsTrigger value="3" className="relative">Day 3</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {/* Schedule Timeline */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-24">
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-24 w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-24 w-px h-full bg-gray-200 z-0"></div>
            {/* Schedule items */}
            <div className="space-y-6 relative z-10">
              {schedule.map((event, index) => (
                <div key={index} className="flex gap-4">
                  {/* Time */}
                  <div className="w-24 pt-2 flex items-start justify-end">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium">{event.startTime}</span>
                      <span className="text-xs text-gray-500">{event.endTime}</span>
                    </div>
                  </div>
                  {/* Timeline dot */}
                  <div className="relative -left-[9px] mt-3">
                    <div
                      className={`h-4 w-4 rounded-full border-2 border-white ${
                        event.type === "committee-session"
                          ? "bg-blue-500"
                          : event.type === "break"
                            ? "bg-amber-500"
                            : event.type === "meal"
                              ? "bg-green-500"
                              : event.type === "ceremony"
                                ? "bg-purple-500"
                                : event.type === "plenary"
                                  ? "bg-indigo-500"
                                  : "bg-gray-500"
                      } shadow-md`}
                    ></div>
                  </div>
                  {/* Event card */}
                  <div className="flex-1">
                    <Card
                      className={`overflow-hidden border-l-4 ${
                        event.type === "committee-session"
                          ? "border-l-blue-500"
                          : event.type === "break"
                            ? "border-l-amber-500"
                            : event.type === "meal"
                              ? "border-l-green-500"
                              : event.type === "ceremony"
                                ? "border-l-purple-500"
                                : event.type === "plenary"
                                  ? "border-l-indigo-500"
                                  : "border-l-gray-500"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            {getEventIcon(event.type)}
                            <h3 className="font-medium text-lg">{event.title}</h3>
                          </div>
                          <Badge className={`${getEventBadgeColor(event.type)} border`}>
                            {event.type === "committee-session"
                              ? "Committee Session"
                              : event.type === "break"
                                ? "Break"
                                : event.type === "meal"
                                  ? "Meal"
                                  : event.type === "ceremony"
                                    ? "Ceremony"
                                    : event.type === "plenary"
                                      ? "Plenary Session"
                                      : "Event"}
                          </Badge>
                        </div>
                        {event.description && <p className="text-gray-600 text-sm mb-3">{event.description}</p>}
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                          {event.location && (
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          {event.duration && (
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{event.duration}</span>
                            </div>
                          )}
                        </div>
                        {/* Committee sessions details */}
                        {event.type === "committee-session" && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <h4 className="text-sm font-medium mb-2">Committee Rooms:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {event.committees.length > 0 ? (
                                event.committees.map((committee: any, idx: number) => (
                                  <div key={committee.committee_id} className="flex items-center text-sm">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-medium mr-2">
                                      {idx + 1}
                                    </div>
                                    <span className="font-medium">{committee.name}</span>
                                    <span className="mx-1">-</span>
                                    <span className="text-gray-600">{committee.location}</span>
                                  </div>
                                ))
                              ) : (
                                <span className="text-gray-500">No committees found</span>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Legend */}
        <div className="mt-12 pt-6 border-t">
          <h3 className="text-lg font-medium mb-3">Legend</h3>
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
              <Users className="h-3.5 w-3.5 mr-1" />
              Committee Session
            </Badge>
            <Badge className="bg-amber-100 text-amber-800 border border-amber-200">
              <Coffee className="h-3.5 w-3.5 mr-1" />
              Break
            </Badge>
            <Badge className="bg-green-100 text-green-800 border border-green-200">
              <Utensils className="h-3.5 w-3.5 mr-1" />
              Meal
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 border border-purple-200">
              <Award className="h-3.5 w-3.5 mr-1" />
              Ceremony
            </Badge>
            <Badge className="bg-indigo-100 text-indigo-800 border border-indigo-200">
              <MessageCircle className="h-3.5 w-3.5 mr-1" />
              Plenary Session
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
