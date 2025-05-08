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

const delegatesAPI = {
  // Get delegate by ID
  getDelegate: (id) => {
    return instance.get(`/delegates/${id}`)
  },

  // Update delegate profile
  updateDelegate: (id, data) => {
    return instance.put(`/delegates/${id}`, data)
  },

  // Get delegate's past experiences
  getPastExperiences: (id) => {
    return instance.get(`/delegates/${id}/experiences`)
  },

  // Add past experience
  addPastExperience: (id, data) => {
    return instance.post(`/delegates/${id}/experiences`, data)
  },

  // Get delegate's committee assignments
  getAssignments: (id) => {
    return instance.get(`/delegates/${id}/assignments`)
  },

  // Get delegate's documents
  getDocuments: (id, type = null) => {
    return instance.get(`/delegates/${id}/documents${type ? `?type=${type}` : ""}`)
  },

  // Submit a document
  submitDocument: (data) => {
    return instance.post("/documents", data)
  },
}

export default delegatesAPI
