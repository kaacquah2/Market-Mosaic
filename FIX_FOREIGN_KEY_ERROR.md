# Fixing Foreign Key Constraint Error

## Problem

You encountered this error:
```
ERROR: update or delete on table "products" violates foreign key constraint 
"order_items_product_id_fkey" on table "order_items"
```

This happens because there are existing orders that reference products.

## Solution

**Run the cleanup script BEFORE importing products:**

```sql
-- In Supabase SQL Editor, run:
\i scripts/000_cleanup_before_import.sql
```

This will:
1. Delete order_items
2. Delete cart_items  
3. Delete wishlist_items
4. Delete product_reviews
5. Then delete products

## Alternative: Safe Approach

If you want to keep existing orders but replace products:

### Option 1: Update Products Instead of Delete
```sql
-- Instead of DELETE, use UPDATE
UPDATE public.products 
SET name = 'New Product Name',
    description = 'New description',
    price = 99.99,
    category = 'New Category',
    image_url = 'new_url',
    stock_quantity = 100,
    sku = 'NEW-001'
WHERE id = 'existing-product-id';
```

### Option 2: Cascade Delete (if needed)
```sql
-- Temporarily modify foreign key constraint
ALTER TABLE public.order_items 
DROP CONSTRAINT order_items_product_id_fkey;

-- Now delete products
DELETE FROM public.products;

-- Recreate constraint
ALTER TABLE public.order_items
ADD CONSTRAINT order_items_product_id_fkey
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
```

## Recommended Steps

1. **For Fresh Start** (Development):
   ```sql
   -- Run cleanup
   \i scripts/000_cleanup_before_import.sql
   
   -- Then import products
   \i scripts/019_electronics_50.sql
   \i scripts/020_fashion_50.sql
   -- ... etc
   ```

2. **For Production** (Keep orders):
   - Don't delete products
   - Update products individually
   - Or add new products alongside existing ones

## Files Created

- `000_cleanup_before_import.sql` - Cleanup script
- `019_electronics_50.sql` - 50 Electronics products
- `020_fashion_50.sql` - 50 Fashion products
- `021_food_50.sql` - 50 Food & Groceries products

## Next Steps

1. Run the cleanup script
2. Import products category by category
3. Verify products imported correctly

Running the cleanup script fixes the foreign key constraint error.

