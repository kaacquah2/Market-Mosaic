-- Complete Baby Products Setup
-- Run this script in Supabase SQL Editor
-- This script will clear all products and add baby category products

-- Step 1: Temporarily allow inserts/updates/deletes
DROP POLICY IF EXISTS "products_insert_admin" ON public.products;
DROP POLICY IF EXISTS "products_update_admin" ON public.products;
DROP POLICY IF EXISTS "products_delete_admin" ON public.products;
DROP POLICY IF EXISTS "products_insert_temp" ON public.products;
DROP POLICY IF EXISTS "products_update_temp" ON public.products;
DROP POLICY IF EXISTS "products_delete_temp" ON public.products;

CREATE POLICY "products_insert_temp"
  ON public.products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "products_update_temp"
  ON public.products FOR UPDATE
  USING (true);

CREATE POLICY "products_delete_temp"
  ON public.products FOR DELETE
  USING (true);

-- Step 2: Delete all existing products
DELETE FROM public.products;

-- Step 3: Insert baby category products
INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku, is_active, tags) VALUES

-- Baby Boy Gift Bouquet
('Baby Boy Gift Bouquet', 'Beautiful gift set featuring foil balloon, plush giraffe toy, knitted bear booties, baby socks, nasal aspirator, and baby bottle. Perfect for celebrating a new baby boy!', 79.99, 'Baby', '/placeholder.svg?height=400&width=400', 50, 'BABY-BOY-GIFT-001', true, ARRAY['gift set', 'baby boy', 'newborn', 'toys', 'clothing']),

-- Baby Bath Tub with Toys
('Interactive Baby Bath Tub Set', 'Complete bath time experience with tub, water-spraying crab toy, sunflower shower toy, fishing rod toy, floating turtle toys, and colorful bath balls. Makes bath time fun!', 59.99, 'Baby', '/placeholder.svg?height=400&width=400', 30, 'BABY-BATH-TUB-001', true, ARRAY['bath', 'toys', 'interactive', 'bath time']),

-- Johnson''s Baby Products Set
('Johnson''s Baby Care Collection', 'Gentle skincare set featuring baby cream, baby bath, and baby lotion. Formulated with milk and rice for delicate baby skin. Complete skincare routine.', 24.99, 'Baby', '/placeholder.svg?height=400&width=400', 100, 'JOHNSONS-BABY-SET-001', true, ARRAY['skincare', 'bath', 'lotion', 'gentle']),

-- Personalized Baby Bathrobes
('Personalized Baby Bathrobe Set', 'Luxurious soft bathrobes perfect for after bath time. Available with personalization options for names like Sophia, Matthew, or Kinsley. Terry cloth material.', 34.99, 'Baby', '/placeholder.svg?height=400&width=400', 75, 'BABY-BATHROBE-001', true, ARRAY['bathrobe', 'personalized', 'soft', 'terry cloth']),

-- Diaper Bag Backpack
('Stylish Diaper Bag Backpack', 'Multi-functional navy blue diaper bag with spacious compartments, side pockets for bottles, and multiple carrying options. Perfect for on-the-go parents.', 49.99, 'Baby', '/placeholder.svg?height=400&width=400', 40, 'DIAPER-BAG-001', true, ARRAY['diaper bag', 'backpack', 'travel', 'organization']),

-- Nestle Nestum Baby Cereal
('Nestle Nestum Rice Cereal', 'Organic rice cream cereal without gluten, fortified with iron, zinc, and vitamins A & C. Suitable from 4 months. No added sugars, easy digestion.', 12.99, 'Baby', '/placeholder.svg?height=400&width=400', 150, 'NESTUM-RICE-001', true, ARRAY['cereal', 'organic', 'gluten-free', 'nutrition']),

-- Nestle Golden Morn Cereal
('Nestle Golden Morn Cereal', 'Fortified maize and soya protein cereal for growing kids. Rich in nutrients and delicious taste. Net weight 900g.', 8.99, 'Baby', '/placeholder.svg?height=400&width=400', 200, 'GOLDEN-MORN-001', true, ARRAY['cereal', 'protein', 'nutrition', 'kid-friendly']),

