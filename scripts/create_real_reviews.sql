-- Create actual review records in the product_reviews table
-- This requires using a user_id that exists in auth.users

-- First, let's get a real user ID (or we can use a placeholder)
-- Replace 'YOUR_USER_ID_HERE' with an actual user ID from auth.users

-- Check if we have any users in auth.users
SELECT COUNT(*) as user_count FROM auth.users;

-- If you don't have users, the reviews won't work with foreign key constraints
-- This script assumes you have at least one user in auth.users

-- We'll create reviews using the first available user
DO $$
DECLARE
    product_record RECORD;
    review_count INT;
    rating INT;
    i INT;
    existing_user_id UUID;
    all_user_ids UUID[];
    random_user_id UUID;
BEGIN
    -- Get all user IDs into an array
    SELECT ARRAY_AGG(id) INTO all_user_ids FROM auth.users;
    
    -- If no users exist, we can't create reviews due to foreign key constraint
    IF all_user_ids IS NULL OR array_length(all_user_ids, 1) = 0 THEN
        RAISE NOTICE 'No users found in auth.users. Cannot create reviews without valid user IDs.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found % users to use for reviews', array_length(all_user_ids, 1);
    
    -- Loop through all active products
    FOR product_record IN 
        SELECT id FROM public.products WHERE is_active = true
    LOOP
        -- Random number of reviews between 5 and 15
        review_count := floor(random() * 10 + 5)::INT;
        
        -- Create reviews with random ratings
        FOR i IN 1..review_count LOOP
            -- Pick a random user ID from the array
            random_user_id := all_user_ids[floor(random() * array_length(all_user_ids, 1) + 1)];
            
            -- Random rating between 3 and 5 (mostly positive ratings)
            rating := floor(random() * 3 + 3)::INT;
            
            -- Insert review using a random user ID
            INSERT INTO public.product_reviews (
                product_id,
                user_id,
                rating,
                title,
                comment,
                created_at,
                updated_at
            )
            VALUES (
                product_record.id,
                random_user_id,
                rating,
                CASE rating
                    WHEN 5 THEN 'Perfect! Highly recommend'
                    WHEN 4 THEN 'Great product, very satisfied'
                    WHEN 3 THEN 'Good product, could be better'
                END,
                CASE rating
                    WHEN 5 THEN 'This product exceeded my expectations. Great quality and fast shipping!'
                    WHEN 4 THEN 'Very happy with my purchase. Quality is good for the price.'
                    WHEN 3 THEN 'Product is okay but not amazing. Does the job.'
                END,
                NOW() - (random() * interval '30 days'),
                NOW() - (random() * interval '30 days')
            )
            ON CONFLICT (product_id, user_id) DO NOTHING;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Reviews created successfully!';
END $$;

-- Update products with calculated ratings
UPDATE public.products p
SET 
    average_rating = COALESCE((
        SELECT ROUND(AVG(rating)::NUMERIC, 1)
        FROM public.product_reviews
        WHERE product_id = p.id
    ), 0),
    review_count = COALESCE((
        SELECT COUNT(*)
        FROM public.product_reviews
        WHERE product_id = p.id
    ), 0);

-- Show results
SELECT 
    'Total products with reviews' as info,
    COUNT(DISTINCT product_id)::TEXT as value
FROM public.product_reviews

UNION ALL

SELECT 
    'Total review records' as info,
    COUNT(*)::TEXT as value
FROM public.product_reviews;
