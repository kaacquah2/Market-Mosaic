# 🎨 SOLUTION: Products with Unique Images

## Current Problem
- Products are using the same Unsplash images
- Need unique, product-specific images

## ✅ Solution Options

### Option 1: Use Unsplash Search with Product Names (Quick Fix)

Update existing products to use unique Unsplash search URLs:

```sql
-- This adds a unique search term based on product name
UPDATE public.products 
SET image_url = 'https://source.unsplash.com/600x600/?' || REPLACE(LOWER(name), ' ', '-');
```

### Option 2: Delete and Re-import with Better Images

I've created `scripts/039_quick_import_unique.sql` with products that use Unsplash search terms.

**To use:**
1. Open `scripts/039_quick_import_unique.sql`
2. Copy ALL content
3. Paste into Supabase SQL Editor
4. Click Run

### Option 3: Upload Your Own Images (Best Option)

**For now (without upload):**
Use Option 1 or 2 above.

**Later (when you can upload):**
1. Upload images to Supabase Storage
2. Get the URL for each image
3. Update products with custom URLs

## 🚀 Quick Fix - Run This Now

```sql
-- Make each image unique based on product name
UPDATE public.products 
SET image_url = 'https://source.unsplash.com/600x600/?' || REPLACE(LOWER(name), ' ', '-') || '&id=' || id;
```

This will give each product a unique image based on its name!

## Verify

```sql
SELECT name, image_url FROM public.products LIMIT 5;
```

Each product should now have a different image URL.

