# All Categories Setup Guide

This guide will help you add products from Baby, Food, and Electronics categories to your database.

## Quick Setup

Run the SQL script directly in Supabase's SQL editor:

1. **Go to your Supabase Dashboard**: https://sjhfmoxdxasyachkklru.supabase.co
2. **Navigate to SQL Editor**: Click on "SQL Editor" in the left sidebar
3. **Create a new query**: Click "New query"
4. **Copy and paste** the contents of `scripts/057_all_categories_combined.sql`
5. **Click "Run"** to execute the script

This script will:
- Temporarily modify RLS policies to allow inserts
- Delete all existing products
- Insert 63 products total (14 Baby + 21 Food + 28 Electronics)
- Restore the original RLS policies
- Show verification results

## Products by Category

### Baby Category (14 products)
1. Baby Boy Gift Bouquet - $79.99
2. Interactive Baby Bath Tub Set - $59.99
3. Johnson's Baby Care Collection - $24.99
4. Personalized Baby Bathrobe Set - $34.99
5. Stylish Diaper Bag Backpack - $49.99
6. Nestle Nestum Rice Cereal - $12.99
7. Nestle Golden Morn Cereal - $8.99
8. Mustela Newborn Arrival Gift Set - $45.99
9. Momcozy Wearable Breast Pump - $89.99
10. Nestle Tropical Fruits Baby Food - $4.99
11. Thule Luxe Baby Stroller - $349.99
12. Modern Baby Bouncer Swing - $199.99
13. Nestle Nido FortiGrow Milk Powder - $28.99
14. Nestle Cerelac Kids Multicereals & Fruits - $10.99

### Food Category (21 products)
1. Oreo Milkshake - $8.99
2. Jollof Rice with Grilled Chicken - $14.99
3. Cajun Seafood Boil Platter - $45.99
4. Sprite Soda - $2.99
5. Tropical Strawberry Drink - $6.99
6. Waakye Rice Bowl - $12.99
7. Grilled Fish with Red Sauce - $18.99
8. Grilled Chicken with Yuca Fries - $15.99
9. Fried Yam and Peppered Gizzard - $13.99
10. Grilled Chicken with Spaghetti - $16.99
11. Grilled Chicken Skewers with Yam Fries - $17.99
12. Colorful Fried Rice - $11.99
13. Lemon Pie Slice - $7.99
14. Coca-Cola - $2.99
15. Steamed Crab - $28.99
16. Rainbow Sprinkled Cupcake - $4.99
17. Double Chocolate Brownies - $5.99
18. Fanta Orange Soda - $2.99
19. Tropical Sunrise Cocktail - $9.99
20. Glazed Chicken Wings - $13.99
21. Caramel Cheesecake Slice - $8.99

### Electronics Category (28 products)
1. Braided USB 3.0 Cable - $12.99
2. Multi-Port USB Charger Hub - $29.99
3. MicroSD Card 16GB Class 10 - $9.99
4. SD Card 512GB Ultra Fast - $89.99
5. MicroSD Card 128GB Pro - $24.99
6. Nokia BL-5C Mobile Phone Battery - $19.99
7. Beikell USB 3.0 Card Reader with SD/MicroSD - $69.99
8. JBL Wireless Earbuds Pro - $129.99
9. Hitage Wireless Neckband Earphones - $39.99
10. JBL Tune 710BT Wireless Headphones - $79.99
11. JBL Flip 6 Portable Waterproof Speaker - $129.95
12. Nokia 105 Feature Phone - $29.99
13. Redmi 5G Smartphone - $349.99
14. Smartwatch Fitness Tracker - $99.99
15. Huawei Mobile Wi-Fi Hotspot - $79.99
16. 9D Edge-to-Edge Glass Shield Screen Protector - $24.99
17. Ultra-Slim Laptop 15-inch - $899.99
18. Gaming Console Next-Gen - $499.99
19. 55-inch 4K Ultra HD Smart TV - $699.99
20. Wireless Mouse and Keyboard Combo - $49.99
21. Smart Home Hub - $89.99
22. Portable Power Bank 20000mAh - $39.99
23. 4K Action Camera with Waterproof Case - $149.99
24. E-Reader with Backlight - $119.99
25. Drone with 4K Camera - $599.99

## Total Products
**63 products** across 3 categories

## Verification

After running the script, verify the products were added:

```sql
SELECT COUNT(*) as total_products FROM public.products;
SELECT category, COUNT(*) as count FROM public.products GROUP BY category ORDER BY count DESC;
```

Expected results:
- Total products: 63
- Electronics: 28 products
- Food: 21 products
- Baby: 14 products

## Troubleshooting

If you encounter RLS (Row Level Security) errors:

1. Make sure you're running the SQL script as an authenticated admin user
2. Or temporarily run `scripts/047_temp_allow_inserts.sql` first
3. Then run `scripts/057_all_categories_combined.sql` to add the products

## Next Steps

After adding the products, you can:
- Update product images by uploading actual photos
- Add inventory management
- Set up pricing and discounts
- Configure shipping options

