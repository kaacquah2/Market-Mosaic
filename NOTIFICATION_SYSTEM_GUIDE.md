# Push Notifications & Promotions System

## Overview

This guide shows how to implement a comprehensive notification system for:
- **Order Updates** - Real-time order status notifications
- **Promotions** - Black Friday, sales, special offers
- **Marketing Campaigns** - Targeted user notifications
- **System Alerts** - Important account updates

## Architecture

### 1. Notification Types
- **Web Push Notifications** - Browser notifications
- **Email Notifications** - Order confirmations, promotions
- **In-App Notifications** - Real-time updates within the app
- **SMS Notifications** - Critical order updates (optional)

### 2. Database Schema

```sql
-- Notification templates
CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'order_update', 'promotion', 'marketing', 'system'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  icon VARCHAR(100),
  action_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User notification preferences
CREATE TABLE user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  marketing_emails BOOLEAN DEFAULT true,
  order_updates BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notification campaigns
CREATE TABLE notification_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  template_id UUID REFERENCES notification_templates(id),
  target_audience JSONB, -- User segments, demographics
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'scheduled', 'sent', 'cancelled'
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- User notifications log
CREATE TABLE user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES notification_campaigns(id),
  template_id UUID REFERENCES notification_templates(id),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  channel VARCHAR(20) NOT NULL, -- 'push', 'email', 'sms', 'in_app'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed'
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  clicked_at TIMESTAMP,
  action_url VARCHAR(500),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Push notification subscriptions
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Service Implementation

#### Notification Service (`lib/notification-service.ts`)

```typescript
import { createClient } from '@/lib/supabase/server'
import webpush from 'web-push'

export class NotificationService {
  private supabase = createClient()
  
