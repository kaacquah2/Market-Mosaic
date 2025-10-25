"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cartService } from "@/lib/cart-service"
import { wishlistService, WishlistItem } from "@/lib/wishlist-service"

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    setUser(user)
    fetchWishlist()
  }

  const fetchWishlist = async () => {
    try {
      const items = await wishlistService.getWishlistItems()
      setWishlistItems(items)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (wishlistItemId: string) => {
    try {
      const success = await wishlistService.removeFromWishlist(wishlistItemId)
      if (success) {
        setWishlistItems(prev => prev.filter(item => item.id !== wishlistItemId))
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const addToCart = async (product: WishlistItem['products']) => {
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
        <p className="text-muted-foreground">Loading wishlist...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            My <span className="text-primary">Wishlist</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            {wishlistItems.length} items saved for later
          </p>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="group">
                <Link href={`/products/${item.products.id}`}>
                  <div className="bg-muted rounded-xl overflow-hidden mb-4 aspect-square relative">
                    <img
                      src={item.products.image_url || "/placeholder.svg"}
                      alt={item.products.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    
                    {/* Remove from Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        removeFromWishlist(item.id)
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </button>

                    {/* Stock Badge */}
                    {item.products.stock_quantity === 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        Out of Stock
                      </div>
                    )}
                  </div>
                </Link>
                <div className="space-y-2">
                  <h3 className="font-bold text-base line-clamp-2">{item.products.name}</h3>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">{item.products.category}</p>
                  
                  {/* Rating */}
                  {item.products.average_rating && item.products.average_rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">
                        {item.products.average_rating.toFixed(1)} ({item.products.review_count || 0})
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-primary">${item.products.price.toFixed(2)}</p>
                    <Button
                      size="sm"
                      onClick={() => addToCart(item.products)}
                      disabled={item.products.stock_quantity === 0}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Start adding items you love to your wishlist</p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
