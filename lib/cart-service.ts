import { createClient } from "@/lib/supabase/client"

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  products: {
    id: string
    name: string
    price: number
    image_url: string
    stock_quantity?: number
  }
}

export class CartService {
  private _supabase: ReturnType<typeof createClient> | null = null

  private get supabase() {
    if (!this._supabase) {
      this._supabase = createClient()
    }
    return this._supabase
  }

  async getCartItems(): Promise<CartItem[]> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return []
    }

    const { data, error } = await this.supabase
      .from("cart_items")
      .select(`
        id,
        product_id,
        quantity,
        products!inner (
          id,
          name,
          price,
          image_url,
          stock_quantity
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching cart items:", error)
      return []
    }

    if (!data) {
      return []
    }

    // Supabase returns products as an array, but our CartItem expects a single object for 'products'
    // Map the data to conform to the CartItem interface
    return data.map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      products: Array.isArray(item.products) ? item.products[0] : item.products
    })) as CartItem[]
  }

  async addToCart(productId: string, quantity: number = 1): Promise<{ success: boolean; requiresLogin?: boolean; error?: string }> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return { success: false, requiresLogin: true, error: "Please log in to add items to cart" }
    }

    // Check if item already exists in cart
    const { data: existingItem } = await this.supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single()

    if (existingItem) {
      // Update existing item quantity
      const { error } = await this.supabase
        .from("cart_items")
        .update({ 
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingItem.id)

      if (error) {
        console.error("Error updating cart item:", error)
        return { success: false, error: "Failed to update cart item" }
      }
    } else {
      // Add new item to cart
      const { error } = await this.supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity
        })

      if (error) {
        console.error("Error adding to cart:", error)
        return { success: false, error: "Failed to add item to cart" }
      }
    }

    return { success: true }
  }

  async updateQuantity(cartItemId: string, quantity: number): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    if (quantity <= 0) {
      return this.removeFromCart(cartItemId)
    }

    const { error } = await this.supabase
      .from("cart_items")
      .update({ 
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq("id", cartItemId)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error updating cart item quantity:", error)
      return false
    }

    return true
  }

  async removeFromCart(cartItemId: string): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    const { error } = await this.supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error removing from cart:", error)
      return false
    }

    return true
  }

  async clearCart(): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    const { error } = await this.supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)

    if (error) {
      console.error("Error clearing cart:", error)
      return false
    }

    return true
  }

  async getCartCount(): Promise<number> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return 0
    }

    const { count, error } = await this.supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    if (error) {
      console.error("Error getting cart count:", error)
      return 0
    }

    return count || 0
  }
}

export const cartService = new CartService()
