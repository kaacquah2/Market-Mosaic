-- ==============================================
-- CLEANUP SCRIPT - Run before importing products
-- This handles foreign key constraints properly
-- ==============================================

-- Delete order_items first (references products)
DELETE FROM public.order_items;

-- Delete cart_items (references products)
DELETE FROM public.cart_items;

-- Delete wishlist_items (references products)
DELETE FROM public.wishlist_items;

-- Delete product_reviews (references products)
DELETE FROM public.product_reviews;

-- Now safe to delete products
DELETE FROM public.products;

-- Verification
SELECT 'Cleanup complete. Ready to import new products.' as status;

