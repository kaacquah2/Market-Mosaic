-- ==============================================
-- COMPLETE PRODUCT CATALOG IMPORT - 650 PRODUCTS
-- Instructions: Copy and paste content from each category file below
-- ==============================================

-- IMPORTANT: This file has been truncated due to size.
-- You need to manually combine all category files.

-- SOLUTION: Run each category file individually in Supabase SQL Editor:

-- Step 1: Cleanup
\i scripts/000_cleanup_before_import.sql

-- Step 2: Import each category (copy each file's content)
-- Open each file and copy its INSERT statements into Supabase SQL Editor

-- Or use this PowerShell command on Windows:
-- Get-Content scripts/019_electronics_50.sql, scripts/020_fashion_50.sql, scripts/021_food_50.sql, scripts/022_kitchen_50.sql, scripts/023_home_50.sql, scripts/024_sports_50.sql, scripts/025_beauty_50.sql, scripts/026_office_50.sql, scripts/027_books_50.sql, scripts/028_toys_50.sql, scripts/029_pets_50.sql, scripts/030_essentials_50.sql | Set-Content scripts/complete_import.sql

-- After importing, run verification:
SELECT COUNT(*) as total_products FROM public.products;
SELECT category, COUNT(*) as count FROM public.products GROUP BY category ORDER BY count DESC;
