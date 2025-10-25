-- Update all products to be in stock (run this in Supabase SQL Editor)
-- This will bypass RLS policies

UPDATE public.products
SET stock_quantity = FLOOR(RANDOM() * 90 + 10)::INTEGER
WHERE stock_quantity = 0 OR stock_quantity IS NULL;

-- Verify the update
SELECT id, name, stock_quantity 
FROM public.products 
ORDER BY created_at DESC 
LIMIT 10;

