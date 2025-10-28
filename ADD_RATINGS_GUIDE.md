# Add Ratings to Products Guide

## The Problem
Products are showing "0" ratings because they don't have any reviews yet. To fix this, we need to populate the database with sample ratings.

## Solution

### Step 1: Make Sure the Product Reviews Table Exists

First, check if you have the `product_reviews` table set up. If not, run this in Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- Enable RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews
CREATE POLICY "product_reviews_select_public"
  ON public.product_reviews FOR SELECT
  USING (true);

-- Users can insert their own reviews
CREATE POLICY "product_reviews_insert_own"
  ON public.product_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Step 2: Add Sample Ratings to Your Products

Open the `scripts/populate_product_ratings.sql` file and run it in Supabase SQL Editor.

This script will:
- ✅ Add 5-15 fake reviews to each product
- ✅ Give each product random ratings (mostly 3-5 stars)
- ✅ Update the `average_rating` and `review_count` fields
- ✅ Add realistic review titles and comments

### Step 3: Verify the Ratings Were Added

After running the script, check your products:

```sql
SELECT name, average_rating, review_count 
FROM products 
WHERE is_active = true 
ORDER BY average_rating DESC;
```

You should now see products with ratings like:
- 4.2 (12 reviews)
- 4.5 (8 reviews)
- 3.8 (15 reviews)

### Step 4: Refresh Your App

1. Clear the browser cache: `Ctrl + Shift + R`
2. The "0" ratings should now be replaced with actual star ratings!

## What This Does

The script adds sample data so your products will show:
- ⭐ Star ratings on product cards
- 📊 Review counts next to ratings
- 💬 Review comments on product pages
- 📈 Average rating calculations

## Notes

- These are sample/demo reviews for testing purposes
- Real users will still be able to add their own reviews
- The sample reviews won't affect real user reviews
- You can delete the sample reviews later if needed

## Alternative: Manual Ratings

If you prefer to manually set ratings for specific products:

```sql
-- Update a specific product's rating
UPDATE products 
SET 
    average_rating = 4.5,
    review_count = 10
WHERE id = 'your-product-id';
```

## Need Help?

If ratings still show "0" after running the script:
1. Check that the `product_reviews` table exists
2. Verify the script ran successfully
3. Clear your app cache and hard refresh: `Ctrl + Shift + R`
4. Check the Supabase logs for any errors

---

**Status:** Ready to add ratings! Just run the SQL script in Supabase! ⭐
