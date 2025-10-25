-- ==============================================
-- DELETE ALL EXISTING PRODUCTS
-- ==============================================
DELETE FROM public.products;

-- ==============================================
-- INSERT NEW UNIQUE PRODUCTS WITH REAL IMAGES
-- ==============================================

INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku) VALUES

-- ==============================================
-- ELECTRONICS & TECH
-- ==============================================
('Smart Fitness Watch', 'Track your health with advanced heart rate monitoring, GPS, and sleep analysis. Water-resistant up to 50 meters.', 199.99, 'Electronics', 'https://images.unsplash.com/photo-1544117519-31a4b719223c?w=600&h=600&fit=crop', 45, 'ELEC-001'),
('Wireless Noise-Cancelling Headphones', 'Premium headphones with 30-hour battery life and crystal-clear sound quality. Perfect for music lovers.', 179.99, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', 32, 'ELEC-002'),
('Portable Bluetooth Speaker', '360-degree sound, waterproof design, and 20-hour playtime. Ideal for outdoor adventures.', 89.99, 'Electronics', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', 67, 'ELEC-003'),
('USB-C Fast Charging Cable Set', 'Durable braided cables with rapid charging technology. Compatible with all devices.', 24.99, 'Electronics', 'https://images.unsplash.com/photo-1587825143148-eac8c0cb0173?w=600&h=600&fit=crop', 120, 'ELEC-004'),
('Portable Power Bank 20000mAh', 'High-capacity power bank with fast charging and dual USB ports. Keep your devices powered anywhere.', 49.99, 'Electronics', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop', 58, 'ELEC-005'),

-- ==============================================
-- FASHION & APPAREL
-- ==============================================
('Classic Denim Jacket', 'Timeless denim jacket with modern fit. Perfect for layering in any season.', 69.99, 'Fashion', 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=600&h=600&fit=crop', 24, 'FASH-001'),
('Slim Fit Chinos', 'Comfortable stretch chinos in multiple colors. Versatile for casual and semi-formal occasions.', 54.99, 'Fashion', 'https://images.unsplash.com/photo-1506629082632-401017062e57?w=600&h=600&fit=crop', 89, 'FASH-002'),
('Oversized Cotton Sweatshirt', 'Soft, breathable cotton sweatshirt with relaxed fit. Available in 6 colors.', 39.99, 'Fashion', 'https://images.unsplash.com/photo-1556821552-5f63b1c2c723?w=600&h=600&fit=crop', 156, 'FASH-003'),
('Leather Crossbody Bag', 'Genuine leather crossbody bag with adjustable strap. Perfect for everyday use.', 79.99, 'Fashion', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', 43, 'FASH-004'),
('Classic White Sneakers', 'Minimalist white sneakers with premium materials. Goes with any outfit.', 89.99, 'Fashion', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', 112, 'FASH-005'),

-- ==============================================
-- HOME & LIVING
-- ==============================================
('Smart LED Light Strip', '16 million colors, voice control compatible, and app control. Transform your space instantly.', 34.99, 'Home & Living', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=600&h=600&fit=crop', 76, 'HOME-001'),
('Minimalist Wall Clock', 'Sleek modern wall clock with silent movement. Perfect for any room decor.', 29.99, 'Home & Living', 'https://images.unsplash.com/photo-1533416784636-2b0ccf8b1a8c?w=600&h=600&fit=crop', 52, 'HOME-002'),
('Essential Oil Diffuser', 'Ultrasonic aromatherapy diffuser with 7 color LED lights and timer function.', 39.99, 'Home & Living', 'https://images.unsplash.com/photo-1570045276920-0c8e01c0c8c0?w=600&h=600&fit=crop', 34, 'HOME-003'),
('Bamboo Cutting Board Set', 'Sustainable bamboo cutting boards in 3 sizes. Natural antibacterial properties.', 44.99, 'Home & Living', 'https://images.unsplash.com/photo-1574417709637-933fe00ec5cd?w=600&h=600&fit=crop', 61, 'HOME-004'),
('Cordless Vacuum Cleaner', 'Lightweight, powerful cordless vacuum with 40-minute runtime. Perfect for quick cleanups.', 159.99, 'Home & Living', 'https://images.unsplash.com/photo-1558452919-08ae4aea8a29?w=600&h=600&fit=crop', 28, 'HOME-005'),

-- ==============================================
-- SPORTS & FITNESS
-- ==============================================
('Adjustable Dumbbells Set', 'Space-saving adjustable dumbbells from 5-50 lbs. Perfect for home gym.', 199.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1534367507873-d2d7e24d797f?w=600&h=600&fit=crop', 41, 'SPRT-001'),
('Yoga Mat Premium', 'Eco-friendly non-slip yoga mat with carrying strap. Thick and comfortable.', 34.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop', 83, 'SPRT-002'),
('Running Shoes Trail', 'Lightweight trail running shoes with excellent grip and cushioning. Perfect for outdoor runs.', 119.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop', 67, 'SPRT-003'),
('Adjustable Resistance Bands', 'Set of 5 resistance bands with door anchor and workout guide. Total body training.', 29.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=600&fit=crop', 95, 'SPRT-004'),
('Sports Water Bottle', 'Insulated stainless steel bottle keeps drinks cold for 24 hours. BPA-free.', 24.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 138, 'SPRT-005'),

-- ==============================================
-- BEAUTY & PERSONAL CARE
-- ==============================================
('Natural Face Cleanser', 'Gentle cleansing gel with aloe vera and chamomile. Suitable for all skin types.', 19.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 92, 'BEAU-001'),
('Electric Toothbrush', 'Sonic electric toothbrush with 5 cleaning modes and 3-month battery life.', 69.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1544759857-5c4403c4b63c?w=600&h=600&fit=crop', 55, 'BEAU-002'),
('Hair Dryer Professional', 'Ionic hair dryer with ceramic coating. Reduces frizz and damage. Fast drying.', 49.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=600&fit=crop', 38, 'BEAU-003'),
('Face Moisturizer Daily', 'Hydrating daily moisturizer with SPF 30. Lightweight and non-greasy formula.', 24.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228720-da61a533e4eb?w=600&h=600&fit=crop', 74, 'BEAU-004'),
('Men''s Grooming Kit', 'Complete grooming kit with beard trimmer, hair clipper, and accessories.', 79.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=600&fit=crop', 49, 'BEAU-005'),

-- ==============================================
-- OFFICE & STUDY
-- ==============================================
('Ergonomic Office Chair', 'Comfortable ergonomic chair with lumbar support and adjustable height. All-day comfort.', 249.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 31, 'OFFC-001'),
('Standing Desk Converter', 'Adjustable standing desk converter that fits any desk. Promotes healthy posture.', 199.99, 'Office & Study', 'https://images.unsplash.com/photo-1587330979470-16b34d76e914?w=600&h=600&fit=crop', 22, 'OFFC-002'),
('Wireless Keyboard & Mouse', 'Sleek wireless keyboard and mouse combo with long battery life. Silent typing.', 79.99, 'Office & Study', 'https://images.unsplash.com/photo-1587829191301-4b34e2b6d83d?w=600&h=600&fit=crop', 54, 'OFFC-003'),
('Monitor Stand with Storage', 'Wooden monitor stand with drawers and USB hub. Organize your workspace.', 49.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 63, 'OFFC-004'),
('Desk Organizer Set', 'Bamboo desk organizer with multiple compartments. Keep your desk tidy.', 34.99, 'Office & Study', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 87, 'OFFC-005'),

-- ==============================================
-- OTHER ESSENTIALS
-- ==============================================
('Travel Backpack', 'Durable 40L travel backpack with laptop compartment and compression straps. Perfect for trips.', 89.99, 'Other Essentials', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', 56, 'ESSN-001'),
('Packing Cubes Set', 'Set of 4 packing cubes in different sizes. Organize your luggage efficiently.', 29.99, 'Other Essentials', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', 71, 'ESSN-002'),
('Digital Luggage Scale', 'Handheld digital luggage scale with LCD display. Avoid overweight fees.', 18.99, 'Other Essentials', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=600&fit=crop', 103, 'ESSN-003'),
('Travel Adapter Universal', 'Universal travel adapter with 4 USB ports. Works in 150+ countries.', 24.99, 'Other Essentials', 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop', 89, 'ESSN-004'),
('Portable Phone Stand', 'Adjustable aluminum phone stand for desk or travel. Compatible with all phones.', 14.99, 'Other Essentials', 'https://images.unsplash.com/photo-1595925961061-6dc2b06e3b92?w=600&h=600&fit=crop', 127, 'ESSN-005'),
('Car Phone Mount', 'Magnetic car phone mount with 360-degree rotation. Strong hold on any surface.', 19.99, 'Other Essentials', 'https://images.unsplash.com/photo-1595925961061-6dc2b06e3b92?w=600&h=600&fit=crop', 94, 'ESSN-006'),
('Emergency Car Kit', 'Complete emergency kit with jumper cables, flashlight, and first aid supplies.', 59.99, 'Other Essentials', 'https://images.unsplash.com/photo-1619119994738-d196e6599117?w=600&h=600&fit=crop', 45, 'ESSN-007'),
('Multi-Tool Pocket Knife', 'Compact multi-tool with 12 functions. Essential for outdoor adventures.', 34.99, 'Other Essentials', 'https://images.unsplash.com/photo-1591539690158-0f0b0cca9e5b?w=600&h=600&fit=crop', 62, 'ESSN-008'),
('Solar Power Bank', 'Eco-friendly solar power bank with built-in flashlight. Charge your devices anywhere.', 44.99, 'Other Essentials', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop', 51, 'ESSN-009'),
('First Aid Kit Compact', 'Compact first aid kit with essential supplies. Perfect for home, car, or travel.', 29.99, 'Other Essentials', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=600&fit=crop', 78, 'ESSN-010'),

-- ==============================================
-- FOOD & GROCERIES
-- ==============================================
('Organic Whole Grain Bread', 'Fresh baked organic bread with whole grains. Rich in fiber and nutrients.', 4.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop', 145, 'FOOD-001'),
('Extra Virgin Olive Oil 500ml', 'Premium Italian extra virgin olive oil. Cold-pressed and unfiltered.', 12.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop', 89, 'FOOD-002'),
('Organic Coffee Beans', 'Single-origin organic coffee beans. Medium roast with smooth chocolate notes.', 15.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop', 112, 'FOOD-003'),
('Fresh Organic Eggs 12 Pack', 'Farm-fresh organic eggs from free-range hens. High in protein and omega-3.', 6.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=600&fit=crop', 234, 'FOOD-004'),
('Organic Honey 500g', 'Pure organic honey from local beekeepers. Raw and unfiltered.', 14.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop', 76, 'FOOD-005'),
('Dark Chocolate Bar 85%', 'Premium dark chocolate with 85% cocoa. Rich and antioxidant-rich.', 5.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=600&h=600&fit=crop', 98, 'FOOD-006'),
('Organic Quinoa', 'Premium organic quinoa. High protein superfood perfect for salads and bowls.', 8.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1626673569490-5300e5e2cbc6?w=600&h=600&fit=crop', 67, 'FOOD-007'),
('Fresh Avocados 4 Pack', 'Ripe Hass avocados. Perfect for salads, toast, and guacamole.', 5.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&h=600&fit=crop', 189, 'FOOD-008'),

-- ==============================================
-- KITCHEN & DINING
-- ==============================================
('Stainless Steel Cookware Set', '10-piece non-stick cookware set with lids. Compatible with all stove types.', 149.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=600&h=600&fit=crop', 34, 'KITC-001'),
('Silicone Baking Mat Set', 'Set of 2 reusable silicone baking mats. Non-stick and oven-safe up to 450°F.', 19.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=600&fit=crop', 92, 'KITC-002'),
('Professional Chef Knife', 'High-carbon stainless steel chef knife. Razor-sharp and durable.', 79.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1594736797933-d0f9d98d4f72?w=600&h=600&fit=crop', 45, 'KITC-003'),
('Electric Kettle Glass', 'Borosilicate glass electric kettle with LED indicator. Boils water in 2 minutes.', 44.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1514228742587-9b130788b144?w=600&h=600&fit=crop', 68, 'KITC-004'),
('Instant Pot Pressure Cooker', '7-in-1 multi-functional pressure cooker. Cook meals 70% faster.', 99.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=600&h=600&fit=crop', 38, 'KITC-005'),
('Coffee Maker Automatic', '12-cup programmable coffee maker with thermal carafe. Perfect for mornings.', 64.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=600&h=600&fit=crop', 52, 'KITC-006'),
('Kitchen Storage Container Set', 'Airtight food storage containers in 10 sizes. Keep food fresh longer.', 34.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=600&fit=crop', 87, 'KITC-007'),

-- ==============================================
-- BOOKS & MEDIA
-- ==============================================
('Best Sellers Book Collection', 'Set of 5 bestselling novels from top authors. Hardcover editions.', 89.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 43, 'BOOK-001'),
('Cookbook: Healthy Recipes', '200+ healthy recipes with colorful photos. Perfect for home cooks.', 24.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 67, 'BOOK-002'),
('Business Strategy Guide', 'Essential guide for entrepreneurs and business leaders. Practical insights.', 19.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 54, 'BOOK-003'),
('Photography Fundamentals', 'Comprehensive guide to digital photography. Learn composition and lighting.', 29.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 41, 'BOOK-004'),
('Science Fiction Novel', 'Award-winning science fiction novel. First in bestselling trilogy.', 16.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 89, 'BOOK-005'),

-- ==============================================
-- TOYS & GAMES
-- ==============================================
('Educational Building Blocks', 'Colorful building blocks set for creative play. Develops motor skills.', 29.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 73, 'TOYS-001'),
('Board Game Collection', 'Set of 5 classic board games. Perfect for family game nights.', 59.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 38, 'TOYS-002'),
('RC Drone with Camera', '4K camera drone with GPS. Auto-return and altitude hold features.', 199.99, 'Toys & Games', 'https://images.unsplash.com/photo-1507598641400-ec353624cfa6?w=600&h=600&fit=crop', 26, 'TOYS-003'),
('Rubik''s Cube Collection', 'Set of 3 Rubik''s cubes in different sizes. Classic puzzle game.', 19.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 95, 'TOYS-004'),
('Electronic Learning Tablet', 'Interactive educational tablet for kids. 100+ games and activities.', 79.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 47, 'TOYS-005'),

-- ==============================================
-- PET SUPPLIES
-- ==============================================
('Dog Food Premium Dry', 'Nutritious dry dog food with real meat. 30lb bag.', 49.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 82, 'PETS-001'),
('Cat Scratching Post', 'Tall cat scratching post with sisal rope. Includes hanging toys.', 39.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=600&fit=crop', 58, 'PETS-002'),
('Dog Leash Retractable', 'Heavy-duty retractable leash extends up to 26 feet. Comfortable grip.', 24.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 103, 'PETS-003'),
('Pet Carrier Travel', 'Airline-approved pet carrier with ventilation. Comfortable for small pets.', 44.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=600&fit=crop', 51, 'PETS-004'),
('Automatic Pet Feeder', 'Programmable automatic pet feeder with portion control. Perfect for busy owners.', 89.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 34, 'PETS-005');

-- ==============================================
-- VERIFICATION
-- ==============================================
-- Check product count
SELECT COUNT(*) as total_products FROM public.products;

-- Check products by category
SELECT category, COUNT(*) as product_count 
FROM public.products 
GROUP BY category 
ORDER BY product_count DESC;

-- Check products with stock
SELECT COUNT(*) as in_stock_products 
FROM public.products 
WHERE stock_quantity > 0;

