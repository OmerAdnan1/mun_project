import axios from "axios"

const API_URL = "/api"

// Create axios instance
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a response interceptor for error handling
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

// Fallback mock data if API fails
const getMockCommittees = () => [
  {
    committee_id: 1,
    name: "Security Council",
    topic: "Nuclear Proliferation",
    difficulty: "advanced",
    capacity: 15,
    chair_name: "Zayan Amjad",
  },
  {
    committee_id: 2,
    name: "Human Rights Council",
    topic: "Rights of Refugees",
    difficulty: "intermediate",
    capacity: 20,
    chair_name: "Jane Smith",
  },
  {
    committee_id: 3,
    name: "Economic and Social Council",
    topic: "Sustainable Development",
    difficulty: "beginner",
    capacity: 25,
    chair_name: "John Doe",
  },
]

const committeesAPI = {
  // Get all committees
  getCommittees: async () => {
    try {
      const res = await instance.get("/committees")
      return res.length ? res : getMockCommittees()
    } catch (error) {
      console.error("Failed to fetch committees:", error)
      return getMockCommittees()
    }
  },

  // Get committee by ID
  getCommittee: async (id) => {
    try {
      return await instance.get(`/committees/${id}`)
    } catch (error) {
      console.error(`Failed to fetch committee ${id}:`, error)
      return getMockCommittees().find((c) => c.committee_id === Number.parseInt(id))
    }
  },

  // Get committee delegates
  getCommitteeDelegates: (id) => {
    return instance.get(`/committees/${id}/delegates`)
  },

  // Get committee documents
  getCommitteeDocuments: (id, type = null) => {
    return instance.get(`/committees/${id}/documents${type ? `?type=${type}` : ""}`)
  },

  // Get committee events
  getCommitteeEvents: (id, type = null) => {
    return instance.get(`/committees/${id}/events${type ? `?type=${type}` : ""}`)
  },

  // Get committee blocks
  getCommitteeBlocks: (id) => {
    return instance.get(`/committees/${id}/blocks`)
  },
}

export default committeesAPI
