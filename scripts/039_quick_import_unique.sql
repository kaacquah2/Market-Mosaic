-- ==============================================
-- IMPORT PRODUCTS WITH UNIQUE IMAGES USING UNSplash SEARCH
-- Each product gets a unique image based on its name
-- ==============================================

-- Clean up first
DELETE FROM public.order_items;
DELETE FROM public.cart_items;
DELETE FROM public.wishlist_items;
DELETE FROM public.product_reviews;
DELETE FROM public.products;

-- Insert products with unique Unsplash search URLs
INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku) VALUES

-- ELECTRONICS (10 products)
('Smartphone Wireless Charger', 'Fast wireless charging pad with LED indicator', 24.99, 'Electronics', 'https://source.unsplash.com/600x600/?wireless-charger', 118, 'ELEC-001'),
('Phone Case Clear Protection', 'Ultra-clear protective case with raised edges', 14.99, 'Electronics', 'https://source.unsplash.com/600x600/?phone-case', 245, 'ELEC-002'),
('Screen Protector Tempered Glass', '9H hardness tempered glass protection', 12.99, 'Electronics', 'https://source.unsplash.com/600x600/?screen-protector', 312, 'ELEC-003'),
('USB-C Fast Charging Cable', 'Braided USB-C cable with 60W power delivery', 19.99, 'Electronics', 'https://source.unsplash.com/600x600/?usb-cable', 189, 'ELEC-004'),
('Portable Power Bank', 'Slim design power bank with dual USB ports', 29.99, 'Electronics', 'https://source.unsplash.com/600x600/?power-bank', 156, 'ELEC-005'),
('Wireless Headphones', 'Premium headphones with 30-hour battery', 179.99, 'Electronics', 'https://source.unsplash.com/600x600/?headphones', 67, 'ELEC-006'),
('Wireless Earbuds', 'Bluetooth 5.0 earbuds with noise cancellation', 89.99, 'Electronics', 'https://source.unsplash.com/600x600/?earbuds', 134, 'ELEC-007'),
('Bluetooth Speaker', 'Waterproof speaker with 360-degree sound', 49.99, 'Electronics', 'https://source.unsplash.com/600x600/?speaker', 178, 'ELEC-008'),
('Gaming Headset', 'Surround sound gaming headset', 129.99, 'Electronics', 'https://source.unsplash.com/600x600/?gaming-headset', 89, 'ELEC-009'),
('Smart Watch', 'Fitness tracker with heart rate monitor', 199.99, 'Electronics', 'https://source.unsplash.com/600x600/?smart-watch', 76, 'ELEC-010'),

-- FASHION (10 products)
('White T-Shirt', '100% cotton comfortable fit', 19.99, 'Fashion', 'https://source.unsplash.com/600x600/?white-tshirt', 245, 'FASH-001'),
('Blue Jeans', 'Classic fit denim jeans', 49.99, 'Fashion', 'https://source.unsplash.com/600x600/?jeans', 189, 'FASH-002'),
('Leather Jacket', 'Genuine leather jacket', 199.99, 'Fashion', 'https://source.unsplash.com/600x600/?leather-jacket', 67, 'FASH-003'),
('Running Shoes', 'Comfortable running shoes', 79.99, 'Fashion', 'https://source.unsplash.com/600x600/?running-shoes', 156, 'FASH-004'),
('Beanie Cap', 'Warm winter beanie', 14.99, 'Fashion', 'https://source.unsplash.com/600x600/?beanie', 312, 'FASH-005'),
('Sunglasses', 'UV protection sunglasses', 29.99, 'Fashion', 'https://source.unsplash.com/600x600/?sunglasses', 198, 'FASH-006'),
('Dress Shirt', 'Formal dress shirt', 39.99, 'Fashion', 'https://source.unsplash.com/600x600/?dress-shirt', 167, 'FASH-007'),
('Leather Belt', 'Genuine leather belt', 24.99, 'Fashion', 'https://source.unsplash.com/600x600/?belt', 223, 'FASH-008'),
('Backpack', 'Urban backpack with laptop sleeve', 59.99, 'Fashion', 'https://source.unsplash.com/600x600/?backpack', 134, 'FASH-009'),
('Wristwatch', 'Classic wristwatch', 89.99, 'Fashion', 'https://source.unsplash.com/600x600/?watch', 145, 'FASH-010'),

-- FOOD & GROCERIES (10 products)
('Organic Honey', 'Pure organic honey', 12.99, 'Food & Groceries', 'https://source.unsplash.com/600x600/?honey', 178, 'FOOD-001'),
('Olive Oil', 'Extra virgin olive oil', 24.99, 'Food & Groceries', 'https://source.unsplash.com/600x600/?olive-oil', 134, 'FOOD-002'),
('Coffee Beans', 'Fresh roasted coffee beans', 18.99, 'Food & Groceries', 'https://source.unsplash.com/600x600/?coffee-beans', 256, 'FOOD-003'),
('Dark Chocolate', '70% dark chocolate bar', 6.99, 'Food & Groceries', 'https://source.unsplash.com/600x600/?chocolate', 289, 'FOOD-004'),
('Granola Cereal', 'Healthy granola mix', 9.99, 'Food & Groceries', 'https://source.unsplash.com/600x600/?granola', 198, 'FOOD-005'),
('Olive Oil', 'Premium olive oil', 19.99, 'Food & Groceries', 'https://source.unsplash.com/600x600/?olive-oil-bottle', 156, 'FOOD-006'),
('Pasta', 'Italian pasta', 4.99, 'Food & Groceries', 'https://source.unsplash.com/600x600/?pasta', 234, 'FOOD-007'),
('Rice', 'Long grain rice', 8.99, 'Food & Groceries', 'https://source.unsplash.com/600x600/?rice', 178, 'FOOD-008'),
('Tea', 'Premium tea leaves', 12.99, 'Food & Groceries', 'https://source.unsplash.com/600x600/?tea', 245, 'FOOD-009'),
('Cereal', 'Breakfast cereal', 5.99, 'Food & Groceries', 'https://source.unsplash.com/600x600/?cereal', 198, 'FOOD-010');

-- Verify
SELECT COUNT(*) as total_products FROM public.products;
SELECT category, COUNT(*) as count FROM public.products GROUP BY category;

