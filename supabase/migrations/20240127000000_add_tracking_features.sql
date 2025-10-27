-- Add tracking-related columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipping_carrier TEXT,
ADD COLUMN IF NOT EXISTS estimated_delivery TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;

-- Create order tracking history table
CREATE TABLE IF NOT EXISTS order_tracking_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  location TEXT,
  description TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_order_tracking_history_order_id ON order_tracking_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_tracking_history_timestamp ON order_tracking_history(timestamp DESC);

-- Enable RLS on tracking history table
ALTER TABLE order_tracking_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view tracking history for their own orders
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

-- Policy: Admins can insert and update tracking history
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

-- Add comment to document the table
COMMENT ON TABLE order_tracking_history IS 'Stores tracking updates and status changes for orders';

