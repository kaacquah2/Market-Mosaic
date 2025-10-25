"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthAndFetchProducts()
  }, [])

  const checkAuthAndFetchProducts = async () => {
    const supabase = createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    // Check if user is admin using database role
    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (!userRole || userRole.role !== 'admin') {
      router.push("/")
      return
    }

    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget as HTMLImageElement;
    if (target.src !== "/placeholder.svg") {
      target.src = "/placeholder.svg";
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-bold">
            Curated Admin
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm hover:text-muted-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/products" className="text-sm font-semibold">
              Products
            </Link>
            <button onClick={handleLogout} className="text-sm hover:text-muted-foreground transition-colors">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-serif font-bold">Products</h1>
          <Link href="/admin/products/new">
            <Button>Add Product</Button>
          </Link>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <Link key={product.id} href={`/admin/products/${product.id}`}>
                <div className="bg-muted rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-square bg-muted-foreground/10 flex items-center justify-center">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif font-bold mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{product.category}</p>
                    <p className="font-semibold">${Number.parseFloat(product.price).toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No products yet</p>
            <Link href="/admin/products/new">
              <Button>Create First Product</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
