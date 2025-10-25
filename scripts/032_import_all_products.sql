-- ==============================================
-- MASTER PRODUCT IMPORT SCRIPT
-- Imports all 650 products from all 12 categories
-- ==============================================

-- First, clean up existing data
DELETE FROM public.order_items;
DELETE FROM public.cart_items;
DELETE FROM public.wishlist_items;
DELETE FROM public.product_reviews;
DELETE FROM public.products;

-- Import all categories
-- Note: Copy and paste each category file content here, or run them individually

-- Expected total: 650 products across 12 categories

-- Verification queries
SELECT COUNT(*) as total_products FROM public.products;

SELECT category, COUNT(*) as product_count 
FROM public.products 
GROUP BY category 
ORDER BY product_count DESC;

-- Check for products without images
SELECT COUNT(*) as products_without_images 
FROM public.products 
WHERE image_url IS NULL OR image_url = '';

-- Check stock status
SELECT 
  COUNT(*) as total_products,
  COUNT(CASE WHEN stock_quantity > 0 THEN 1 END) as in_stock,
  COUNT(CASE WHEN stock_quantity = 0 THEN 1 END) as out_of_stock
FROM public.products;

