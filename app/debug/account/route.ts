import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      return NextResponse.json({
        error: "Auth error",
        message: userError.message,
        code: userError.code,
      }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({
        error: "Not authenticated",
      }, { status: 401 })
    }

    // Test profile fetch
    const profileStart = Date.now()
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
    const profileTime = Date.now() - profileStart

    // Test orders fetch
    const ordersStart = Date.now()
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
    const ordersTime = Date.now() - ordersStart

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
      profile: {
        data: profile,
        error: profileError ? profileError.message : null,
        time: `${profileTime}ms`,
      },
      orders: {
        count: orders?.length || 0,
        error: ordersError ? ordersError.message : null,
        time: `${ordersTime}ms`,
      },
      timings: {
        profile: profileTime,
        orders: ordersTime,
        total: profileTime + ordersTime,
      },
    })
  } catch (error) {
    return NextResponse.json({
      error: "Server error",
      message: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  }
}


