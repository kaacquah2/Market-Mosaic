import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { logoutAction } from "@/app/admin/actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, ShoppingCart, TrendingUp, Users, Bell } from "lucide-react"
import { UpdateStockButton } from "@/components/admin/update-stock-button"

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

  const totalRevenue = orders?.reduce((sum: number, order: any) => sum + Number.parseFloat(order.total || 0), 0) || 0
  const totalCustomers = new Set(orders?.map((o: any) => o.user_id)).size || 0
  const avgOrderValue = orders && orders.length > 0 ? totalRevenue / orders.length : 0

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
          >
            Market Mosaic Admin
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-sm font-semibold text-primary">
              Dashboard
            </Link>
            <Link href="/admin/products" className="text-sm font-semibold hover:text-primary transition-colors">
              Products
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="text-sm font-semibold hover:text-primary transition-colors">
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Products</p>
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary">{products?.length || 0}</p>
            <p className="text-xs text-muted-foreground mt-2">Active listings</p>
          </div>

          <div className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg p-6 border border-secondary/20 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <ShoppingCart className="h-5 w-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-secondary">{orders?.length || 0}</p>
            <p className="text-xs text-muted-foreground mt-2">All time</p>
          </div>

          <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg p-6 border border-accent/20 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-accent">${totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-2">Lifetime earnings</p>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Customers</p>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary">{totalCustomers}</p>
            <p className="text-xs text-muted-foreground mt-2">Unique buyers</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-card rounded-lg p-6 border border-border mb-12">
          <h2 className="text-lg font-bold mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Order Value</p>
              <p className="text-2xl font-bold text-primary">${avgOrderValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-accent">
                {products && products.length > 0
                  ? (((orders?.length || 0) / (products.length * 10)) * 100).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Inventory Status</p>
              <p className="text-2xl font-bold text-secondary">{products?.length || 0} SKUs</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/products/new">
              <Button className="bg-primary hover:bg-primary/90">Add New Product</Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="outline" className="bg-transparent">
                Manage Products
              </Button>
            </Link>
            <UpdateStockButton />
            <Link href="/admin/campaigns">
              <Button variant="outline" className="bg-transparent">
                <Bell className="h-4 w-4 mr-2" />
                Manage Campaigns
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline" className="bg-transparent">
                View Support
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <Link href="/admin/orders">
              <Button variant="ghost" className="text-primary">
                View All →
              </Button>
            </Link>
          </div>
          {orders && orders.length > 0 ? (
            <div className="overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold">Total</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Tracking</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order: any) => (
                    <tr key={order.id} className="border-b border-border hover:bg-primary/5 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                      <td className="py-3 px-4 text-muted-foreground">{order.customer_email || "Guest"}</td>
                      <td className="py-3 px-4 font-semibold text-primary">
                        ${Number.parseFloat(order.total || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-accent/20 text-accent px-2 py-1 rounded text-xs font-semibold">
                          {order.status || "pending"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {order.tracking_number ? (
                          <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline text-xs font-mono">
                            {order.tracking_number}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground text-xs">No tracking</span>
                        )}
                      </td>
                      <td className="py-3 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 border border-border rounded-lg bg-card">
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
