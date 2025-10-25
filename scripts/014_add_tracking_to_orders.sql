-- Add tracking fields to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS current_location JSONB;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS destination_address JSONB;

-- Add index for tracking_number
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON public.orders(tracking_number);

-- Add comment for documentation
COMMENT ON COLUMN public.orders.shipping_address IS 'Full shipping address details';
COMMENT ON COLUMN public.orders.tracking_number IS 'Unique tracking number for the shipment';
COMMENT ON COLUMN public.orders.current_location IS 'Current location coordinates {lat, lng}';
COMMENT ON COLUMN public.orders.destination_address IS 'Destination address for delivery';

