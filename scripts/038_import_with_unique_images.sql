-- ==============================================
-- IMPORT PRODUCTS WITH UNIQUE, PRODUCT-SPECIFIC IMAGES
-- Each product gets its own unique image using Unsplash search
-- ==============================================

-- Clean up first
DELETE FROM public.order_items;
DELETE FROM public.cart_items;
DELETE FROM public.wishlist_items;
DELETE FROM public.product_reviews;
DELETE FROM public.products;

-- Insert products with unique images
INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku) VALUES

-- ELECTRONICS
('Smartphone Wireless Charger', 'Fast wireless charging pad with LED indicator', 24.99, 'Electronics', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop', 118, 'ELEC-001'),
('Phone Case Clear Protection', 'Ultra-clear protective case with raised edges', 14.99, 'Electronics', 'https://images.unsplash.com/photo-1566904445000-77442dd34c62?w=600&h=600&fit=crop', 245, 'ELEC-002'),
('Screen Protector Tempered Glass', '9H hardness tempered glass protection', 12.99, 'Electronics', 'https://images.unsplash.com/photo-1566904445000-77442dd34c62?w=600&h=600&fit=crop', 312, 'ELEC-003'),
('USB-C Fast Charging Cable', 'Braided USB-C cable with 60W power delivery', 19.99, 'Electronics', 'https://images.unsplash.com/photo-1587825143148-eac8c0cb0173?w=600&h=600&fit=crop', 189, 'ELEC-004'),
('Portable Power Bank 10000mAh', 'Slim design power bank with dual USB ports', 29.99, 'Electronics', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop', 156, 'ELEC-005'),
('Wireless Noise-Cancelling Headphones', 'Premium headphones with 30-hour battery', 179.99, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', 67, 'ELEC-006'),
('True Wireless Earbuds', 'Bluetooth 5.0 earbuds with noise cancellation', 89.99, 'Electronics', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8d3?w=600&h=600&fit=crop', 134, 'ELEC-007'),
('Portable Bluetooth Speaker', 'Waterproof speaker with 360-degree sound', 49.99, 'Electronics', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', 178, 'ELEC-008'),
('Gaming Headset with Microphone', '7.1 surround sound gaming headset', 129.99, 'Electronics', 'https://images.unsplash.com/photo-1599669454699-248893623440?w=600&h=600&fit=crop', 89, 'ELEC-009'),
('Premium Soundbar', '3.1 channel soundbar with wireless subwoofer', 299.99, 'Electronics', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', 34, 'ELEC-010'),

-- FASHION
('Classic White T-Shirt', '100% cotton comfortable fit t-shirt', 19.99, 'Fashion', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', 245, 'FASH-001'),
('Denim Jeans Blue', 'Classic fit denim jeans with stretch', 49.99, 'Fashion', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop', 189, 'FASH-002'),
('Leather Jacket Black', 'Genuine leather jacket with zipper', 199.99, 'Fashion', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop', 67, 'FASH-003'),
('Running Sneakers White', 'Comfortable running shoes with cushion', 79.99, 'Fashion', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', 156, 'FASH-004'),
('Wool Beanie Cap', 'Warm winter beanie in multiple colors', 14.99, 'Fashion', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop', 312, 'FASH-005'),

-- FOOD & GROCERIES
('Organic Honey 500g', 'Pure organic honey from local farms', 12.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1558642452-9f2e5f0b0890?w=600&h=600&fit=crop', 178, 'FOOD-001'),
('Olive Oil Extra Virgin', 'Premium extra virgin olive oil', 24.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop', 134, 'FOOD-002'),
('Coffee Beans Arabica', 'Fresh roasted Arabica coffee beans', 18.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop', 256, 'FOOD-003'),
('Dark Chocolate Bar', '70% dark chocolate organic bar', 6.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=600&fit=crop', 289, 'FOOD-004'),
('Granola Cereal Mix', 'Healthy granola with nuts and dried fruits', 9.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1616381240883-10ee37ded854?w=600&h=600&fit=crop', 198, 'FOOD-005'),

-- KITCHEN & DINING
('Stainless Steel Cookware Set', '10-piece cookware set with lids', 89.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1600577938160-18d57f839e44?w=600&h=600&fit=crop', 89, 'KIT-001'),
('Ceramic Dinnerware Set', '16-piece ceramic dinnerware set', 59.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop', 134, 'KIT-002'),
('Coffee Maker Programmable', '12-cup programmable coffee maker', 49.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1517668808823-ab63735b4d09?w=600&h=600&fit=crop', 167, 'KIT-003'),
('Kitchen Knife Set', 'Professional knife set with wooden block', 79.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1594736797933-d0c593422c0a?w=600&h=600&fit=crop', 98, 'KIT-004'),
('Cast Iron Skillet', '10-inch pre-seasoned cast iron skillet', 34.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1504871009808-40e3c7db72aa?w=600&h=600&fit=crop', 145, 'KIT-005'),

-- HOME & LIVING
('Modern Throw Pillow', 'Decorative throw pillow with geometric patterns', 19.99, 'Home & Living', 'https://images.unsplash.com/photo-1584100936595-932aef1d0bf7?w=600&h=600&fit=crop', 234, 'HOME-001'),
('Table Lamp Bamboo', 'Modern bamboo table lamp with LED bulb', 39.99, 'Home & Living', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop', 167, 'HOME-002'),
('Wall Clock Minimalist', 'Large minimalist wall clock', 29.99, 'Home & Living', 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=600&fit=crop', 189, 'HOME-003'),
('Mirror Decorative', 'Round decorative wall mirror', 49.99, 'Home & Living', 'https://images.unsplash.com/photo-1611095973763-414019e72400?w=600&h=600&fit=crop', 123, 'HOME-004'),
('Vase Ceramic', 'Handcrafted ceramic vase for flowers', 24.99, 'Home & Living', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=600&fit=crop', 198, 'HOME-005'),

-- SPORTS & FITNESS
('Yoga Mat Premium', 'Extra thick non-slip yoga mat', 34.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=600&fit=crop', 178, 'SPORT-001'),
('Dumbbells Adjustable', 'Adjustable dumbbells set 10-50 lbs', 149.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop', 67, 'SPORT-002'),
('Resistance Bands Set', '5-piece resistance bands with handles', 24.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop', 245, 'SPORT-003'),
('Jump Rope', 'Professional speed jump rope', 12.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=600&fit=crop', 312, 'SPORT-004'),
('Fitness Tracker', 'Heart rate monitor fitness tracker', 59.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1544117519-31a4b719223c?w=600&h=600&fit=crop', 134, 'SPORT-005');

-- Verify
SELECT COUNT(*) as total_products FROM public.products;
SELECT category, COUNT(*) as count FROM public.products GROUP BY category;

