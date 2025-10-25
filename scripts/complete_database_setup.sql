-- Complete Database Schema Setup for Ecommerce App
-- Run this single script to set up the entire database schema

-- ==============================================
-- 1. CREATE PRODUCTS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable
DROP POLICY IF EXISTS "products_select_public" ON public.products;
CREATE POLICY "products_select_public"
  ON public.products FOR SELECT
  USING (true);

-- Only admins can insert products (we'll check admin status in app logic)
DROP POLICY IF EXISTS "products_insert_admin" ON public.products;
CREATE POLICY "products_insert_admin"
  ON public.products FOR INSERT
  WITH CHECK (false);

-- Only admins can update products
DROP POLICY IF EXISTS "products_update_admin" ON public.products;
CREATE POLICY "products_update_admin"
  ON public.products FOR UPDATE
  USING (false);

-- Only admins can delete products
DROP POLICY IF EXISTS "products_delete_admin" ON public.products;
CREATE POLICY "products_delete_admin"
  ON public.products FOR DELETE
  USING (false);

-- ==============================================
-- 2. CREATE ORDERS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can only view their own orders
DROP POLICY IF EXISTS "orders_select_own" ON public.orders;
CREATE POLICY "orders_select_own"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own orders
DROP POLICY IF EXISTS "orders_insert_own" ON public.orders;
CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own orders
DROP POLICY IF EXISTS "orders_update_own" ON public.orders;
CREATE POLICY "orders_update_own"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id);

-- Users cannot delete orders
DROP POLICY IF EXISTS "orders_delete_none" ON public.orders;
CREATE POLICY "orders_delete_none"
  ON public.orders FOR DELETE
  USING (false);

-- ==============================================
-- 3. CREATE ORDER_ITEMS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on order_items table
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Users can view order items for their own orders
DROP POLICY IF EXISTS "order_items_select_own" ON public.order_items;
CREATE POLICY "order_items_select_own"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Users can insert order items for their own orders
DROP POLICY IF EXISTS "order_items_insert_own" ON public.order_items;
CREATE POLICY "order_items_insert_own"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Users cannot update or delete order items
DROP POLICY IF EXISTS "order_items_update_none" ON public.order_items;
CREATE POLICY "order_items_update_none"
  ON public.order_items FOR UPDATE
  USING (false);

DROP POLICY IF EXISTS "order_items_delete_none" ON public.order_items;
CREATE POLICY "order_items_delete_none"
  ON public.order_items FOR DELETE
  USING (false);

-- ==============================================
-- 4. CREATE USER_PROFILES TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'US',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on user_profiles table
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
CREATE POLICY "user_profiles_select_own"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "user_profiles_insert_own" ON public.user_profiles;
CREATE POLICY "user_profiles_insert_own"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
CREATE POLICY "user_profiles_update_own"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Users cannot delete their profile
DROP POLICY IF EXISTS "user_profiles_delete_none" ON public.user_profiles;
CREATE POLICY "user_profiles_delete_none"
  ON public.user_profiles FOR DELETE
  USING (false);

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================
-- 5. CREATE CART_ITEMS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on cart_items table
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own cart items
DROP POLICY IF EXISTS "cart_items_select_own" ON public.cart_items;
CREATE POLICY "cart_items_select_own"
  ON public.cart_items FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own cart items
DROP POLICY IF EXISTS "cart_items_insert_own" ON public.cart_items;
CREATE POLICY "cart_items_insert_own"
  ON public.cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own cart items
DROP POLICY IF EXISTS "cart_items_update_own" ON public.cart_items;
CREATE POLICY "cart_items_update_own"
  ON public.cart_items FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own cart items
DROP POLICY IF EXISTS "cart_items_delete_own" ON public.cart_items;
CREATE POLICY "cart_items_delete_own"
  ON public.cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- ==============================================
-- 6. CREATE PRODUCT_REVIEWS TABLE
-- ==============================================
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

-- Enable RLS on product_reviews table
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews
DROP POLICY IF EXISTS "product_reviews_select_public" ON public.product_reviews;
CREATE POLICY "product_reviews_select_public"
  ON public.product_reviews FOR SELECT
  USING (true);

