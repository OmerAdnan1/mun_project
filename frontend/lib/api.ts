// API service for the MUN Management System
// This file contains functions to interact with the backend API
// For demo purposes, most functions will return mock data when the API is not available

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Types
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface LoginResponse {
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  phone?: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  // Add other user fields
}

interface Delegate {
  id: string;
  name: string;
  // Add other delegate fields
}

interface Committee {
  id: string;
  name: string;
  // Add other committee fields
}

interface DelegateAssignment {
  assignment_id: string;
  delegate_id: string;
  committee_id: string;
  country_id: string;
  committee_name: string;
  country_name: string;
  topic: string;
  position: string;
}

interface Score {
  score_id: string;
  delegate_id: string;
  committee_id: string;
  category: string;
  points: number;
  timestamp: string;
  comments: string;
  event_type?: string;
  event_description?: string;
  document_title?: string;
  document_type?: string;
  chair_name: string;
}

interface Attendance {
  id: string;
  delegate_id: string;
  committee_id: string;
  date: string;
  status: string;
  committee_name: string;
  position: string;
}

interface Document {
  document_id: string;
  delegate_id: string;
  committee_id: string;
  title: string;
  type: string;
  status: string;
  submitted_date: string;
  feedback: string | null;
}



// ... Add other interfaces as needed

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // User APIs
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.api.post('/users/login', { email, password });
    return response.data;
  }

  async register(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.api.post('/users/register', userData);
    return response.data;
  }

  // Update user info
  async updateUser(id: string, data: any): Promise<ApiResponse<any>> {
    const response = await this.api.put(`/users/${id}`, data);
    return response.data;
  }

  // Delegate APIs
  async getDelegates(): Promise<ApiResponse<Delegate[]>> {
    const response = await this.api.get('/delegates');
    return response.data;
  }

  async getDelegateById(id: string): Promise<ApiResponse<Delegate>> {
    const response = await this.api.get(`/delegates/${id}`);
    return response.data;
  }

  // Committee APIs
  async getCommittees(): Promise<ApiResponse<Committee[]>> {
    const response = await this.api.get('/committees');
    return response.data;
  }

  async getCommitteeById(id: string): Promise<ApiResponse<Committee>> {
    try {
      const response = await this.api.get(`/committees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch committee with ID ${id}:`, error);
      throw error;
    }
  }

  // Document APIs
  async getDocuments(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/documents');
    return response.data;
  }

  async uploadDocument(formData: FormData): Promise<ApiResponse<any>> {
    const response = await this.api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Attendance APIs
  async getAttendances(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/attendances');
    return response.data;
  }

  async markAttendance(data: any): Promise<ApiResponse<any>> {
    const response = await this.api.post('/attendances', data);
    return response.data;
  }

  // Get attendance for a committee on a specific date
  async getAttendanceByDate(committeeId: string, date: string): Promise<ApiResponse<any[]>> {
    const response = await this.api.get(`/attendances/committee/${committeeId}/date/${date}`)
    return response.data;
  }

  // Score APIs
  async getScores(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/api/scores');
    return response.data;
  }

  async addScore(data: any): Promise<any> {
    try {
      const response = await this.api.post('/scores', {
        delegate_id: parseInt(data.delegate_id),
        committee_id: parseInt(data.committee_id),
        category: data.category,
        points: parseFloat(data.points),
        chair_id: parseInt(data.chair_id || this.getCurrentUserId()),
        comments: data.comments || "no comments"
      });
      return response.data;
    } catch (error) {
      console.error('Error adding score:', error);
      throw error;
    }
  }

  async getScoresByCommittee(committeeId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await this.api.get(`/scores/committee/${committeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch scores for committee ${committeeId}:`, error);
      return {
        success: true,
        message: "Failed to fetch scores, using fallback data",
        data: []
      };
    }
  }

  // Event APIs
  async getEvents(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/events');
    return response.data;
  }

  async createEvent(data: any): Promise<ApiResponse<any>> {
    const response = await this.api.post('/events', data);
    return response.data;
  }

  // Vote APIs
  async getVotes(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/votes');
    return response.data;
  }

  async castVote(data: any): Promise<ApiResponse<any>> {
    const response = await this.api.post('/votes', data);
    return response.data;
  }

  // Delegate Assignment APIs
  async getDelegateAssignments(delegateId: string): Promise<ApiResponse<DelegateAssignment[]>> {
    const response = await this.api.get(`/delegate-assignments?delegateId=${parseInt(delegateId)}`);
    return response.data;
  }

  async assignDelegate(data: any): Promise<ApiResponse<any>> {
    const response = await this.api.post('/delegate-assignments', data);
    return response.data;
  }

  async getAllDelegateAssignments() {
    try {
      const apiData = await apiRequest("/delegate-assignments/all")
      if (apiData) return apiData
      return { success: false, message: "No response from server", data: [] }
    } catch (error) {
      console.error("Get all delegate assignments API error:", error)
      return { success: false, message: "Failed to fetch delegate assignments", data: [] }
    }
  }

  // Country APIs
  async getCountries(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/countries');
    return response.data;
  }

  async updateCountry(countryId: number, data: { name: string; importance: number }) {
    const response = await this.api.put(`/countries/${countryId}`, data);
    return response.data;
  }

  async addCountry(data: { name: string; importance: number }) {
    const response = await this.api.post(`/countries`, data);
    return response.data;
  }

  // Block APIs
  async getBlocks(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/blocks');
    return response.data;
  }

  // Admin APIs
  async getAdmins(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/admins');
    return response.data;
  }

  async getDelegateScores(delegateId: string): Promise<ApiResponse<Score[]>> {
    const response = await this.api.get(`/scores/delegate/${parseInt(delegateId)}`);
    return response.data;
  }

  async getDelegateAttendance(delegateId: string): Promise<ApiResponse<Attendance[]>> {
    const response = await this.api.get(`/attendances/delegate/${parseInt(delegateId)}`);
    return response.data;
  }

  async getDelegateDocuments(delegateId: string): Promise<ApiResponse<Document[]>> {
    const response = await this.api.get(`/documents/delegate/${parseInt(delegateId)}`);
    return response.data;
  }

  // Chair APIs
  async getChairById(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get(`/chairs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch chair with ID ${id}:`, error);
      throw error;
    }
  }

  async getChairCommittees(chairId: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get(`/committees?chair_id=${chairId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch committees for chair ${chairId}:`, error);
      // Return mock data for demonstration purposes
      return {
        success: true,
        data: [
          {
            id: "1",
            name: "United Nations Security Council",
            topic: "Addressing Conflicts in the Middle East",
            delegate_count: 15,
            next_session: "Today, 9:00 AM",
            pending_documents: 3,
          },
          {
            id: "2",
            name: "World Health Organization",
            topic: "Global Pandemic Response",
            delegate_count: 20,
            next_session: "Tomorrow, 10:00 AM",
            pending_documents: 5,
          },
        ],
      };
    }
  }

  async updateChairInfo(id: string, data: any): Promise<ApiResponse<any>> {
    const response = await this.api.put(`/chairs/${id}`, data);
    return response.data;
  }

  // Admin APIs
  async getAdminById(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/admins/${id}`);
    return response.data;
  }

  async updateAdminInfo(id: string, data: any): Promise<ApiResponse<any>> {
    const response = await this.api.put(`/admins/${id}`, data);
    return response.data;
  }

  // Delegate APIs
  async updateDelegateInfo(id: string, data: any): Promise<ApiResponse<any>> {
    const response = await this.api.put(`/delegates/${id}`, data);
    return response.data;
  }

  // Helper method to get current user ID
  private getCurrentUserId(): string | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          return user.id;
        } catch (e) {
          console.error('Error parsing user from localStorage:', e);
        }
      }
    }
    return null;
  }
}

export const apiService = new ApiService();

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("mun_token")
  }
  return null
}

// Helper function to handle API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `API request failed: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error)
    throw error // Re-throw the error to handle it in the calling code
  }
}

