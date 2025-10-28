"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Layers, Package, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface CategoryStats {
  category: string
  productCount: number
  totalRevenue: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryStats[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")

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
    await fetchCategories()
  }

  const fetchCategories = async () => {
    const supabase = createClient()
    
    // Fetch all products with their categories
    const { data: products } = await supabase
      .from("products")
      .select("category, price, id")

    // Fetch all orders to calculate revenue
    const { data: orders } = await supabase
      .from("orders")
      .select("id")

    const { data: orderItems } = await supabase
      .from("order_items")
      .select("product_id, price, quantity")

    // Group products by category
    const categoryMap = new Map<string, CategoryStats>()

    products?.forEach((product) => {
      const category = product.category || "Uncategorized"
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          category,
          productCount: 0,
          totalRevenue: 0,
        })
      }

      const stats = categoryMap.get(category)!
      stats.productCount++

      // Calculate revenue for this product
      const productRevenue = orderItems
        ?.filter((item) => item.product_id === product.id)
        .reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0

      stats.totalRevenue += productRevenue
    })

    setCategories(Array.from(categoryMap.values()).sort((a, b) => b.productCount - a.productCount))
    setLoading(false)
  }

  const createCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Please enter a category name")
      return
    }

    // For now, we'll just add it to the list
    // In a real app, you might want to create a categories table
    const newCategory: CategoryStats = {
      category: newCategoryName,
      productCount: 0,
      totalRevenue: 0,
    }

    setCategories([...categories, newCategory])
    setNewCategoryName("")
    setIsCreateDialogOpen(false)
    alert("Category created! You can now assign products to this category.")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <AdminHeader userEmail={user?.email} />
          <main className="p-6">
            <p className="text-muted-foreground">Loading categories...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
              <p className="text-muted-foreground">Organize your product catalog</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                  <DialogDescription>
                    Add a new product category to organize your inventory
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      placeholder="e.g., Electronics, Clothing, Home & Garden"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createCategory}>Create Category</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                <Layers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categories.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {categories.reduce((sum, c) => sum + c.productCount, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${categories.reduce((sum, c) => sum + c.totalRevenue, 0).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categories Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.category} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Products</span>
                    <Badge variant="secondary">{category.productCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="font-semibold">${category.totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${(category.productCount / Math.max(...categories.map(c => c.productCount), 1)) * 100}%`,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {categories.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Categories Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first category to organize your products
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Category
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}