-- Users can insert their own reviews
DROP POLICY IF EXISTS "product_reviews_insert_own" ON public.product_reviews;
CREATE POLICY "product_reviews_insert_own"
  ON public.product_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
DROP POLICY IF EXISTS "product_reviews_update_own" ON public.product_reviews;
CREATE POLICY "product_reviews_update_own"
  ON public.product_reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reviews
DROP POLICY IF EXISTS "product_reviews_delete_own" ON public.product_reviews;
CREATE POLICY "product_reviews_delete_own"
  ON public.product_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update product average rating
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products 
  SET updated_at = NOW()
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update product when reviews change
DROP TRIGGER IF EXISTS on_review_change ON public.product_reviews;
CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_product_rating();

-- ==============================================
-- 7. CREATE WISHLIST_ITEMS TABLE
-- ==============================================
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on wishlist_items table
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own wishlist
DROP POLICY IF EXISTS "wishlist_items_select_own" ON public.wishlist_items;
CREATE POLICY "wishlist_items_select_own"
  ON public.wishlist_items FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own wishlist items
DROP POLICY IF EXISTS "wishlist_items_insert_own" ON public.wishlist_items;
CREATE POLICY "wishlist_items_insert_own"
  ON public.wishlist_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own wishlist items
DROP POLICY IF EXISTS "wishlist_items_delete_own" ON public.wishlist_items;
CREATE POLICY "wishlist_items_delete_own"
  ON public.wishlist_items FOR DELETE
  USING (auth.uid() = user_id);

-- Users cannot update wishlist items (no update needed)
DROP POLICY IF EXISTS "wishlist_items_update_none" ON public.wishlist_items;
CREATE POLICY "wishlist_items_update_none"
  ON public.wishlist_items FOR UPDATE
  USING (false);

-- ==============================================
-- 8. ENHANCE PRODUCTS TABLE
-- ==============================================
-- Add missing columns to products table for better ecommerce functionality
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS weight DECIMAL(8,2),
ADD COLUMN IF NOT EXISTS dimensions TEXT, -- JSON string for length, width, height
ADD COLUMN IF NOT EXISTS tags TEXT[], -- Array of tags
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0 CHECK (review_count >= 0);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_products_rating ON public.products(average_rating);

