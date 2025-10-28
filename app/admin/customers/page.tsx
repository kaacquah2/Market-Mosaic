"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, ShoppingBag, Calendar, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Customer {
  user_id: string
  email: string
  role: string
  created_at: string
  orderCount: number
  totalSpent: number
  lastOrder: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuthAndFetch()
  }, [])

  useEffect(() => {
    filterCustomers()
  }, [searchQuery, customers])

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

    // Fetch all users with their roles
    const { data: usersData } = await supabase
      .from("user_roles")
      .select("*")
      .order("created_at", { ascending: false })

    // Fetch orders to calculate customer stats
    const { data: ordersData } = await supabase
      .from("orders")
      .select("user_id, total, created_at")

    // Process customer data with order information
    const customersWithStats = await Promise.all(
      (usersData || []).map(async (userData) => {
        const userOrders = ordersData?.filter((order) => order.user_id === userData.user_id) || []
        const totalSpent = userOrders.reduce((sum, order) => sum + Number.parseFloat(order.total || 0), 0)
        const lastOrder = userOrders.length > 0 
          ? new Date(Math.max(...userOrders.map(o => new Date(o.created_at).getTime()))).toISOString()
          : null

        // Get user email from auth
        const { data: authUser } = await supabase.auth.admin.getUserById(userData.user_id)
        
        return {
          user_id: userData.user_id,
          email: authUser?.user?.email || "Unknown",
          role: userData.role,
          created_at: userData.created_at,
          orderCount: userOrders.length,
          totalSpent,
          lastOrder: lastOrder || userData.created_at,
        }
      })
    )

    setCustomers(customersWithStats)
    setFilteredCustomers(customersWithStats)
    setLoading(false)
  }

  const filterCustomers = () => {
    if (!searchQuery) {
      setFilteredCustomers(customers)
      return
    }

    const filtered = customers.filter((customer) =>
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.user_id.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setFilteredCustomers(filtered)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <AdminHeader userEmail={user?.email} />
          <main className="p-6">
            <p className="text-muted-foreground">Loading customers...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground">Manage your customer base</p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Buyers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {customers.filter((c) => c.orderCount > 0).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle>Search Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email or user ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Customers Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Customers ({filteredCustomers.length})</CardTitle>
              <CardDescription>Complete list of registered users</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCustomers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Customer</th>
                        <th className="text-left py-3 px-4 font-medium">Role</th>
                        <th className="text-left py-3 px-4 font-medium">Orders</th>
                        <th className="text-left py-3 px-4 font-medium">Total Spent</th>
                        <th className="text-left py-3 px-4 font-medium">Last Order</th>
                        <th className="text-left py-3 px-4 font-medium">Joined</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.user_id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                  {customer.email.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium">{customer.email}</p>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {customer.user_id.slice(0, 8)}...
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={customer.role === "admin" ? "default" : "secondary"}>
                              {customer.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{customer.orderCount}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold">
                            ${customer.totalSpent.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {customer.lastOrder 
                              ? new Date(customer.lastOrder).toLocaleDateString()
                              : "Never"}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {new Date(customer.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <ShoppingBag className="mr-2 h-4 w-4" />
                                  View Orders
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No customers found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

