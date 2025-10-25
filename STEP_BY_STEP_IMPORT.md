# 🚀 STEP-BY-STEP PRODUCT IMPORT GUIDE

## ✅ Step 1 Complete: Cleanup Done
You've successfully deleted old products. Now let's import the 650 new products!

## 📝 Step 2: Import Products

### Option A: Import Everything at Once (Easiest)

1. **Open** `scripts/complete_all_products.sql` in VS Code
2. **Copy ALL** content (Ctrl+A then Ctrl+C)
3. **Go to** Supabase Dashboard → SQL Editor
4. **Click** "New Query"
5. **Paste** (Ctrl+V)
6. **Click** "Run" button

### Option B: Import Category by Category (If file is too large)

**Step 1:** Copy cleanup again (to be safe):
```sql
DELETE FROM public.order_items;
DELETE FROM public.cart_items;
DELETE FROM public.wishlist_items;
DELETE FROM public.product_reviews;
DELETE FROM public.products;
```

**Step 2:** Import each category file one by one:

1. Electronics (50 products):
   - Open `scripts/019_electronics_50.sql`
   - Copy ALL content
   - Paste into Supabase SQL Editor
   - Click Run

2. Fashion (50 products):
   - Open `scripts/020_fashion_50.sql`
   - Copy ALL content
   - Paste into Supabase SQL Editor
   - Click Run

3. Food (50 products):
   - Open `scripts/021_food_50.sql`
   - Copy ALL content
   - Paste into Supabase SQL Editor
   - Click Run

4. Kitchen (50 products):
   - Open `scripts/022_kitchen_50.sql`
   - Copy ALL content
   - Paste into Supabase SQL Editor
   - Click Run

5. Home (50 products):
   - Open `scripts/023_home_50.sql`
   - Copy ALL content
   - Paste into Supabase SQL Editor
   - Click Run

6. Sports (50 products):
   - Open `scripts/024_sports_50.sql`
   - Copy ALL content
   - Paste into Supabase SQL Editor
   - Click Run

7. Beauty (50 products):
   - Open `scripts/025_beauty_50.sql`
   - Copy ALL content
   - Paste into Supabase SQL Editor
   - Click Run

8. Office (50 products):
   - Open `scripts/026_office_50.sql`
   - Copy ALL content
   - Paste into Supabase SQL Editor
   - Click Run

9. Books (50 products):
   - Open `scripts/027_books_50.sql`
   - Copy ALL content
   - Paste into Supabase SQL Editor
   - Click Run

10. Toys (50 products):
    - Open `scripts/028_toys_50.sql`
    - Copy ALL content
    - Paste into Supabase SQL Editor
    - Click Run

11. Pets (50 products):
    - Open `scripts/029_pets_50.sql`
    - Copy ALL content
    - Paste into Supabase SQL Editor
    - Click Run

12. Essentials (50 products):
    - Open `scripts/030_essentials_50.sql`
    - Copy ALL content
    - Paste into Supabase SQL Editor
    - Click Run

## ✅ Step 3: Verify Import

After importing, run this query:

```sql
SELECT COUNT(*) as total_products FROM public.products;
```

**Expected Result:** 650 products

Check by category:
```sql
SELECT category, COUNT(*) as count 
FROM public.products 
GROUP BY category 
ORDER BY count DESC;
```

**Expected Result:** 12 categories with 50 products each

## 🎯 What Each Category Has

- ✅ Electronics - 50 products
- ✅ Fashion - 50 products
- ✅ Food & Groceries - 50 products
- ✅ Kitchen & Dining - 50 products
- ✅ Home & Living - 50 products
- ✅ Sports & Fitness - 50 products
- ✅ Beauty & Personal Care - 50 products
- ✅ Office & Study - 50 products
- ✅ Books & Media - 50 products
- ✅ Toys & Games - 50 products
- ✅ Pet Supplies - 50 products
- ✅ Other Essentials - 50 products

**Total: 650 products with real images, stock quantities, and SKUs**

## 🚨 Troubleshooting

**If you get an error:**
- Make sure you copied the ENTIRE INSERT statement
- Check that each INSERT ends with a semicolon `;`
- Don't copy the comments `--` lines, only the INSERT statements

**If products don't show:**
- Check if `is_active` column exists: `SELECT * FROM public.products LIMIT 1;`
- If not, add it: `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;`
- Update all products: `UPDATE public.products SET is_active = true WHERE is_active IS NULL;`

---

**Ready to import! Choose Option A or B above.** 🚀

