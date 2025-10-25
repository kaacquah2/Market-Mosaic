-- After uploading a product through the admin page, run this to verify it was saved

-- Check the most recent products
SELECT 
  id,
  name,
  price,
  category,
  image_url,
  stock_quantity,
  created_at
FROM products 
ORDER BY created_at DESC 
LIMIT 5;

-- Count total products
SELECT COUNT(*) as total_products FROM products;

-- Check for products created today
SELECT 
  COUNT(*) as products_created_today,
  MAX(created_at) as latest_product_time
FROM products 
WHERE created_at::date = CURRENT_DATE;

