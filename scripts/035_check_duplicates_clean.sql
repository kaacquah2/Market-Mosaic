-- Check for duplicates by name
SELECT name, COUNT(*) as duplicate_count
FROM public.products
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Check for duplicates by SKU
SELECT sku, COUNT(*) as duplicate_count
FROM public.products
GROUP BY sku
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- View all duplicates with details
SELECT id, name, sku, category, price
FROM public.products
WHERE name IN (
  SELECT name 
  FROM public.products 
  GROUP BY name 
  HAVING COUNT(*) > 1
)
ORDER BY name;

-- Remove duplicates by name (keeps oldest)
DELETE FROM public.products
WHERE id IN (
  SELECT id
  FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at ASC) as row_num
    FROM public.products
  ) t
  WHERE row_num > 1
);

-- Verify no duplicates remain
SELECT name, COUNT(*) as count
FROM public.products
GROUP BY name
HAVING COUNT(*) > 1;

-- Check total products
SELECT COUNT(*) as total_products FROM public.products;

