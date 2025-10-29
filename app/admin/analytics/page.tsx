"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight
} from "lucide-react"

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

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
    await fetchAnalytics()
  }

  const fetchAnalytics = async () => {
    const supabase = createClient()

    // Fetch orders
    const { data: orders } = await supabase.from("orders").select("*")
    const { data: products } = await supabase.from("products").select("*")
    const { data: users } = await supabase.from("user_roles").select("*")
    const { data: orderItems } = await supabase.from("order_items").select("*")

    // Calculate time periods
    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const previous30Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    // Filter orders by time period
    const ordersLast7Days = orders?.filter((o) => new Date(o.created_at) >= last7Days) || []
    const ordersLast30Days = orders?.filter((o) => new Date(o.created_at) >= last30Days) || []
    const ordersPrevious30Days = orders?.filter(
      (o) => new Date(o.created_at) >= previous30Days && new Date(o.created_at) < last30Days
    ) || []

    // Calculate revenue
    const revenueLast30Days = ordersLast30Days.reduce((sum, o) => sum + parseFloat(o.total || 0), 0)
    const revenuePrevious30Days = ordersPrevious30Days.reduce((sum, o) => sum + parseFloat(o.total || 0), 0)
    const revenueChange = revenuePrevious30Days > 0 
      ? ((revenueLast30Days - revenuePrevious30Days) / revenuePrevious30Days) * 100
      : 0

    // Calculate average order value
    const avgOrderValue = ordersLast30Days.length > 0
      ? revenueLast30Days / ordersLast30Days.length
      : 0

    // Calculate conversion rate (simplified)
    const conversionRate = products && products.length > 0
      ? ((ordersLast30Days.length / (products.length * 50)) * 100)
      : 0

    // Top selling products
    const productSales = new Map<string, { name: string; sales: number; revenue: number }>()
    
    for (const item of orderItems || []) {
      const product = products?.find((p) => p.id === item.product_id)
      if (product) {
        const current = productSales.get(product.id) || { name: product.name, sales: 0, revenue: 0 }
        current.sales += item.quantity
        current.revenue += item.price * item.quantity
        productSales.set(product.id, current)
      }
    }

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Category performance
    const categoryStats = new Map<string, { revenue: number; orders: number }>()
    
    for (const item of orderItems || []) {
      const product = products?.find((p) => p.id === item.product_id)
      if (product) {
        const category = product.category || "Uncategorized"
        const current = categoryStats.get(category) || { revenue: 0, orders: 0 }
        current.revenue += item.price * item.quantity
        current.orders += 1
        categoryStats.set(category, current)
      }
    }

    const topCategories = Array.from(categoryStats.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    setAnalytics({
      totalRevenue: revenueLast30Days,
      revenueChange,
      totalOrders: ordersLast30Days.length,
      ordersChange: ordersPrevious30Days.length > 0
        ? ((ordersLast30Days.length - ordersPrevious30Days.length) / ordersPrevious30Days.length) * 100
        : 0,
      avgOrderValue,
      conversionRate,
      totalCustomers: users?.length || 0,
      ordersLast7Days: ordersLast7Days.length,
      topProducts,
      topCategories,
    })

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <AdminHeader userEmail={user?.email} />
          <main className="p-6">
            <p className="text-muted-foreground">Loading analytics...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Insights and performance metrics</p>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue (30 days)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {analytics.revenueChange >= 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">+{analytics.revenueChange.toFixed(1)}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                      <span className="text-red-500">{analytics.revenueChange.toFixed(1)}%</span>
                    </>
                  )}
                  <span>from last period</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders (30 days)</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalOrders}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {analytics.ordersChange >= 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">+{analytics.ordersChange.toFixed(1)}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                      <span className="text-red-500">{analytics.ordersChange.toFixed(1)}%</span>
                    </>
                  )}
                  <span>from last period</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analytics.avgOrderValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">Per order</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground mt-1">Of visitors</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Products & Categories */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>By revenue (all time)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topProducts.map((product: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sales} sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">${product.revenue.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  {analytics.topProducts.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">No sales data yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
                <CardDescription>By revenue (all time)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topCategories.map((category: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{category.name}</p>
                          <p className="text-xs text-muted-foreground">{category.orders} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">${category.revenue.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  {analytics.topCategories.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">No sales data yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Orders Last 7 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.ordersLast7Days}</div>
                <p className="text-sm text-muted-foreground mt-2">Recent activity</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.totalCustomers}</div>
                <p className="text-sm text-muted-foreground mt-2">Registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue per Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${analytics.totalCustomers > 0 
                    ? (analytics.totalRevenue / analytics.totalCustomers).toFixed(2) 
                    : "0.00"}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Average lifetime value</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

