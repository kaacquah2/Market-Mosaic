"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Navigation } from "@/components/navigation"
import { Search, Filter, Star, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { cartService } from "@/lib/cart-service"
import { wishlistService } from "@/lib/wishlist-service"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  brand?: string
  in_stock: boolean
  average_rating?: number
  review_count?: number
}

interface SearchFilters {
  query: string
  category: string
  minPrice: number
  maxPrice: number
  inStock: boolean
  sortBy: string
  brands: string[]
}

const SORT_OPTIONS = [
  { value: "name_asc", label: "Name A-Z" },
  { value: "name_desc", label: "Name Z-A" },
  { value: "price_asc", label: "Price Low to High" },
  { value: "price_desc", label: "Price High to Low" },
  { value: "rating_desc", label: "Highest Rated" },
  { value: "newest", label: "Newest First" }
]

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports & Outdoors",
  "Books",
  "Health & Beauty",
  "Toys & Games",
  "Automotive",
  "Food & Beverages",
  "Baby Products"
]

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    minPrice: 0,
    maxPrice: 1000,
    inStock: false,
    sortBy: "name_asc",
    brands: []
  })
  const [availableBrands, setAvailableBrands] = useState<string[]>([])
  const [cartItems, setCartItems] = useState<Set<string>>(new Set())
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set())

  // Fetch cart and wishlist on component mount
  useEffect(() => {
    fetchCartAndWishlist()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true)

      // Apply search query
      if (filters.query && filters.query.trim()) {
        // Use case-insensitive search on name and description fields
        const searchQuery = filters.query.trim()
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        
        console.log("Searching for:", searchQuery)
      }

      // Apply category filter
      if (filters.category) {
        query = query.eq("category", filters.category)
      }

      // Apply price range
      if (filters.minPrice > 0) {
        query = query.gte("price", filters.minPrice)
      }
      if (filters.maxPrice < 1000) {
        query = query.lte("price", filters.maxPrice)
      }

      // Apply stock filter (check if product has stock)
      if (filters.inStock) {
        query = query.gt("stock_quantity", 0)
      }

      // Apply brand filter
      if (filters.brands.length > 0) {
        query = query.in("brand", filters.brands)
      }

      // Apply sorting
      switch (filters.sortBy) {
        case "name_asc":
          query = query.order("name", { ascending: true })
          break
        case "name_desc":
          query = query.order("name", { ascending: false })
          break
        case "price_asc":
          query = query.order("price", { ascending: true })
          break
        case "price_desc":
          query = query.order("price", { ascending: false })
          break
        case "newest":
          query = query.order("created_at", { ascending: false })
          break
        default:
          query = query.order("name", { ascending: true })
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching products:", error)
        return
      }

      setProducts(data || [])

      // Extract unique brands for filter
      const brands = [...new Set(data?.map(p => p.brand).filter(Boolean) || [])]
      setAvailableBrands(brands)

    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCartAndWishlist = async () => {
    try {
      const [cartData, wishlistData] = await Promise.all([
        cartService.getCartItems(),
        wishlistService.getWishlistItems()
      ])
      
      setCartItems(new Set(cartData.map(item => item.product_id)))
      setWishlistItems(new Set(wishlistData.map(item => item.product_id)))
    } catch (error) {
      console.error("Error fetching cart and wishlist:", error)
    }
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Initial fetch on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Debounce search to avoid too many queries
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts()
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timer)
  }, [filters.query, filters.category, filters.minPrice, filters.maxPrice, filters.inStock, filters.sortBy, filters.brands])

  const handleBrandToggle = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }))
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "",
      minPrice: 0,
      maxPrice: 1000,
      inStock: false,
      sortBy: "name_asc",
      brands: []
    })
  }

  const addToCart = async (productId: string) => {
    try {
      const result = await cartService.addToCart(productId, 1)
      if (result.success) {
        setCartItems(prev => new Set([...prev, productId]))
        toast({
          title: "Item added to cart",
          description: "The item has been added to your cart.",
        })
      } else if (result.requiresLogin) {
        toast({
          title: "Please log in",
          description: "You need to log in to add items to your cart.",
          variant: "destructive",
        })
        router.push("/auth/login")
      } else {
        toast({
          title: "Failed to add item",
          description: result.error || "Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleWishlist = async (productId: string) => {
    try {
      const isInWishlist = wishlistItems.has(productId)
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(productId)
        setWishlistItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(productId)
          return newSet
        })
      } else {
        await wishlistService.addToWishlist(productId)
        setWishlistItems(prev => new Set([...prev, productId]))
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Search Products</h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={filters.query}
                onChange={(e) => handleFilterChange("query", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchProducts()
                  }
                }}
                className="pl-10"
              />
            </div>
            
            <Button
              onClick={() => fetchProducts()}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Price Range: ${filters.minPrice} - ${filters.maxPrice}
                    </label>
                    <Slider
                      value={[filters.minPrice, filters.maxPrice]}
                      onValueChange={([min, max]) => {
                        handleFilterChange("minPrice", min)
                        handleFilterChange("maxPrice", max)
                      }}
                      max={1000}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  {/* Stock Filter */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inStock"
                      checked={filters.inStock}
                      onCheckedChange={(checked) => handleFilterChange("inStock", checked)}
                    />
                    <label htmlFor="inStock" className="text-sm">In Stock Only</label>
                  </div>

                  {/* Brand Filter */}
                  {availableBrands.length > 0 && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Brands</label>
                      <div className="space-y-2">
                        {availableBrands.map(brand => (
                          <div key={brand} className="flex items-center space-x-2">
                            <Checkbox
                              id={brand}
                              checked={filters.brands.includes(brand)}
                              onCheckedChange={() => handleBrandToggle(brand)}
                            />
                            <label htmlFor={brand} className="text-sm">{brand}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {loading ? "Loading..." : `${products.length} products found`}
              </p>
              
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="bg-muted h-48 rounded-lg mb-4" />
                      <div className="bg-muted h-4 rounded mb-2" />
                      <div className="bg-muted h-4 rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                    <Link href={`/products/${product.id}`}>
                      <CardContent className="p-4">
                        <div className="relative mb-4">
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            width={300}
                            height={300}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.preventDefault()
                              toggleWishlist(product.id)
                            }}
                          >
                            <Heart className={`h-4 w-4 ${wishlistItems.has(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                          <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
                          
                          {product.average_rating && product.average_rating > 0 && product.review_count && product.review_count > 0 && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-muted-foreground">
                                {product.average_rating.toFixed(1)} ({product.review_count})
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{product.category}</Badge>
                            {!product.in_stock && (
                              <Badge variant="destructive">Out of Stock</Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                    
                    <div className="p-4 pt-0">
                      <Button
                        className="w-full"
                        disabled={!product.in_stock || cartItems.has(product.id)}
                        onClick={() => addToCart(product.id)}
                      >
                        {cartItems.has(product.id) ? "In Cart" : "Add to Cart"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdvancedSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading search...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
