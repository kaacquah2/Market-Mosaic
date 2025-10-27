"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import OrderTracking from "@/components/order-tracking"
import { ReturnRequest } from "@/components/return-system"
import { OrderTimeline } from "@/components/order-timeline"
import { CarrierTrackingLink } from "@/components/carrier-tracking-link"
import { Package, Truck, MapPin } from "lucide-react"

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
  shipped_at?: string
  delivered_at?: string
  shipping_address?: any
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

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [trackingHistory, setTrackingHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)

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

      setUser(currentUser)

      // Fetch user profile
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", currentUser.id)
        .single()

      setUserProfile(profileData)

      // Fetch order
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .eq("user_id", currentUser.id)
        .single()

      if (!orderData) {
        redirect("/account")
        return
      }

      // Process order data with tracking info
      const processedOrder: Order = {
        ...orderData,
        current_location: orderData.current_location || undefined,
        destination_address: orderData.destination_address || undefined,
      }

      // If no destination address in order, use user profile
      if (!processedOrder.destination_address && profileData) {
        const geocodedAddress = profileData.address_line1 
          ? {
              address: profileData.address_line1,
              city: profileData.city || "",
              state: profileData.state || "",
              postalCode: profileData.postal_code || "",
              country: profileData.country || "US",
            }
          : undefined
        
        if (geocodedAddress) {
          processedOrder.destination_address = geocodedAddress
        }
      }

      setOrder(processedOrder)

      // Fetch order items
      const { data: orderItemsData } = await supabase
        .from("order_items")
        .select("*, products(*)")
        .eq("order_id", orderData.id)

      setOrderItems(orderItemsData || [])

      // Fetch tracking history
      const { data: trackingData } = await supabase
        .from("order_tracking_history")
        .select("*")
        .eq("order_id", orderData.id)
        .order("timestamp", { ascending: false })

      setTrackingHistory(trackingData || [])
    } catch (error) {
      console.error("Error fetching order data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Order not found</p>
          <Link href="/account">
            <Button>Back to Account</Button>
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
          <Link href="/" className="text-2xl font-serif font-bold">
            Market Mosaic
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/products" className="text-sm hover:text-muted-foreground transition-colors">
              Shop
            </Link>
            <Link href="/cart" className="text-sm hover:text-muted-foreground transition-colors">
              Cart
            </Link>
            <Link href="/account" className="text-sm hover:text-muted-foreground transition-colors">
              Account
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/account" className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block">
          ← Back to Account
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
              <span className="bg-primary/10 text-primary px-3 py-1 rounded text-xs font-semibold uppercase">
                {order.status.replace(/_/g, " ")}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold">${Number.parseFloat(order.total).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-8 border border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-serif font-bold">Order Tracking</h2>
            </div>

            {/* Carrier and Tracking Number */}
            {order.tracking_number && (
              <div className="mb-6 p-4 bg-background rounded-lg border">
                <CarrierTrackingLink
                  trackingNumber={order.tracking_number}
                  carrier={order.shipping_carrier}
                />
              </div>
            )}

            {/* Shipping Address */}
            {order.shipping_address && (
              <div className="mb-6 p-4 bg-background rounded-lg border">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-2">Shipping Address</p>
                    <p className="text-sm text-muted-foreground">
                      {order.shipping_address.full_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.shipping_address.address_line1}
                      {order.shipping_address.address_line2 && `, ${order.shipping_address.address_line2}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                    </p>
                    <p className="text-sm text-muted-foreground">{order.shipping_address.country}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <OrderTimeline
              orderStatus={order.status}
              createdAt={order.created_at}
              shippedAt={order.shipped_at}
              deliveredAt={order.delivered_at}
              estimatedDelivery={order.estimated_delivery}
              trackingHistory={trackingHistory}
            />
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-muted rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-serif font-bold mb-6">Items</h2>

          {orderItems && orderItems.length > 0 ? (
            <div className="space-y-6">
              {orderItems.map((item) => (
                <div key={item.id} className="flex gap-6 pb-6 border-b border-border last:border-0">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-background rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.products?.image_url || "/placeholder.svg"}
                      alt={item.products?.name || "Product"}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-semibold mb-2">{item.products?.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{item.products?.category}</p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Quantity: </span>
                      <span className="font-semibold">{item.quantity}</span>
                    </p>
                  </div>

                  {/* Price */}
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
        <div className="bg-muted rounded-lg p-6 mb-12">
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

        {/* Live Map Tracking (if available) */}
        {(order.current_location || order.destination_address) && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-serif font-bold">Live Location</h2>
            </div>
            <OrderTracking
              currentLocation={order.current_location}
              destinationAddress={order.destination_address}
              trackingNumber={order.tracking_number}
              status={order.status}
            />
          </div>
        )}

        {/* Return Request */}
        {order.status === 'completed' && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-6">Need to Return Something?</h2>
            <ReturnRequest orderId={order.id} />
          </div>
        )}

        <div className="mt-12">
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
