"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, AlertTriangle, CheckCircle, Package, TrendingDown } from "lucide-react"
import Link from "next/link"

interface ProductInventory {
  id: string
  name: string
  sku: string
  category: string
  stock_quantity: number
  image_url: string
}

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductInventory[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductInventory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuthAndFetch()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [searchQuery, stockFilter, products])

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

    const { data: productsData } = await supabase
      .from("products")
      .select("id, name, sku, category, stock_quantity, image_url")
      .order("stock_quantity", { ascending: true })

    setProducts(productsData || [])
    setFilteredProducts(productsData || [])
    setLoading(false)
  }

  const filterProducts = () => {
    let filtered = [...products]

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (stockFilter === "low") {
      filtered = filtered.filter((p) => p.stock_quantity > 0 && p.stock_quantity < 10)
    } else if (stockFilter === "out") {
      filtered = filtered.filter((p) => p.stock_quantity === 0)
    }

    setFilteredProducts(filtered)
  }

  const updateStock = async (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return

    const supabase = createClient()
    const { error } = await supabase
      .from("products")
      .update({ stock_quantity: newQuantity })
      .eq("id", productId)

    if (!error) {
      setProducts(products.map((p) => 
        p.id === productId ? { ...p, stock_quantity: newQuantity } : p
      ))
    }
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: AlertTriangle }
    if (quantity < 10) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", icon: TrendingDown }
    return { label: "In Stock", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: CheckCircle }
  }

  const lowStockCount = products.filter((p) => p.stock_quantity > 0 && p.stock_quantity < 10).length
  const outOfStockCount = products.filter((p) => p.stock_quantity === 0).length
  const inStockCount = products.filter((p) => p.stock_quantity >= 10).length

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <AdminHeader userEmail={user?.email} />
          <main className="p-6">
            <p className="text-muted-foreground">Loading inventory...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-muted-foreground">Monitor and manage product stock levels</p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inStockCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <TrendingDown className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{lowStockCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by product name, SKU, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={stockFilter === "all" ? "default" : "outline"}
                    onClick={() => setStockFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={stockFilter === "low" ? "default" : "outline"}
                    onClick={() => setStockFilter("low")}
                  >
                    Low Stock
                  </Button>
                  <Button
                    variant={stockFilter === "out" ? "default" : "outline"}
                    onClick={() => setStockFilter("out")}
                  >
                    Out of Stock
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory ({filteredProducts.length})</CardTitle>
              <CardDescription>Manage stock levels for all products</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Product</th>
                        <th className="text-left py-3 px-4 font-medium">SKU</th>
                        <th className="text-left py-3 px-4 font-medium">Category</th>
                        <th className="text-left py-3 px-4 font-medium">Stock</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => {
                        const status = getStockStatus(product.stock_quantity)
                        const StatusIcon = status.icon
                        return (
                          <tr key={product.id} className="border-b hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.image_url || "/placeholder.svg"}
                                  alt={product.name}
                                  className="h-10 w-10 rounded object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg"
                                  }}
                                />
                                <span className="font-medium">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-sm text-muted-foreground">
                              {product.sku || "N/A"}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              <Badge variant="outline">{product.category}</Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Input
                                type="number"
                                value={product.stock_quantity}
                                onChange={(e) => updateStock(product.id, parseInt(e.target.value) || 0)}
                                className="w-20"
                                min="0"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                                <StatusIcon className="h-3 w-3" />
                                {status.label}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Link href={`/admin/products/${product.id}`}>
                                <Button size="sm" variant="ghost">
                                  Edit
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

