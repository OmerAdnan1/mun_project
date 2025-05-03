"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Award, BarChart3, FileText, Globe, Settings, Users } from "lucide-react"
import { AdminUserManagement } from "@/components/admin/user-management"
import { AdminCommitteeManagement } from "@/components/admin/committee-management"
import { AdminCountryManagement } from "@/components/admin/country-management"
import { AdminAssignmentManagement } from "@/components/admin/assignment-management"

export function AdminDashboard() {
  const [showSampleDataAlert] = useState(true)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>

      {showSampleDataAlert && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>[Sample Data] Showing example admin interface.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Users</CardTitle>
            <CardDescription>Total registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">248</span>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <span className="text-green-500">+12</span> new registrations today
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Committees</CardTitle>
            <CardDescription>Active committees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="mr-2 h-5 w-5 text-purple-500" />
                <span className="text-2xl font-bold">15</span>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <span className="text-amber-500">3</span> need chair assignment
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Documents</CardTitle>
            <CardDescription>Pending review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-amber-500" />
                <span className="text-2xl font-bold">42</span>
              </div>
              <Button variant="outline" size="sm">
                Review
              </Button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <span className="text-red-500">18</span> position papers pending
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Awards</CardTitle>
            <CardDescription>Award calculation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">Ready</span>
              </div>
              <Button variant="outline" size="sm">
                Calculate
              </Button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Last updated <span className="font-medium">2 hours ago</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conference Overview</CardTitle>
          <CardDescription>Key metrics and statistics for the current conference</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold">248</div>
                <div className="text-sm text-gray-500">Delegates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">32</div>
                <div className="text-sm text-gray-500">Chairs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">15</div>
                <div className="text-sm text-gray-500">Committees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-sm text-gray-500">Capacity</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">3</div>
                <div className="text-sm text-gray-500">Days Left</div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button className="gap-2">
              <BarChart3 className="h-4 w-4" />
              View Detailed Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="committees">Committees</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <AdminUserManagement />
        </TabsContent>

        <TabsContent value="committees" className="mt-6">
          <AdminCommitteeManagement />
        </TabsContent>

        <TabsContent value="countries" className="mt-6">
          <AdminCountryManagement />
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <AdminAssignmentManagement />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Configure system-wide settings for the MUN platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Open Settings Panel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
