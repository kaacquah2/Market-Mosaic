"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Inbox, CheckCircle, XCircle } from "lucide-react"

export default function ReviewsPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const supabase = createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (!currentUser) {
      window.location.href = "/auth/login"
      return
    }

    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", currentUser.id)
      .single()

    if (!userRole || userRole.role !== "admin") {
      window.location.href = "/"
      return
    }

    setUser(currentUser)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <AdminHeader userEmail={user?.email} />
          <main className="p-6">
            <p className="text-muted-foreground">Loading reviews...</p>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <div className="flex-1 ml-64">
        <AdminHeader userEmail={user?.email} />
        
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
            <p className="text-muted-foreground">Manage customer reviews and ratings</p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Inbox className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.0</div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <Card>
            <CardHeader>
              <CardTitle>All Reviews</CardTitle>
              <CardDescription>Moderate customer feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                <p className="text-muted-foreground">
                  Reviews from customers will appear here
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
            <CardHeader>
              <CardTitle className="text-blue-600 dark:text-blue-400">Reviews Feature</CardTitle>
              <CardDescription>
                Enable product reviews to gather customer feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                To enable the review system, you'll need to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Create a reviews table in your database</li>
                <li>Add review functionality to product pages</li>
                <li>Set up moderation workflows</li>
                <li>Configure email notifications</li>
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

