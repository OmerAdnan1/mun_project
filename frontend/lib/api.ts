// API service for the MUN Management System
// This file contains functions to interact with the backend API
// For demo purposes, most functions will return mock data when the API is not available

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
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

// ... Add other interfaces as needed

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
      (config: AxiosRequestConfig) => {
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
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await this.api.post('/users/login', { email, password });
    return response.data;
  }

  async register(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.api.post('/users/register', userData);
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
    const response = await this.api.get(`/committees/${id}`);
    return response.data;
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

  // Score APIs
  async getScores(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/scores');
    return response.data;
  }

  async addScore(data: any): Promise<ApiResponse<any>> {
    const response = await this.api.post('/scores', data);
    return response.data;
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
  async getDelegateAssignments(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/delegate-assignments');
    return response.data;
  }

  async assignDelegate(data: any): Promise<ApiResponse<any>> {
    const response = await this.api.post('/delegate-assignments', data);
    return response.data;
  }

  // Country APIs
  async getCountries(): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/countries');
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
    // For demo purposes, we'll simulate API requests without actually making them
    // This prevents errors when running in development without a backend
    console.log(`[Mock API] Request to ${endpoint}`)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Instead of making a real API request, we'll throw an error to trigger the mock data fallback
    throw new Error("Using mock data for demonstration")

    // In a real app, you would uncomment the following code:
    /*
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data
    */
  } catch (error) {
    // In development, we'll silently use mock data instead of throwing errors
    console.log(`[Mock API] Using mock data for ${endpoint}`)
    return null // Return null to signal that the API request "failed" and we should use mock data
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
export async function updateDelegateInfo(delegateId: string, data: any) {
  try {
    const apiData = await apiRequest(`/delegates/${delegateId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })

    if (apiData) return apiData

    // Mock data fallback
    return {
      success: true,
      data: {
        delegate_id: delegateId,
        ...data,
      },
    }
  } catch (error) {
    console.error("Update delegate info API error:", error)
    // For demo, return mock data
    return {
      success: true,
      data: {
        delegate_id: delegateId,
        ...data,
      },
    }
  }
}

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

// Chair APIs
export async function updateChairInfo(chairId: string, data: any) {
  try {
    const apiData = await apiRequest(`/chairs/${chairId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })

    if (apiData) return apiData

    // Mock data fallback
    return {
      success: true,
      data: {
        chair_id: chairId,
        ...data,
      },
    }
  } catch (error) {
    console.error("Update chair info API error:", error)
    // For demo, return mock data
    return {
      success: true,
      data: {
        chair_id: chairId,
        ...data,
      },
    }
  }
}

// Committee APIs
export async function getCommittees() {
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
    const apiData = await apiRequest("/committees?featured=true")
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
    if (apiData) return apiData

    // Mock data fallback
    return {
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
    }
  } catch (error) {
    console.log(`Get committee by ID API error for ID ${committeeId}, using mock data:`, error)
    // For demo, return mock data
    return {
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
    }
  }
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
    const apiData = await apiRequest(`/delegate-assignments?delegateId=${delegateId}`)
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

// Chair APIs
export async function getChairCommittees(chairId: string) {
  try {
    const apiData = await apiRequest(`/committees?chair_id=${chairId}`)
    if (apiData) return apiData

    // Mock data fallback
    return [
      {
        committee_id: "1",
        name: "United Nations Security Council",
        topic: "Addressing Conflicts in the Middle East",
        delegate_count: 15,
        next_session: "Today, 9:00 AM",
        pending_documents: 3,
      },
      {
        committee_id: "2",
        name: "World Health Organization",
        topic: "Global Pandemic Response",
        delegate_count: 20,
        next_session: "Tomorrow, 10:00 AM",
        pending_documents: 5,
      },
    ]
  } catch (error) {
    console.error("Get chair committees API error:", error)
    // For demo, return mock data
    return [
      {
        committee_id: "1",
        name: "United Nations Security Council",
        topic: "Addressing Conflicts in the Middle East",
        delegate_count: 15,
        next_session: "Today, 9:00 AM",
        pending_documents: 3,
      },
      {
        committee_id: "2",
        name: "World Health Organization",
        topic: "Global Pandemic Response",
        delegate_count: 20,
        next_session: "Tomorrow, 10:00 AM",
        pending_documents: 5,
      },
    ]
  }
}

// Delegate Dashboard APIs
export async function getDelegateScores(delegateId: string) {
  try {
    const apiData = await apiRequest(`/scores/delegate/${delegateId}`)
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
    const apiData = await apiRequest(`/attendances/delegate/${delegateId}`)
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
    const apiData = await apiRequest(`/documents/delegate/${delegateId}`)
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
