-- Create returns table for handling product returns and refunds
CREATE TABLE IF NOT EXISTS public.returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processing', 'completed', 'cancelled')),
  reason VARCHAR(50) NOT NULL CHECK (reason IN ('defective', 'wrong_item', 'not_as_described', 'changed_mind', 'damaged_shipping', 'other')),
  description TEXT,
  refund_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  refund_method VARCHAR(20) DEFAULT 'original_payment' CHECK (refund_method IN ('original_payment', 'store_credit', 'exchange')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT
);

-- Create return_items table for individual items in a return
CREATE TABLE IF NOT EXISTS public.return_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_id UUID NOT NULL REFERENCES public.returns(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  condition VARCHAR(20) NOT NULL DEFAULT 'good' CHECK (condition IN ('good', 'damaged', 'defective')),
  refund_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on returns table
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;

-- Users can view their own returns
CREATE POLICY "returns_select_own"
  ON public.returns FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own returns
CREATE POLICY "returns_insert_own"
  ON public.returns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own returns (only if pending)
CREATE POLICY "returns_update_own"
  ON public.returns FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Admins can view all returns
CREATE POLICY "returns_select_admin"
  ON public.returns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Admins can update all returns
CREATE POLICY "returns_update_admin"
  ON public.returns FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Enable RLS on return_items table
ALTER TABLE public.return_items ENABLE ROW LEVEL SECURITY;

-- Users can view return items for their returns
CREATE POLICY "return_items_select_own"
  ON public.return_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.returns 
      WHERE id = return_items.return_id 
      AND user_id = auth.uid()
    )
  );

-- Users can insert return items for their returns
CREATE POLICY "return_items_insert_own"
  ON public.return_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.returns 
      WHERE id = return_items.return_id 
      AND user_id = auth.uid()
      AND status = 'pending'
    )
  );

-- Admins can view all return items
CREATE POLICY "return_items_select_admin"
  ON public.return_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create function to update return timestamp
CREATE OR REPLACE FUNCTION public.update_return_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update return timestamp
DROP TRIGGER IF EXISTS on_return_update ON public.returns;
CREATE TRIGGER on_return_update
  BEFORE UPDATE ON public.returns
  FOR EACH ROW EXECUTE FUNCTION public.update_return_timestamp();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_returns_user_id ON public.returns(user_id);
CREATE INDEX IF NOT EXISTS idx_returns_order_id ON public.returns(order_id);
CREATE INDEX IF NOT EXISTS idx_returns_status ON public.returns(status);
CREATE INDEX IF NOT EXISTS idx_return_items_return_id ON public.return_items(return_id);
CREATE INDEX IF NOT EXISTS idx_return_items_order_item_id ON public.return_items(order_item_id);
