import { createClient } from "@/lib/supabase/client"

export interface ReturnRequest {
  id: string
  order_id: string
  user_id: string
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'cancelled'
  reason: 'defective' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'damaged_shipping' | 'other'
  description?: string
  refund_amount: number
  refund_method: 'original_payment' | 'store_credit' | 'exchange'
  created_at: string
  updated_at: string
  processed_at?: string
  admin_notes?: string
}

export interface ReturnItem {
  id: string
  return_id: string
  order_item_id: string
  quantity: number
  condition: 'good' | 'damaged' | 'defective'
  refund_amount: number
  created_at: string
  order_items?: {
    quantity: number
    products: {
      name: string
      price: number
      image_url: string
    }
  }
}

export interface ReturnWithItems extends ReturnRequest {
  return_items: ReturnItem[]
  orders?: {
    id: string
    total: number
    status: string
    created_at: string
  }
}

export class ReturnService {
  private supabase = createClient()

  async createReturn(
    orderId: string,
    reason: ReturnRequest['reason'],
    description?: string,
    refundMethod: ReturnRequest['refund_method'] = 'original_payment'
  ): Promise<string | null> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      throw new Error("User not authenticated")
    }

    // Verify the order belongs to the user
    const { data: order, error: orderError } = await this.supabase
      .from("orders")
      .select("id, total, status, created_at")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single()

    if (orderError || !order) {
      throw new Error("Order not found or doesn't belong to user")
    }

    // Check if order is eligible for return (within 30 days and completed)
    const orderDate = new Date(order.created_at || new Date())
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    if (orderDate < thirtyDaysAgo) {
      throw new Error("Order is too old for return (must be within 30 days)")
    }

    if (order.status !== 'completed') {
      throw new Error("Only completed orders can be returned")
    }

    // Create the return request
    const { data: returnData, error } = await this.supabase
      .from("returns")
      .insert({
        order_id: orderId,
        user_id: user.id,
        reason,
        description,
        refund_method: refundMethod,
        refund_amount: order.total
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating return:", error)
      return null
    }

    return returnData.id
  }

  async addReturnItem(
    returnId: string,
    orderItemId: string,
    quantity: number,
    condition: ReturnItem['condition'] = 'good'
  ): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      throw new Error("User not authenticated")
    }

    // Verify the return belongs to the user and is pending
    const { data: returnData, error: returnError } = await this.supabase
      .from("returns")
      .select("id, status")
      .eq("id", returnId)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .single()

    if (returnError || !returnData) {
      throw new Error("Return not found or not pending")
    }

    // Get order item details
    const { data: orderItem, error: orderItemError } = await this.supabase
      .from("order_items")
      .select("quantity, products(price)")
      .eq("id", orderItemId)
      .single()

    if (orderItemError || !orderItem) {
      throw new Error("Order item not found")
    }

    // Calculate refund amount
    const refundAmount = ((orderItem.products as any).price * quantity)

    const { error } = await this.supabase
      .from("return_items")
      .insert({
        return_id: returnId,
        order_item_id: orderItemId,
        quantity,
        condition,
        refund_amount: refundAmount
      })

    if (error) {
      console.error("Error adding return item:", error)
      return false
    }

    return true
  }

  async getUserReturns(): Promise<ReturnWithItems[]> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return []
    }

    const { data, error } = await this.supabase
      .from("returns")
      .select(`
        *,
        return_items (
          *,
          order_items (
            quantity,
            products (
              name,
              price,
              image_url
            )
          )
        ),
        orders (
          id,
          total,
          status,
          created_at
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching returns:", error)
      return []
    }

    return data || []
  }

  async getReturnById(returnId: string): Promise<ReturnWithItems | null> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return null
    }

    const { data, error } = await this.supabase
      .from("returns")
      .select(`
        *,
        return_items (
          *,
          order_items (
            quantity,
            products (
              name,
              price,
              image_url
            )
          )
        ),
        orders (
          id,
          total,
          status,
          created_at
        )
      `)
      .eq("id", returnId)
      .eq("user_id", user.id)
      .single()

    if (error) {
      console.error("Error fetching return:", error)
      return null
    }

    return data
  }

  async cancelReturn(returnId: string): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      throw new Error("User not authenticated")
    }

    const { error } = await this.supabase
      .from("returns")
      .update({ status: 'cancelled' })
      .eq("id", returnId)
      .eq("user_id", user.id)
      .eq("status", "pending")

    if (error) {
      console.error("Error cancelling return:", error)
      return false
    }

    return true
  }

  async getOrderItemsForReturn(orderId: string): Promise<any[]> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return []
    }

    const { data, error } = await this.supabase
      .from("order_items")
      .select(`
        id,
        quantity,
        products (
          id,
          name,
          price,
          image_url
        )
      `)
      .eq("order_id", orderId)

    if (error) {
      console.error("Error fetching order items:", error)
      return []
    }

    return data || []
  }

  async isOrderEligibleForReturn(orderId: string): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    const { data: order, error } = await this.supabase
      .from("orders")
      .select("created_at, status")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single()

    if (error || !order) {
      return false
    }

    // Check if order is completed and within 30 days
    const orderDate = new Date(order.created_at)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return order.status === 'completed' && orderDate >= thirtyDaysAgo
  }
}

export const returnService = new ReturnService()
