/**
 * Live tracking endpoint for users
 * Fetches real-time tracking information
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchCarrierTracking } from '@/lib/automated-tracking-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch order
    const { data: order } = await supabase
      .from('orders')
      .select('id, tracking_number, shipping_carrier, user_id')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (!order.tracking_number || !order.shipping_carrier) {
      return NextResponse.json(
        { error: 'No tracking information available' },
        { status: 404 }
      )
    }

    // Fetch live tracking from carrier
    const trackingData = await fetchCarrierTracking(
      order.tracking_number,
      order.shipping_carrier
    )

    if (!trackingData) {
      return NextResponse.json(
        { error: 'Could not fetch tracking information' },
        { status: 404 }
      )
    }

    return NextResponse.json(trackingData)
  } catch (error) {
    console.error('Error fetching live tracking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tracking' },
      { status: 500 }
    )
  }
}

