"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Mail, Phone, Save, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { apiService } from "@/lib/api"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    // Delegate specific fields
    experience_level: "",
    emergency_contact: "",
    // Chair specific fields
    chairing_experience: "",
    evaluation_metrics: "",
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }

    // If user is authenticated, fetch the complete profile data from the API
    if (user) {
      const fetchProfileData = async () => {
        try {
          setLoading(true)
          let response
          
          if (user.role === "delegate") {
            response = await apiService.getDelegateById(user.id)
          } else if (user.role === "chair") {
            response = await apiService.getChairById(user.id)
          } else {
            response = await apiService.getAdminById(user.id)
          }

          if (response.success) {
            setProfileData({
              name: response.data.name || "",
              email: response.data.email || "",
              phone: response.data.phone || "",
              bio: response.data.bio || "",
              experience_level: response.data.experience_level || "",
              emergency_contact: response.data.emergency_contact || "",
              chairing_experience: response.data.chairing_experience || "",
              evaluation_metrics: response.data.evaluation_metrics || "",
            })
          }
        } catch (error) {
          console.error("Failed to fetch profile data:", error)
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load profile data. Please try again later.",
          })
        } finally {
          setLoading(false)
        }
      }

      fetchProfileData()
    }
  }, [isLoading, isAuthenticated, router, user, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return // Early return if user is null

    setLoading(true)

    try {
      // Always update general user info
      await apiService.updateUser(user.id, {
        full_name: profileData.name,
        phone: profileData.phone,
        bio: profileData.bio,
      })

      let response
      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        bio: profileData.bio,
      }

      if (user.role === "delegate") {
        response = await apiService.updateDelegateInfo(user.id, {
          ...updateData,
          experience_level: profileData.experience_level,
          emergency_contact: profileData.emergency_contact,
        })
      } else if (user.role === "chair") {
        response = await apiService.updateChairInfo(user.id, {
          ...updateData,
          chairing_experience: profileData.chairing_experience,
          evaluation_metrics: profileData.evaluation_metrics,
        })
      } else {
        response = await apiService.updateAdminInfo(user.id, updateData)
      }

      if (!response || response.success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
      } else {
        throw new Error(response.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Skeleton className="h-12 w-1/3" />
          <div className="mt-8">
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null // Will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Profile</h1>
        <p className="mt-2 text-gray-600">Manage your personal information and preferences</p>

        <Alert className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>[Sample Data] This is a demonstration profile page.</AlertDescription>
        </Alert>

        <div className="mt-8">
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              {user.role === "delegate" && <TabsTrigger value="delegate">Delegate Info</TabsTrigger>}
              {user.role === "chair" && <TabsTrigger value="chair">Chair Info</TabsTrigger>}
              {user.role === "admin" && <TabsTrigger value="admin">Admin Settings</TabsTrigger>}
            </TabsList>

            <TabsContent value="general" className="mt-6">
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>General Information</CardTitle>
                    <CardDescription>Update your basic profile information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                        <User className="h-10 w-10 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{profileData.name}</h3>
                        <p className="text-sm text-gray-500">{profileData.email}</p>
                        <Badge className="mt-1">{user.role}</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleChange}
                          placeholder="Your email address"
                          className="pl-9"
                          disabled
                        />
                      </div>
                      <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={handleChange}
                          placeholder="Your phone number"
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                      <Save className="mr-2 h-4 w-4" />
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your password and security preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    const form = e.target as HTMLFormElement
                    const currentPassword = (form.elements.namedItem('current_password') as HTMLInputElement).value
                    const newPassword = (form.elements.namedItem('new_password') as HTMLInputElement).value
                    const confirmPassword = (form.elements.namedItem('confirm_password') as HTMLInputElement).value

                    if (!currentPassword || !newPassword || !confirmPassword) {
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Please fill in all password fields.",
                      })
                      return
                    }

                    if (newPassword !== confirmPassword) {
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: "New passwords do not match.",
                      })
                      return
                    }

                    if (newPassword.length < 8) {
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: "New password must be at least 8 characters long.",
                      })
                      return
                    }

                    setLoading(true)
                    try {
                      const response = await apiService.updateUser(user.id, {
                        password: newPassword
                      })

                      if (response.success) {
                        toast({
                          title: "Success",
                          description: "Password updated successfully.",
                        })
                        form.reset()
                      } else {
                        throw new Error(response.message || "Failed to update password")
                      }
                    } catch (error) {
                      console.error("Password update error:", error)
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to update password. Please check your current password and try again.",
                      })
                    } finally {
                      setLoading(false)
                    }
                  }}>
                    <div className="space-y-2">
                      <Label htmlFor="current_password">Current Password</Label>
                      <Input 
                        id="current_password" 
                        name="current_password"
                        type="password" 
                        placeholder="Enter your current password" 
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new_password">New Password</Label>
                      <Input 
                        id="new_password" 
                        name="new_password"
                        type="password" 
                        placeholder="Enter a new password" 
                        required
                        minLength={8}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Confirm New Password</Label>
                      <Input 
                        id="confirm_password" 
                        name="confirm_password"
                        type="password" 
                        placeholder="Confirm your new password" 
                        required
                        minLength={8}
                      />
                    </div>

                    <div className="mt-6">
                      <Button type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Change Password"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {user.role === "delegate" && (
              <TabsContent value="delegate" className="mt-6">
                <Card>
                  <form onSubmit={handleSubmit}>
                    <CardHeader>
                      <CardTitle>Delegate Information</CardTitle>
                      <CardDescription>Update your delegate-specific information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="experience_level">Experience Level</Label>
                        <Input
                          id="experience_level"
                          name="experience_level"
                          value={profileData.experience_level}
                          onChange={handleChange}
                          placeholder="Your MUN experience level"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergency_contact">Emergency Contact</Label>
                        <Textarea
                          id="emergency_contact"
                          name="emergency_contact"
                          value={profileData.emergency_contact}
                          onChange={handleChange}
                          placeholder="Name, relationship, and phone number"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button type="submit" disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            )}

            {user.role === "chair" && (
              <TabsContent value="chair" className="mt-6">
                <Card>
                  <form onSubmit={handleSubmit}>
                    <CardHeader>
                      <CardTitle>Chair Information</CardTitle>
                      <CardDescription>Update your chair-specific information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="chairing_experience">Chairing Experience</Label>
                        <Textarea
                          id="chairing_experience"
                          name="chairing_experience"
                          value={profileData.chairing_experience}
                          onChange={handleChange}
                          placeholder="Describe your previous experience chairing MUN committees"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="evaluation_metrics">Evaluation Approach</Label>
                        <Textarea
                          id="evaluation_metrics"
                          name="evaluation_metrics"
                          value={profileData.evaluation_metrics}
                          onChange={handleChange}
                          placeholder="Describe your approach to evaluating delegates"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button type="submit" disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            )}

            {user.role === "admin" && (
              <TabsContent value="admin" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Admin Settings</CardTitle>
                    <CardDescription>Manage your admin preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Admin-specific settings are managed through the admin dashboard.
                    </p>
                    <div className="mt-4">
                      <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
                        Go to Admin Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}