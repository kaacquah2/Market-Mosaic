-- Complete Database Schema Setup for Ecommerce App
-- Run this script to set up the entire database schema

-- 1. Create products table
\i scripts/001_create_products_table.sql

-- 2. Create orders table
\i scripts/002_create_orders_table.sql

-- 3. Create order_items table
\i scripts/003_create_order_items_table.sql

-- 4. Create user_profiles table
\i scripts/007_create_user_profiles_table.sql

-- 5. Create cart_items table
\i scripts/008_create_cart_items_table.sql

-- 6. Create product_reviews table
\i scripts/009_create_product_reviews_table.sql

-- 7. Create wishlist_items table
\i scripts/010_create_wishlist_table.sql

-- 8. Enhance products table with additional columns
\i scripts/011_enhance_products_table.sql

-- 9. Seed initial products
\i scripts/004_seed_products.sql

-- 10. Update product images
\i scripts/005_update_product_images.sql

-- 11. Seed extended products
\i scripts/006_seed_products_extended.sql

-- Verify schema creation
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
