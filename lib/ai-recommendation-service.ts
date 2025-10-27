import { createClient } from "@/lib/supabase/client"
import { cacheService } from "@/lib/cache-service"

export interface ProductRecommendation {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  brand?: string
  score: number
  reason: string
  average_rating?: number
  in_stock: boolean
}

export interface UserPreferences {
  categories: string[]
  brands: string[]
  priceRange: { min: number; max: number }
  averageOrderValue: number
  purchaseHistory: string[]
  viewedProducts: string[]
  wishlistItems: string[]
}

export class AIRecommendationService {
  private supabase = createClient()

  async getUserPreferences(userId: string): Promise<UserPreferences> {
    const cacheKey = `user_preferences:${userId}`
    const cached = cacheService.get<UserPreferences>(cacheKey)
    if (cached) return cached

    try {
      // Get user's order history (simplified - no joins)
      const { data: orders } = await this.supabase
        .from('orders')
        .select('id, total')
        .eq('user_id', userId)
        .eq('status', 'completed')

      // Get order items for these orders
      const orderIds = orders?.map(o => o.id) || []
      let orderItems: any[] = []
      let products: any[] = []
      
      if (orderIds.length > 0) {
        const { data: items } = await this.supabase
          .from('order_items')
          .select('product_id, order_id')
          .in('order_id', orderIds)
        
        orderItems = items || []
        
        // Get products for these order items
        const productIds = Array.from(new Set(orderItems.map(i => i.product_id)))
        if (productIds.length > 0) {
          const { data: prods } = await this.supabase
            .from('products')
            .select('id, category, brand, price')
            .in('id', productIds)
          
          products = prods || []
        }
      }

      // Get user's wishlist
      const { data: wishlist } = await this.supabase
        .from('wishlist_items')
        .select('product_id')
        .eq('user_id', userId)

      // Get user's cart history (viewed products)
      const { data: cartHistory } = await this.supabase
        .from('cart_items')
        .select('product_id')
        .eq('user_id', userId)

      // Analyze preferences
      const categories: string[] = []
      const brands: string[] = []
      const purchaseHistory: string[] = []
      const viewedProducts: string[] = []
      const wishlistItems: string[] = []
      let totalSpent = 0
      let orderCount = orders?.length || 0

      // Calculate total spent
      orders?.forEach(order => {
        totalSpent += parseFloat(order.total || '0')
      })

      // Build purchase history and extract categories/brands
      orderItems.forEach((item: any) => {
        purchaseHistory.push(item.product_id)
        
        const product = products.find(p => p.id === item.product_id)
        if (product) {
          if (product.category) categories.push(product.category)
          if (product.brand) brands.push(product.brand)
        }
      })

      wishlist?.forEach(item => {
        wishlistItems.push(item.product_id)
      })

      cartHistory?.forEach(item => {
        viewedProducts.push(item.product_id)
      })

      // Calculate price range from purchase history
      const prices = products.map(p => p.price).filter(p => p > 0)

      const priceRange = {
        min: prices.length > 0 ? Math.min(...prices) * 0.5 : 0,
        max: prices.length > 0 ? Math.max(...prices) * 2 : 1000
      }

      const preferences: UserPreferences = {
        categories: [...new Set(categories)],
        brands: [...new Set(brands)],
        priceRange,
        averageOrderValue: orderCount > 0 ? totalSpent / orderCount : 0,
        purchaseHistory,
        viewedProducts,
        wishlistItems
      }

      cacheService.set(cacheKey, preferences, 180000) // Cache for 3 minutes - reduced to save space
      return preferences

    } catch (error) {
      console.error('Error getting user preferences:', error)
      return {
        categories: [],
        brands: [],
        priceRange: { min: 0, max: 1000 },
        averageOrderValue: 0,
        purchaseHistory: [],
        viewedProducts: [],
        wishlistItems: []
      }
    }
  }

  async getRecommendations(userId: string, limit: number = 10): Promise<ProductRecommendation[]> {
    const cacheKey = `recommendations:${userId}:${limit}`
    const cached = cacheService.get<ProductRecommendation[]>(cacheKey)
    if (cached) return cached

    try {
      const preferences = await this.getUserPreferences(userId)
      
      // Get all products
      const { data: products } = await this.supabase
        .from('products')
        .select('*')
        .eq('is_active', true)

      if (!products) return []

      // Score products based on user preferences
      const scoredProducts = products
        .filter(product => !preferences.purchaseHistory.includes(product.id))
        .map(product => {
          let score = 0
          let reasons: string[] = []

          // Category preference (40% weight)
          if (preferences.categories.includes(product.category)) {
            score += 40
            reasons.push(`Matches your interest in ${product.category}`)
          }

          // Brand preference (20% weight)
          if (product.brand && preferences.brands.includes(product.brand)) {
            score += 20
            reasons.push(`From your preferred brand ${product.brand}`)
          }

          // Price preference (20% weight)
          if (product.price >= preferences.priceRange.min && product.price <= preferences.priceRange.max) {
            score += 20
            reasons.push('Within your preferred price range')
          }

          // Wishlist similarity (10% weight)
          if (preferences.wishlistItems.length > 0) {
            const similarProducts = products.filter(p => 
              preferences.wishlistItems.includes(p.id) && 
              p.category === product.category
            )
            if (similarProducts.length > 0) {
              score += 10
              reasons.push('Similar to items in your wishlist')
            }
          }

          // View history similarity (10% weight)
          if (preferences.viewedProducts.length > 0) {
            const viewedSimilar = products.filter(p => 
              preferences.viewedProducts.includes(p.id) && 
              p.category === product.category
            )
            if (viewedSimilar.length > 0) {
              score += 10
              reasons.push('Similar to products you viewed')
            }
          }

          // Popularity boost (5% weight)
          if (product.average_rating && product.average_rating >= 4) {
            score += 5
            reasons.push('Highly rated by customers')
          }

          return {
            ...product,
            score,
            reason: reasons.join(', ') || 'Recommended for you'
          }
        })
        .filter(product => product.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)

      cacheService.set(cacheKey, scoredProducts, 600000) // Cache for 10 minutes
      return scoredProducts

    } catch (error) {
      console.error('Error getting recommendations:', error)
      return []
    }
  }

