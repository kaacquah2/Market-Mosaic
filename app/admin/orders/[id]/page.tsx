"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import OrderTracking from "@/components/order-tracking"
import { OrderTrackingManager } from "@/components/admin/order-tracking-manager"

interface OrderItem {
  id: string
  quantity: number
  price: number
  products?: {
    name: string
    category: string
    image_url: string
  }
}

interface Order {
  id: string
  created_at: string
  status: string
  total: string
  tracking_number?: string
  shipping_carrier?: string
  estimated_delivery?: string
  current_location?: { lat: number; lng: number }
  destination_address?: {
    address: string
    city: string
    state: string
    postalCode: string
    country: string
    location?: { lat: number; lng: number }
  }
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget as HTMLImageElement;
    if (target.src !== "/placeholder.svg") {
      target.src = "/placeholder.svg";
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { id } = await params
      const supabase = createClient()

      // Get user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) {
        redirect("/auth/login")
        return
      }

      // Check if user is admin
      const { data: userRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", currentUser.id)
        .single()

      if (!userRole || userRole.role !== 'admin') {
        redirect("/")
        return
      }

      setIsAdmin(true)

      // Fetch order
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single()

      if (!orderData) {
        redirect("/admin")
        return
      }

      // Process order data with tracking info
      const processedOrder: Order = {
        ...orderData,
        current_location: orderData.current_location || undefined,
        destination_address: orderData.destination_address || undefined,
      }

      setOrder(processedOrder)

      // Fetch order items
      const { data: orderItemsData } = await supabase
        .from("order_items")
        .select("*, products(*)")
        .eq("order_id", orderData.id)

      setOrderItems(orderItemsData || [])
    } catch (error) {
      console.error("Error fetching order data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTrackingUpdate = () => {
    // Refresh order data after tracking update
    fetchData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    )
  }

  if (!order || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Order not found or unauthorized</p>
          <Link href="/admin">
            <Button>Back to Admin</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/admin" className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Market Mosaic Admin
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm hover:text-muted-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/products" className="text-sm hover:text-muted-foreground transition-colors">
              Products
            </Link>
            <Link href="/admin/logout" className="text-sm hover:text-muted-foreground transition-colors">
              Logout
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block">
          ← Back to Admin Dashboard
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold mb-4">Order Details</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
              <p className="font-mono text-sm font-semibold">{order.id.slice(0, 8)}...</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Date</p>
              <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded text-xs font-semibold">{order.status}</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold">${Number.parseFloat(order.total).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Tracking Update Form */}
        <div className="mb-12">
          <OrderTrackingManager
            orderId={order.id}
            currentStatus={order.status}
            currentTrackingNumber={order.tracking_number}
            currentCarrier={order.shipping_carrier}
            currentEstimatedDelivery={order.estimated_delivery}
            onUpdate={handleTrackingUpdate}
          />
        </div>

        {/* Order Tracking Map */}
        {(order.tracking_number || order.current_location || order.destination_address) && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-6">Track Order</h2>
            <OrderTracking
              currentLocation={order.current_location}
              destinationAddress={order.destination_address}
              trackingNumber={order.tracking_number}
              status={order.status}
            />
          </div>
        )}

        {/* Order Items */}
        <div className="bg-muted rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6">Items</h2>

          {orderItems && orderItems.length > 0 ? (
            <div className="space-y-6">
              {orderItems.map((item) => (
                <div key={item.id} className="flex gap-6 pb-6 border-b border-border last:border-0">
                  <div className="w-24 h-24 bg-background rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.products?.image_url || "/placeholder.svg"}
                      alt={item.products?.name || "Product"}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-semibold mb-2">{item.products?.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{item.products?.category}</p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Quantity: </span>
                      <span className="font-semibold">{item.quantity}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-2">Unit Price</p>
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No items in this order</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-muted rounded-lg p-6">
          <h2 className="text-2xl font-serif font-bold mb-6">Order Summary</h2>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${(Number.parseFloat(order.total) * 0.909).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span>${(Number.parseFloat(order.total) * 0.091).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>Free</span>
            </div>

            <div className="border-t border-border pt-4 flex justify-between font-serif text-lg font-bold">
              <span>Total</span>
              <span>${Number.parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

