import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { NotificationService } from '@/lib/notification-service'

// Send campaign
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!userRole || userRole.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { campaignId } = await request.json()
    
    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 })
    }

    const notificationService = new NotificationService(supabase)
    const success = await notificationService.sendCampaign(campaignId)

    if (!success) {
      return NextResponse.json({ error: 'Failed to send campaign' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending campaign:', error)
    return NextResponse.json({ error: 'Failed to send campaign' }, { status: 500 })
  }
}

