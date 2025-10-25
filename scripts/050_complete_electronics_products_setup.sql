-- Complete Electronics Products Setup
-- Run this script in Supabase SQL Editor
-- This script will clear all products and add electronics category products

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

-- Step 3: Insert electronics category products
INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku, is_active, tags) VALUES

-- USB Cables and Chargers
('Braided USB 3.0 Cable', 'Premium braided USB 3.0 cable with gold-plated connectors. Features both USB-A and USB-C ends for versatile connectivity.', 12.99, 'Electronics', '/placeholder.svg?height=400&width=400', 150, 'ELEC-USB-CABLE-001', true, ARRAY['usb cable', 'charging', 'data transfer', 'braided']),

('Multi-Port USB Charger Hub', '10-port USB charger hub with 8x 5V/2.4A ports and 2x 5V/1A ports. Perfect for charging multiple devices simultaneously.', 29.99, 'Electronics', '/placeholder.svg?height=400&width=400', 100, 'ELEC-CHARGER-HUB-001', true, ARRAY['usb charger', 'multi-port', 'charging station', 'hub']),

-- Memory Cards
('MicroSD Card 16GB Class 10', 'High-speed microSD card with Class 10 rating and UHS Speed Class 1 (U1). Perfect for smartphones, cameras, and tablets.', 9.99, 'Electronics', '/placeholder.svg?height=400&width=400', 200, 'ELEC-MICROSD-16GB-001', true, ARRAY['microsd', 'memory card', 'storage', 'class 10']),

('SD Card 512GB Ultra Fast', 'Massive 512GB SD card with blazing fast 170MB/s read speeds. Ideal for professional photography and 4K video recording.', 89.99, 'Electronics', '/placeholder.svg?height=400&width=400', 50, 'ELEC-SD-512GB-001', true, ARRAY['sd card', 'storage', '512gb', 'photography']),

('MicroSD Card 128GB Pro', 'Professional grade 128GB microSD card with high-speed performance for action cameras and drones.', 24.99, 'Electronics', '/placeholder.svg?height=400&width=400', 80, 'ELEC-MICROSD-128GB-001', true, ARRAY['microsd', '128gb', 'storage', 'professional']),

-- Batteries
('Nokia BL-5C Mobile Phone Battery', 'Original Nokia BL-5C rechargeable battery with reliable power for Nokia feature phones.', 19.99, 'Electronics', '/placeholder.svg?height=400&width=400', 60, 'ELEC-BATTERY-NOKIA-001', true, ARRAY['battery', 'nokia', 'mobile phone', 'rechargeable']),

-- Card Readers
('Beikell USB 3.0 Card Reader with SD/MicroSD', 'Dual USB-C and USB-A card reader with USB 3.0 speeds. Includes 512GB SD card and 128GB microSD card.', 69.99, 'Electronics', '/placeholder.svg?height=400&width=400', 40, 'ELEC-CARDREADER-001', true, ARRAY['card reader', 'usb 3.0', 'usb-c', 'sd card', 'microsd']),

-- Wireless Earbuds and Headphones
('JBL Wireless Earbuds Pro', 'True wireless earbuds with active noise cancellation, powerful bass, and IPX7 waterproof rating. Includes charging case.', 129.99, 'Electronics', '/placeholder.svg?height=400&width=400', 90, 'ELEC-JBL-EARBUDS-001', true, ARRAY['earbuds', 'wireless', 'jbl', 'noise cancelling', 'waterproof']),

('Hitage Wireless Neckband Earphones', 'Stylish black and blue wireless neckband earphones with clear audio and comfortable fit. Perfect for sports and daily use.', 39.99, 'Electronics', '/placeholder.svg?height=400&width=400', 120, 'ELEC-NECKBAND-001', true, ARRAY['earphones', 'wireless', 'neckband', 'bluetooth', 'sports']),

('JBL Tune 710BT Wireless Headphones', 'Over-ear wireless headphones with JBL Pure Bass Sound, 50-hour battery life, and multi-point connection.', 79.99, 'Electronics', '/placeholder.svg?height=400&width=400', 70, 'ELEC-JBL-HEADPHONES-001', true, ARRAY['headphones', 'over-ear', 'wireless', 'jbl', 'audio']),

-- Portable Speakers
('JBL Flip 6 Portable Waterproof Speaker', 'Powerful portable speaker with rich bass, IP67 waterproof and dustproof rating, and 12 hours of playtime.', 129.95, 'Electronics', '/placeholder.svg?height=400&width=400', 85, 'ELEC-JBL-FLIP6-001', true, ARRAY['speaker', 'portable', 'waterproof', 'bluetooth', 'jbl']),

-- Smartphones and Feature Phones
('Nokia 105 Feature Phone', 'Classic durable Nokia feature phone with long battery life, essential calling and texting capabilities.', 29.99, 'Electronics', '/placeholder.svg?height=400&width=400', 100, 'ELEC-NOKIA-105-001', true, ARRAY['feature phone', 'nokia', 'basic phone', 'mobile']),