-- Mustela Newborn Gift Set
('Mustela Newborn Arrival Gift Set', 'Complete natural skincare set for delicate newborn skin. Includes gentle shampoo, cleansing gel, cleansing water, body lotion, and diaper rash cream with avocado.', 45.99, 'Baby', '/placeholder.svg?height=400&width=400', 60, 'MUSTELA-NEWBORN-001', true, ARRAY['newborn', 'skincare', 'natural', 'gift set']),

-- Momcozy Wearable Breast Pump
('Momcozy Wearable Breast Pump', 'Compact, hands-free wearable breast pump system with matching carrying case. Portable design for modern moms on the go.', 89.99, 'Baby', '/placeholder.svg?height=400&width=400', 25, 'MOMCOZY-PUMP-001', true, ARRAY['breast pump', 'wearable', 'portable', 'feeding']),

-- Nestle Baby Food - Tropical Fruits
('Nestle Tropical Fruits Baby Food', 'Stage 2 baby food featuring tropical fruits like banana, mango, and pineapple. No added sugar, suitable from 6 months. 120g jar.', 4.99, 'Baby', '/placeholder.svg?height=400&width=400', 250, 'NESTLE-FRUITS-001', true, ARRAY['baby food', 'fruits', 'stage 2', 'no sugar']),

-- Thule Baby Stroller
('Thule Luxe Baby Stroller', 'Premium three-wheel stroller with cream bassinet and black frame. Features adjustable handlebar, spacious storage basket, and smooth-riding wheels.', 349.99, 'Baby', '/placeholder.svg?height=400&width=400', 15, 'THULE-STROLLER-001', true, ARRAY['stroller', 'bassinet', 'premium', 'travel']),

-- Baby Bouncer Swing
('Modern Baby Bouncer Swing', 'Elegant baby bouncer with plush padding, 5-point safety harness, overhead mobile with star and moon toys, and electronic controls for soothing motion.', 199.99, 'Baby', '/placeholder.svg?height=400&width=400', 20, 'BABY-BOUNCER-001', true, ARRAY['bouncer', 'swing', 'safety', 'entertainment']),

-- Nestle Nido FortiGrow Milk Powder
('Nestle Nido FortiGrow Milk Powder', 'Instant full cream milk powder fortified with high-quality proteins, iron, Vitamin C, calcium, and Vitamin D. Net weight 2500g. Perfect for growing children.', 28.99, 'Baby', '/placeholder.svg?height=400&width=400', 80, 'NIDO-FORTIGROW-001', true, ARRAY['milk powder', 'nutrition', 'fortified', 'calcium']),

-- Nestle Cerelac Kids Cereal
('Nestle Cerelac Kids Multicereals & Fruits', 'Delicious cereal with fruit crunchies for kids 3 years and up. Contains wheat, strawberries, mango, banana, and berries. 380g can.', 10.99, 'Baby', '/placeholder.svg?height=400&width=400', 120, 'CERELAC-KIDS-001', true, ARRAY['cereal', 'kids', 'fruits', 'crunchies']);

-- Step 4: Restore the admin policies
DROP POLICY IF EXISTS "products_insert_temp" ON public.products;
DROP POLICY IF EXISTS "products_update_temp" ON public.products;
DROP POLICY IF EXISTS "products_delete_temp" ON public.products;

CREATE POLICY "products_insert_admin"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin(auth.jwt() ->> 'email'));

CREATE POLICY "products_update_admin"
  ON public.products FOR UPDATE
  USING (public.is_admin(auth.jwt() ->> 'email'));

CREATE POLICY "products_delete_admin"
  ON public.products FOR DELETE
  USING (public.is_admin(auth.jwt() ->> 'email'));

-- Step 5: Verify the insert
SELECT COUNT(*) as total_products FROM public.products;
SELECT category, COUNT(*) as count FROM public.products GROUP BY category ORDER BY count DESC;

