"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Navigation } from "@/components/navigation"
import { cartService, CartItem } from "@/lib/cart-service"
import { AppConfig } from "@/lib/config"
import { ShippingAddressForm } from "@/components/shipping-address-form"
import { ShippingMethodSelector } from "@/components/shipping-method-selector"

interface ShippingAddress {
  fullName: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

interface ShippingMethod {
  id: string
  name: string
  carrier: string
  description: string
  base_cost: number
  estimated_days: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null)
  const [canProceed, setCanProceed] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)
    }

    checkAuth()

    const fetchCartItems = async () => {
      try {
        const items = await cartService.getCartItems()
        if (items.length === 0) {
          router.push("/cart")
          return
        }
        setCartItems(items)
      } catch (error) {
        console.error("Error fetching cart items:", error)
        router.push("/cart")
      }
    }

    fetchCartItems()
  }, [router])

  // Validate shipping information
  useEffect(() => {
    const isValid = shippingAddress !== null && shippingMethod !== null
    setCanProceed(isValid)
  }, [shippingAddress, shippingMethod])

  const subtotal = cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0)
  const tax = subtotal * AppConfig.getTaxRate()
  const shippingCost = shippingMethod?.base_cost || 0
  const total = subtotal + tax + shippingCost

  const handleCheckout = async () => {
    if (!shippingAddress || !shippingMethod) {
      alert("Please complete shipping information before proceeding")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          cartItems: cartItems.map(item => ({
            id: item.products.id,
            name: item.products.name,
            price: item.products.price,
            image_url: item.products.image_url,
            quantity: item.quantity
          })),
          shippingAddress,
          shippingMethod: {
            id: shippingMethod.id,
            name: shippingMethod.name,
            carrier: shippingMethod.carrier,
            cost: shippingMethod.base_cost
          }
        }),
      })

      // Check if response is ok
      if (!response.ok) {
        let errorMessage = "Checkout failed. Please try again."
        try {
          const errorData = await response.json()
          console.error("Checkout API error:", errorData)
          if (errorData.error) {
            errorMessage = errorData.error
          }
        } catch (e) {
          // If JSON parsing fails, try as text
          const errorText = await response.text()
          console.error("Checkout API error (text):", errorText)
        }
        alert(errorMessage)
        return
      }

      // Parse JSON response safely
      let data
      try {
        data = await response.json()
      } catch (error) {
        console.error("Failed to parse JSON response:", error)
        alert("Invalid response from server. Please try again.")
        return
      }

      if (data.url) {
        // Redirect to Stripe Checkout using the URL from the session
        window.location.href = data.url
      } else {
        alert("Checkout failed. Please try again.")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Order Review */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
              <h2 className="text-xl font-bold mb-4">Order Review</h2>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center pb-4 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-semibold">{item.products.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">${(item.products.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <ShippingAddressForm onAddressChange={setShippingAddress} />

            {/* Shipping Method */}
            <ShippingMethodSelector 
              onMethodChange={setShippingMethod}
              selectedCountry={shippingAddress?.country}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 space-y-4 sticky top-20 border border-primary/20">
              <h2 className="text-xl font-bold">Order Total</h2>

              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({Math.round(AppConfig.getTaxRate() * 100)}%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shippingMethod ? `$${shippingMethod.base_cost.toFixed(2)}` : "$0.00"}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isLoading || !canProceed}
                className="w-full mt-6 bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Processing..." : "Pay with Stripe"}
              </Button>
              {!canProceed && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Please complete shipping information to continue
                </p>
              )}

              <Link href="/cart">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
