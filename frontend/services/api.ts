// Mock API service for the MUN Management System
// In a real application, this would make actual HTTP requests to your backend

// Base API URL
const API_URL = "http://localhost:5000/api"

// Helper function to simulate API calls
function simulateApiCall<T>(
  data: T,
  delay = 500,
  shouldSucceed = true,
): Promise<{ success: boolean; data: T; message?: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve({ success: true, data })
      } else {
        reject(new Error("API call failed"))
      }
    }, delay)
  })
}

// User Registration
export const registerUser = async (userData: any) => {
  // Simulate API call
  const userId = Math.floor(Math.random() * 10000)
  const responseData = {
    user_id: userId,
    email: userData.email,
    full_name: userData.full_name,
    role: userData.role,
    phone: userData.phone || "",
    created_at: new Date().toISOString(),
  }

  return simulateApiCall(responseData)
}

// User Login
export const loginUser = async (credentials: { email: string; password: string }) => {
  // Simulate API call
  const responseData = {
    user_id: Math.floor(Math.random() * 10000),
    email: credentials.email,
    full_name: "John Doe", // In a real app, this would come from the backend
    role: credentials.email.includes("chair") ? "chair" : credentials.email.includes("admin") ? "admin" : "delegate",
    phone: "1234567890",
    token: "mock_jwt_token_" + Math.random().toString(36).substring(2),
  }

  return simulateApiCall({ ...responseData, message: "Login successful" })
}

// Update Delegate Info
export const updateDelegateInfo = async (userId: number, data: any) => {
  const responseData = {
    user_id: userId,
    experience_level: data.experience_level,
    emergency_contact: data.emergency_contact,
  }

  return simulateApiCall(responseData)
}

// Add Delegate Experience
export const addDelegateExperience = async (userId: number, data: any) => {
  const responseData = {
    experience_id: Math.floor(Math.random() * 10000),
    user_id: userId,
    conference_name: data.conference_name,
    committee: data.committee,
    country: data.country,
    year: data.year,
    awards: data.awards,
    description: data.description,
  }

  return simulateApiCall(responseData)
}

// Update Chair Info
export const updateChairInfo = async (userId: number, data: any) => {
  const responseData = {
    user_id: userId,
    evaluation_metrics: data.evaluation_metrics,
    chairing_experience: data.chairing_experience,
  }

  return simulateApiCall(responseData)
}

// Fetch Committees
export const fetchCommittees = async (queryParams = "") => {
  try {
    // Generate mock committee data
    const committees = Array.from({ length: 10 }, (_, i) => ({
      committee_id: i + 1,
      name: [
        "UN Security Council",
        "UN General Assembly",
        "World Health Organization",
        "UN Human Rights Council",
        "International Court of Justice",
        "UN Environment Programme",
        "Economic and Social Council",
        "UN Women",
        "UNICEF",
        "UNESCO",
      ][i],
      topic: [
        "International Peace and Security",
        "Sustainable Development Goals",
        "Global Health Crisis",
        "Human Rights Violations",
        "Maritime Border Disputes",
        "Climate Change",
        "Economic Recovery Post-Pandemic",
        "Gender Equality",
        "Children's Rights",
        "Cultural Heritage Protection",
      ][i],
      difficulty: ["beginner", "intermediate", "advanced"][Math.floor(Math.random() * 3)],
      capacity: 20 + Math.floor(Math.random() * 10),
      chair_name: `Chair ${i + 1}`,
      current_delegate_count: Math.floor(Math.random() * 15),
    }))

    return simulateApiCall({ data: committees, count: committees.length })
  } catch (error) {
    console.error("Error in fetchCommittees:", error)
    // Return empty data array on error
    return { success: true, data: [] }
  }
}

// Fetch Committee Details
export const fetchCommitteeDetails = async (committeeId: number) => {
  const committee = {
    committee_id: committeeId,
    name: [
      "UN Security Council",
      "UN General Assembly",
      "World Health Organization",
      "UN Human Rights Council",
      "International Court of Justice",
    ][committeeId % 5],
    description:
      "This committee focuses on addressing key global challenges through diplomatic negotiations and consensus-building. Delegates will engage in substantive debate on pressing international issues.",
    topic: [
      "International Peace and Security",
      "Sustainable Development Goals",
      "Global Health Crisis",
      "Human Rights Violations",
      "Maritime Border Disputes",
    ][committeeId % 5],
    difficulty: ["beginner", "intermediate", "advanced"][committeeId % 3],
    capacity: 20 + Math.floor(Math.random() * 10),
    location: "Conference Room " + ((committeeId % 5) + 1),
    start_date: "2023-06-15T09:00:00Z",
    end_date: "2023-06-18T17:00:00Z",
    chair_id: 1001,
    chair_name: "Dr. Jane Smith",
  }

  return simulateApiCall({ data: committee })
}

