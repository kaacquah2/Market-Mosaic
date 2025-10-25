-- Clear all products from the database
-- WARNING: This will delete ALL products permanently!

-- Show what will be deleted
SELECT 
  COUNT(*) as products_to_delete,
  array_agg(name ORDER BY created_at DESC) as product_names
FROM products;

-- Delete all products
DELETE FROM products;

-- Verify deletion
SELECT 
  COUNT(*) as remaining_products,
  'All products cleared' as status
FROM products;

-- Show current products table state
SELECT 
  COUNT(*) as total_products,
  MAX(created_at) as last_product_date
FROM products;

