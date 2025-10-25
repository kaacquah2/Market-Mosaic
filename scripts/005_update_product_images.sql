-- Update product images to use proper URLs without query strings
UPDATE products SET image_url = '/placeholder.jpg' WHERE image_url LIKE '%?%';
