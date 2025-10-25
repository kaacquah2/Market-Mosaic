-- Add unique constraint to name field (will fail silently if it already exists)
DO $$ 
BEGIN
    ALTER TABLE notification_templates ADD CONSTRAINT notification_templates_name_unique UNIQUE (name);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Insert default notification templates
INSERT INTO notification_templates (name, type, title, message, icon, action_url) VALUES
('Order Confirmed', 'order_update', 'Order Confirmed! 🎉', 'Your order has been confirmed and is being processed.', 'package', '/account/orders'),
('Order Shipped', 'order_update', 'Your Order is on the Way! 📦', 'Great news! Your order has been shipped and is on its way to you.', 'truck', '/account/orders'),
('Order Delivered', 'order_update', 'Order Delivered! ✅', 'Your order has been successfully delivered. Enjoy your purchase!', 'check-circle', '/account/orders'),
('Black Friday Sale', 'promotion', '🔥 Black Friday Sale - Up to 70% Off!', 'Don''t miss our biggest sale of the year! Up to 70% off on selected items. Limited time offer!', 'fire', '/products?sale=true'),
('Flash Sale', 'promotion', '⚡ Flash Sale - 50% Off Everything!', 'Limited time offer! Get 50% off on all items. Sale ends in 24 hours!', 'zap', '/products?flash=true'),
('New Product Alert', 'marketing', 'New Product Just Dropped! 🆕', 'Check out our latest addition to the collection. You might love this!', 'star', '/products'),
('Cart Abandonment', 'marketing', 'Don''t Forget Your Items! 🛒', 'You have items waiting in your cart. Complete your purchase now!', 'shopping-cart', '/cart'),
('Welcome Message', 'system', 'Welcome to Market Mosaic! 👋', 'Thank you for joining us. Explore our amazing products and enjoy shopping!', 'heart', '/products')
ON CONFLICT (name) DO UPDATE SET
  type = EXCLUDED.type,
  title = EXCLUDED.title,
  message = EXCLUDED.message,
  icon = EXCLUDED.icon,
  action_url = EXCLUDED.action_url,
  updated_at = NOW();

-- Verify templates were inserted
SELECT 'Template count: ' || COUNT(*) FROM notification_templates;

