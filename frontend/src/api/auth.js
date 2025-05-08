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

const authAPI = {
  // Register a new user
  register: (userData) => {
    return instance.post("/users/register", userData).then(response => {
      // Return the user_id from the response
      return { user_id: response.user_id }
    })
  },

  // Login user
  login: (email, password) => {
    return instance.post("/users/login", { email, password })
  },

  // Get current user profile
  getCurrentUser: () => {
    return instance.get("/users/profile")
  },
}

export default authAPI
