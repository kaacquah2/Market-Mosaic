-- ==============================================
-- FIND AND REMOVE DUPLICATE PRODUCTS
-- ==============================================

-- Step 1: Check for duplicates by name
SELECT name, COUNT(*) as duplicate_count
FROM public.products
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Step 2: Check for duplicates by SKU
SELECT sku, COUNT(*) as duplicate_count
FROM public.products
GROUP BY sku
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Step 3: View all duplicates with details
SELECT 
  id,
  name,
  sku,
  category,
  price,
  created_at
FROM public.products
WHERE name IN (
  SELECT name 
  FROM public.products 
  GROUP BY name 
  HAVING COUNT(*) > 1
)
ORDER BY name, created_at;

-- Step 4: Remove duplicates (keeps the oldest record)
-- This deletes duplicates based on name, keeping the one with the earliest created_at
DELETE FROM public.products
WHERE id IN (
  SELECT id
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY name 
        ORDER BY created_at ASC
      ) as row_num
    FROM public.products
  ) t
  WHERE row_num > 1
);

-- Step 5: Verify - check for duplicates again
SELECT name, COUNT(*) as count
FROM public.products
GROUP BY name
HAVING COUNT(*) > 1;

-- Step 6: Check total products after cleanup
SELECT COUNT(*) as total_products FROM public.products;

-- Step 7: Final summary
SELECT 
  COUNT(*) as total_products,
  COUNT(DISTINCT name) as unique_names,
  COUNT(DISTINCT sku) as unique_skus,
  COUNT(DISTINCT category) as categories
FROM public.products;

