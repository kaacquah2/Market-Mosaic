"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp,
  ShoppingCart,
  Package,
  Users
} from "lucide-react"

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [reportData, setReportData] = useState<any>(null)

  useEffect(() => {
    checkAuthAndFetch()
  }, [])

  const checkAuthAndFetch = async () => {
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
    await generateReports()
  }

  const generateReports = async () => {
    const supabase = createClient()

    const { data: orders } = await supabase.from("orders").select("*")
    const { data: products } = await supabase.from("products").select("*")
    const { data: users } = await supabase.from("user_roles").select("*")

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    const monthlyOrders = orders?.filter((o) => new Date(o.created_at) >= startOfMonth) || []
    const yearlyOrders = orders?.filter((o) => new Date(o.created_at) >= startOfYear) || []

    const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0)
    const yearlyRevenue = yearlyOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0)

    setReportData({
      monthly: {
        orders: monthlyOrders.length,
        revenue: monthlyRevenue,
        avgOrderValue: monthlyOrders.length > 0 ? monthlyRevenue / monthlyOrders.length : 0,
      },
      yearly: {
        orders: yearlyOrders.length,
        revenue: yearlyRevenue,
        avgOrderValue: yearlyOrders.length > 0 ? yearlyRevenue / yearlyOrders.length : 0,
      },
      allTime: {
        orders: orders?.length || 0,
        products: products?.length || 0,
        customers: users?.length || 0,
        revenue: orders?.reduce((sum, o) => sum + parseFloat(o.total || 0), 0) || 0,
      },
    })

    setLoading(false)
  }

  const exportReport = (reportType: string) => {
    alert(`Exporting ${reportType} report... (Feature coming soon)`)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <AdminHeader userEmail={user?.email} />
          <main className="p-6">
            <p className="text-muted-foreground">Loading reports...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">Generate and export business reports</p>
          </div>

          {/* Monthly Report */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Monthly Report</CardTitle>
                  <CardDescription>Performance for the current month</CardDescription>
                </div>
                <Button onClick={() => exportReport("Monthly")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Orders</p>
                    <p className="text-2xl font-bold">{reportData.monthly.orders}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">${reportData.monthly.revenue.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Order</p>
                    <p className="text-2xl font-bold">${reportData.monthly.avgOrderValue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Yearly Report */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Yearly Report</CardTitle>
                  <CardDescription>Performance for the current year</CardDescription>
                </div>
                <Button onClick={() => exportReport("Yearly")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Orders</p>
                    <p className="text-2xl font-bold">{reportData.yearly.orders}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">${reportData.yearly.revenue.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Order</p>
                    <p className="text-2xl font-bold">${reportData.yearly.avgOrderValue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All Time Report */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Time Report</CardTitle>
                  <CardDescription>Overall business performance</CardDescription>
                </div>
                <Button onClick={() => exportReport("All Time")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{reportData.allTime.orders}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">${reportData.allTime.revenue.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Package className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Products</p>
                    <p className="text-2xl font-bold">{reportData.allTime.products}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <Users className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customers</p>
                    <p className="text-2xl font-bold">{reportData.allTime.customers}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Reports */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Sales Report</CardTitle>
                <CardDescription>Detailed sales analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => exportReport("Sales")}>
                  <Download className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Inventory Report</CardTitle>
                <CardDescription>Stock levels and movements</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => exportReport("Inventory")}>
                  <Download className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Customer Report</CardTitle>
                <CardDescription>Customer behavior analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => exportReport("Customer")}>
                  <Download className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Product Performance</CardTitle>
                <CardDescription>Best and worst sellers</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => exportReport("Product Performance")}>
                  <Download className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Category Report</CardTitle>
                <CardDescription>Category-wise analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => exportReport("Category")}>
                  <Download className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Tax Report</CardTitle>
                <CardDescription>Tax calculations and summaries</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={() => exportReport("Tax")}>
                  <Download className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

