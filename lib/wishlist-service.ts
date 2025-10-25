import { createClient } from "@/lib/supabase/client"

export interface WishlistItem {
  id: string
  product_id: string
  created_at: string
  products: {
    id: string
    name: string
    price: number
    image_url: string
    category: string
    average_rating?: number
    review_count?: number
    stock_quantity?: number
  }
}

export class WishlistService {
  private _supabase: ReturnType<typeof createClient> | null = null

  private get supabase() {
    if (!this._supabase) {
      this._supabase = createClient()
    }
    return this._supabase
  }

  async getWishlistItems(): Promise<WishlistItem[]> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return []
    }

    const { data, error } = await this.supabase
      .from("wishlist_items")
      .select(`
        id,
        product_id,
        created_at,
        products!inner (
          id,
          name,
          price,
          image_url,
          category,
          average_rating,
          review_count,
          stock_quantity
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching wishlist items:", error)
      return []
    }

    // Transform the data to match our interface
    const transformedData = (data || []).map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      created_at: item.created_at,
      products: Array.isArray(item.products) ? item.products[0] : item.products
    })).filter((item: any) => item.products) as WishlistItem[]
    
    return transformedData
  }

  async addToWishlist(productId: string): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    // Check if item already exists in wishlist
    const { data: existingItem } = await this.supabase
      .from("wishlist_items")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single()

    if (existingItem) {
      // Item already in wishlist
      return true
    }

    // Add new item to wishlist
    const { error } = await this.supabase
      .from("wishlist_items")
      .insert({
        user_id: user.id,
        product_id: productId
      })

    if (error) {
      console.error("Error adding to wishlist:", error)
      return false
    }

    return true
  }

  async removeFromWishlist(wishlistItemId: string): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    const { error } = await this.supabase
      .from("wishlist_items")
      .delete()
      .eq("id", wishlistItemId)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error removing from wishlist:", error)
      return false
    }

    return true
  }

  async removeFromWishlistByProductId(productId: string): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    const { error } = await this.supabase
      .from("wishlist_items")
      .delete()
      .eq("product_id", productId)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error removing from wishlist:", error)
      return false
    }

    return true
  }

  async isInWishlist(productId: string): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    const { data, error } = await this.supabase
      .from("wishlist_items")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single()

    if (error) {
      return false
    }

    return !!data
  }

  async getWishlistCount(): Promise<number> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return 0
    }

    const { count, error } = await this.supabase
      .from("wishlist_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    if (error) {
      console.error("Error getting wishlist count:", error)
      return 0
    }

    return count || 0
  }
}

export const wishlistService = new WishlistService()
