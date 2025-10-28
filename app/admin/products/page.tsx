"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuthAndFetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [searchQuery, products])

  const checkAuthAndFetchProducts = async () => {
    const supabase = createClient()
    
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    // Check if user is admin using database role
    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", currentUser.id)
      .single()

    if (!userRole || userRole.role !== 'admin') {
      router.push("/")
      return
    }

    setUser(currentUser)

    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false })
    setProducts(data || [])
    setFilteredProducts(data || [])
    setLoading(false)
  }

  const filterProducts = () => {
    if (!searchQuery) {
      setFilteredProducts(products)
      return
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setFilteredProducts(filtered)
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget as HTMLImageElement;
    if (target.src !== "/placeholder.svg") {
      target.src = "/placeholder.svg";
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <AdminHeader userEmail={user?.email} />
          <main className="p-6">
            <p className="text-muted-foreground">Loading products...</p>
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
              <h1 className="text-3xl font-bold tracking-tight">Products</h1>
              <p className="text-muted-foreground">Manage your product catalog</p>
            </div>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name, category, or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          {filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product: any) => (
                <Link key={product.id} href={`/admin/products/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1 line-clamp-1">{product.name}</h3>
                      <Badge variant="outline" className="mb-2">
                        {product.category}
                      </Badge>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold">${Number.parseFloat(product.price).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {product.stock_quantity || 0}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "No products found matching your search" : "No products yet"}
                </p>
                <Link href="/admin/products/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Product
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