// Authentication
export async function registerUser(userData: any) {
  try {
    const apiData = await apiRequest("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })

    if (apiData) return apiData

    // Mock data fallback
    return {
      success: true,
      data: {
        user_id: "user_" + Math.floor(Math.random() * 1000),
        ...userData,
      },
    }
  } catch (error) {
    console.error("Register user API error:", error)
    // For demo, return mock data
    return {
      success: true,
      data: {
        user_id: "user_" + Math.floor(Math.random() * 1000),
        ...userData,
      },
    }
  }
}

export async function loginUser(credentials: { email: string; password: string }) {
  try {
    const apiData = await apiRequest("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    if (apiData) return apiData

    // For demo purposes, simulate successful login with mock data
    // In a real app, you would validate credentials on the server
    return {
      success: true,
      data: {
        user_id: "user_123",
        name: credentials.email.split("@")[0],
        email: credentials.email,
        role: credentials.email.includes("admin")
          ? "admin"
          : credentials.email.includes("chair")
            ? "chair"
            : "delegate",
      },
      token: "mock_token_123",
    }
  } catch (error) {
    // For demo, we'll simulate a successful login
    // In a real app, you might want to handle specific error cases
    console.log("Login API error, using mock data:", error)
    return {
      success: true,
      data: {
        user_id: "user_123",
        name: credentials.email.split("@")[0],
        email: credentials.email,
        role: credentials.email.includes("admin")
          ? "admin"
          : credentials.email.includes("chair")
            ? "chair"
            : "delegate",
      },
      token: "mock_token_123",
    }
  }
}

// Delegate APIs
export async function addDelegateExperience(delegateId: string, experienceData: any) {
  try {
    const apiData = await apiRequest(`/delegates/${delegateId}/experiences`, {
      method: "POST",
      body: JSON.stringify(experienceData),
    })

    if (apiData) return apiData

    // Mock data fallback
    return {
      success: true,
      data: {
        experience_id: "exp_" + Math.floor(Math.random() * 1000),
        delegate_id: delegateId,
        ...experienceData,
      },
    }
  } catch (error) {
    console.error("Add delegate experience API error:", error)
    // For demo, return mock data
    return {
      success: true,
      data: {
        experience_id: "exp_" + Math.floor(Math.random() * 1000),
        delegate_id: delegateId,
        ...experienceData,
      },
    }
  }
}

// Committee APIs
export async function getCommittees(filters?: { difficulty?: string; chair_id?: string; search_term?: string }) {
  try {
    let query = "";
    if (filters) {
      const params = new URLSearchParams();
      if (filters.difficulty && filters.difficulty !== "all") params.append("difficulty", filters.difficulty);
      if (filters.chair_id) params.append("chair_id", filters.chair_id);
      if (filters.search_term) params.append("search_term", filters.search_term);
      query = "?" + params.toString();
    }
    const apiData = await apiRequest(`/committees${query}`)
    if (apiData) return apiData
    // Mock data fallback
    return [
      {
        committee_id: "1",
        name: "United Nations Security Council",
        topic: "Addressing Conflicts in the Middle East",
        difficulty: "Advanced",
        capacity: 15,
        current_delegate_count: 10,
        chair_name: "Alex Johnson",
      },
      {
        committee_id: "2",
        name: "World Health Organization",
        topic: "Global Pandemic Response",
        difficulty: "Intermediate",
        capacity: 20,
        current_delegate_count: 15,
        chair_name: "Sarah Chen",
      },
      {
        committee_id: "3",
        name: "UN Environment Programme",
        topic: "Climate Change Mitigation",
        difficulty: "Beginner",
        capacity: 25,
        current_delegate_count: 18,
        chair_name: "Michael Rodriguez",
      },
      {
        committee_id: "4",
        name: "UN Human Rights Council",
        topic: "Protecting Rights of Refugees",
        difficulty: "Intermediate",
        capacity: 20,
        current_delegate_count: 12,
        chair_name: "Emily Wilson",
      },
      {
        committee_id: "5",
        name: "International Monetary Fund",
        topic: "Economic Recovery Post-Pandemic",
        difficulty: "Advanced",
        capacity: 15,
        current_delegate_count: 8,
        chair_name: "David Kim",
      },
      {
        committee_id: "6",
        name: "UN General Assembly",
        topic: "Nuclear Disarmament",
        difficulty: "Beginner",
        capacity: 30,
        current_delegate_count: 25,
        chair_name: "Sophia Martinez",
      },
    ]
  } catch (error) {
    console.error("Get committees API error:", error)
    // For demo, return mock data
    return [
      {
        committee_id: "1",
        name: "United Nations Security Council",
        topic: "Addressing Conflicts in the Middle East",
        difficulty: "Advanced",
        capacity: 15,
        current_delegate_count: 10,
        chair_name: "Alex Johnson",
      },
      {
        committee_id: "2",
        name: "World Health Organization",
        topic: "Global Pandemic Response",
        difficulty: "Intermediate",
        capacity: 20,
        current_delegate_count: 15,
        chair_name: "Sarah Chen",
      },
      {
        committee_id: "3",
        name: "UN Environment Programme",
        topic: "Climate Change Mitigation",
        difficulty: "Beginner",
        capacity: 25,
        current_delegate_count: 18,
        chair_name: "Michael Rodriguez",
      },
      {
        committee_id: "4",
        name: "UN Human Rights Council",
        topic: "Protecting Rights of Refugees",
        difficulty: "Intermediate",
        capacity: 20,
        current_delegate_count: 12,
        chair_name: "Emily Wilson",
      },
      {
        committee_id: "5",
        name: "International Monetary Fund",
        topic: "Economic Recovery Post-Pandemic",
        difficulty: "Advanced",
        capacity: 15,
        current_delegate_count: 8,
        chair_name: "David Kim",
      },
      {
        committee_id: "6",
        name: "UN General Assembly",
        topic: "Nuclear Disarmament",
        difficulty: "Beginner",
        capacity: 30,
        current_delegate_count: 25,
        chair_name: "Sophia Martinez",
      },
    ]
  }
}

export async function getFeaturedCommittees() {
  try {
    const apiData = await apiRequest("/committees")
    if (apiData) return apiData

    // Mock data fallback
    return [
      {
        committee_id: "1",
        name: "United Nations Security Council",
        topic: "Addressing Conflicts in the Middle East",
        difficulty: "Advanced",
        capacity: 15,
        current_delegate_count: 10,
        chair_name: "Alex Johnson",
      },
      {
        committee_id: "2",
        name: "World Health Organization",
        topic: "Global Pandemic Response",
        difficulty: "Intermediate",
        capacity: 20,
        current_delegate_count: 15,
        chair_name: "Sarah Chen",
      },
      {
        committee_id: "3",
        name: "UN Environment Programme",
        topic: "Climate Change Mitigation",
        difficulty: "Beginner",
        capacity: 25,
        current_delegate_count: 18,
        chair_name: "Michael Rodriguez",
      },
    ]
  } catch (error) {
    console.log("Get featured committees API error, using mock data:", error)
    // For demo, return mock data
    return [
      {
        committee_id: "1",
        name: "United Nations Security Council",
        topic: "Addressing Conflicts in the Middle East",
        difficulty: "Advanced",
        capacity: 15,
        current_delegate_count: 10,
        chair_name: "Alex Johnson",
      },
      {
        committee_id: "2",
        name: "World Health Organization",
        topic: "Global Pandemic Response",
        difficulty: "Intermediate",
        capacity: 20,
        current_delegate_count: 15,
        chair_name: "Sarah Chen",
      },
      {
        committee_id: "3",
        name: "UN Environment Programme",
        topic: "Climate Change Mitigation",
        difficulty: "Beginner",
        capacity: 25,
        current_delegate_count: 18,
        chair_name: "Michael Rodriguez",
      },
    ]
  }
}

export async function getCommitteeById(committeeId: string) {
  try {
    const apiData = await apiRequest(`/committees/${committeeId}`)
    if (apiData && apiData.success && apiData.data) {
      // Return the new structure: { committee, delegates }
      return apiData
    }
    // Fallback for legacy or mock
    return {
      success: true,
      data: {
        committee: {
      committee_id: committeeId,
      name: "United Nations Security Council",
      description:
        "The Security Council has primary responsibility for the maintenance of international peace and security. It takes the lead in determining the existence of a threat to the peace or act of aggression.",
      topic: "Addressing Conflicts in the Middle East",
      difficulty: "Advanced",
      capacity: 15,
      current_delegate_count: 10,
      chair_name: "Alex Johnson",
      background_guide_url: "#",
      schedule: [
        { day: "Friday", time: "9:00 AM - 12:00 PM", activity: "Opening Session" },
        { day: "Friday", time: "2:00 PM - 5:00 PM", activity: "Debate Session 1" },
        { day: "Saturday", time: "9:00 AM - 12:00 PM", activity: "Debate Session 2" },
        { day: "Saturday", time: "2:00 PM - 5:00 PM", activity: "Voting Procedures" },
      ],
        },
        delegates: [],
      },
    }
  } catch (error) {
    // For demo, return mock data
    return {
      success: true,
      data: {
        committee: {
      committee_id: committeeId,
      name: "United Nations Security Council",
      description:
        "The Security Council has primary responsibility for the maintenance of international peace and security. It takes the lead in determining the existence of a threat to the peace or act of aggression.",
      topic: "Addressing Conflicts in the Middle East",
      difficulty: "Advanced",
      capacity: 15,
      current_delegate_count: 10,
      chair_name: "Alex Johnson",
      background_guide_url: "#",
      schedule: [
        { day: "Friday", time: "9:00 AM - 12:00 PM", activity: "Opening Session" },
        { day: "Friday", time: "2:00 PM - 5:00 PM", activity: "Debate Session 1" },
        { day: "Saturday", time: "9:00 AM - 12:00 PM", activity: "Debate Session 2" },
        { day: "Saturday", time: "2:00 PM - 5:00 PM", activity: "Voting Procedures" },
      ],
        },
        delegates: [],
      },
    }
  }
}

// Get full committee overview (all data in one call)
export async function getCommitteeOverview(committeeId: string) {
  const response = await fetch(`http://localhost:5000/api/committees/overview/${committeeId}`)
  if (!response.ok) throw new Error('Failed to fetch committee overview')
  return await response.json()
}

// Assignment APIs
export async function allocateDelegate(data: { delegateId: string; committeeId: string }) {
  try {
    const apiData = await apiRequest("/delegate-assignments/allocate/single", {
      method: "POST",
      body: JSON.stringify(data),
    })

    if (apiData) return apiData

    // Mock data fallback
    return {
      success: true,
      data: {
        assignment_id: "assignment_" + Math.floor(Math.random() * 1000),
        delegate_id: data.delegateId,
        committee_id: data.committeeId,
        country_id: "country_" + Math.floor(Math.random() * 100),
        country_name: ["France", "Germany", "Japan", "Brazil", "India"][Math.floor(Math.random() * 5)],
      },
    }
  } catch (error) {
    console.error("Allocate delegate API error:", error)
    // For demo, return mock data
    return {
      success: true,
      data: {
        assignment_id: "assignment_" + Math.floor(Math.random() * 1000),
        delegate_id: data.delegateId,
        committee_id: data.committeeId,
        country_id: "country_" + Math.floor(Math.random() * 100),
        country_name: ["France", "Germany", "Japan", "Brazil", "India"][Math.floor(Math.random() * 5)],
      },
    }
  }
}

export async function getDelegateAssignments(delegateId: string) {
  try {
    const apiData = await apiRequest(`/delegate-assignments?delegateId=${parseInt(delegateId)}`)
    if (apiData) return apiData

    // Mock data fallback
    return [
      {
        assignment_id: "assignment_123",
        delegate_id: delegateId,
        committee_id: "1",
        committee_name: "United Nations Security Council",
        country_name: "France",
        topic: "Addressing Conflicts in the Middle East",
      },
    ]
  } catch (error) {
    console.error("Get delegate assignments API error:", error)
    // For demo, return mock data
    return [
      {
        assignment_id: "assignment_123",
        delegate_id: delegateId,
        committee_id: "1",
        committee_name: "United Nations Security Council",
        country_name: "France",
        topic: "Addressing Conflicts in the Middle East",
      },
    ]
  }
}

// Delegate Dashboard APIs
export async function getDelegateScores(delegateId: string) {
  try {
    const apiData = await apiRequest(`/scores/delegate/${parseInt(delegateId)}`)
    if (apiData) return apiData

    // Mock data fallback
    return [
      { score_id: "1", category: "Speech", points: 8, date: "2023-10-15", notes: "Excellent opening speech" },
      {
        score_id: "2",
        category: "Resolution",
        points: 10,
        date: "2023-10-16",
        notes: "Primary sponsor of passed resolution",
      },
      { score_id: "3", category: "Diplomacy", points: 7, date: "2023-10-16", notes: "Good coalition building" },
    ]
  } catch (error) {
    console.error("Get delegate scores API error:", error)
    // For demo, return mock data
    return [
      { score_id: "1", category: "Speech", points: 8, date: "2023-10-15", notes: "Excellent opening speech" },
      {
        score_id: "2",
        category: "Resolution",
        points: 10,
        date: "2023-10-16",
        notes: "Primary sponsor of passed resolution",
      },
      { score_id: "3", category: "Diplomacy", points: 7, date: "2023-10-16", notes: "Good coalition building" },
    ]
  }
}

export async function getDelegateAttendance(delegateId: string) {
  try {
    const apiData = await apiRequest(`/attendances/delegate/${parseInt(delegateId)}`)
    if (apiData) return apiData

    // Mock data fallback
    return [
      { id: "1", committee_name: "UNSC", date: "2023-10-15", session: "Morning", status: "present" },
      { id: "2", committee_name: "UNSC", date: "2023-10-15", session: "Afternoon", status: "present" },
      { id: "3", committee_name: "UNSC", date: "2023-10-16", session: "Morning", status: "late" },
      { id: "4", committee_name: "UNSC", date: "2023-10-16", session: "Afternoon", status: "present" },
    ]
  } catch (error) {
    console.error("Get delegate attendance API error:", error)
    // For demo, return mock data
    return [
      { id: "1", committee_name: "UNSC", date: "2023-10-15", session: "Morning", status: "present" },
      { id: "2", committee_name: "UNSC", date: "2023-10-15", session: "Afternoon", status: "present" },
      { id: "3", committee_name: "UNSC", date: "2023-10-16", session: "Morning", status: "late" },
      { id: "4", committee_name: "UNSC", date: "2023-10-16", session: "Afternoon", status: "present" },
    ]
  }
}

export async function getDelegateDocuments(delegateId: string) {
  try {
    const apiData = await apiRequest(`/documents/delegate/${parseInt(delegateId)}`)
    if (apiData) return apiData

    // Mock data fallback
    return [
      {
        document_id: "1",
        title: "Position Paper",
        type: "position_paper",
        status: "approved",
        submitted_date: "2023-10-01",
        feedback: "Well researched",
      },
      {
        document_id: "2",
        title: "Draft Resolution on Peacekeeping",
        type: "resolution",
        status: "pending",
        submitted_date: "2023-10-15",
        feedback: null,
      },
    ]
  } catch (error) {
    console.error("Get delegate documents API error:", error)
    // For demo, return mock data
    return [
      {
        document_id: "1",
        title: "Position Paper",
        type: "position_paper",
        status: "approved",
        submitted_date: "2023-10-01",
        feedback: "Well researched",
      },
      {
        document_id: "2",
        title: "Draft Resolution on Peacekeeping",
        type: "resolution",
        status: "pending",
        submitted_date: "2023-10-15",
        feedback: null,
      },
    ]
  }
}

// Get all users
export async function getAllUsers() {
  try {
    const apiData = await apiRequest("/users/all")
    if (apiData) return apiData
    // Mock data fallback
    return {
      success: true,
      data: [],
    }
  } catch (error) {
    console.error("Get all users API error:", error)
    return {
      success: false,
      data: [],
      message: "Failed to fetch users"
    }
  }
}

export async function createCommittee(data: any) {
  try {
    const apiData = await apiRequest("/committees", {
      method: "POST",
      body: JSON.stringify(data),
    })
    if (apiData) return apiData
    return { success: false, message: "No response from server", data: null }
  } catch (error) {
    console.error("Create committee API error:", error)
    return { success: false, message: "Failed to create committee", data: null }
  }
}
