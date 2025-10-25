# Food Products Setup Guide

This guide will help you clear all existing products and add food category products to your database.

## Quick Setup

Run the SQL script directly in Supabase's SQL editor:

1. **Go to your Supabase Dashboard**: https://sjhfmoxdxasyachkklru.supabase.co
2. **Navigate to SQL Editor**: Click on "SQL Editor" in the left sidebar
3. **Create a new query**: Click "New query"
4. **Copy and paste** the contents of `scripts/049_complete_food_products_setup.sql`
5. **Click "Run"** to execute the script

This script will:
- Temporarily modify RLS policies to allow inserts
- Delete all existing products
- Insert 21 food products
- Restore the original RLS policies
- Show verification results

## Food Products Added

The following 21 food products will be added:

### Main Dishes
1. **Jollof Rice with Grilled Chicken** - $14.99
2. **Waakye Rice Bowl** - $12.99
3. **Whole Fish with Red Sauce** - $18.99
4. **Grilled Chicken with Yuca Fries** - $15.99
5. **Fried Yam and Peppered Gizzard** - $13.99
6. **Grilled Chicken with Spaghetti** - $16.99
7. **Grilled Chicken Skewers with Yam Fries** - $17.99
8. **Colorful Fried Rice** - $11.99

### Seafood
9. **Cajun Seafood Boil Platter** - $45.99
10. **Steamed Crab** - $28.99

### Desserts
11. **Oreo Milkshake** - $8.99
12. **Rainbow Sprinkled Cupcake** - $4.99
13. **Double Chocolate Brownies** - $5.99
14. **Lemon Pie Slice** - $7.99
15. **Caramel Cheesecake Slice** - $8.99

### Drinks
16. **Sprite Soda** - $2.99
17. **Tropical Strawberry Drink** - $6.99
18. **Coca-Cola** - $2.99
19. **Fanta Orange Soda** - $2.99
20. **Tropical Sunrise Cocktail** - $9.99

### Appetizers
21. **Glazed Chicken Wings** - $13.99

All products will be categorized under "Food" category.

## Categories Breakdown

- **Main Dishes**: 8 products (African, Latin, Asian cuisine)
- **Seafood**: 2 products
- **Desserts**: 5 products
- **Drinks**: 5 products
- **Appetizers**: 1 product

## Verification

After running the script, verify the products were added:

```sql
SELECT COUNT(*) as total_products FROM public.products;
SELECT category, COUNT(*) as count FROM public.products GROUP BY category;
SELECT name, price FROM public.products ORDER BY price DESC;
```

## Troubleshooting

If you encounter RLS (Row Level Security) errors:

1. Make sure you're running the SQL script as an authenticated admin user
2. Or temporarily run `scripts/047_temp_allow_inserts.sql` first
3. Then run `scripts/049_complete_food_products_setup.sql` to add the products

## Next Steps

After adding the products, you can:
- Update product images by uploading actual photos
- Add inventory management
- Set up pricing and discounts
- Configure shipping options

