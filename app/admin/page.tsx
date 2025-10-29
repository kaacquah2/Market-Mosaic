import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Users, Bell, Package, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { UpdateStockButton } from "@/components/admin/update-stock-button"

// Force dynamic rendering - always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin using database role
  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single()

  if (!userRole || userRole.role !== 'admin') {
    redirect("/")
  }

  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

  const { data: allUsers } = await supabase.from("user_roles").select("*")

  const totalRevenue = orders?.reduce((sum: number, order: any) => sum + Number.parseFloat(order.total || 0), 0) || 0
  const totalCustomers = new Set(orders?.map((o: any) => o.user_id)).size || 0
  const avgOrderValue = orders && orders.length > 0 ? totalRevenue / orders.length : 0
  const lowStockProducts = products?.filter((p: any) => (p.stock_quantity || 0) < 10).length || 0
  const activeProducts = products?.filter((p: any) => p.is_active).length || 0

  // Calculate previous period stats (last 30 days vs previous 30 days)
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
  
  const recentOrders = orders?.filter((o: any) => new Date(o.created_at) >= thirtyDaysAgo) || []
  const previousOrders = orders?.filter((o: any) => new Date(o.created_at) >= sixtyDaysAgo && new Date(o.created_at) < thirtyDaysAgo) || []
  
  const recentRevenue = recentOrders.reduce((sum: number, order: any) => sum + Number.parseFloat(order.total || 0), 0)
  const previousRevenue = previousOrders.reduce((sum: number, order: any) => sum + Number.parseFloat(order.total || 0), 0)
  const revenueChange = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <div className="flex-1 lg:ml-64">
        <AdminHeader userEmail={user.email} />
        
        <main className="p-4 sm:p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email?.split("@")[0]}</p>
          </div>

          {/* Platform Statistics Section */}
          <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10">
            <CardHeader>
              <CardTitle className="text-2xl">Platform Statistics</CardTitle>
              <CardDescription>Real-time metrics from our marketplace</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-background/80 rounded-lg p-6 border border-border/50 text-center">
                  <p className="text-4xl font-bold text-primary mb-2">
                    {activeProducts}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">Active Products</p>
                  <p className="text-xs text-muted-foreground mt-1">Available for purchase</p>
                </div>
                <div className="bg-background/80 rounded-lg p-6 border border-border/50 text-center">
                  <p className="text-4xl font-bold text-accent mb-2">
                    {orders?.length || 0}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-xs text-muted-foreground mt-1">Completed transactions</p>
                </div>
                <div className="bg-background/80 rounded-lg p-6 border border-border/50 text-center">
                  <p className="text-4xl font-bold text-secondary mb-2">
                    ${totalRevenue.toFixed(0)}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-xs text-muted-foreground mt-1">Platform earnings</p>
                </div>
                <div className="bg-background/80 rounded-lg p-6 border border-border/50 text-center">
                  <p className="text-4xl font-bold text-primary mb-2">
                    ${avgOrderValue.toFixed(0)}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                  <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {revenueChange >= 0 ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">+{revenueChange.toFixed(1)}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                      <span className="text-red-500">{revenueChange.toFixed(1)}%</span>
                    </>
                  )}
                  <span>from last month</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +{recentOrders.length} this month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allUsers?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalCustomers} have ordered
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {lowStockProducts > 0 && (
                    <span className="text-orange-500">{lowStockProducts} low stock</span>
                  )}
                  {lowStockProducts === 0 && "All in stock"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Key metrics for your business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                    <p className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                    <p className="text-2xl font-bold">
                      {products && products.length > 0
                        ? (((orders?.length || 0) / (products.length * 10)) * 100).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Active SKUs</p>
                    <p className="text-2xl font-bold">{products?.length || 0}</p>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Orders This Month</span>
                    <span className="font-medium">{recentOrders.length}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${Math.min((recentOrders.length / (orders?.length || 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {recentOrders.length} of {orders?.length || 0} total orders
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/admin/products/new" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Package className="mr-2 h-4 w-4" />
                    Add New Product
                  </Button>
                </Link>
                <Link href="/admin/orders-list" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    View All Orders
                  </Button>
                </Link>
                <Link href="/admin/campaigns" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Bell className="mr-2 h-4 w-4" />
                    Create Campaign
                  </Button>
                </Link>
                <div>
                  <UpdateStockButton />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </div>
              <Link href="/admin/orders-list">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">{order.customer_email || "Guest"}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-bold">${Number.parseFloat(order.total || 0).toFixed(2)}</p>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
                          {order.status || "pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">No orders yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          {lowStockProducts > 0 && (
            <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900">
              <CardHeader>
                <CardTitle className="text-orange-600 dark:text-orange-400 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Low Stock Alert
                </CardTitle>
                <CardDescription>Products running low on inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  <span className="font-bold text-orange-600 dark:text-orange-400">{lowStockProducts}</span> products have less than 10 units in stock
                </p>
                <Link href="/admin/inventory">
                  <Button variant="outline" size="sm">
                    View Inventory
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
