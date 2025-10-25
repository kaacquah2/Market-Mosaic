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
