import { createClient } from "@/lib/supabase/client"

export interface ProductReview {
  id: string
  product_id: string
  user_id: string
  rating: number
  title?: string
  comment?: string
  created_at: string
  updated_at: string
  user_profiles?: {
    first_name?: string
    last_name?: string
  }
}

export interface ReviewStats {
  average_rating: number
  total_reviews: number
  rating_distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export class ReviewService {
  private supabase = createClient()

  async getProductReviews(productId: string): Promise<ProductReview[]> {
    try {
      const { data, error } = await this.supabase
        .from("product_reviews")
        .select(`
          *,
          user_profiles (
            first_name,
            last_name
          )
        `)
        .eq("product_id", productId)
        .order("created_at", { ascending: false })

      if (error) {
        // Table might not exist yet - silently return empty array
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          return []
        }
        console.error("Error fetching reviews:", error)
        return []
      }

      return data || []
    } catch (err) {
      console.error("Unexpected error fetching reviews:", err)
      return []
    }
  }

  async getReviewStats(productId: string): Promise<ReviewStats> {
    try {
      const { data, error } = await this.supabase
        .from("product_reviews")
        .select("rating")
        .eq("product_id", productId)

      if (error) {
        // Table might not exist yet - silently return empty stats
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          return {
            average_rating: 0,
            total_reviews: 0,
            rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
          }
        }
        console.error("Error fetching review stats:", error)
        return {
          average_rating: 0,
          total_reviews: 0,
          rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        }
      }

      const reviews = data || []
      const totalReviews = reviews.length

      if (totalReviews === 0) {
        return {
          average_rating: 0,
          total_reviews: 0,
          rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        }
      }

      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews

      const ratingDistribution = reviews.reduce((dist, review) => {
        dist[review.rating as keyof typeof dist]++
        return dist
      }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })

      return {
        average_rating: Math.round(averageRating * 10) / 10,
        total_reviews: totalReviews,
        rating_distribution: ratingDistribution
      }
    } catch (err) {
      console.error("Unexpected error fetching review stats:", err)
      return {
        average_rating: 0,
        total_reviews: 0,
        rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    }
  }

  async addReview(productId: string, rating: number, title?: string, comment?: string): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    const { error } = await this.supabase
      .from("product_reviews")
      .insert({
        product_id: productId,
        user_id: user.id,
        rating,
        title,
        comment
      })

    if (error) {
      console.error("Error adding review:", error)
      return false
    }

    return true
  }

  async updateReview(reviewId: string, rating: number, title?: string, comment?: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("product_reviews")
      .update({
        rating,
        title,
        comment,
        updated_at: new Date().toISOString()
      })
      .eq("id", reviewId)

    if (error) {
      console.error("Error updating review:", error)
      return false
    }

    return true
  }

  async deleteReview(reviewId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("product_reviews")
      .delete()
      .eq("id", reviewId)

    if (error) {
      console.error("Error deleting review:", error)
      return false
    }

    return true
  }

  async getUserReview(productId: string): Promise<ProductReview | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()

      if (!user) {
        return null
      }

      const { data, error } = await this.supabase
        .from("product_reviews")
        .select("*")
        .eq("product_id", productId)
        .eq("user_id", user.id)
        .single()

      if (error) {
        // No review found or table doesn't exist - return null
        return null
      }

      return data
    } catch (err) {
      return null
    }
  }

  async hasUserPurchasedProduct(productId: string): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()

    if (!user) {
      return false
    }

    // Get completed orders for the user
    const { data: orders } = await this.supabase
      .from("orders")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "completed")

    if (!orders || orders.length === 0) {
      return false
    }

    const orderIds = orders.map(order => order.id)

    const { data, error } = await this.supabase
      .from("order_items")
      .select("id")
      .eq("product_id", productId)
      .in("order_id", orderIds)

    if (error) {
      console.error("Error checking purchase:", error)
      return false
    }

    return (data?.length || 0) > 0
  }
}

export const reviewService = new ReviewService()