-- Update products table policies to allow admin operations
DROP POLICY IF EXISTS "products_insert_admin" ON public.products;
DROP POLICY IF EXISTS "products_update_admin" ON public.products;
DROP POLICY IF EXISTS "products_delete_admin" ON public.products;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_email IN ('admin@example.com', 'admin@yourdomain.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin policies
DROP POLICY IF EXISTS "products_insert_admin" ON public.products;
CREATE POLICY "products_insert_admin"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin(auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS "products_update_admin" ON public.products;
CREATE POLICY "products_update_admin"
  ON public.products FOR UPDATE
  USING (public.is_admin(auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS "products_delete_admin" ON public.products;
CREATE POLICY "products_delete_admin"
  ON public.products FOR DELETE
  USING (public.is_admin(auth.jwt() ->> 'email'));

-- ==============================================
-- 9. SEED INITIAL PRODUCTS
-- ==============================================
-- Insert sample products for youth-focused eCommerce store
INSERT INTO products (name, description, price, category, image_url) VALUES
-- Streetwear & Fashion
('Oversized Vintage Hoodie', 'Cozy oversized hoodie with retro vibes. Perfect for casual streetwear looks.', 49.99, 'Streetwear', '/placeholder.svg?height=400&width=400'),
('Cargo Pants with Straps', 'Multi-pocket cargo pants with adjustable straps. Ultimate utility meets style.', 59.99, 'Streetwear', '/placeholder.svg?height=400&width=400'),
('Graphic T-Shirt Collection', 'Limited edition graphic tees with bold designs and vibrant colors.', 24.99, 'Streetwear', '/placeholder.svg?height=400&width=400'),
('Baggy Jeans', 'Classic baggy jeans with a modern twist. Comfortable and on-trend.', 64.99, 'Streetwear', '/placeholder.svg?height=400&width=400'),

-- Sneakers & Footwear
('Air Max Inspired Sneakers', 'Chunky sneakers with air cushioning. Maximum comfort and style.', 89.99, 'Sneakers', '/placeholder.svg?height=400&width=400'),
('Retro Basketball Shoes', 'Classic basketball silhouette with modern colorways. Court-ready style.', 99.99, 'Sneakers', '/placeholder.svg?height=400&width=400'),
('Platform Skate Shoes', 'Elevated skate shoes with platform sole. Perfect for skating or casual wear.', 79.99, 'Sneakers', '/placeholder.svg?height=400&width=400'),

-- Tech & Accessories
('Wireless Earbuds Pro', 'Premium wireless earbuds with noise cancellation and 30-hour battery life.', 129.99, 'Tech', '/placeholder.svg?height=400&width=400'),
('Phone Case with Attitude', 'Durable phone case with bold designs and drop protection.', 19.99, 'Accessories', '/placeholder.svg?height=400&width=400'),
('Crossbody Bag', 'Trendy crossbody bag perfect for festivals and everyday carry.', 44.99, 'Accessories', '/placeholder.svg?height=400&width=400'),
('Beanie Collection', 'Cozy beanies in multiple colors. Essential winter accessory.', 22.99, 'Accessories', '/placeholder.svg?height=400&width=400'),

-- Lifestyle & Home
('LED Neon Sign', 'Custom LED neon signs for room decor. Create the vibe you want.', 34.99, 'Lifestyle', '/placeholder.svg?height=400&width=400'),
('Vinyl Record Player', 'Retro vinyl record player with modern sound quality.', 149.99, 'Lifestyle', '/placeholder.svg?height=400&width=400'),
('Aesthetic Desk Lamp', 'Minimalist desk lamp with adjustable brightness and color modes.', 39.99, 'Lifestyle', '/placeholder.svg?height=400&width=400'),

-- Beauty & Personal Care
('Lip Tint Palette', 'Multi-shade lip tint palette with long-lasting formula.', 16.99, 'Beauty', '/placeholder.svg?height=400&width=400'),
('Skincare Starter Kit', 'Complete skincare routine in one kit. Glow up essentials.', 54.99, 'Beauty', '/placeholder.svg?height=400&width=400'),
('Hair Styling Set', 'Professional hair styling tools for salon-quality results at home.', 69.99, 'Beauty', '/placeholder.svg?height=400&width=400'),

-- Gaming & Entertainment
('Gaming Headset RGB', 'High-performance gaming headset with RGB lighting and surround sound.', 119.99, 'Gaming', '/placeholder.svg?height=400&width=400'),
('Mechanical Keyboard', 'Customizable mechanical keyboard with hot-swap switches.', 139.99, 'Gaming', '/placeholder.svg?height=400&width=400'),
('Gaming Mouse Pad XL', 'Extra-large gaming mouse pad with non-slip base.', 29.99, 'Gaming', '/placeholder.svg?height=400&width=400');

-- ==============================================
-- 10. UPDATE PRODUCT IMAGES
-- ==============================================
-- Update product images to use proper URLs without query strings
UPDATE products SET image_url = '/placeholder.jpg' WHERE image_url LIKE '%?%';

-- ==============================================
-- 11. SEED EXTENDED PRODUCTS
-- ==============================================
-- Insert 30+ products with proper image URLs
INSERT INTO products (name, price, description, category, image_url) VALUES
-- Streetwear
('Oversized Vintage Hoodie', 49.99, 'Classic oversized hoodie with vintage wash', 'Streetwear', 'https://images.unsplash.com/photo-1556821552-5f63b1c2c723?w=500&h=500&fit=crop'),
('Cargo Pants with Straps', 59.99, 'Multi-pocket cargo pants with adjustable straps', 'Streetwear', 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=500&fit=crop'),
('Graphic T-Shirt Collection', 29.99, 'Limited edition graphic tees', 'Streetwear', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop'),
('Oversized Denim Jacket', 79.99, 'Vintage-inspired oversized denim', 'Streetwear', 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop'),
('Track Pants Premium', 44.99, 'Comfortable track pants with side stripes', 'Streetwear', 'https://images.unsplash.com/photo-1506629082632-401017062e57?w=500&h=500&fit=crop'),

-- Sneakers
('Air Max Inspired Sneakers', 89.99, 'Modern sneakers with air cushioning', 'Sneakers', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop'),
('Retro Basketball Shoes', 99.99, 'Classic basketball shoe design', 'Sneakers', 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop'),
('High-Top Canvas Sneakers', 69.99, 'Durable canvas high-tops', 'Sneakers', 'https://images.unsplash.com/photo-1525966222134-fceb466e6e85?w=500&h=500&fit=crop'),
('Running Shoes Performance', 119.99, 'Advanced running shoe technology', 'Sneakers', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop'),
('Slip-On Casual Sneakers', 59.99, 'Easy slip-on everyday sneakers', 'Sneakers', 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop'),

-- Tech & Gadgets
('Wireless Earbuds Pro', 129.99, 'Premium wireless earbuds with noise cancellation', 'Tech', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'),
('Gaming Headset RGB', 119.99, 'Professional gaming headset with RGB lighting', 'Tech', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'),
('Portable Phone Charger', 34.99, 'Fast charging power bank 20000mAh', 'Tech', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop'),
('USB-C Hub Multi-Port', 44.99, ' 7-in-1 USB-C hub for connectivity', 'Tech', 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop'),
('Wireless Mouse Pro', 54.99, 'Ergonomic wireless mouse with precision tracking', 'Tech', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop'),

-- Lifestyle
('LED Neon Sign', 34.99, 'Customizable LED neon signs for room decor', 'Lifestyle', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=500&h=500&fit=crop'),
('Stainless Steel Water Bottle', 29.99, 'Insulated water bottle keeps drinks cold for 24hrs', 'Lifestyle', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=500&h=500&fit=crop'),
('Minimalist Backpack', 79.99, 'Sleek backpack with laptop compartment', 'Lifestyle', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop'),
('Desk Lamp LED', 44.99, 'Modern LED desk lamp with adjustable brightness', 'Lifestyle', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=500&h=500&fit=crop'),
('Wireless Charger Pad', 39.99, 'Fast wireless charging pad for all devices', 'Lifestyle', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop'),

-- Beauty & Personal Care
('Skincare Starter Kit', 54.99, 'Complete skincare routine set', 'Beauty', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop'),
('Face Mask Sheet Set', 24.99, 'Pack of 10 hydrating face masks', 'Beauty', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop'),
('Beard Care Kit', 39.99, 'Complete beard grooming set', 'Beauty', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop'),
('Hair Styling Gel', 19.99, 'Professional hair styling gel', 'Beauty', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop'),
('Lip Balm Collection', 14.99, 'Set of 5 flavored lip balms', 'Beauty', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop'),

-- Gaming
('Gaming Mouse Pad XL', 34.99, 'Large gaming mouse pad with RGB', 'Gaming', 'https://images.unsplash.com/photo-1587829191301-4b34e2b6d83d?w=500&h=500&fit=crop'),
('Mechanical Keyboard RGB', 99.99, 'Professional mechanical gaming keyboard', 'Gaming', 'https://images.unsplash.com/photo-1587829191301-4b34e2b6d83d?w=500&h=500&fit=crop'),
('Gaming Chair Pro', 249.99, 'Ergonomic gaming chair with lumbar support', 'Gaming', 'https://images.unsplash.com/photo-1587829191301-4b34e2b6d83d?w=500&h=500&fit=crop'),
('Controller Charging Dock', 29.99, 'Fast charging dock for game controllers', 'Gaming', 'https://images.unsplash.com/photo-1587829191301-4b34e2b6d83d?w=500&h=500&fit=crop'),
('Gaming Monitor 144Hz', 299.99, '27 inch 144Hz gaming monitor', 'Gaming', 'https://images.unsplash.com/photo-1587829191301-4b34e2b6d83d?w=500&h=500&fit=crop');

-- ==============================================
-- VERIFICATION
-- ==============================================
-- Verify schema creation
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Show product count
SELECT COUNT(*) as total_products FROM public.products;

-- Show table structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
ORDER BY table_name, ordinal_position;
