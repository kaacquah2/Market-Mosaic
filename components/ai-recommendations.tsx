"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, Sparkles, TrendingUp, Eye } from "lucide-react"
import { aiRecommendationService, ProductRecommendation } from "@/lib/ai-recommendation-service"
import { createClient } from "@/lib/supabase/client"
import { cartService } from "@/lib/cart-service"
import { wishlistService } from "@/lib/wishlist-service"

interface RecommendationSectionProps {
  userId?: string
  productId?: string
  type: 'personalized' | 'similar' | 'trending'
  title: string
  limit?: number
}

export function RecommendationSection({ 
  userId, 
  productId, 
  type, 
  title, 
  limit = 8 
}: RecommendationSectionProps) {
  const [products, setProducts] = useState<ProductRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState<Set<string>>(new Set())
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchRecommendations()
    fetchCartAndWishlist()
  }, [userId, productId, type, limit])

  const fetchRecommendations = async () => {
    try {
      let recommendations: ProductRecommendation[] = []

      switch (type) {
        case 'personalized':
          if (userId) {
            recommendations = await aiRecommendationService.getRecommendations(userId, limit)
          }
          break
        case 'similar':
          if (productId) {
            recommendations = await aiRecommendationService.getSimilarProducts(productId, limit)
          }
          break
        case 'trending':
          recommendations = await aiRecommendationService.getTrendingProducts(limit)
          break
      }

      setProducts(recommendations)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
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
      console.error('Error fetching cart and wishlist:', error)
    }
  }

  const addToCart = async (productId: string) => {
    try {
      await cartService.addToCart(productId, 1)
      setCartItems(prev => new Set([...prev, productId]))
    } catch (error) {
      console.error('Error adding to cart:', error)
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
      console.error('Error toggling wishlist:', error)
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'personalized':
        return <Sparkles className="h-5 w-5 text-purple-500" />
      case 'similar':
        return <Eye className="h-5 w-5 text-blue-500" />
      case 'trending':
        return <TrendingUp className="h-5 w-5 text-green-500" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="bg-muted h-48 rounded-lg mb-4" />
                <div className="bg-muted h-4 rounded mb-2" />
                <div className="bg-muted h-4 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {getIcon()}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  
                  {type === 'personalized' && (
                    <Badge className="absolute top-2 left-2 bg-purple-500">
                      AI Recommended
                    </Badge>
                  )}
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
                    {product.in_stock ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        ✓ In Stock
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Out of Stock</Badge>
                    )}
                  </div>
                  
                  {product.reason && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.reason}
                    </p>
                  )}
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
    </div>
  )
}

export function PersonalizedHomepage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
      setLoading(false)
    }
    getUser()
  }, [])

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-muted h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {user ? (
        <>
          <RecommendationSection
            userId={user.id}
            type="personalized"
            title="Recommended for You"
            limit={8}
          />
          <RecommendationSection
            type="trending"
            title="Trending Now"
            limit={6}
          />
        </>
      ) : (
        <RecommendationSection
          type="trending"
          title="Popular Products"
          limit={8}
        />
      )}
    </div>
  )
}

export function ProductRecommendations({ productId }: { productId: string }) {
  return (
    <div className="space-y-8">
      <RecommendationSection
        productId={productId}
        type="similar"
        title="You Might Also Like"
        limit={4}
      />
      <RecommendationSection
        type="trending"
        title="Trending Products"
        limit={4}
      />
    </div>
  )
}