  async getSimilarProducts(productId: string, limit: number = 5): Promise<ProductRecommendation[]> {
    const cacheKey = `similar_products:${productId}:${limit}`
    const cached = cacheService.get<ProductRecommendation[]>(cacheKey)
    if (cached) return cached

    try {
      // Get the target product
      const { data: targetProduct } = await this.supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (!targetProduct) return []

      // Get similar products
      const { data: products } = await this.supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .neq('id', productId)

      if (!products) return []

      const similarProducts = products
        .map(product => {
          let score = 0
          let reasons: string[] = []

          // Same category (50% weight)
          if (product.category === targetProduct.category) {
            score += 50
            reasons.push(`Same category: ${product.category}`)
          }

          // Same brand (30% weight)
          if (product.brand && product.brand === targetProduct.brand) {
            score += 30
            reasons.push(`Same brand: ${product.brand}`)
          }

          // Similar price range (20% weight)
          const priceDiff = Math.abs(product.price - targetProduct.price)
          const priceRatio = priceDiff / targetProduct.price
          if (priceRatio <= 0.3) { // Within 30% price difference
            score += 20
            reasons.push('Similar price range')
          }

          return {
            ...product,
            score,
            reason: reasons.join(', ') || 'Similar product'
          }
        })
        .filter(product => product.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)

      cacheService.set(cacheKey, similarProducts, 600000) // Cache for 10 minutes
      return similarProducts

    } catch (error) {
      console.error('Error getting similar products:', error)
      return []
    }
  }

  async getTrendingProducts(limit: number = 10): Promise<ProductRecommendation[]> {
    const cacheKey = `trending_products:${limit}`
    const cached = cacheService.get<ProductRecommendation[]>(cacheKey)
    if (cached) return cached

    try {
      // Get products - simplified query without order_items relationship
      const { data: products, error: productsError } = await this.supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .gte('average_rating', 4) // Only highly rated products
        .order('average_rating', { ascending: false })
        .limit(limit)

      if (productsError) {
        console.error('Error fetching trending products:', productsError)
        return []
      }

      if (!products) return []

      // Transform to recommendations with simpler scoring based on rating
      const trendingProducts = products.map(product => ({
        ...product,
        score: (product.average_rating || 0) * 10 + (product.review_count || 0),
        reason: `${product.average_rating?.toFixed(1)}★ rating (${product.review_count || 0} reviews)`
      }))

      cacheService.set(cacheKey, trendingProducts, 180000) // Cache for 3 minutes
      return trendingProducts

    } catch (error) {
      console.error('Error getting trending products:', error)
      return []
    }
  }

  async getPersonalizedHomepage(userId: string): Promise<{
    recommendations: ProductRecommendation[]
    trending: ProductRecommendation[]
    recentlyViewed: ProductRecommendation[]
  }> {
    const cacheKey = `homepage:${userId}`
    const cached = cacheService.get<{
      recommendations: ProductRecommendation[]
      trending: ProductRecommendation[]
      recentlyViewed: ProductRecommendation[]
    }>(cacheKey)
    if (cached) return cached

    try {
      const [recommendations, trending, preferences] = await Promise.all([
        this.getRecommendations(userId, 8),
        this.getTrendingProducts(6),
        this.getUserPreferences(userId)
      ])

      // Get recently viewed products
      const recentlyViewed = preferences.viewedProducts.slice(-4).map(async productId => {
        const { data: product } = await this.supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single()
        return product
      })

      const recentlyViewedProducts = (await Promise.all(recentlyViewed))
        .filter(Boolean)
        .map(product => ({
          ...product,
          score: 100,
          reason: 'Recently viewed'
        }))

      const result = {
        recommendations,
        trending,
        recentlyViewed: recentlyViewedProducts
      }

      cacheService.set(cacheKey, result, 180000) // Cache for 3 minutes - reduced to save space
      return result

    } catch (error) {
      console.error('Error getting personalized homepage:', error)
      return {
        recommendations: [],
        trending: [],
        recentlyViewed: []
      }
    }
  }

  // Clear user-specific cache when user actions occur
  invalidateUserCache(userId: string): void {
    cacheService.delete(`user_preferences:${userId}`)
    cacheService.delete(`recommendations:${userId}:*`)
    cacheService.delete(`homepage:${userId}`)
  }
}

export const aiRecommendationService = new AIRecommendationService()
