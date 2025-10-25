import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { NotificationService } from '@/lib/notification-service'

// Update order status and send notifications
export async function POST(request: NextRequest) {
  try {
    const { orderId, status, adminUserId } = await request.json()

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if user is admin
    if (adminUserId) {
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', adminUserId)
        .single()

      if (!userRole || userRole.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Update order status
    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select('user_id')
      .single()

    if (updateError) {
      console.error('Error updating order:', updateError)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    // Send notification to user
    if (order?.user_id) {
      const notificationService = new NotificationService()
      
      // Send appropriate notification based on status
      let notificationStatus = status
      if (status === 'processing') {
        notificationStatus = 'confirmed'
      } else if (status === 'in_transit') {
        notificationStatus = 'shipped'
      }

      await notificationService.sendOrderUpdateNotification(
        order.user_id, 
        orderId, 
        notificationStatus
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: `Order ${orderId} status updated to ${status}` 
    })

  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Get order status history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get order details
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Get related notifications
    const { data: notifications } = await supabase
      .from('user_notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'order_update')
      .contains('metadata', { orderId })
      .order('created_at', { ascending: false })

    return NextResponse.json({
      order,
      notifications: notifications || []
    })

  } catch (error) {
    console.error('Error fetching order status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

