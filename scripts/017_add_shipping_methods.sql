-- Add shipping method and cost fields to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_method TEXT DEFAULT 'standard';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(10, 2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_carrier TEXT; -- e.g., 'DHL', 'FedEx', 'UPS', 'USPS'

-- Add comment for documentation
COMMENT ON COLUMN public.orders.shipping_method IS 'Shipping method: standard, express, overnight, etc.';
COMMENT ON COLUMN public.orders.shipping_cost IS 'Shipping cost in dollars';
COMMENT ON COLUMN public.orders.shipping_carrier IS 'Shipping carrier: DHL, FedEx, UPS, USPS, etc.';

-- Create shipping methods table for reference
CREATE TABLE IF NOT EXISTS public.shipping_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  carrier TEXT NOT NULL,
  description TEXT,
  base_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
  estimated_days INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on shipping_methods table
ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;

-- Shipping methods are publicly readable
CREATE POLICY "shipping_methods_select_public"
  ON public.shipping_methods FOR SELECT
  USING (true);

-- Insert default shipping methods
INSERT INTO public.shipping_methods (name, carrier, description, base_cost, estimated_days) VALUES
  ('Standard Shipping', 'USPS', 'Standard ground shipping', 5.99, 7),
  ('Express Shipping', 'FedEx', '2-3 business days', 15.99, 3),
  ('Overnight Shipping', 'FedEx', 'Next business day delivery', 29.99, 1),
  ('International Standard', 'DHL', 'International standard shipping', 24.99, 14),
  ('International Express', 'DHL', 'International express shipping', 49.99, 5)
ON CONFLICT (name) DO NOTHING;

