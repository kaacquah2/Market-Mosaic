-- Update all products to be in stock
-- Set stock_quantity to a random value between 10 and 100 for each product

UPDATE public.products
SET stock_quantity = FLOOR(RANDOM() * 90 + 10)::INTEGER
WHERE stock_quantity = 0 OR stock_quantity IS NULL;

-- Alternatively, set all products to a fixed stock of 100
-- UPDATE public.products SET stock_quantity = 100 WHERE stock_quantity = 0 OR stock_quantity IS NULL;

-- Verify the update
SELECT id, name, stock_quantity FROM public.products ORDER BY created_at DESC LIMIT 10;

