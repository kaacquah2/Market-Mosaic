-- ==============================================
-- MASTER PRODUCT CATALOG SCRIPT
-- Imports all 13 category files (650 products total)
-- ==============================================

-- First, delete all existing products
DELETE FROM public.products;

-- Then run each category file in order:
-- \i scripts/019_electronics_50.sql
-- \i scripts/020_fashion_50.sql
-- \i scripts/021_food_50.sql
-- \i scripts/022_kitchen_50.sql
-- \i scripts/023_home_50.sql
-- \i scripts/024_sports_50.sql
-- \i scripts/025_beauty_50.sql
-- \i scripts/026_office_50.sql
-- \i scripts/027_books_50.sql
-- \i scripts/028_toys_50.sql
-- \i scripts/029_pets_50.sql
-- \i scripts/030_essentials_50.sql

-- Or run everything at once (after all files are created)
-- This script will be generated after all individual files are ready

-- Verification
SELECT COUNT(*) as total_products FROM public.products;

SELECT category, COUNT(*) as product_count 
FROM public.products 
GROUP BY category 
ORDER BY product_count DESC;

