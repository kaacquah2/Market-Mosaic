/**
 * API endpoint for automated tracking updates
 * This can be called by webhooks from carriers or scheduled tasks
 */

import { NextRequest, NextResponse } from 'next/server'
import { updateOrderTrackingFromCarrier, batchUpdateAllTracking } from '@/lib/automated-tracking-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, updateAll } = body

    if (updateAll) {
      // Update all orders with tracking numbers
      await batchUpdateAllTracking()
      return NextResponse.json({ message: 'All tracking updated' })
    }

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID required' },
        { status: 400 }
      )
    }

    // Update specific order
    const result = await updateOrderTrackingFromCarrier(orderId)

    if (!result) {
      return NextResponse.json(
        { error: 'Could not fetch tracking information' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Tracking updated successfully',
      tracking: result
    })
  } catch (error) {
    console.error('Error updating tracking:', error)
    return NextResponse.json(
      { error: 'Failed to update tracking' },
      { status: 500 }
    )
  }
}

// Allow GET for webhook testing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (orderId) {
      const result = await updateOrderTrackingFromCarrier(orderId)
      return NextResponse.json(result || { message: 'No tracking data found' })
    }

    // Return list of available endpoints
    return NextResponse.json({
      endpoints: {
        updateOrder: 'POST /api/tracking/update with { orderId }',
        updateAll: 'POST /api/tracking/update with { updateAll: true }',
        testOrder: 'GET /api/tracking/update?orderId=ORDER_ID'
      }
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

