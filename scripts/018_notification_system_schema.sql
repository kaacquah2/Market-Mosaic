-- Notification System Database Schema
-- Run this script in your Supabase SQL Editor

-- 1. Notification templates
CREATE TABLE IF NOT EXISTS notification_templates (
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

-- 2. User notification preferences
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  marketing_emails BOOLEAN DEFAULT true,
  order_updates BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. Notification campaigns
CREATE TABLE IF NOT EXISTS notification_campaigns (
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

-- 4. User notifications log
CREATE TABLE IF NOT EXISTS user_notifications (
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

-- 5. Push notification subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Insert default notification templates
INSERT INTO notification_templates (name, type, title, message, icon, action_url) VALUES
('Order Confirmed', 'order_update', 'Order Confirmed! 🎉', 'Your order has been confirmed and is being processed.', 'package', '/account/orders'),
('Order Shipped', 'order_update', 'Your Order is on the Way! 📦', 'Great news! Your order has been shipped and is on its way to you.', 'truck', '/account/orders'),
('Order Delivered', 'order_update', 'Order Delivered! ✅', 'Your order has been successfully delivered. Enjoy your purchase!', 'check-circle', '/account/orders'),
('Black Friday Sale', 'promotion', '🔥 Black Friday Sale - Up to 70% Off!', 'Don''t miss our biggest sale of the year! Up to 70% off on selected items. Limited time offer!', 'fire', '/products?sale=true'),
('Flash Sale', 'promotion', '⚡ Flash Sale - 50% Off Everything!', 'Limited time offer! Get 50% off on all items. Sale ends in 24 hours!', 'zap', '/products?flash=true'),
('New Product Alert', 'marketing', 'New Product Just Dropped! 🆕', 'Check out our latest addition to the collection. You might love this!', 'star', '/products'),
('Cart Abandonment', 'marketing', 'Don''t Forget Your Items! 🛒', 'You have items waiting in your cart. Complete your purchase now!', 'shopping-cart', '/cart'),
('Welcome Message', 'system', 'Welcome to Market Mosaic! 👋', 'Thank you for joining us. Explore our amazing products and enjoy shopping!', 'heart', '/products')
ON CONFLICT DO NOTHING;

-- 7. Enable Row Level Security
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies
-- Templates: Read-only for all authenticated users
CREATE POLICY "Templates are viewable by authenticated users" ON notification_templates
  FOR SELECT USING (auth.role() = 'authenticated');

-- User preferences: Users can manage their own preferences
CREATE POLICY "Users can manage their own notification preferences" ON user_notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Campaigns: Only admins can manage campaigns
CREATE POLICY "Admins can manage campaigns" ON notification_campaigns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- User notifications: Users can view their own notifications
CREATE POLICY "Users can view their own notifications" ON user_notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Push subscriptions: Users can manage their own subscriptions
CREATE POLICY "Users can manage their own push subscriptions" ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- 9. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_status ON user_notifications(status);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON user_notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_campaigns_status ON notification_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_notification_campaigns_scheduled_at ON notification_campaigns(scheduled_at);

-- 10. Create function to automatically create user notification preferences
CREATE OR REPLACE FUNCTION create_user_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create trigger to auto-create preferences for new users
DROP TRIGGER IF EXISTS create_notification_preferences_trigger ON auth.users;
CREATE TRIGGER create_notification_preferences_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_notification_preferences();

-- 12. Create function to log notification delivery
CREATE OR REPLACE FUNCTION log_notification_delivery(
  p_user_id UUID,
  p_campaign_id UUID,
  p_template_id UUID,
  p_title VARCHAR(255),
  p_message TEXT,
  p_type VARCHAR(50),
  p_channel VARCHAR(20),
  p_action_url VARCHAR(500) DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO user_notifications (
    user_id, campaign_id, template_id, title, message, type, 
    channel, action_url, metadata, status, sent_at
  ) VALUES (
    p_user_id, p_campaign_id, p_template_id, p_title, p_message, 
    p_type, p_channel, p_action_url, p_metadata, 'sent', NOW()
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON notification_templates TO authenticated;
GRANT ALL ON user_notification_preferences TO authenticated;
GRANT ALL ON user_notifications TO authenticated;
GRANT ALL ON push_subscriptions TO authenticated;
GRANT ALL ON notification_campaigns TO authenticated;
GRANT EXECUTE ON FUNCTION log_notification_delivery TO authenticated;

