-- Check current stock status and update all products to be in stock
-- Run this in Supabase SQL Editor

-- Step 1: Check current stock status
SELECT 
  'Total Products' as category,
  COUNT(*) as count,
  COUNT(CASE WHEN stock_quantity > 0 THEN 1 END) as in_stock,
  COUNT(CASE WHEN stock_quantity = 0 OR stock_quantity IS NULL THEN 1 END) as out_of_stock
FROM public.products;

-- Step 2: Show products with zero or null stock
SELECT id, name, category, stock_quantity 
FROM public.products 
WHERE stock_quantity = 0 OR stock_quantity IS NULL
ORDER BY name
LIMIT 20;

-- Step 3: Update all products to have stock (random between 10-100)
UPDATE public.products
SET stock_quantity = FLOOR(RANDOM() * 90 + 10)::INTEGER
WHERE stock_quantity = 0 OR stock_quantity IS NULL;

-- Step 4: Verify all products now have stock
SELECT 
  'After Update' as status,
  COUNT(*) as total_products,
  COUNT(CASE WHEN stock_quantity > 0 THEN 1 END) as in_stock,
  MIN(stock_quantity) as min_stock,
  MAX(stock_quantity) as max_stock,
  ROUND(AVG(stock_quantity)) as avg_stock
FROM public.products;

-- Step 5: Show sample of updated products
SELECT id, name, category, stock_quantity 
FROM public.products 
ORDER BY created_at DESC 
LIMIT 10;

