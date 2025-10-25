import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { NotificationService } from '@/lib/notification-service'

// Send push notification API
export async function POST(request: NextRequest) {
  try {
    const { subscription, payload } = await request.json()

    if (!subscription || !payload) {
      return NextResponse.json({ error: 'Missing subscription or payload' }, { status: 400 })
    }

    // Send push notification using web-push
    const webpush = require('web-push')
    
    // Configure web push
    webpush.setVapidDetails(
      'mailto:noreply@marketmosaic.com',
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    )

    const result = await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    )

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Error sending push notification:', error)
    return NextResponse.json({ error: 'Failed to send push notification' }, { status: 500 })
  }
}