// Allocate Delegate to Committee
export const allocateDelegateToCommittee = async (data: { delegateId: number; committeeId: number }) => {
  const countries = [
    "United States",
    "United Kingdom",
    "France",
    "China",
    "Russia",
    "Germany",
    "Japan",
    "India",
    "Brazil",
    "South Africa",
  ]
  const responseData = {
    assignment_id: Math.floor(Math.random() * 10000),
    delegate_id: data.delegateId,
    committee_id: data.committeeId,
    country_id: Math.floor(Math.random() * 100),
    country_name: countries[Math.floor(Math.random() * countries.length)],
    conference_year: new Date().getFullYear(),
    assignment_date: new Date().toISOString(),
  }

  return simulateApiCall(responseData)
}

// Fetch Delegate Assignments
export const fetchDelegateAssignments = async (queryParams = "") => {
  const assignments = Array.from({ length: 1 }, (_, i) => ({
    assignment_id: i + 1,
    delegate_id: 1001,
    delegate_name: "John Doe",
    committee_id: 1,
    committee_name: "UN Security Council",
    country_id: 42,
    country_name: "France",
    block_id: 3,
    block_name: "European Union",
    conference_year: new Date().getFullYear(),
  }))

  return simulateApiCall({ data: assignments, count: assignments.length })
}

// Fetch Delegate Scores
export const fetchDelegateScores = async (delegateId: number) => {
  const categories = [
    "Position Paper",
    "Speech",
    "Moderated Caucus",
    "Unmoderated Caucus",
    "Resolution",
    "Amendment",
    "Diplomacy",
  ]
  const scores = Array.from({ length: 5 }, (_, i) => ({
    score_id: i + 1,
    category: categories[i % categories.length],
    points: Math.floor(Math.random() * 10) + 1,
    chair_name: "Dr. Jane Smith",
    timestamp: new Date(Date.now() - i * 86400000).toISOString(), // Past days
    comments: "Excellent performance in committee session.",
  }))

  return simulateApiCall({ data: scores, count: scores.length })
}

// Fetch Delegate Attendance
export const fetchDelegateAttendance = async (delegateId: number) => {
  const statuses = ["present", "present", "present", "late", "excused"]
  const attendance = Array.from({ length: 5 }, (_, i) => ({
    user_id: delegateId,
    committee_id: 1,
    committee_name: "UN Security Council",
    date: new Date(Date.now() - i * 86400000).toISOString(), // Past days
    status: statuses[i],
    notes: i === 3 ? "Arrived 15 minutes late" : i === 4 ? "Excused for academic conflict" : "",
  }))

  return simulateApiCall({ data: attendance, count: attendance.length })
}

// Fetch Delegate Documents
export const fetchDelegateDocuments = async (delegateId: number) => {
  const documents = Array.from({ length: 3 }, (_, i) => ({
    document_id: i + 1,
    title: ["Position Paper: France", "Draft Resolution on Security", "Amendment to Clause 3"][i],
    type: ["Position Paper", "Draft Resolution", "Amendment"][i],
    status: ["approved", "pending", "draft"][i],
    uploaded_at: new Date(Date.now() - i * 86400000).toISOString(), // Past days
    due_date: new Date(Date.now() + (7 - i) * 86400000).toISOString(), // Future days
  }))

  return simulateApiCall({ data: documents, count: documents.length })
}

// Add these new functions to your existing services/api.ts file

// Fetch current conference day
export const fetchCurrentConferenceDay = async () => {
  // Mock API response - in a real app, this would come from the backend
  const currentDay = 1 // Simulate that it's day 1 of the conference

  return simulateApiCall({ currentDay })
}

// Fetch schedule for a specific day
export const fetchSchedule = async (day: number) => {
  // Mock schedule data
  const scheduleData = generateScheduleForDay(day)

  return simulateApiCall(scheduleData)
}

