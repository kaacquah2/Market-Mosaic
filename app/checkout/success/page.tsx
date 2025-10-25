"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Navigation } from "@/components/navigation"
import { cartService } from "@/lib/cart-service"
import { NotificationService } from "@/lib/notification-service"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!sessionId) return

      const supabase = createClient()

      // Get the order by session ID
      const { data: orders } = await supabase.from("orders").select("*").eq("stripe_session_id", sessionId).single()

      if (orders) {
        // Update order status to completed
        await supabase.from("orders").update({ status: "completed" }).eq("id", orders.id)

        setOrder(orders)

        // Clear cart from database
        await cartService.clearCart()

        // Send order confirmation email and notifications
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            // Send email confirmation
            await fetch('/api/send-order-confirmation', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderId: orders.id,
                userEmail: user.email,
                userName: user.user_metadata?.first_name || user.email?.split('@')[0]
              })
            })

            // Send push notification for order confirmation
            const notificationService = new NotificationService()
            await notificationService.sendOrderUpdateNotification(user.id, orders.id, 'confirmed')
          }
        } catch (error) {
          console.error('Failed to send confirmation notifications:', error)
        }
      }

      setIsLoading(false)
    }

    fetchOrder()
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-4xl font-bold">Thank You!</h1>
          <p className="text-lg text-muted-foreground">Your order has been confirmed.</p>

          {order && (
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 text-left space-y-4 my-8 border border-primary/20">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-semibold">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-primary">${Number.parseFloat(order.total).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          <p className="text-muted-foreground">
            A confirmation email has been sent to your email address. You can track your order in your account.
          </p>

          <div className="flex gap-4 justify-center pt-6">
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90">Continue Shopping</Button>
            </Link>
            <Link href="/account">
              <Button variant="outline">View Orders</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
