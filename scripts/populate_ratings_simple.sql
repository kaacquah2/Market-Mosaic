-- Simplified script to add ratings to products
-- This script will update the average_rating and review_count fields directly
-- without creating actual review records

-- First, let's add some sample review data to the product_reviews table
-- We'll temporarily disable the foreign key constraint

-- Option 1: Update products with random ratings (NO INSERT INTO product_reviews)
-- This is the simplest approach - just update the products table directly

UPDATE public.products
SET 
    average_rating = ROUND((random() * 1.5 + 3.5)::NUMERIC, 1),  -- Random rating between 3.5-5.0
    review_count = floor(random() * 10 + 5)::INT  -- Random review count between 5-15
WHERE is_active = true;

-- Show results
SELECT 
    name,
    ROUND(average_rating::NUMERIC, 1) as rating,
    review_count
FROM public.products
WHERE is_active = true
ORDER BY average_rating DESC
LIMIT 20;

-- If you want to actually create review records, you need to either:
-- 1. Create real users first, OR
-- 2. Temporarily modify the foreign key constraint
--
-- To modify the constraint, run this first:
-- ALTER TABLE public.product_reviews 
--   DROP CONSTRAINT IF EXISTS product_reviews_user_id_fkey;
--
-- Then run the populate script, then recreate the constraint:
-- ALTER TABLE public.product_reviews
--   ADD CONSTRAINT product_reviews_user_id_fkey
--   FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