// Helper function to generate mock schedule data for each day
function generateScheduleForDay(day: number) {
  const committees = [
    { id: 1, name: "UN Security Council", room: "Conference Room A" },
    { id: 2, name: "UN General Assembly", room: "Grand Hall" },
    { id: 3, name: "World Health Organization", room: "Conference Room B" },
    { id: 4, name: "UN Human Rights Council", room: "Conference Room C" },
    { id: 5, name: "International Court of Justice", room: "Judicial Chamber" },
  ]

  // Day 1 Schedule
  if (day === 1) {
    return [
      {
        title: "Registration & Check-in",
        type: "ceremony",
        startTime: "08:00",
        endTime: "09:00",
        duration: "1 hour",
        location: "Main Lobby",
        description: "Delegate registration, badge collection, and welcome packets",
      },
      {
        title: "Opening Ceremony",
        type: "ceremony",
        startTime: "09:15",
        endTime: "10:30",
        duration: "1 hour 15 minutes",
        location: "Grand Hall",
        description: "Welcome addresses, keynote speech, and conference overview",
      },
      {
        title: "Coffee Break",
        type: "break",
        startTime: "10:30",
        endTime: "11:00",
        duration: "30 minutes",
        location: "Foyer",
      },
      {
        title: "Committee Session I",
        type: "committee-session",
        startTime: "11:00",
        endTime: "13:00",
        duration: "2 hours",
        description: "Roll call, setting the agenda, and opening speeches",
        committees: committees,
      },
      {
        title: "Lunch",
        type: "meal",
        startTime: "13:00",
        endTime: "14:00",
        duration: "1 hour",
        location: "Dining Hall",
      },
      {
        title: "Committee Session II",
        type: "committee-session",
        startTime: "14:00",
        endTime: "16:30",
        duration: "2 hours 30 minutes",
        description: "General speakers list and moderated caucus",
        committees: committees,
      },
      {
        title: "Coffee Break",
        type: "break",
        startTime: "16:30",
        endTime: "17:00",
        duration: "30 minutes",
        location: "Foyer",
      },
      {
        title: "Committee Session III",
        type: "committee-session",
        startTime: "17:00",
        endTime: "19:00",
        duration: "2 hours",
        description: "Unmoderated caucus and working paper development",
        committees: committees,
      },
      {
        title: "Delegate Social",
        type: "ceremony",
        startTime: "20:00",
        endTime: "22:00",
        duration: "2 hours",
        location: "University Courtyard",
        description: "Informal networking event for delegates",
      },
    ]
  }

  // Day 2 Schedule
  else if (day === 2) {
    return [
      {
        title: "Breakfast",
        type: "meal",
        startTime: "08:00",
        endTime: "09:00",
        duration: "1 hour",
        location: "Dining Hall",
      },
      {
        title: "Committee Session IV",
        type: "committee-session",
        startTime: "09:00",
        endTime: "11:30",
        duration: "2 hours 30 minutes",
        description: "Working paper presentations and feedback",
        committees: committees,
      },
      {
        title: "Coffee Break",
        type: "break",
        startTime: "11:30",
        endTime: "12:00",
        duration: "30 minutes",
        location: "Foyer",
      },
      {
        title: "Guest Speaker Panel",
        type: "plenary",
        startTime: "12:00",
        endTime: "13:00",
        duration: "1 hour",
        location: "Grand Hall",
        description: "Distinguished diplomats discuss current global challenges",
      },
      {
        title: "Lunch",
        type: "meal",
        startTime: "13:00",
        endTime: "14:00",
        duration: "1 hour",
        location: "Dining Hall",
      },
      {
        title: "Committee Session V",
        type: "committee-session",
        startTime: "14:00",
        endTime: "16:30",
        duration: "2 hours 30 minutes",
        description: "Draft resolution development and amendments",
        committees: committees,
      },
      {
        title: "Coffee Break",
        type: "break",
        startTime: "16:30",
        endTime: "17:00",
        duration: "30 minutes",
        location: "Foyer",
      },
      {
        title: "Committee Session VI",
        type: "committee-session",
        startTime: "17:00",
        endTime: "19:00",
        duration: "2 hours",
        description: "Continued resolution development and voting procedures",
        committees: committees,
      },
      {
        title: "Cultural Night",
        type: "ceremony",
        startTime: "20:00",
        endTime: "22:00",
        duration: "2 hours",
        location: "University Auditorium",
        description: "Performances and cultural showcase from participating countries",
      },
    ]
  }

  // Day 3 Schedule
  else {
    return [
      {
        title: "Breakfast",
        type: "meal",
        startTime: "08:00",
        endTime: "09:00",
        duration: "1 hour",
        location: "Dining Hall",
      },
      {
        title: "Committee Session VII",
        type: "committee-session",
        startTime: "09:00",
        endTime: "11:30",
        duration: "2 hours 30 minutes",
        description: "Final resolution voting and amendments",
        committees: committees,
      },
      {
        title: "Coffee Break",
        type: "break",
        startTime: "11:30",
        endTime: "12:00",
        duration: "30 minutes",
        location: "Foyer",
      },
      {
        title: "Committee Session VIII",
        type: "committee-session",
        startTime: "12:00",
        endTime: "13:30",
        duration: "1 hour 30 minutes",
        description: "Committee wrap-up and final proceedings",
        committees: committees,
      },
      {
        title: "Lunch",
        type: "meal",
        startTime: "13:30",
        endTime: "14:30",
        duration: "1 hour",
        location: "Dining Hall",
      },
      {
        title: "General Assembly Plenary",
        type: "plenary",
        startTime: "14:30",
        endTime: "16:30",
        duration: "2 hours",
        location: "Grand Hall",
        description: "Presentation of committee resolutions to the General Assembly",
      },
      {
        title: "Coffee Break",
        type: "break",
        startTime: "16:30",
        endTime: "17:00",
        duration: "30 minutes",
        location: "Foyer",
      },
      {
        title: "Closing Ceremony & Awards",
        type: "ceremony",
        startTime: "17:00",
        endTime: "19:00",
        duration: "2 hours",
        location: "Grand Hall",
        description: "Presentation of awards, closing remarks, and farewell",
      },
    ]
  }
}

