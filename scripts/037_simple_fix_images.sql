-- FIX DUPLICATE IMAGES - Run this in Supabase SQL Editor

-- Method 1: Add unique ID to each image URL
UPDATE public.products 
SET image_url = image_url || '&pid=' || id;

-- Method 2: Use Unsplash random images with unique seeds
UPDATE public.products 
SET image_url = 'https://source.unsplash.com/600x600/?sig=' || id || '&random=' || RANDOM();

-- Verify unique images
SELECT COUNT(*) as total_products, COUNT(DISTINCT image_url) as unique_images
FROM public.products;

