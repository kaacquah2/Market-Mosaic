"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import { Heart, Star, ShoppingCart, Minus, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { cartService } from "@/lib/cart-service"
import { wishlistService } from "@/lib/wishlist-service"
import { AppConfig } from "@/lib/config"
import { ReviewSection } from "@/components/review-section"
import { ProductRecommendations } from "@/components/ai-recommendations"

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
  sku?: string
  weight?: number
  dimensions?: string
  tags?: string[]
  created_at?: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
      checkWishlistStatus(params.id as string)
    }
  }, [params.id])

  const checkWishlistStatus = async (productId: string) => {
    try {
      const inWishlist = await wishlistService.isInWishlist(productId)
      setIsInWishlist(inWishlist)
    } catch (error) {
      console.error("Error checking wishlist status:", error)
    }
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget as HTMLImageElement;
    if (target.src !== "/placeholder.svg") {
      target.src = "/placeholder.svg";
    }
  }

  const fetchProduct = async (productId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .eq("is_active", true)
        .single()

      if (error) {
        console.error("Error fetching product:", error)
        return
      }

      setProduct(data)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    setIsAdding(true)
    try {
      const result = await cartService.addToCart(product.id, quantity)
      if (result.success) {
        toast({
          title: "Item added to cart",
          description: `${product.name} has been added to your cart.`,
        })
        router.push("/cart")
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
    } finally {
      setIsAdding(false)
    }
  }

  const toggleWishlist = async () => {
    if (!product) return

    try {
      if (isInWishlist) {
        const success = await wishlistService.removeFromWishlistByProductId(product.id)
        if (success) {
          setIsInWishlist(false)
        }
      } else {
        const success = await wishlistService.addToWishlist(product.id)
        if (success) {
          setIsInWishlist(true)
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground mb-4 sm:mb-8 inline-block">
          ← Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {/* Product Image */}
          <div className="bg-muted rounded-lg overflow-hidden aspect-square">
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-muted-foreground uppercase tracking-wide">{product.category}</span>
                {product.sku && (
                  <span className="text-sm text-muted-foreground">• SKU: {product.sku}</span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>

              {/* Rating */}
              {product.average_rating && product.average_rating > 0 && product.review_count && product.review_count > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.average_rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.average_rating.toFixed(1)} ({product.review_count} reviews)
                  </span>
                </div>
              )}

              <p className="text-muted-foreground text-lg mb-6">{product.description}</p>

              {/* Product Info */}
              <div className="space-y-2 mb-6">
                {product.weight && (
                  <p className="text-sm text-muted-foreground">Weight: {product.weight} lbs</p>
                )}
                {product.dimensions && (
                  <p className="text-sm text-muted-foreground">Dimensions: {product.dimensions}</p>
                )}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Price and Actions */}
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <span className="text-3xl sm:text-4xl font-bold text-primary">${product.price.toFixed(2)}</span>
                {product.stock_quantity === 0 && (
                  <span className="inline-flex items-center w-fit px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Out of Stock
                  </span>
                )}
                {product.stock_quantity && product.stock_quantity > 0 && product.stock_quantity < 10 && (
                  <span className="inline-flex items-center w-fit px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    ⚠️ Only {product.stock_quantity} left in stock!
                  </span>
                )}
                {product.stock_quantity && product.stock_quantity >= 10 && (
                  <span className="inline-flex items-center w-fit px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    ✓ In Stock ({product.stock_quantity} available)
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = Number.parseInt(e.target.value) || 1
                      const maxStock = product.stock_quantity || 999
                      setQuantity(Math.min(Math.max(1, val), maxStock))
                    }}
                    className="w-16 text-center border-0"
                    min="1"
                    max={product.stock_quantity || 99}
                    disabled={product.stock_quantity === 0}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(quantity + 1, product.stock_quantity || 999))}
                    disabled={product.stock_quantity === 0 || quantity >= (product.stock_quantity || 999)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {product.stock_quantity && quantity >= product.stock_quantity && (
                  <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                    Maximum available quantity selected
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock_quantity === 0}
                  className="flex-1"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock_quantity === 0 ? "Out of Stock" : isAdding ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  onClick={toggleWishlist}
                  className="px-4"
                >
                  <Heart className={`h-4 w-4 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>

              {/* Shipping Info */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Shipping & Returns</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Free shipping on orders over ${AppConfig.getFreeShippingThreshold()}</li>
                  <li>• 30-day return policy</li>
                  <li>• Express delivery available</li>
                  {product.weight && (
                    <li>• Estimated delivery: 3-5 business days</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ReviewSection productId={product.id} />
        </div>

        {/* AI Recommendations */}
        <div className="mt-16">
          <ProductRecommendations productId={product.id} />
        </div>
      </div>
    </div>
  )
}