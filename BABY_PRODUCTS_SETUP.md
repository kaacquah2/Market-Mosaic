# Baby Products Setup Guide

This guide will help you clear all existing products and add baby category products to your database.

## Option 1: Run SQL Script in Supabase (Recommended)

The easiest way is to run the SQL script directly in Supabase's SQL editor:

1. **Go to your Supabase Dashboard**: https://sjhfmoxdxasyachkklru.supabase.co
2. **Navigate to SQL Editor**: Click on "SQL Editor" in the left sidebar
3. **Create a new query**: Click "New query"
4. **Copy and paste** the contents of `scripts/048_complete_baby_products_setup.sql`
5. **Click "Run"** to execute the script

This script will:
- Temporarily modify RLS policies to allow inserts
- Delete all existing products
- Insert 14 baby category products
- Restore the original RLS policies
- Show verification results

## Option 2: Use Admin Panel

If you have admin access configured:

1. Go to `/admin/products` in your app
2. Manually add each product using the admin interface

## Baby Products Added

The following 14 baby products will be added:

1. **Baby Boy Gift Bouquet** - $79.99
2. **Interactive Baby Bath Tub Set** - $59.99
3. **Johnson's Baby Care Collection** - $24.99
4. **Personalized Baby Bathrobe Set** - $34.99
5. **Stylish Diaper Bag Backpack** - $49.99
6. **Nestle Nestum Rice Cereal** - $12.99
7. **Nestle Golden Morn Cereal** - $8.99
8. **Mustela Newborn Arrival Gift Set** - $45.99
9. **Momcozy Wearable Breast Pump** - $89.99
10. **Nestle Tropical Fruits Baby Food** - $4.99
11. **Thule Luxe Baby Stroller** - $349.99
12. **Modern Baby Bouncer Swing** - $199.99
13. **Nestle Nido FortiGrow Milk Powder** - $28.99
14. **Nestle Cerelac Kids Multicereals & Fruits** - $10.99

All products will be categorized under "Baby" category.

## Troubleshooting

If you encounter RLS (Row Level Security) errors:

1. Make sure you're running the SQL script as an authenticated admin user
2. Or use the `scripts/047_temp_allow_inserts.sql` script first to temporarily allow inserts
3. Then run `scripts/048_complete_baby_products_setup.sql` to add the products

## Verification

After running the script, verify the products were added:

```sql
SELECT COUNT(*) as total_products FROM public.products;
SELECT category, COUNT(*) as count FROM public.products GROUP BY category;
```

