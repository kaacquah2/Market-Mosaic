"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import { Heart, Filter, Star, Search } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cartService } from "@/lib/cart-service"
import { wishlistService } from "@/lib/wishlist-service"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  stock_quantity?: number
  average_rating?: number
  review_count?: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchProducts()
    fetchWishlistStatus()
  }, [])

  const fetchWishlistStatus = async () => {
    try {
      const wishlistItems = await wishlistService.getWishlistItems()
      const wishlistIds = wishlistItems.map(item => item.product_id)
      setWishlist(wishlistIds)
    } catch (error) {
      console.error("Error fetching wishlist status:", error)
    }
  }

  const fetchProducts = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching products:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        setError(`Failed to fetch products: ${error.message}`)
        return
      }

      setProducts(data || [])
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data?.map(p => p.category).filter(Boolean) || []))
      setCategories(uniqueCategories)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("Error fetching products:", errorMessage)
      setError(`Failed to connect to database: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = !selectedCategory || product.category === selectedCategory
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

    return matchesSearch && matchesCategory && matchesPrice
  })

  const toggleWishlist = async (id: string) => {
    try {
      if (wishlist.includes(id)) {
        const success = await wishlistService.removeFromWishlistByProductId(id)
        if (success) {
          setWishlist(prev => prev.filter(item => item !== id))
        }
      } else {
        const success = await wishlistService.addToWishlist(id)
        if (success) {
          setWishlist(prev => [...prev, id])
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
    }
  }

  const addToCart = async (product: Product) => {
    try {
      const success = await cartService.addToCart(product.id, 1)
      if (success) {
        // You could add a toast notification here
        console.log("Added to cart successfully")
      } else {
        alert("Failed to add item to cart. Please try again.")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("An error occurred. Please try again.")
    }
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget as HTMLImageElement;
    if (target.src !== "/placeholder.svg") {
      target.src = "/placeholder.svg";
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Products</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => {
              setError(null)
              setLoading(true)
              fetchProducts()
            }}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">
            All <span className="text-primary">Products</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            {filteredProducts.length} products found • Discover everything you need to express your vibe
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>
            <Link href="/search">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Advanced Search
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Category:</span>
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Price Range */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold">Price Range:</span>
              <input
                type="range"
                min="0"
                max="300"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                className="flex-1 max-w-xs"
              />
              <span className="text-sm font-semibold">${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/products/${product.id}`}>
                  <div className="bg-muted rounded-xl overflow-hidden mb-4 aspect-square relative">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleWishlist(product.id)
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                        }`} 
                      />
                    </button>

                    {/* Stock Badge */}
                    {product.stock_quantity === 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        Out of Stock
                      </div>
                    )}
                  </div>
                </Link>
                <div className="space-y-2">
                  <h3 className="font-bold text-base line-clamp-2">{product.name}</h3>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">{product.category}</p>
                  
                  {/* Rating */}
                  {product.average_rating && product.average_rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">
                        {product.average_rating.toFixed(1)} ({product.review_count || 0})
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product)}
                      disabled={product.stock_quantity === 0}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No products found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}