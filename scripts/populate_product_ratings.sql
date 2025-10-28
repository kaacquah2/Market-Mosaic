-- Add sample ratings to all products
-- This will give each product a random average rating and review count

-- Function to generate random ratings for each product
DO $$
DECLARE
    product_record RECORD;
    review_count INT;
    rating INT;
    i INT;
    fake_user_id TEXT;
    user_id_count INT;
BEGIN
    -- Count how many users we have
    SELECT COUNT(*) INTO user_id_count FROM auth.users;
    
    -- If no users exist, create fake users first
    IF user_id_count = 0 THEN
        RAISE NOTICE 'No users found. Please create some users first or disable the user_id foreign key constraint.';
        RETURN;
    END IF;
    
    -- Loop through all active products
    FOR product_record IN 
        SELECT id FROM public.products WHERE is_active = true
    LOOP
        -- Random number of reviews between 5 and 15
        review_count := floor(random() * 10 + 5)::INT;
        
        -- Create reviews with random ratings
        FOR i IN 1..review_count LOOP
            -- Get a random existing user ID (with a unique suffix for each review)
            SELECT id INTO fake_user_id 
            FROM auth.users 
            ORDER BY RANDOM() 
            LIMIT 1;
            
            -- Generate unique identifier by appending a random number
            fake_user_id := fake_user_id || '-' || floor(random() * 100000)::TEXT;
            
            -- Random rating between 3 and 5 (mostly positive ratings)
            rating := floor(random() * 3 + 3)::INT;
            
            -- Insert review
            BEGIN
                INSERT INTO public.product_reviews (
                    product_id,
                    user_id,
                    rating,
                    title,
                    comment,
                    created_at
                )
                VALUES (
                    product_record.id,
                    fake_user_id,
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
                    NOW() - (random() * interval '30 days')
                );
            EXCEPTION 
                WHEN OTHERS THEN
                    -- Skip duplicate key errors
                    CONTINUE;
            END;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Sample reviews added successfully!';
END $$;

-- Update products table with calculated average ratings and review counts
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
    id,
    name,
    ROUND(average_rating::NUMERIC, 1) as avg_rating,
    review_count
FROM public.products
WHERE is_active = true
ORDER BY average_rating DESC
LIMIT 20;
