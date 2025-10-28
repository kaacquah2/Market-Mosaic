-- Check the current state of product ratings in the database
-- Run this to see which products have ratings and which don't

SELECT 
    id,
    name,
    COALESCE(ROUND(average_rating::NUMERIC, 1), 0) as rating,
    COALESCE(review_count, 0) as review_count,
    CASE 
        WHEN average_rating IS NULL OR average_rating = 0 THEN '❌ No Rating'
        ELSE '✅ Has Rating'
    END as status
FROM public.products
WHERE is_active = true
ORDER BY 
    CASE WHEN average_rating IS NULL THEN 1 ELSE 0 END,
    average_rating DESC;

-- Summary
SELECT 
    COUNT(*) as total_products,
    COUNT(CASE WHEN average_rating IS NOT NULL AND average_rating > 0 THEN 1 END) as products_with_ratings,
    COUNT(CASE WHEN average_rating IS NULL OR average_rating = 0 THEN 1 END) as products_without_ratings
FROM public.products
WHERE is_active = true;
