-- ========================================
-- ORDER TRACKING MIGRATION
-- Run this SQL in your Supabase SQL Editor
-- ========================================

-- 1. Add tracking-related columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipping_carrier TEXT,
ADD COLUMN IF NOT EXISTS estimated_delivery TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;

-- 2. Create order tracking history table
CREATE TABLE IF NOT EXISTS order_tracking_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  location TEXT,
  description TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_order_tracking_history_order_id ON order_tracking_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_tracking_history_timestamp ON order_tracking_history(timestamp DESC);

-- 4. Enable RLS on tracking history table
ALTER TABLE order_tracking_history ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their order tracking history" ON order_tracking_history;
DROP POLICY IF EXISTS "Admins can manage tracking history" ON order_tracking_history;

-- 6. Policy: Users can view tracking history for their own orders
CREATE POLICY "Users can view their order tracking history"
ON order_tracking_history
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_tracking_history.order_id
    AND orders.user_id = auth.uid()
  )
);

-- 7. Policy: Admins can insert and update tracking history
CREATE POLICY "Admins can manage tracking history"
ON order_tracking_history
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- 8. Add comment to document the table
COMMENT ON TABLE order_tracking_history IS 'Stores tracking updates and status changes for orders';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Order tracking migration completed successfully!';
END $$;

