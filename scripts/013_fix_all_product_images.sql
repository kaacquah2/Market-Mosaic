-- Fix all product images with proper Unsplash URLs
-- This script updates all products to have working image URLs

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1556821552-5f63b1c2c723?w=500&h=500&fit=crop' WHERE name = 'Oversized Vintage Hoodie';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=500&fit=crop' WHERE name = 'Cargo Pants with Straps';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop' WHERE name = 'Graphic T-Shirt Collection';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop' WHERE name = 'Baggy Jeans';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1506629082632-401017062e57?w=500&h=500&fit=crop' WHERE name = 'Oversized Denim Jacket';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1506629082632-401017062e57?w=500&h=500&fit=crop' WHERE name = 'Track Pants Premium';

-- Sneakers
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop' WHERE name = 'Air Max Inspired Sneakers';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop' WHERE name = 'Retro Basketball Shoes';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1525966222134-fceb466e6e85?w=500&h=500&fit=crop' WHERE name = 'Platform Skate Shoes';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1525966222134-fceb466e6e85?w=500&h=500&fit=crop' WHERE name = 'High-Top Canvas Sneakers';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop' WHERE name = 'Running Shoes Performance';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop' WHERE name = 'Slip-On Casual Sneakers';

-- Tech & Accessories
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop' WHERE name = 'Wireless Earbuds Pro';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop' WHERE name = 'Phone Case with Attitude';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop' WHERE name = 'Crossbody Bag';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop' WHERE name = 'Beanie Collection';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop' WHERE name = 'Gaming Headset RGB';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop' WHERE name = 'Portable Phone Charger';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop' WHERE name = 'USB-C Hub Multi-Port';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop' WHERE name = 'Wireless Mouse Pro';

-- Lifestyle & Home
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=500&h=500&fit=crop' WHERE name = 'LED Neon Sign';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop' WHERE name = 'Vinyl Record Player';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=500&h=500&fit=crop' WHERE name = 'Aesthetic Desk Lamp';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=500&h=500&fit=crop' WHERE name = 'Stainless Steel Water Bottle';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop' WHERE name = 'Minimalist Backpack';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=500&h=500&fit=crop' WHERE name = 'Desk Lamp LED';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop' WHERE name = 'Wireless Charger Pad';

-- Beauty & Personal Care
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop' WHERE name = 'Lip Tint Palette';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop' WHERE name = 'Skincare Starter Kit';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop' WHERE name = 'Hair Styling Set';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop' WHERE name = 'Face Mask Sheet Set';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop' WHERE name = 'Beard Care Kit';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop' WHERE name = 'Hair Styling Gel';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop' WHERE name = 'Lip Balm Collection';

-- Gaming & Entertainment
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587829191301-4b34e2b6d83d?w=500&h=500&fit=crop' WHERE name = 'Gaming Headset RGB';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587829191301-4b34e2b6d83d?w=500&h=500&fit=crop' WHERE name = 'Mechanical Keyboard';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587829191301-4b34e2b6d83d?w=500&h=500&fit=crop' WHERE name = 'Gaming Mouse Pad XL';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587829191301-4b34e2b6d83d?w=500&h=500&fit=crop' WHERE name = 'Mechanical Keyboard RGB';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587829191301-4b34e2b6d83d?w=500&h=500&fit=crop' WHERE name = 'Gaming Chair Pro';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587829191301-4b34e2b6d83d?w=500&h=500&fit=crop' WHERE name = 'Controller Charging Dock';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587829191301-4b34e2b6d83d?w=500&h=500&fit=crop' WHERE name = 'Gaming Monitor 144Hz';

-- Update any remaining placeholder URLs to use our local placeholder
UPDATE products SET image_url = '/placeholder.svg' WHERE image_url LIKE '%placeholder.svg%' OR image_url LIKE '%placeholder.jpg%' OR image_url IS NULL OR image_url = '';
