"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { apiService } from "@/lib/api"

interface User {
  id: string
  name: string
  email: string
  role: "delegate" | "chair" | "admin"
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("mun_user")
    const storedToken = localStorage.getItem("mun_token")

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("mun_user")
        localStorage.removeItem("mun_token")
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password)
      
      if (!response.success) {
        throw new Error(response.message || "Login failed")
      }

      const userData = response.data

      const user: User = {
        id: userData.user_id,
        name: userData.full_name || email.split("@")[0],
        email,
        role: userData.role as "delegate" | "chair" | "admin",
      }

      setUser(user)

      // Store in localStorage
      localStorage.setItem("mun_user", JSON.stringify(user))
      localStorage.setItem("mun_token", "dummy_token") // Replace with actual token when implemented
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("mun_user")
    localStorage.removeItem("mun_token")
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
