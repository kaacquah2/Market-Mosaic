'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { NotificationService } from '@/lib/notification-service'
import { Bell, BellOff, Settings, CheckCircle, AlertCircle } from 'lucide-react'

interface NotificationPreferences {
  email_notifications: boolean
  push_notifications: boolean
  sms_notifications: boolean
  marketing_emails: boolean
  order_updates: boolean
}

export function PushNotificationSetup() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    marketing_emails: true,
    order_updates: true
  })
  const [user, setUser] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    checkSupport()
    checkAuth()
  }, [])

  const checkSupport = () => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window
    setIsSupported(supported)
    
    if (supported) {
      checkSubscriptionStatus()
    }
  }

  const checkAuth = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      setUser(user)
      await fetchUserPreferences(user.id)
    }
  }

  const fetchUserPreferences = async (userId: string) => {
    try {
      const notificationService = new NotificationService()
      const userPreferences = await notificationService.getUserPreferences(userId)
      
      if (userPreferences) {
        setPreferences({
          email_notifications: userPreferences.email_notifications ?? true,
          push_notifications: userPreferences.push_notifications ?? true,
          sms_notifications: userPreferences.sms_notifications ?? false,
          marketing_emails: userPreferences.marketing_emails ?? true,
          order_updates: userPreferences.order_updates ?? true
        })
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error)
    }
  }

  const checkSubscriptionStatus = async () => {
    if (!isSupported) return

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    } catch (error) {
      console.error('Error checking subscription status:', error)
    }
  }

  const subscribeToPush = async () => {
    if (!isSupported || !user) return

    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      })

      // Save subscription to database
      const supabase = createClient()
      await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          endpoint: subscription.endpoint,
          p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
          auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))),
          user_agent: navigator.userAgent
        })

      setIsSubscribed(true)
      
      // Show success message
      const notificationService = new NotificationService()
      await notificationService.sendNotificationToUser(user.id, {
        title: 'Notifications Enabled! 🔔',
        message: 'You\'ll now receive updates about your orders and special offers.',
        type: 'system',
        actionUrl: '/account'
      })
      
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
      alert('Failed to enable push notifications. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribeFromPush = async () => {
    if (!isSupported || !user) return

    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        await subscription.unsubscribe()
      }

      // Remove subscription from database
      const supabase = createClient()
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user.id)

      setIsSubscribed(false)
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    if (!user) return

    setSaving(true)
    try {
      const updatedPreferences = { ...preferences, [key]: value }
      setPreferences(updatedPreferences)

      const notificationService = new NotificationService()
      await notificationService.updateUserPreferences(user.id, updatedPreferences)
    } catch (error) {
      console.error('Error updating preferences:', error)
      // Revert on error
      setPreferences(preferences)
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
            Please log in to manage your notification preferences.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Push Notification Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Get instant updates about your orders and special offers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isSupported ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Push notifications are not supported in this browser</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Browser Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications even when the app is closed
                  </p>
                </div>
                <Button
                  onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
                  disabled={isLoading}
                  variant={isSubscribed ? "outline" : "default"}
                  size="sm"
                >
                  {isLoading ? (
                    "Processing..."
                  ) : isSubscribed ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Enabled
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4 mr-2" />
                      Enable
                    </>
                  )}
                </Button>
              </div>
              
              {isSubscribed && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Push notifications are enabled for this device</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose what types of notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="email-notifications" className="text-base font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive order confirmations and updates via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.email_notifications}
              onCheckedChange={(checked) => updatePreference('email_notifications', checked)}
              disabled={saving}
            />
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="push-notifications" className="text-base font-medium">
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive instant browser notifications
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={preferences.push_notifications}
              onCheckedChange={(checked) => updatePreference('push_notifications', checked)}
              disabled={saving || !isSupported}
            />
          </div>

          {/* Order Updates */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="order-updates" className="text-base font-medium">
                Order Updates
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when your order status changes
              </p>
            </div>
            <Switch
              id="order-updates"
              checked={preferences.order_updates}
              onCheckedChange={(checked) => updatePreference('order_updates', checked)}
              disabled={saving}
            />
          </div>

          {/* Marketing Emails */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="marketing-emails" className="text-base font-medium">
                Marketing Emails
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive promotional offers and product updates
              </p>
            </div>
            <Switch
              id="marketing-emails"
              checked={preferences.marketing_emails}
              onCheckedChange={(checked) => updatePreference('marketing_emails', checked)}
              disabled={saving}
            />
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="sms-notifications" className="text-base font-medium">
                SMS Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive critical updates via text message
              </p>
            </div>
            <Switch
              id="sms-notifications"
              checked={preferences.sms_notifications}
              onCheckedChange={(checked) => updatePreference('sms_notifications', checked)}
              disabled={saving}
            />
          </div>
        </CardContent>
      </Card>

      {/* Test Notification */}
      {isSubscribed && (
        <Card>
          <CardHeader>
            <CardTitle>Test Notifications</CardTitle>
            <CardDescription>
              Send yourself a test notification to make sure everything is working
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={async () => {
                const notificationService = new NotificationService()
                await notificationService.sendNotificationToUser(user.id, {
                  title: 'Test Notification 🧪',
                  message: 'This is a test notification to verify everything is working correctly!',
                  type: 'system',
                  actionUrl: '/account'
                })
              }}
              variant="outline"
              className="w-full"
            >
              Send Test Notification
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

