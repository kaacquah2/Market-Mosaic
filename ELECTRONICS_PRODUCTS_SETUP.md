# Electronics Products Setup Guide

This guide will help you clear all existing products and add electronics category products to your database.

## Quick Setup

Run the SQL script directly in Supabase's SQL editor:

1. **Go to your Supabase Dashboard**: https://sjhfmoxdxasyachkklru.supabase.co
2. **Navigate to SQL Editor**: Click on "SQL Editor" in the left sidebar
3. **Create a new query**: Click "New query"
4. **Copy and paste** the contents of `scripts/050_complete_electronics_products_setup.sql`
5. **Click "Run"** to execute the script

This script will:
- Temporarily modify RLS policies to allow inserts
- Delete all existing products
- Insert 28 electronics products
- Restore the original RLS policies
- Show verification results

## Electronics Products Added

The following 28 electronics products will be added:

### Cables & Chargers
1. **Braided USB 3.0 Cable** - $12.99
2. **Multi-Port USB Charger Hub** - $29.99

### Memory Cards
3. **MicroSD Card 16GB Class 10** - $9.99
4. **SD Card 512GB Ultra Fast** - $89.99
5. **MicroSD Card 128GB Pro** - $24.99

### Batteries
6. **Nokia BL-5C Mobile Phone Battery** - $19.99

### Card Readers
7. **Beikell USB 3.0 Card Reader with SD/MicroSD** - $69.99

### Audio Products
8. **JBL Wireless Earbuds Pro** - $129.99
9. **Hitage Wireless Neckband Earphones** - $39.99
10. **JBL Tune 710BT Wireless Headphones** - $79.99
11. **JBL Flip 6 Portable Waterproof Speaker** - $129.95

### Mobile Devices
12. **Nokia 105 Feature Phone** - $29.99
13. **Redmi 5G Smartphone** - $349.99
14. **Smartwatch Fitness Tracker** - $99.99
15. **Huawei Mobile Wi-Fi Hotspot** - $79.99

### Accessories
16. **9D Edge-to-Edge Glass Shield Screen Protector** - $24.99

### Computers & Gaming
17. **Ultra-Slim Laptop 15-inch** - $899.99
18. **Gaming Console Next-Gen** - $499.99
19. **55-inch 4K Ultra HD Smart TV** - $699.99
20. **Wireless Mouse and Keyboard Combo** - $49.99

### Smart Home
21. **Smart Home Hub** - $89.99

### Power & Charging
22. **Portable Power Bank 20000mAh** - $39.99

### Cameras & Drones
23. **4K Action Camera with Waterproof Case** - $149.99
24. **E-Reader with Backlight** - $119.99
25. **Drone with 4K Camera** - $599.99

All products will be categorized under "Electronics" category.

## Categories Breakdown

- **Cables & Chargers**: 2 products
- **Memory Cards**: 3 products
- **Batteries**: 1 product
- **Card Readers**: 1 product
- **Audio Products**: 4 products
- **Mobile Devices**: 4 products
- **Accessories**: 1 product
- **Computers & Gaming**: 4 products
- **Smart Home**: 1 product
- **Power & Charging**: 1 product
- **Cameras & Drones**: 3 products

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
3. Then run `scripts/050_complete_electronics_products_setup.sql` to add the products

## Next Steps

After adding the products, you can:
- Update product images by uploading actual photos
- Add inventory management
- Set up pricing and discounts
- Configure shipping options

