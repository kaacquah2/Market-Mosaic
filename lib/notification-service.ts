import type { SupabaseClient } from '@supabase/supabase-js'

export interface NotificationTemplate {
  id: string
  name: string
  type: 'order_update' | 'promotion' | 'marketing' | 'system'
  title: string
  message: string
  icon?: string
  action_url?: string
}

export interface NotificationCampaign {
  id: string
  name: string
  type: string
  template_id: string
  target_audience: any
  scheduled_at?: string
  sent_at?: string
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled'
  created_by: string
}

export interface PushSubscription {
  endpoint: string
  p256dh: string
  auth: string
}

export class NotificationService {
  private supabase: SupabaseClient

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient
  }

  private getSupabaseClient() {
    return this.supabase
  }

  // Send push notification
  async sendPushNotification(userId: string, notification: {
    title: string
    message: string
    icon?: string
    actionUrl?: string
  }): Promise<boolean> {
    try {
      const supabase = this.getSupabaseClient()
      // Check if user has push notifications enabled
      const { data: preferences } = await supabase
        .from('user_notification_preferences')
        .select('push_notifications')
        .eq('user_id', userId)
        .single()

      if (!preferences?.push_notifications) {
        console.log('Push notifications disabled for user:', userId)
        return false
      }

      // Get user's push subscriptions
      const { data: subscriptions } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userId)

      if (!subscriptions?.length) {
        console.log('No push subscriptions found for user:', userId)
        return false
      }

      // Send push notifications to all user's devices
      const promises = subscriptions.map(async (sub) => {
        try {
          const response = await fetch('/api/send-push-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              subscription: {
                endpoint: sub.endpoint,
                keys: {
                  p256dh: sub.p256dh,
                  auth: sub.auth
                }
              },
              payload: {
                title: notification.title,
                message: notification.message,
                icon: notification.icon || '/icon-192x192.png',
                url: notification.actionUrl || '/'
              }
            })
          })

          return response.ok
        } catch (error) {
          console.error('Error sending push notification:', error)
          return false
        }
      })

      const results = await Promise.allSettled(promises)
      const successCount = results.filter(result => 
        result.status === 'fulfilled' && result.value === true
      ).length

      console.log(`Push notification sent to ${successCount}/${subscriptions.length} devices`)
      return successCount > 0
    } catch (error) {
      console.error('Error sending push notification:', error)
      return false
    }
  }

  // Send email notification
  async sendEmailNotification(userId: string, templateId: string, data: any = {}): Promise<boolean> {
    try {
      const supabase = this.getSupabaseClient()
      // Check if user has email notifications enabled
      const { data: preferences } = await supabase
        .from('user_notification_preferences')
        .select('email_notifications')
        .eq('user_id', userId)
        .single()

      if (!preferences?.email_notifications) {
        console.log('Email notifications disabled for user:', userId)
        return false
      }

      // Get user email
      const { data: user } = await supabase.auth.admin.getUserById(userId)
      if (!user?.user?.email) {
        console.log('No email found for user:', userId)
        return false
      }

      // Get template
      const { data: template } = await supabase
        .from('notification_templates')
        .select('*')
        .eq('id', templateId)
        .single()

      if (!template) {
        console.log('Template not found:', templateId)
        return false
      }

      // Render template with data
      const renderedTitle = this.renderTemplate(template.title, data)
      const renderedMessage = this.renderTemplate(template.message, data)

      // Send email using existing Resend service
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Market Mosaic <noreply@marketmosaic.com>',
          to: [user.user.email],
          subject: renderedTitle,
          html: this.createEmailHTML(renderedTitle, renderedMessage, template.action_url),
        }),
      })

      return response.ok
    } catch (error) {
      console.error('Error sending email notification:', error)
      return false
    }
  }

  // Send notification to user (multi-channel)
  async sendNotificationToUser(
    userId: string, 
    notification: {
      title: string
      message: string
      type: string
      templateId?: string
      campaignId?: string
      actionUrl?: string
      icon?: string
    }
  ): Promise<boolean> {
    try {
      // Send push notification
      const pushSuccess = await this.sendPushNotification(userId, {
        title: notification.title,
        message: notification.message,
        icon: notification.icon,
        actionUrl: notification.actionUrl
      })

      // Send email notification if template is provided
      let emailSuccess = false
      if (notification.templateId) {
        emailSuccess = await this.sendEmailNotification(userId, notification.templateId, {
          title: notification.title,
          message: notification.message,
          actionUrl: notification.actionUrl
        })
      }

      // Log notification
      const supabase = this.getSupabaseClient()
      await supabase.rpc('log_notification_delivery', {
        p_user_id: userId,
        p_campaign_id: notification.campaignId || null,
        p_template_id: notification.templateId || null,
        p_title: notification.title,
        p_message: notification.message,
        p_type: notification.type,
        p_channel: 'multi',
        p_action_url: notification.actionUrl || null,
        p_metadata: {
          push_success: pushSuccess,
          email_success: emailSuccess
        }
      })

      return pushSuccess || emailSuccess
    } catch (error) {
      console.error('Error sending notification to user:', error)
      return false
    }
  }

  // Create promotion campaign
  async createPromotionCampaign(campaign: {
    name: string
    type: string
    templateId: string
    targetAudience: any
    scheduledAt?: Date
  }): Promise<{ data: any; error: any }> {
    try {
      const supabase = this.getSupabaseClient()
      const { data, error } = await supabase
        .from('notification_campaigns')
        .insert({
          name: campaign.name,
          type: campaign.type,
          template_id: campaign.templateId,
          target_audience: campaign.targetAudience,
          scheduled_at: campaign.scheduledAt?.toISOString(),
          status: 'draft'
        })
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Send campaign to users
  async sendCampaign(campaignId: string): Promise<boolean> {
    try {
      const supabase = this.getSupabaseClient()
      const { data: campaign } = await supabase
        .from('notification_campaigns')
        .select(`
          *,
          notification_templates (*)
        `)
        .eq('id', campaignId)
        .single()

      if (!campaign) {
        console.log('Campaign not found:', campaignId)
        return false
      }

      // Get target users based on campaign criteria
      const users = await this.getTargetUsers(campaign.target_audience)

      console.log(`Sending campaign "${campaign.name}" to ${users.length} users`)

      // Send notifications to all users
      const promises = users.map(user => 
        this.sendNotificationToUser(user.user_id, {
          title: campaign.notification_templates.title,
          message: campaign.notification_templates.message,
          type: campaign.type,
          templateId: campaign.template_id,
          campaignId: campaignId,
          actionUrl: campaign.notification_templates.action_url,
          icon: campaign.notification_templates.icon
        })
      )

      const results = await Promise.allSettled(promises)
      const successCount = results.filter(result => 
        result.status === 'fulfilled' && result.value === true
      ).length

      // Update campaign status
      await supabase
        .from('notification_campaigns')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', campaignId)

      console.log(`Campaign sent successfully to ${successCount}/${users.length} users`)
      return successCount > 0
    } catch (error) {
      console.error('Error sending campaign:', error)
      return false
    }
  }

  // Get target users based on campaign criteria
  private async getTargetUsers(criteria: any): Promise<{ user_id: string }[]> {
    try {
      const supabase = this.getSupabaseClient()
      let query = supabase
        .from('user_notification_preferences')
        .select('user_id')

      // Apply targeting criteria
      if (criteria.allUsers) {
        // Get all users with notification preferences
        const { data } = await query
        return data || []
      }

      if (criteria.minOrders) {
        // Get users with minimum number of orders
        const { data } = await supabase
          .from('orders')
          .select('user_id')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        
        const userIds = [...new Set(data?.map(order => order.user_id) || [])]
        
        if (userIds.length >= criteria.minOrders) {
          const { data: preferences } = await supabase
            .from('user_notification_preferences')
            .select('user_id')
            .in('user_id', userIds)
          
          return preferences || []
        }
      }

      if (criteria.country) {
        // Get users from specific country
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('user_id')
          .eq('country', criteria.country)

        const userIds = profiles?.map(profile => profile.user_id) || []
        
        const { data: preferences } = await supabase
          .from('user_notification_preferences')
          .select('user_id')
          .in('user_id', userIds)
        
        return preferences || []
      }

      // Default: return all users with preferences
      const { data } = await query
      return data || []
    } catch (error) {
      console.error('Error getting target users:', error)
      return []
    }
  }

  // Get notification templates
  async getTemplates(type?: string): Promise<NotificationTemplate[]> {
    try {
      const supabase = this.getSupabaseClient()
      let query = supabase
        .from('notification_templates')
        .select('*')
        .order('name')

      if (type) {
        query = query.eq('type', type)
      }

      const { data, error } = await query
      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Error fetching templates:', error)
      return []
    }
  }

  // Get user's notification preferences
  async getUserPreferences(userId: string): Promise<any> {
    try {
      const supabase = this.getSupabaseClient()
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.error('Error fetching user preferences:', error)
      return null
    }
  }

  // Update user's notification preferences
  async updateUserPreferences(userId: string, preferences: any): Promise<boolean> {
    try {
      const supabase = this.getSupabaseClient()
      const { error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating user preferences:', error)
      return false
    }
  }

  // Get user's notifications
  async getUserNotifications(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const supabase = this.getSupabaseClient()
      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user notifications:', error)
      return []
    }
  }

  // Send order update notification
  async sendOrderUpdateNotification(userId: string, orderId: string, status: string): Promise<boolean> {
    try {
      let templateName = ''
      let actionUrl = `/account/orders/${orderId}`

      switch (status) {
        case 'confirmed':
          templateName = 'Order Confirmed'
          break
        case 'shipped':
          templateName = 'Order Shipped'
          break
        case 'delivered':
          templateName = 'Order Delivered'
          break
        default:
          templateName = 'Order Confirmed'
      }

      // Get template
      const supabase = this.getSupabaseClient()
      const { data: template } = await supabase
        .from('notification_templates')
        .select('*')
        .eq('name', templateName)
        .single()

      if (!template) {
        console.log('Template not found:', templateName)
        return false
      }

      // Send notification
      return await this.sendNotificationToUser(userId, {
        title: template.title,
        message: template.message,
        type: 'order_update',
        templateId: template.id,
        actionUrl: actionUrl,
        icon: template.icon
      })
    } catch (error) {
      console.error('Error sending order update notification:', error)
      return false
    }
  }

  // Render template with data
  private renderTemplate(template: string, data: any): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] || match)
  }

  // Create email HTML
  private createEmailHTML(title: string, message: string, actionUrl?: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
        </div>
        
        <div class="content">
          <p>${message}</p>
          
          ${actionUrl ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${actionUrl}" class="button">View Details</a>
          </div>
          ` : ''}
        </div>

        <div class="footer">
          <p>© 2024 Market Mosaic. All rights reserved.</p>
        </div>
      </body>
      </html>
    `
  }
}

