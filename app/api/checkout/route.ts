import { createClient } from "@/lib/supabase/server"
import Stripe from "stripe"
import { type NextRequest, NextResponse } from "next/server"
import { AppConfig } from "@/lib/config"

// Force dynamic - no caching for checkout
export const dynamic = 'force-dynamic'
export const revalidate = 0

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set")
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { cartItems, shippingAddress, shippingMethod } = body

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 })
    }

    if (!shippingMethod) {
      return NextResponse.json({ error: "Shipping method is required" }, { status: 400 })
    }

    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate stock availability before processing
    for (const item of cartItems) {
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("stock_quantity, name")
        .eq("id", item.id)
        .single()

      if (productError || !product) {
        return NextResponse.json({ 
          error: `Product "${item.name}" not found` 
        }, { status: 400 })
      }

      const availableStock = product.stock_quantity || 0
      if (availableStock < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for "${product.name}". Only ${availableStock} available, but ${item.quantity} requested.` 
        }, { status: 400 })
      }
    }

    // Create line items for Stripe
    const line_items = cartItems.map((item: any) => ({
      price_data: {
        currency: AppConfig.getCurrency().toLowerCase(),
        product_data: {
          name: item.name,
          images: item.image_url ? [item.image_url] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Add tax line item dynamically
    const subtotal = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const tax = subtotal * AppConfig.getTaxRate()

    line_items.push({
      price_data: {
        currency: AppConfig.getCurrency().toLowerCase(),
        product_data: {
          name: "Tax",
        },
        unit_amount: Math.round(tax * 100),
      },
      quantity: 1,
    })

    // Add shipping cost line item
    const shippingCost = shippingMethod.cost || 0
    if (shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: AppConfig.getCurrency().toLowerCase(),
          product_data: {
            name: `Shipping - ${shippingMethod.name}`,
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      })
    }

    // Create Stripe checkout session
    let stripe
    try {
      stripe = getStripe()
    } catch (error) {
      console.error("Stripe initialization error:", error)
      return NextResponse.json({ error: "Payment system not configured. Please contact support." }, { status: 500 })
    }

    let session
    try {
      session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${request.nextUrl.origin}`}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${request.nextUrl.origin}`}/cart`,
        customer_email: user.email,
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'PL', 'IE', 'PT', 'GR', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'JP', 'CN', 'KR', 'IN', 'TH', 'SG', 'MY', 'PH', 'ID', 'VN', 'TW', 'HK', 'NZ', 'ZA', 'EG', 'KE', 'NG', 'GH', 'MA', 'TN', 'AE', 'SA', 'IL', 'TR', 'PK', 'BD', 'LK', 'NP', 'MM', 'KH', 'LA', 'BN', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'BO', 'PY', 'UY', 'CR', 'PA', 'GT', 'HN', 'NI', 'SV', 'DO', 'JM', 'TT', 'GY', 'SR', 'RU', 'UA', 'BY', 'KZ', 'UZ', 'GE', 'AM', 'AZ', 'IQ', 'JO', 'LB', 'YE', 'OM', 'KW', 'QA', 'BH', 'AF', 'ET', 'TZ', 'UG', 'RW', 'BW', 'NA', 'ZM', 'ZW', 'MU', 'SC', 'MG', 'MZ', 'AO', 'CV', 'DZ', 'LY', 'SD', 'SS', 'ER', 'DJ', 'SO', 'KM', 'AD', 'MC', 'SM', 'VA', 'LI', 'MT', 'CY', 'LU', 'IS', 'MD', 'MK', 'ME', 'RS', 'BA', 'AL', 'XK', 'MN', 'BT', 'MV', 'TL', 'FJ', 'PG', 'SB', 'VU', 'NC', 'PF', 'WS', 'KI', 'TV', 'NR', 'TO'],
        },
        metadata: {
          user_id: user.id,
        },
      } as any)
    } catch (error: any) {
      console.error("Stripe session creation error:", error)
      return NextResponse.json({ 
        error: `Stripe error: ${error.message || 'Unknown error'}` 
      }, { status: 500 })
    }

    // Create order in database
    const total = subtotal + tax + shippingCost
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total: total,
        status: "pending",
        stripe_session_id: session.id,
        shipping_address: {
          full_name: shippingAddress.fullName,
          address_line1: shippingAddress.addressLine1,
          address_line2: shippingAddress.addressLine2 || "",
          city: shippingAddress.city,
          state: shippingAddress.state || "",
          postal_code: shippingAddress.postalCode || "",
          country: shippingAddress.country,
          phone: shippingAddress.phone,
        },
        shipping_method: shippingMethod.name,
        shipping_cost: shippingCost,
        shipping_carrier: shippingMethod.carrier,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Database order creation error:", orderError)
      return NextResponse.json({ 
        error: `Database error: ${orderError.message}` 
      }, { status: 500 })
    }

    if (order) {
      // Create order items
      const { error: itemsError } = await supabase.from("order_items").insert(
        cartItems.map((item: any) => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      )

      if (itemsError) {
        console.error("Database order items creation error:", itemsError)
        // Don't fail the checkout if order items fail - order is already created
        // Just log the error
      }

      // Reduce stock quantity for each product
      for (const item of cartItems) {
        const { data: product, error: productError } = await supabase
          .from("products")
          .select("stock_quantity")
          .eq("id", item.id)
          .single()

        if (!productError && product) {
          const newStock = Math.max(0, (product.stock_quantity || 0) - item.quantity)
          
          await supabase
            .from("products")
            .update({ stock_quantity: newStock })
            .eq("id", item.id)
          
          console.log(`Stock reduced for product ${item.id}: ${product.stock_quantity} -> ${newStock}`)
        }
      }
    }

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("Unexpected checkout error:", error)
    return NextResponse.json({ 
      error: `Checkout failed: ${error.message || 'Unknown error'}` 
    }, { status: 500 })
  }
}