('Redmi 5G Smartphone', 'Premium 5G smartphone with 48MP AI camera, vibrant display, and powerful performance.', 349.99, 'Electronics', '/placeholder.svg?height=400&width=400', 45, 'ELEC-REDMI-5G-001', true, ARRAY['smartphone', '5g', 'redmi', 'mobile phone', 'camera']),

-- Smartwatches
('Smartwatch Fitness Tracker', 'Advanced smartwatch with heart rate monitoring, activity tracking, GPS, and health metrics. Compatible with iOS and Android.', 99.99, 'Electronics', '/placeholder.svg?height=400&width=400', 110, 'ELEC-SMARTWATCH-001', true, ARRAY['smartwatch', 'fitness tracker', 'wearable', 'health', 'gps']),

-- Mobile Hotspots
('Huawei Mobile Wi-Fi Hotspot', 'Portable 4G LTE Wi-Fi hotspot supporting up to 32 devices. Perfect for travel and remote work with reliable connectivity.', 79.99, 'Electronics', '/placeholder.svg?height=400&width=400', 30, 'ELEC-WIFI-HOTSPOT-001', true, ARRAY['wifi hotspot', 'mobile wifi', 'huawei', '4g', 'portable']),

-- Screen Protectors
('9D Edge-to-Edge Glass Shield Screen Protector', 'Premium tempered glass screen protector with full edge-to-edge coverage and maximum protection against scratches and impacts.', 24.99, 'Electronics', '/placeholder.svg?height=400&width=400', 180, 'ELEC-SCREEN-GUARD-001', true, ARRAY['screen protector', 'tempered glass', 'protection', 'phone accessory']),

-- Laptops and Computers
('Ultra-Slim Laptop 15-inch', 'Premium ultra-slim laptop with high-resolution display, fast processor, and all-day battery life. Perfect for work and entertainment.', 899.99, 'Electronics', '/placeholder.svg?height=400&width=400', 25, 'ELEC-LAPTOP-001', true, ARRAY['laptop', 'computer', 'ultrabook', 'portable']),

-- Gaming Consoles
('Gaming Console Next-Gen', 'Next-generation gaming console with stunning graphics, fast loading times, and exclusive game library.', 499.99, 'Electronics', '/placeholder.svg?height=400&width=400', 35, 'ELEC-GAMING-CONSOLE-001', true, ARRAY['gaming', 'console', 'video games', 'entertainment']),

-- Smart TVs
('55-inch 4K Ultra HD Smart TV', 'Immersive 55-inch Smart TV with 4K resolution, HDR, voice control, and streaming apps built-in.', 699.99, 'Electronics', '/placeholder.svg?height=400&width=400', 20, 'ELEC-SMART-TV-001', true, ARRAY['smart tv', '4k', 'television', 'home entertainment']),

-- Computer Accessories
('Wireless Mouse and Keyboard Combo', 'Ergonomic wireless mouse and keyboard combo with long battery life and reliable connection.', 49.99, 'Electronics', '/placeholder.svg?height=400&width=400', 95, 'ELEC-MOUSE-KEYBOARD-001', true, ARRAY['mouse', 'keyboard', 'wireless', 'computer accessory']),

-- Smart Home
('Smart Home Hub', 'Central smart home hub to control lights, thermostats, security, and all your smart devices from one app.', 89.99, 'Electronics', '/placeholder.svg?height=400&width=400', 55, 'ELEC-SMART-HUB-001', true, ARRAY['smart home', 'hub', 'automation', 'iot']),

-- Power Banks
('Portable Power Bank 20000mAh', 'High-capacity portable power bank with fast charging for smartphones, tablets, and laptops.', 39.99, 'Electronics', '/placeholder.svg?height=400&width=400', 130, 'ELEC-POWERBANK-001', true, ARRAY['power bank', 'portable charger', 'battery', 'charging']),

-- Action Cameras
('4K Action Camera with Waterproof Case', 'Compact 4K action camera with image stabilization, waterproof housing, and multiple mounting options.', 149.99, 'Electronics', '/placeholder.svg?height=400&width=400', 40, 'ELEC-ACTION-CAM-001', true, ARRAY['action camera', '4k', 'waterproof', 'adventure', 'photography']),

-- E-Readers
('E-Reader with Backlight', 'High-resolution e-reader with adjustable backlight, long battery life, and access to millions of books.', 119.99, 'Electronics', '/placeholder.svg?height=400&width=400', 65, 'ELEC-EREADER-001', true, ARRAY['e-reader', 'books', 'reading', 'tablet']),

-- Drones
('Drone with 4K Camera', 'Professional drone with 4K camera, GPS navigation, and intelligent flight modes for aerial photography.', 599.99, 'Electronics', '/placeholder.svg?height=400&width=400', 15, 'ELEC-DRONE-001', true, ARRAY['drone', 'camera', 'aerial', 'photography', 'quadcopter']);

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