// --- Voting API Functions ---

// Fetch all resolutions available for voting (documents that require voting)
export const fetchResolutionsForVoting = async (committeeId: number) => {
  // In a real app, fetch from backend: `${API_URL}/documents?committee_id=${committeeId}&requires_voting=true`
  // Here, return mock data
  const resolutions = Array.from({ length: 3 }, (_, i) => ({
    resolution_id: i + 1,
    title: `Resolution ${i + 1}`,
    description: `Description for resolution ${i + 1}`,
    author: ["France", "USA", "China"][i],
    country: ["France", "USA", "China"][i],
    voting_status: i === 0 ? "active" : i === 1 ? "completed" : "pending",
    submitted_at: new Date(Date.now() - i * 86400000).toISOString(),
  }))
  return simulateApiCall({ data: resolutions, count: resolutions.length })
}

// Fetch voting results for a resolution (document)
export const fetchVotingResults = async (resolutionId: number) => {
  // In a real app, fetch from backend: `${API_URL}/votes/document/${resolutionId}`
  // Here, return mock data
  const votes = { yes: 8, no: 3, abstain: 2 }
  const countries = [
    { country_id: 1, country_name: "France", vote: "yes" },
    { country_id: 2, country_name: "USA", vote: "no" },
    { country_id: 3, country_name: "China", vote: "abstain" },
  ]
  return simulateApiCall({
    resolution_id: resolutionId,
    title: `Resolution ${resolutionId}`,
    description: `Description for resolution ${resolutionId}`,
    author: "France",
    country: "France",
    committee_name: "UN Security Council",
    votes,
    total_votes: votes.yes + votes.no + votes.abstain,
    countries,
    voting_status: "active",
  })
}

// Update voting status for a resolution (start/end voting)
export const updateVotingStatus = async (resolutionId: number, status: "in_progress" | "completed" | "pending") => {
  // In a real app, PATCH/PUT to backend: `${API_URL}/documents/${resolutionId}`
  // Here, just simulate
  return simulateApiCall({ resolution_id: resolutionId, voting_status: status })
}

// Cast a vote for a resolution (document)
export const castVote = async ({ delegate_id, document_id, vote }: { delegate_id: number, document_id: number, vote: "yes" | "no" | "abstain" }) => {
  // In a real app, POST to backend: `${API_URL}/votes` with { delegate_id, document_id, vote }
  // Here, just simulate
  return simulateApiCall({ vote_id: Math.floor(Math.random() * 10000), delegate_id, document_id, vote })
}