  // Send push notification
  async sendPushNotification(userId: string, notification: {
    title: string
    message: string
    icon?: string
    actionUrl?: string
  }) {
    try {
      // Get user's push subscriptions
      const { data: subscriptions } = await this.supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userId)

      if (!subscriptions?.length) return false

      // Configure web push
      webpush.setVapidDetails(
        'mailto:your-email@example.com',
        process.env.VAPID_PUBLIC_KEY!,
        process.env.VAPID_PRIVATE_KEY!
      )

      // Send to all user's devices
      const promises = subscriptions.map(sub => 
        webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth
            }
          },
          JSON.stringify({
            title: notification.title,
            message: notification.message,
            icon: notification.icon || '/icon-192x192.png',
            url: notification.actionUrl || '/'
          })
        ).catch(err => console.error('Push notification failed:', err))
      )

      await Promise.allSettled(promises)
      return true
    } catch (error) {
      console.error('Error sending push notification:', error)
      return false
    }
  }

  // Send email notification
  async sendEmailNotification(userId: string, templateId: string, data: any) {
    try {
      const { data: user } = await this.supabase.auth.admin.getUserById(userId)
      const { data: template } = await this.supabase
        .from('notification_templates')
        .select('*')
        .eq('id', templateId)
        .single()

      if (!user || !template) return false

      // Use existing Resend service
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Market Mosaic <noreply@marketmosaic.com>',
          to: [user.user.email],
          subject: template.title,
          html: this.renderTemplate(template.message, data),
        }),
      })

      return response.ok
    } catch (error) {
      console.error('Error sending email notification:', error)
      return false
    }
  }

  // Create promotion campaign
  async createPromotionCampaign(campaign: {
    name: string
    templateId: string
    targetAudience: any
    scheduledAt?: Date
  }) {
    const { data, error } = await this.supabase
      .from('notification_campaigns')
      .insert({
        name: campaign.name,
        type: 'promotion',
        template_id: campaign.templateId,
        target_audience: campaign.targetAudience,
        scheduled_at: campaign.scheduledAt,
        status: 'draft'
      })
      .select()
      .single()

    return { data, error }
  }

  // Send campaign to users
  async sendCampaign(campaignId: string) {
    const { data: campaign } = await this.supabase
      .from('notification_campaigns')
      .select(`
        *,
        notification_templates (*)
      `)
      .eq('id', campaignId)
      .single()

    if (!campaign) return false

    // Get target users based on campaign criteria
    const users = await this.getTargetUsers(campaign.target_audience)

    // Send notifications to all users
    const promises = users.map(user => 
      this.sendNotificationToUser(user.id, {
        title: campaign.notification_templates.title,
        message: campaign.notification_templates.message,
        type: campaign.type,
        campaignId: campaignId
      })
    )

    await Promise.allSettled(promises)

    // Update campaign status
    await this.supabase
      .from('notification_campaigns')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', campaignId)

    return true
  }

  private async sendNotificationToUser(userId: string, notification: any) {
    // Send push notification
    await this.sendPushNotification(userId, notification)
    
    // Send email notification
    await this.sendEmailNotification(userId, notification.templateId, notification)
    
    // Log notification
    await this.supabase
      .from('user_notifications')
      .insert({
        user_id: userId,
        campaign_id: notification.campaignId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        channel: 'multi',
        status: 'sent',
        sent_at: new Date().toISOString()
      })
  }

  private async getTargetUsers(criteria: any) {
    let query = this.supabase
      .from('user_profiles')
      .select('user_id')

    // Apply targeting criteria
    if (criteria.country) {
      query = query.eq('country', criteria.country)
    }
    if (criteria.minOrders) {
      // Subquery for users with minimum orders
      query = query.in('user_id', 
        this.supabase
          .from('orders')
          .select('user_id')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      )
    }

    const { data } = await query
    return data || []
  }

  private renderTemplate(template: string, data: any): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || match)
  }
}
```

### 4. Frontend Implementation

#### Push Notification Setup (`components/push-notification-setup.tsx`)

```typescript
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function PushNotificationSetup() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window)
    checkSubscriptionStatus()
  }, [])

  const checkSubscriptionStatus = async () => {
    if (!isSupported) return

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    setIsSubscribed(!!subscription)
  }

  const subscribeToPush = async () => {
    if (!isSupported) return

    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      })

      // Save subscription to database
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase
          .from('push_subscriptions')
          .upsert({
            user_id: user.id,
            endpoint: subscription.endpoint,
            p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
            auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))),
            user_agent: navigator.userAgent
          })
      }

      setIsSubscribed(true)
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported) {
    return (
      <div className="text-sm text-muted-foreground">
        Push notifications are not supported in this browser
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={subscribeToPush}
        disabled={isSubscribed || isLoading}
        variant={isSubscribed ? "outline" : "default"}
        size="sm"
      >
        {isSubscribed ? "✓ Subscribed" : "Enable Push Notifications"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Get notified about order updates and special offers
      </p>
    </div>
  )
}
```

### 5. Admin Campaign Management

#### Campaign Dashboard (`app/admin/campaigns/page.tsx`)

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([])
  const [templates, setTemplates] = useState([])

  useEffect(() => {
    fetchCampaigns()
    fetchTemplates()
  }, [])

  const fetchCampaigns = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('notification_campaigns')
      .select(`
        *,
        notification_templates (name, title)
      `)
      .order('created_at', { ascending: false })
    
    setCampaigns(data || [])
  }

  const createBlackFridayCampaign = async () => {
    const supabase = createClient()
    
    // Create Black Friday template
    const { data: template } = await supabase
      .from('notification_templates')
      .insert({
        name: 'Black Friday Sale',
        type: 'promotion',
        title: '🔥 Black Friday Sale - Up to 70% Off!',
        message: 'Don\'t miss our biggest sale of the year! Up to 70% off on selected items. Limited time offer!',
        action_url: '/products?sale=true'
      })
      .select()
      .single()

    // Create campaign
    await supabase
      .from('notification_campaigns')
      .insert({
        name: 'Black Friday 2024',
        type: 'promotion',
        template_id: template.id,
        target_audience: {
          allUsers: true,
          minOrders: 0
        },
        scheduled_at: new Date('2024-11-29T00:00:00Z').toISOString(),
        status: 'scheduled'
      })

    fetchCampaigns()
  }

  const sendCampaign = async (campaignId: string) => {
    const response = await fetch('/api/admin/send-campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId })
    })

    if (response.ok) {
      fetchCampaigns()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notification Campaigns</h1>
        <Button onClick={createBlackFridayCampaign}>
          Create Black Friday Campaign
        </Button>
      </div>

      <div className="grid gap-4">
        {campaigns.map((campaign: any) => (
          <Card key={campaign.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{campaign.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {campaign.notification_templates?.title}
                  </p>
                </div>
                <Badge variant={
                  campaign.status === 'sent' ? 'default' :
                  campaign.status === 'scheduled' ? 'secondary' : 'outline'
                }>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {campaign.status === 'draft' && (
                  <Button 
                    size="sm" 
                    onClick={() => sendCampaign(campaign.id)}
                  >
                    Send Now
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

### 6. Environment Variables

Add to `.env.local`:

```env
# Push Notifications
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key

# Notification Settings
NEXT_PUBLIC_NOTIFICATION_ENABLED=true
```

### 7. Service Worker (`public/sw.js`)

```javascript
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {}
  
  const options = {
    body: data.message,
    icon: data.icon || '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: data.url || '/'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/xmark.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    )
  }
})
```

## Usage Examples

### Order Update Notifications
```typescript
// When order status changes
await notificationService.sendPushNotification(userId, {
  title: 'Order Update',
  message: `Your order #${orderId} has been shipped!`,
  actionUrl: `/account/orders/${orderId}`
})
```

### Black Friday Campaign
```typescript
// Create and send Black Friday campaign
await notificationService.createPromotionCampaign({
  name: 'Black Friday 2024',
  templateId: 'black-friday-template',
  targetAudience: { allUsers: true },
  scheduledAt: new Date('2024-11-29T00:00:00Z')
})
```

This system provides a complete notification infrastructure that can handle all types of promotional campaigns and order updates!
