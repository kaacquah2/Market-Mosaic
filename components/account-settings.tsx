"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Mail, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AccountSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // You can load saved preferences from database here
  }, [])

  const handleToggle = async (setting: string, value: boolean) => {
    
    // In a real app, you'd save these to your database
    // For now, we'll just show a toast
    
    if (setting === 'email') {
      setEmailNotifications(value)
      toast({
        title: "Email notifications " + (value ? "enabled" : "disabled"),
      })
    } else if (setting === 'marketing') {
      setMarketingEmails(value)
      toast({
        title: "Marketing emails " + (value ? "enabled" : "disabled"),
      })
    } else if (setting === 'push') {
      setPushNotifications(value)
      toast({
        title: "Push notifications " + (value ? "enabled" : "disabled"),
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Control how you receive updates and notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="email-notifications" className="font-semibold">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about your orders
              </p>
            </div>
          </div>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={(checked) => handleToggle('email', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="marketing-emails" className="font-semibold">
                Marketing Emails
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive promotional offers and deals
              </p>
            </div>
          </div>
          <Switch
            id="marketing-emails"
            checked={marketingEmails}
            onCheckedChange={(checked) => handleToggle('marketing', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="push-notifications" className="font-semibold">
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified about order updates
              </p>
            </div>
          </div>
          <Switch
            id="push-notifications"
            checked={pushNotifications}
            onCheckedChange={(checked) => handleToggle('push', checked)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

