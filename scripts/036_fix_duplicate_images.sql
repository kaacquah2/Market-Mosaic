-- ==============================================
-- UPDATE PRODUCT IMAGES WITH UNIQUE UNSplash URLs
-- Each product gets a unique image based on its ID
-- ==============================================

-- Update Electronics products with unique images
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop&id=' || id WHERE category = 'Electronics' AND id = (SELECT id FROM public.products WHERE category = 'Electronics' ORDER BY created_at LIMIT 1 OFFSET 0);
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1566904445000-77442dd34c62?w=600&h=600&fit=crop&id=' || id WHERE category = 'Electronics' AND id = (SELECT id FROM public.products WHERE category = 'Electronics' ORDER BY created_at LIMIT 1 OFFSET 1);
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1587825143148-eac8c0cb0173?w=600&h=600&fit=crop&id=' || id WHERE category = 'Electronics' AND id = (SELECT id FROM public.products WHERE category = 'Electronics' ORDER BY created_at LIMIT 1 OFFSET 2);

-- ==============================================
-- BETTER SOLUTION: Update all products with unique IDs
-- ==============================================

-- Update ALL products to have unique image URLs by adding their ID
UPDATE public.products 
SET image_url = image_url || '&pid=' || id;

-- Alternative: Use different Unsplash seeds for variety
UPDATE public.products 
SET image_url = REPLACE(image_url, 'fit=crop', 'fit=crop&sig=' || id);

-- ==============================================
-- BEST SOLUTION: Assign unique images per category
-- ==============================================

-- Electronics
UPDATE public.products SET image_url = 'https://source.unsplash.com/600x600/?electronics&sig=' || id WHERE category = 'Electronics';

-- Fashion
UPDATE public.products SET image_url = 'https://source.unsplash.com/600x600/?fashion&sig=' || id WHERE category = 'Fashion';

-- Food
UPDATE public.products SET image_url = 'https://source.unsplash.com/600x600/?food&sig=' || id WHERE category = 'Food & Groceries';

-- Kitchen
UPDATE public.products SET image_url = 'https://source.unsplash.com/600x600/?kitchen&sig=' || id WHERE category = 'Kitchen & Dining';

-- Home
UPDATE public.products SET image_url = 'https://source.unsplash.com/600x600/?home&sig=' || id WHERE category = 'Home & Living';

-- Sports
UPDATE public.products SET image_url = 'https://source.unsplash.com/600x600/?sports&sig=' || id WHERE category = 'Sports & Fitness';

-- Beauty
UPDATE public.products SET image_url = 'https://source.unsplash.com/600x600/?beauty&sig=' || id WHERE category = 'Beauty & Personal Care';

-- Office
UPDATE public.products SET image_url = 'https://source.unsplash.com/600x600/?office&sig=' || id WHERE category = 'Office & Study';

-- Books
UPDATE public.products SET image_url = 'https://source.unsplash.com/600x600/?books&sig=' || id WHERE category = 'Books & Media';

-- Toys
UPDATE public.products SET image_url = 'https://source.unsplash.com/600x600/?toys&sig=' || id WHERE category = 'Toys & Games';

-- Pets
UPDATE public.products SET image_url = 'https://source.unsplash.com/600x600/?pets&sig=' || id WHERE category = 'Pet Supplies';

-- Essentials
UPDATE public.products SET image_url = 'https://source.unsplash.com/600x600/?essentials&sig=' || id WHERE category = 'Other Essentials';

-- Verify
SELECT category, COUNT(*) as count, COUNT(DISTINCT image_url) as unique_images
FROM public.products
GROUP BY category;

