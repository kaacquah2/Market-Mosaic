import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Check if user is authenticated and is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: userRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (!userRole || userRole.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const {
      status,
      tracking_number,
      shipping_carrier,
      estimated_delivery,
      current_location,
      tracking_update,
    } = body

    // Update order
    const updateData: any = {}
    if (status) updateData.status = status
    if (tracking_number !== undefined) updateData.tracking_number = tracking_number
    if (shipping_carrier !== undefined) updateData.shipping_carrier = shipping_carrier
    if (estimated_delivery !== undefined) updateData.estimated_delivery = estimated_delivery
    if (current_location !== undefined) updateData.current_location = current_location

    // Set timestamps based on status
    if (status === "shipped" && !updateData.shipped_at) {
      updateData.shipped_at = new Date().toISOString()
    }
    if (status === "delivered" && !updateData.delivered_at) {
      updateData.delivered_at = new Date().toISOString()
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (orderError) {
      console.error("Error updating order:", orderError)
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }

    // Add tracking history entry if provided
    if (tracking_update) {
      const { error: historyError } = await supabase.from("order_tracking_history").insert({
        order_id: id,
        status: tracking_update.status || status,
        location: tracking_update.location,
        description: tracking_update.description,
        timestamp: tracking_update.timestamp || new Date().toISOString(),
      })

      if (historyError) {
        console.error("Error adding tracking history:", historyError)
        // Don't fail the request if history insertion fails
      }
    }

    // Send notification to customer (optional)
    // You can integrate email/SMS notifications here

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error("Error updating order tracking:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get tracking history for the order
    const { data: history, error } = await supabase
      .from("order_tracking_history")
      .select("*")
      .eq("order_id", id)
      .order("timestamp", { ascending: false })

    if (error) {
      console.error("Error fetching tracking history:", error)
      return NextResponse.json({ error: "Failed to fetch tracking history" }, { status: 500 })
    }

    return NextResponse.json({ history: history || [] })
  } catch (error: any) {
    console.error("Error fetching tracking history:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

