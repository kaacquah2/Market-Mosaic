# Database Schema Setup

This directory contains SQL scripts to set up the complete database schema for the ecommerce application.

## Quick Setup

Run the complete schema setup:
```bash
psql -h your-supabase-host -U postgres -d postgres -f scripts/000_setup_complete_schema.sql
```

## Individual Scripts

### Core Tables
- `001_create_products_table.sql` - Products catalog with RLS policies
- `002_create_orders_table.sql` - Order management
- `003_create_order_items_table.sql` - Order line items

### User Management
- `007_create_user_profiles_table.sql` - Extended user profiles with addresses
- `008_create_cart_items_table.sql` - Persistent shopping cart

### Enhanced Features
- `009_create_product_reviews_table.sql` - Customer reviews and ratings
- `010_create_wishlist_table.sql` - User wishlist/favorites
- `011_enhance_products_table.sql` - Additional product fields (SKU, stock, etc.)

### Data Seeding
- `004_seed_products.sql` - Initial product catalog
- `005_update_product_images.sql` - Update product images
- `006_seed_products_extended.sql` - Extended product catalog

## Schema Overview

### Tables Created
1. **products** - Product catalog with categories, pricing, and inventory
2. **orders** - Customer orders with Stripe integration
3. **order_items** - Individual items within orders
4. **user_profiles** - Extended user information and addresses
5. **cart_items** - Persistent shopping cart
6. **product_reviews** - Customer reviews and ratings
7. **wishlist_items** - User wishlist/favorites

### Key Features
- **Row Level Security (RLS)** enabled on all tables
- **User-specific policies** for data access control
- **Admin policies** for product management
- **Automatic triggers** for user profile creation
- **Performance indexes** on frequently queried columns

### Environment Variables Required
See `.env.local` for all required environment variables:
- Supabase URL and API keys
- Stripe secret and publishable keys
- Development/production URLs

## Admin Access
Default admin emails (update in `011_enhance_products_table.sql`):
- `admin@example.com`
- `admin@yourdomain.com`

## Security Notes
- All tables use Row Level Security (RLS)
- Users can only access their own data
- Admin functions are properly secured
- Sensitive operations require authentication
