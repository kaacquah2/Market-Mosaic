-- Run this in Supabase SQL Editor to check which categories have products
-- and which are empty

-- 1. Show count of products per category
SELECT 
  category,
  COUNT(*) as product_count,
  MIN(price) as min_price,
  MAX(price) as max_price,
  SUM(stock_quantity) as total_stock
FROM public.products
WHERE category IS NOT NULL
GROUP BY category
ORDER BY product_count DESC;

-- 2. Show total products
SELECT 'Total Products: ' || COUNT(*) as summary FROM public.products;

-- 3. List all unique categories (including empty ones if defined elsewhere)
SELECT DISTINCT category 
FROM public.products 
WHERE category IS NOT NULL
ORDER BY category;

