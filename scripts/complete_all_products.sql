-- ==============================================
-- CLEANUP SCRIPT - Run before importing products
-- This handles foreign key constraints properly
-- ==============================================

-- Delete order_items first (references products)
DELETE FROM public.order_items;

-- Delete cart_items (references products)
DELETE FROM public.cart_items;

-- Delete wishlist_items (references products)
DELETE FROM public.wishlist_items;

-- Delete product_reviews (references products)
DELETE FROM public.product_reviews;

-- Now safe to delete products
DELETE FROM public.products;

-- Verification
SELECT 'Cleanup complete. Ready to import new products.' as status;

-- ==============================================
-- ELECTRONICS CATEGORY - 50 PRODUCTS
-- ==============================================

INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku) VALUES

-- Smartphones & Accessories
('Smartphone Wireless Charger', 'Fast wireless charging pad with LED indicator. Compatible with all Qi-enabled devices.', 24.99, 'Electronics', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop', 118, 'ELEC-001'),
('Phone Case Clear Protection', 'Ultra-clear protective case with raised edges. Shock-absorbing material.', 14.99, 'Electronics', 'https://images.unsplash.com/photo-1566904445000-77442dd34c62?w=600&h=600&fit=crop', 245, 'ELEC-002'),
('Screen Protector Tempered Glass', '9H hardness tempered glass with oleophobic coating. Crystal clear protection.', 12.99, 'Electronics', 'https://images.unsplash.com/photo-1566904445000-77442dd34c62?w=600&h=600&fit=crop', 312, 'ELEC-003'),
('USB-C Fast Charging Cable', 'Braided USB-C cable with 60W power delivery. 6ft length.', 19.99, 'Electronics', 'https://images.unsplash.com/photo-1587825143148-eac8c0cb0173?w=600&h=600&fit=crop', 189, 'ELEC-004'),
('Portable Power Bank 10000mAh', 'Slim design power bank with dual USB ports. Fast charging technology.', 29.99, 'Electronics', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop', 156, 'ELEC-005'),

-- Audio Devices
('Wireless Noise-Cancelling Headphones', 'Premium headphones with 30-hour battery and crystal-clear sound.', 179.99, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', 67, 'ELEC-006'),
('True Wireless Earbuds', 'Bluetooth 5.0 earbuds with noise cancellation. 8-hour battery life.', 89.99, 'Electronics', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8d3?w=600&h=600&fit=crop', 134, 'ELEC-007'),
('Portable Bluetooth Speaker', 'Waterproof speaker with 360-degree sound. 20-hour playtime.', 49.99, 'Electronics', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', 178, 'ELEC-008'),
('Gaming Headset with Microphone', '7.1 surround sound gaming headset with RGB lighting. Comfortable for long sessions.', 129.99, 'Electronics', 'https://images.unsplash.com/photo-1599669454699-248893623440?w=600&h=600&fit=crop', 89, 'ELEC-009'),
('Premium Soundbar', '3.1 channel soundbar with wireless subwoofer. Dolby Atmos compatible.', 299.99, 'Electronics', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', 34, 'ELEC-010'),

-- Wearables & Smart Tech
('Smart Fitness Watch', 'Track health with heart rate, GPS, and sleep analysis. Water-resistant.', 199.99, 'Electronics', 'https://images.unsplash.com/photo-1544117519-31a4b719223c?w=600&h=600&fit=crop', 76, 'ELEC-011'),
('Smart Ring Sleep Tracker', 'Discrete sleep and activity tracking ring. Comfortable 24/7 wear.', 249.99, 'Electronics', 'https://images.unsplash.com/photo-1544117519-31a4b719223c?w=600&h=600&fit=crop', 43, 'ELEC-012'),
('Smart Home Hub', 'Central control for all smart devices. Voice assistant compatible.', 89.99, 'Electronics', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', 58, 'ELEC-013'),
('Smart Doorbell Camera', '1080p HD video doorbell with night vision. Motion detection alerts.', 149.99, 'Electronics', 'https://images.unsplash.com/photo-1591280063444-34b0e0a056f6?w=600&h=600&fit=crop', 52, 'ELEC-014'),
('Smart Light Bulbs Set', 'Color-changing smart bulbs with app control. Voice command compatible.', 49.99, 'Electronics', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=600&h=600&fit=crop', 142, 'ELEC-015'),

-- Computer Accessories
('Wireless Mouse Ergonomic', 'Ergonomic wireless mouse with precision tracking. 3-month battery.', 39.99, 'Electronics', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=600&fit=crop', 167, 'ELEC-016'),
('Mechanical Keyboard RGB', 'RGB mechanical keyboard with hot-swap switches. Silent typing.', 119.99, 'Electronics', 'https://images.unsplash.com/photo-1587829191301-4b34e2b6d83d?w=600&h=600&fit=crop', 98, 'ELEC-017'),
('USB-C Hub Multi-Port', '7-in-1 USB-C hub with HDMI, USB ports, and card reader.', 59.99, 'Electronics', 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop', 123, 'ELEC-018'),
('Laptop Stand Aluminum', 'Adjustable aluminum laptop stand. Ergonomic design.', 34.99, 'Electronics', 'https://images.unsplash.com/photo-1599995905957-187fd7c93c80?w=600&h=600&fit=crop', 145, 'ELEC-019'),
('External SSD 1TB', 'Fast external SSD with USB-C. Portable and shock-resistant.', 99.99, 'Electronics', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop', 87, 'ELEC-020'),

-- Cameras & Photography
('Action Camera 4K', 'Waterproof 4K action camera with image stabilization. Perfect for adventures.', 199.99, 'Electronics', 'https://images.unsplash.com/photo-1598550880863-4e7aaef27844?w=600&h=600&fit=crop', 56, 'ELEC-021'),
('Ring Light Photography', 'Adjustable LED ring light with tripod. Perfect for content creators.', 49.99, 'Electronics', 'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=600&h=600&fit=crop', 134, 'ELEC-022'),
('Camera Lens Cleaning Kit', 'Professional lens cleaning kit with microfiber cloths and solution.', 19.99, 'Electronics', 'https://images.unsplash.com/photo-1598550880863-4e7aaef27844?w=600&h=600&fit=crop', 223, 'ELEC-023'),
('Tripod with Smartphone Mount', 'Adjustable tripod with smartphone mount. Lightweight and portable.', 29.99, 'Electronics', 'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=600&h=600&fit=crop', 178, 'ELEC-024'),
('Camera Memory Card 128GB', 'High-speed SD card with 128GB capacity. 4K video recording.', 34.99, 'Electronics', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop', 312, 'ELEC-025'),

-- Tablets & E-Readers
('Tablet Stand Adjustable', 'Multi-angle tablet stand with cable management. Compatible with all tablets.', 24.99, 'Electronics', 'https://images.unsplash.com/photo-1599995905957-187fd7c93c80?w=600&h=600&fit=crop', 167, 'ELEC-026'),
('E-Reader Case Leather', 'Premium leather case with stand. Auto wake/sleep feature.', 39.99, 'Electronics', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 145, 'ELEC-027'),
('Tablet Stylus Pen', 'Precision stylus pen with palm rejection. 2048 pressure levels.', 49.99, 'Electronics', 'https://images.unsplash.com/photo-1599995905957-187fd7c93c80?w=600&h=600&fit=crop', 98, 'ELEC-028'),
('Screen Magnifier for Tablet', '10x magnification screen magnifier. Reduces eye strain.', 29.99, 'Electronics', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 89, 'ELEC-029'),
('Tablet Keyboard Case', 'Protective keyboard case with Bluetooth connectivity. Backlit keys.', 79.99, 'Electronics', 'https://images.unsplash.com/photo-1599995905957-187fd7c93c80?w=600&h=600&fit=crop', 112, 'ELEC-030'),

-- Gaming Accessories
('Gaming Mouse Pad XL', 'Extra-large RGB gaming mouse pad with non-slip base.', 34.99, 'Electronics', 'https://images.unsplash.com/photo-1591294368300-86c7a8c8aed5?w=600&h=600&fit=crop', 156, 'ELEC-031'),
('Controller Charging Station', 'Dual controller charging dock with LED indicators.', 39.99, 'Electronics', 'https://images.unsplash.com/photo-1629883064601-0cad394c5c10?w=600&h=600&fit=crop', 123, 'ELEC-032'),
('Gaming Microphone USB', 'Professional USB microphone with noise cancellation. Perfect for streaming.', 89.99, 'Electronics', 'https://images.unsplash.com/photo-1507984211203-767c0cdf3207?w=600&h=600&fit=crop', 87, 'ELEC-033'),
('Stream Deck Controller', 'Programmable keypad for streamers. 15 customizable buttons.', 149.99, 'Electronics', 'https://images.unsplash.com/photo-1591294368300-86c7a8c8aed5?w=600&h=600&fit=crop', 45, 'ELEC-034'),
('Gaming Monitor Stand', 'Adjustable monitor stand with RGB lighting. Cable management.', 79.99, 'Electronics', 'https://images.unsplash.com/photo-1587829191301-4b34e2b6d83d?w=600&h=600&fit=crop', 67, 'ELEC-035'),

-- Storage & Organization
('USB Flash Drive 64GB', 'Waterproof USB 3.0 flash drive. Fast transfer speeds.', 12.99, 'Electronics', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop', 345, 'ELEC-036'),
('Cable Management Box', 'Desk cable organizer box with breathing holes. Clean workspace.', 19.99, 'Electronics', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 234, 'ELEC-037'),
('Cable Clips Set', 'Adhesive cable clips for desk organization. No tools needed.', 9.99, 'Electronics', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 412, 'ELEC-038'),
('USB Extension Cable', '6ft USB extension cable with gold-plated connectors.', 8.99, 'Electronics', 'https://images.unsplash.com/photo-1587825143148-eac8c0cb0173?w=600&h=600&fit=crop', 298, 'ELEC-039'),
('Device Charging Station', 'Multi-device charging station with LED indicators. Sync & charge.', 49.99, 'Electronics', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop', 123, 'ELEC-040'),

-- Energy & Power
('Solar Panel Portable', 'Foldable solar panel with USB outputs. Perfect for camping.', 129.99, 'Electronics', 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=600&fit=crop', 56, 'ELEC-041'),
('Car Jump Starter', 'Portable car jump starter with air compressor. 20000mAh power bank.', 89.99, 'Electronics', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop', 67, 'ELEC-042'),
('Battery Organizer', 'AA/AAA battery organizer with tester. Keep batteries organized.', 24.99, 'Electronics', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop', 189, 'ELEC-043'),
('Rechargeable Battery Pack', 'Set of 8 AA rechargeable batteries with charger.', 29.99, 'Electronics', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop', 156, 'ELEC-044'),
('Voltage Converter Universal', 'Universal voltage converter for international travel. 2000W capacity.', 49.99, 'Electronics', 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop', 89, 'ELEC-045'),

-- Smart Home & IoT
('Smart Thermostat', 'Wi-Fi enabled smart thermostat with app control. Energy efficient.', 199.99, 'Electronics', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', 52, 'ELEC-046'),
('Smart Smoke Detector', 'Interconnected smoke detector with app alerts. 10-year battery.', 89.99, 'Electronics', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', 112, 'ELEC-047'),
('Smart Door Lock', 'Keyless smart door lock with fingerprint access. Wi-Fi connected.', 249.99, 'Electronics', 'https://images.unsplash.com/photo-1591280063444-34b0e0a056f6?w=600&h=600&fit=crop', 34, 'ELEC-048'),
('Smart Plug Wi-Fi', 'Wi-Fi smart plug with voice control. Remote power management.', 24.99, 'Electronics', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', 223, 'ELEC-049'),
('Smart Air Purifier', 'HEPA air purifier with app control. Removes 99.97% particles.', 199.99, 'Electronics', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', 67, 'ELEC-050');

-- ==============================================
-- FASHION CATEGORY - 50 PRODUCTS
-- ==============================================

INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku) VALUES

-- Tops & Shirts
('Classic Denim Jacket', 'Timeless denim jacket with modern fit. Perfect for layering in any season.', 69.99, 'Fashion', 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=600&h=600&fit=crop', 24, 'FASH-001'),
('Oversized Cotton Sweatshirt', 'Soft, breathable cotton sweatshirt with relaxed fit. Available in 6 colors.', 39.99, 'Fashion', 'https://images.unsplash.com/photo-1556821552-5f63b1c2c723?w=600&h=600&fit=crop', 156, 'FASH-002'),
('Slim Fit Dress Shirt', 'Professional dress shirt with stretch fabric. Available in multiple colors.', 49.99, 'Fashion', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', 89, 'FASH-003'),
('Striped T-Shirt Collection', 'Casual striped tees in multiple colors. Soft cotton blend.', 24.99, 'Fashion', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', 234, 'FASH-004'),
('Hooded Zip Sweatshirt', 'Cozy hooded sweatshirt with front pocket. Warm fleece lining.', 54.99, 'Fashion', 'https://images.unsplash.com/photo-1556821552-5f63b1c2c723?w=600&h=600&fit=crop', 112, 'FASH-005'),

-- Pants & Bottoms
('Slim Fit Chinos', 'Comfortable stretch chinos in multiple colors. Versatile for casual and semi-formal occasions.', 54.99, 'Fashion', 'https://images.unsplash.com/photo-1506629082632-401017062e57?w=600&h=600&fit=crop', 89, 'FASH-006'),
('Classic Jeans Denim', 'Traditional blue jeans with straight fit. Made from quality denim.', 64.99, 'Fashion', 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=600&h=600&fit=crop', 145, 'FASH-007'),
('Athletic Joggers', 'Comfortable joggers with tapered fit. Perfect for active lifestyle.', 44.99, 'Fashion', 'https://images.unsplash.com/photo-1506629082632-401017062e57?w=600&h=600&fit=crop', 167, 'FASH-008'),
('Cargo Pants', 'Multi-pocket cargo pants with adjustable straps. Ultimate utility meets style.', 59.99, 'Fashion', 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=600&h=600&fit=crop', 98, 'FASH-009'),
('Dress Pants Tailored', 'Professional dress pants with tailored fit. Perfect for office wear.', 79.99, 'Fashion', 'https://images.unsplash.com/photo-1506629082632-401017062e57?w=600&h=600&fit=crop', 67, 'FASH-010'),

-- Footwear
('Classic White Sneakers', 'Minimalist white sneakers with premium materials. Goes with any outfit.', 89.99, 'Fashion', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', 112, 'FASH-011'),
('Running Shoes Athletic', 'Lightweight running shoes with excellent cushioning. Perfect for daily runs.', 119.99, 'Fashion', 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop', 87, 'FASH-012'),
('Leather Boots Classic', 'Premium leather boots with durable sole. All-weather protection.', 149.99, 'Fashion', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', 54, 'FASH-013'),
('Slip-On Casual Shoes', 'Easy slip-on casual shoes with memory foam insole. Comfortable all day.', 69.99, 'Fashion', 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop', 123, 'FASH-014'),
('Canvas Sneakers Low', 'Classic canvas sneakers in multiple colors. Versatile and comfortable.', 49.99, 'Fashion', 'https://images.unsplash.com/photo-1525966222134-fceb466e6e85?w=600&h=600&fit=crop', 178, 'FASH-015'),

-- Accessories & Bags
('Leather Crossbody Bag', 'Genuine leather crossbody bag with adjustable strap. Perfect for everyday use.', 79.99, 'Fashion', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', 43, 'FASH-016'),
('Backpack Classic', 'Durable backpack with laptop compartment. Multiple pockets for organization.', 89.99, 'Fashion', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', 67, 'FASH-017'),
('Leather Wallet Slim', 'Slim leather wallet with RFID blocking. Multiple card slots.', 34.99, 'Fashion', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', 156, 'FASH-018'),
('Canvas Tote Bag', 'Spacious canvas tote bag with reinforced handles. Perfect for shopping.', 29.99, 'Fashion', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', 198, 'FASH-019'),
('Messenger Bag', 'Professional messenger bag with padded laptop compartment.', 64.99, 'Fashion', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', 89, 'FASH-020'),

-- Hats & Headwear
('Baseball Cap Classic', 'Adjustable baseball cap with structured crown. Multiple color options.', 24.99, 'Fashion', 'https://images.unsplash.com/photo-1596885630379-0c63d67a1c0a?w=600&h=600&fit=crop', 234, 'FASH-021'),
('Beanie Knit', 'Cozy knit beanie in multiple colors. Perfect for winter.', 19.99, 'Fashion', 'https://images.unsplash.com/photo-1536790632416-1840aed5eaf1?w=600&h=600&fit=crop', 267, 'FASH-022'),
('Fedora Hat', 'Classic fedora hat with adjustable band. Stylish and versatile.', 39.99, 'Fashion', 'https://images.unsplash.com/photo-1596885630379-0c63d67a1c0a?w=600&h=600&fit=crop', 123, 'FASH-023'),
('Bucket Hat', 'Trendy bucket hat with UV protection. Perfect for summer.', 22.99, 'Fashion', 'https://images.unsplash.com/photo-1596885630379-0c63d67a1c0a?w=600&h=600&fit=crop', 189, 'FASH-024'),
('Visor Cap', 'Adjustable visor cap with moisture-wicking fabric. Sports-ready.', 21.99, 'Fashion', 'https://images.unsplash.com/photo-1596885630379-0c63d67a1c0a?w=600&h=600&fit=crop', 145, 'FASH-025'),

-- Belts & Accessories
('Leather Belt Classic', 'Genuine leather belt with adjustable buckle. Multiple sizes available.', 34.99, 'Fashion', 'https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=600&h=600&fit=crop', 178, 'FASH-026'),
('Canvas Belt Casual', 'Casual canvas belt with metal buckle. Versatile and durable.', 22.99, 'Fashion', 'https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=600&h=600&fit=crop', 156, 'FASH-027'),
('Suspenders Vintage', 'Classic suspenders with adjustable length. Adds style to any outfit.', 29.99, 'Fashion', 'https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=600&h=600&fit=crop', 89, 'FASH-028'),
('Money Clip Metal', 'Slim metal money clip with card holder. Compact and secure.', 14.99, 'Fashion', 'https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=600&h=600&fit=crop', 234, 'FASH-029'),
('Keychain Leather', 'Premium leather keychain with brass hardware. Durable and stylish.', 9.99, 'Fashion', 'https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=600&h=600&fit=crop', 345, 'FASH-030'),

-- Sunglasses & Eyewear
('Aviator Sunglasses', 'Classic aviator sunglasses with UV protection. Polarized lenses.', 49.99, 'Fashion', 'https://images.unsplash.com/photo-1511499767150-a48a237b008e?w=600&h=600&fit=crop', 156, 'FASH-031'),
('Wayfarer Sunglasses', 'Timeless wayfarer sunglasses with comfortable fit. Multiple color options.', 39.99, 'Fashion', 'https://images.unsplash.com/photo-1511499767150-a48a237b008e?w=600&h=600&fit=crop', 198, 'FASH-032'),
('Reading Glasses', 'Stylish reading glasses with blue light filtering. Multiple prescriptions.', 24.99, 'Fashion', 'https://images.unsplash.com/photo-1511499767150-a48a237b008e?w=600&h=600&fit=crop', 234, 'FASH-033'),
('Cat Eye Sunglasses', 'Fashionable cat eye sunglasses with mirrored lenses. Retro style.', 44.99, 'Fashion', 'https://images.unsplash.com/photo-1511499767150-a48a237b008e?w=600&h=600&fit=crop', 145, 'FASH-034'),
('Sports Sunglasses', 'Wrap-around sports sunglasses with anti-fog coating. Secure fit.', 54.99, 'Fashion', 'https://images.unsplash.com/photo-1511499767150-a48a237b008e?w=600&h=600&fit=crop', 112, 'FASH-035'),

-- Watches & Jewelry
('Classic Leather Watch', 'Minimalist leather watch with leather strap. Water-resistant.', 79.99, 'Fashion', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop', 98, 'FASH-036'),
('Smart Watch', 'Feature-rich smartwatch with fitness tracking. Multiple watch faces.', 199.99, 'Fashion', 'https://images.unsplash.com/photo-1544117519-31a4b719223c?w=600&h=600&fit=crop', 67, 'FASH-037'),
('Bracelet Leather', 'Adjustable leather bracelet with metal accents. Unisex design.', 19.99, 'Fashion', 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&h=600&fit=crop', 178, 'FASH-038'),
('Watch Strap Leather', 'Replacement leather watch strap with quick-release pins.', 24.99, 'Fashion', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop', 167, 'FASH-039'),
('Minimalist Necklace', 'Simple silver necklace with pendant. Versatile and elegant.', 34.99, 'Fashion', 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&h=600&fit=crop', 134, 'FASH-040'),

-- Socks & Underwear
('Ankle Socks Pack', 'Comfortable ankle socks pack of 6. Moisture-wicking fabric.', 14.99, 'Fashion', 'https://images.unsplash.com/photo-1586350977773-bf48b6c7355c?w=600&h=600&fit=crop', 456, 'FASH-041'),
('Crew Socks Athletes', 'Athletic crew socks with cushioning. Perfect for sports.', 19.99, 'Fashion', 'https://images.unsplash.com/photo-1586350977773-bf48b6c7355c?w=600&h=600&fit=crop', 234, 'FASH-042'),
('Dress Socks Pack', 'Professional dress socks pack of 6. Multiple colors.', 24.99, 'Fashion', 'https://images.unsplash.com/photo-1586350977773-bf48b6c7355c?w=600&h=600&fit=crop', 189, 'FASH-043'),
('No-Show Socks', 'Low-cut no-show socks that stay in place. Invisible comfort.', 16.99, 'Fashion', 'https://images.unsplash.com/photo-1586350977773-bf48b6c7355c?w=600&h=600&fit=crop', 278, 'FASH-044'),
('Compression Socks', 'Medical-grade compression socks. Improves circulation.', 29.99, 'Fashion', 'https://images.unsplash.com/photo-1586350977773-bf48b6c7355c?w=600&h=600&fit=crop', 145, 'FASH-045'),

-- Outerwear
('Windbreaker Jacket', 'Lightweight windbreaker with water-resistant coating. Compact design.', 59.99, 'Fashion', 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=600&h=600&fit=crop', 112, 'FASH-046'),
('Puffer Jacket Warm', 'Insulated puffer jacket with down filling. Perfect for cold weather.', 89.99, 'Fashion', 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=600&h=600&fit=crop', 78, 'FASH-047'),
('Bomber Jacket', 'Classic bomber jacket with ribbed cuffs. Stylish and comfortable.', 79.99, 'Fashion', 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=600&h=600&fit=crop', 98, 'FASH-048'),
('Trench Coat', 'Classic trench coat with belted waist. Timeless elegance.', 149.99, 'Fashion', 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=600&h=600&fit=crop', 45, 'FASH-049'),
('Cardigan Sweater', 'Cozy cardigan sweater with buttons. Perfect for layering.', 64.99, 'Fashion', 'https://images.unsplash.com/photo-1556821552-5f63b1c2c723?w=600&h=600&fit=crop', 134, 'FASH-050');

-- ==============================================
-- FOOD & GROCERIES CATEGORY - 50 PRODUCTS
-- ==============================================

INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku) VALUES

-- Bread & Bakery
('Organic Whole Grain Bread', 'Fresh baked organic bread with whole grains. Rich in fiber and nutrients.', 4.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop', 145, 'FOOD-001'),
('Multigrain Bread Loaf', 'Healthy multigrain bread with seeds and nuts. Delicious taste.', 5.49, 'Food & Groceries', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop', 178, 'FOOD-002'),
('Sourdough Bread Artisan', 'Artisan sourdough bread with tangy flavor. Handcrafted daily.', 6.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop', 123, 'FOOD-003'),
('Bagels Assorted Pack', 'Fresh bagels in assorted flavors. Pack of 6.', 4.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop', 156, 'FOOD-004'),
('English Muffins Pack', 'Classic English muffins. Perfect for breakfast. Pack of 6.', 3.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop', 189, 'FOOD-005'),

-- Dairy & Eggs
('Fresh Organic Eggs 12 Pack', 'Farm-fresh organic eggs from free-range hens. High in protein.', 6.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&h=600&fit=crop', 234, 'FOOD-006'),
('Organic Milk Whole Gallon', 'Fresh organic whole milk. Rich and creamy.', 5.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=600&fit=crop', 167, 'FOOD-007'),
('Greek Yogurt Assorted', 'Creamy Greek yogurt in multiple flavors. High protein. Pack of 6.', 7.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=600&fit=crop', 145, 'FOOD-008'),
('Organic Butter Grass-Fed', 'Premium grass-fed butter. Rich in omega-3.', 6.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=600&fit=crop', 198, 'FOOD-009'),
('Cheese Sliced Variety', 'Assorted cheese slices. Perfect for sandwiches. Pack of 24.', 8.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=600&fit=crop', 134, 'FOOD-010'),

-- Produce & Fresh
('Fresh Avocados 4 Pack', 'Ripe Hass avocados. Perfect for salads, toast, and guacamole.', 5.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&h=600&fit=crop', 189, 'FOOD-011'),
('Organic Bananas Bunch', 'Fresh organic bananas. Rich in potassium. Approximately 3 lbs.', 3.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=600&fit=crop', 223, 'FOOD-012'),
('Baby Spinach Organic', 'Fresh organic baby spinach. Tender and nutritious.', 4.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=600&fit=crop', 156, 'FOOD-013'),
('Cherry Tomatoes Organic', 'Sweet cherry tomatoes. Perfect for salads. 1 lb.', 4.49, 'Food & Groceries', 'https://images.unsplash.com/photo-1592841200221-a6898c577e46?w=600&h=600&fit=crop', 178, 'FOOD-014'),
('Bell Peppers Mixed', 'Colorful bell peppers in red, yellow, and green. Pack of 3.', 6.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1592841200221-a6898c577e46?w=600&h=600&fit=crop', 145, 'FOOD-015'),

-- Pantry Staples
('Extra Virgin Olive Oil 500ml', 'Premium Italian extra virgin olive oil. Cold-pressed and unfiltered.', 12.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop', 89, 'FOOD-016'),
('Organic Coconut Oil', 'Cold-pressed organic coconut oil. Versatile cooking oil.', 9.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop', 123, 'FOOD-017'),
('Organic Quinoa', 'Premium organic quinoa. High protein superfood perfect for salads.', 8.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1626673569490-5300e5e2cbc6?w=600&h=600&fit=crop', 67, 'FOOD-018'),
('Brown Rice Organic', 'Long-grain organic brown rice. Whole grain goodness.', 7.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1626673569490-5300e5e2cbc6?w=600&h=600&fit=crop', 145, 'FOOD-019'),
('Organic Pasta Assorted', 'Organic pasta in various shapes. Pack of 3.', 6.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=600&fit=crop', 112, 'FOOD-020'),

-- Beverages
('Organic Coffee Beans', 'Single-origin organic coffee beans. Medium roast with smooth chocolate notes.', 15.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop', 112, 'FOOD-021'),
('Green Tea Organic', 'Premium organic green tea. Antioxidant-rich and refreshing.', 7.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&h=600&fit=crop', 167, 'FOOD-022'),
('Herbal Tea Collection', 'Assorted herbal tea bags. Caffeine-free. Pack of 30.', 8.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&h=600&fit=crop', 145, 'FOOD-023'),
('Fresh Orange Juice', '100% pure squeezed orange juice. No added sugar. 64 oz.', 5.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&h=600&fit=crop', 178, 'FOOD-024'),
('Coconut Water Organic', 'Pure organic coconut water. Natural electrolytes.', 4.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&h=600&fit=crop', 189, 'FOOD-025'),

-- Snacks & Nuts
('Organic Honey 500g', 'Pure organic honey from local beekeepers. Raw and unfiltered.', 14.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop', 76, 'FOOD-026'),
('Mixed Nuts Roasted', 'Premium mixed nuts roasted and salted. Pack of 16 oz.', 12.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&h=600&fit=crop', 134, 'FOOD-027'),
('Dark Chocolate Bar 85%', 'Premium dark chocolate with 85% cocoa. Rich and antioxidant-rich.', 5.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=600&h=600&fit=crop', 98, 'FOOD-028'),
('Trail Mix Organic', 'Organic trail mix with dried fruits and nuts. 12 oz.', 8.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&h=600&fit=crop', 156, 'FOOD-029'),
('Almonds Roasted Salted', 'Premium roasted almonds with sea salt. 16 oz.', 11.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&h=600&fit=crop', 167, 'FOOD-030'),

-- Condiments & Sauces
('Organic Tomato Sauce', 'Rich organic tomato sauce. Perfect for pasta. 24 oz.', 4.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1592841200221-a6898c577e46?w=600&h=600&fit=crop', 178, 'FOOD-031'),
('Balsamic Vinegar Aged', 'Premium aged balsamic vinegar. Rich and complex flavor.', 12.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop', 98, 'FOOD-032'),
('Organic Mustard Dijon', 'Smooth Dijon mustard made with organic ingredients.', 5.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1530825894095-9c0b2eb48342?w=600&h=600&fit=crop', 145, 'FOOD-033'),
('Hot Sauce Variety Pack', 'Assorted hot sauces from mild to extra hot. Pack of 4.', 9.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1530825894095-9c0b2eb48342?w=600&h=600&fit=crop', 123, 'FOOD-034'),
('Organic Peanut Butter', 'Natural organic peanut butter. No added sugar. 16 oz.', 6.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&h=600&fit=crop', 134, 'FOOD-035'),

-- Canned & Preserved
('Organic Black Beans', 'Canned organic black beans. Ready to use. Pack of 4.', 6.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=600&fit=crop', 156, 'FOOD-036'),
('Organic Chickpeas', 'Canned organic chickpeas. Versatile and protein-rich. Pack of 4.', 6.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=600&fit=crop', 167, 'FOOD-037'),
('Organic Kidney Beans', 'Canned organic kidney beans. Perfect for chili. Pack of 4.', 6.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=600&fit=crop', 145, 'FOOD-038'),
('Organic Soup Variety', 'Assorted organic soups. Pack of 6.', 12.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1543013309-0d1f4edeb68d?w=600&h=600&fit=crop', 178, 'FOOD-039'),
('Organic Vegetable Broth', 'Rich organic vegetable broth. Perfect for cooking. 32 oz.', 4.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1543013309-0d1f4edeb68d?w=600&h=600&fit=crop', 189, 'FOOD-040'),

-- Breakfast Items
('Organic Granola', 'Crunchy organic granola with honey and nuts. 16 oz.', 7.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=600&fit=crop', 156, 'FOOD-041'),
('Instant Oatmeal Variety', 'Instant oatmeal in assorted flavors. Pack of 12.', 5.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=600&fit=crop', 234, 'FOOD-042'),
('Organic Cereal Crunchy', 'Whole grain organic cereal. Low sugar and high fiber.', 5.49, 'Food & Groceries', 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=600&fit=crop', 167, 'FOOD-043'),
('Maple Syrup Pure', '100% pure maple syrup. Grade A amber color.', 11.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop', 123, 'FOOD-044'),
('Organic Jam Assorted', 'Organic fruit jam in assorted flavors. Pack of 3.', 8.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop', 145, 'FOOD-045'),

-- Frozen & Convenience
('Organic Frozen Berries', 'Mixed organic frozen berries. Perfect for smoothies. 16 oz.', 8.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&h=600&fit=crop', 156, 'FOOD-046'),
('Frozen Vegetables Mixed', 'Mixed frozen vegetables. Convenient and nutritious. 16 oz.', 4.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=600&fit=crop', 189, 'FOOD-047'),
('Organic Ice Cream', 'Premium organic ice cream in vanilla flavor. 16 oz.', 6.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=600&fit=crop', 134, 'FOOD-048'),
('Frozen Pizza Margherita', 'Organic frozen pizza with fresh ingredients. Ready to bake.', 8.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&h=600&fit=crop', 112, 'FOOD-049'),
('Organic Frozen Meals', 'Assorted organic frozen meals. Healthy and convenient. Pack of 4.', 18.99, 'Food & Groceries', 'https://images.unsplash.com/photo-1543013309-0d1f4edeb68d?w=600&h=600&fit=crop', 145, 'FOOD-050');

-- ==============================================
-- KITCHEN & DINING CATEGORY - 50 PRODUCTS
-- ==============================================

INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku) VALUES

-- Cookware
('Stainless Steel Cookware Set', '10-piece non-stick cookware set with lids. Compatible with all stove types.', 149.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=600&h=600&fit=crop', 34, 'KITC-001'),
('Cast Iron Dutch Oven', 'Premium cast iron Dutch oven. Perfect for slow cooking and braising.', 89.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=600&h=600&fit=crop', 45, 'KITC-002'),
('Non-Stick Frying Pan Set', 'Set of 3 non-stick frying pans in different sizes. PFOA-free.', 59.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=600&h=600&fit=crop', 67, 'KITC-003'),
('Ceramic Cookware Set', 'Beautiful ceramic cookware set. Non-stick and oven-safe up to 450°F.', 79.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=600&h=600&fit=crop', 52, 'KITC-004'),
('Stock Pot Set', 'Heavy-duty stock pots with lids. Perfect for soups and stocks.', 69.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=600&h=600&fit=crop', 41, 'KITC-005'),

-- Baking & Pastry
('Silicone Baking Mat Set', 'Set of 2 reusable silicone baking mats. Non-stick and oven-safe up to 450°F.', 19.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=600&fit=crop', 92, 'KITC-006'),
('Mixing Bowl Set', 'Stainless steel mixing bowls in 5 sizes. Nesting design for easy storage.', 34.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=600&fit=crop', 78, 'KITC-007'),
('Baking Sheet Set', 'Heavy-duty aluminum baking sheets. Warp-resistant and non-stick.', 24.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=600&fit=crop', 89, 'KITC-008'),
('Cake Stand Decorative', 'Glass cake stand with decorative base. Perfect for special occasions.', 29.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=600&fit=crop', 56, 'KITC-009'),
('Pie Dish Set', 'Deep dish pie pans in various sizes. Ideal for savory and sweet pies.', 19.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=600&fit=crop', 67, 'KITC-010'),

-- Knives & Cutlery
('Professional Chef Knife', 'High-carbon stainless steel chef knife. Razor-sharp and durable.', 79.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1594736797933-d0f9d98d4f72?w=600&h=600&fit=crop', 45, 'KITC-011'),
('Knife Block Set', 'Complete knife set with wooden block. Includes 8 essential knives.', 149.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1594736797933-d0f9d98d4f72?w=600&h=600&fit=crop', 34, 'KITC-012'),
('Kitchen Shears', 'Heavy-duty kitchen shears with built-in bottle opener. Multi-purpose.', 24.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1594736797933-d0f9d98d4f72?w=600&h=600&fit=crop', 123, 'KITC-013'),
('Cutting Board Bamboo', 'Sustainable bamboo cutting board. Natural antibacterial properties.', 19.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1574417709637-933fe00ec5cd?w=600&h=600&fit=crop', 156, 'KITC-014'),
('Sharpening Steel', 'Professional knife sharpening steel. Maintains knife edge.', 34.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1594736797933-d0f9d98d4f72?w=600&h=600&fit=crop', 89, 'KITC-015'),

-- Small Appliances
('Electric Kettle Glass', 'Borosilicate glass electric kettle with LED indicator. Boils water in 2 minutes.', 44.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1514228742587-9b130788b144?w=600&h=600&fit=crop', 68, 'KITC-016'),
('Coffee Maker Automatic', '12-cup programmable coffee maker with thermal carafe. Perfect for mornings.', 64.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=600&h=600&fit=crop', 52, 'KITC-017'),
('Instant Pot Pressure Cooker', '7-in-1 multi-functional pressure cooker. Cook meals 70% faster.', 99.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=600&h=600&fit=crop', 38, 'KITC-018'),
('Stand Mixer Professional', 'Heavy-duty stand mixer with multiple attachments. 5-quart capacity.', 249.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1514228742587-9b130788b144?w=600&h=600&fit=crop', 28, 'KITC-019'),
('Food Processor Compact', 'Compact food processor with multiple blades. Perfect for chopping and pureeing.', 79.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1514228742587-9b130788b144?w=600&h=600&fit=crop', 56, 'KITC-020'),

-- Utensils & Tools
('Silicone Spatula Set', 'Heat-resistant silicone spatulas in multiple sizes. Non-scratch.', 14.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=600&fit=crop', 234, 'KITC-021'),
('Wooden Spoon Set', 'Natural bamboo wooden spoons. Perfect for cooking.', 12.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=600&fit=crop', 267, 'KITC-022'),
('Measuring Cup Set', 'Stainless steel measuring cups and spoons. Durable and accurate.', 16.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=600&fit=crop', 178, 'KITC-023'),
('Can Opener Electric', 'Smooth-edge electric can opener. Hands-free operation.', 29.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1514228742587-9b130788b144?w=600&h=600&fit=crop', 145, 'KITC-024'),
('Garlic Press Stainless', 'Stainless steel garlic press. Easy to clean and use.', 12.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=600&fit=crop', 198, 'KITC-025'),

-- Storage & Organization
('Kitchen Storage Container Set', 'Airtight food storage containers in 10 sizes. Keep food fresh longer.', 34.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=600&fit=crop', 87, 'KITC-026'),
('Spice Rack Organizer', 'Tiered spice rack with 24 jars. Keep spices organized.', 49.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=600&fit=crop', 76, 'KITC-027'),
('Lazy Susan Turntable', 'Rotating lazy Susan for countertop organization. Accessible storage.', 24.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=600&fit=crop', 123, 'KITC-028'),
('Pantry Organizer Bins', 'Set of 6 clear pantry organizer bins. Labeled for easy identification.', 34.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=600&fit=crop', 112, 'KITC-029'),
('Drawer Organizer Set', 'Expandable drawer organizers for utensils. Clean and organized.', 19.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=600&fit=crop', 156, 'KITC-030'),

-- Dinnerware
('Dinner Plate Set Ceramic', 'Elegant ceramic dinner plates. Set of 8. Dishwasher safe.', 49.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 89, 'KITC-031'),
('Bowl Set Stoneware', 'Beautiful stoneware bowls in various sizes. Microwave safe.', 39.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 134, 'KITC-032'),
('Coffee Mug Set', 'Insulated coffee mugs with lids. Keeps drinks hot for hours.', 24.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1514228742587-9b130788b144?w=600&h=600&fit=crop', 178, 'KITC-033'),
('Wine Glass Set', 'Elegant wine glasses set of 8. Lead-free crystal.', 34.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 156, 'KITC-034'),
('Flatware Set Stainless', 'Premium stainless steel flatware set for 8. Durable and elegant.', 89.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=600&h=600&fit=crop', 67, 'KITC-035'),

-- Kitchen Gadgets
('Vegetable Spiralizer', 'Multi-blade vegetable spiralizer. Create healthy noodles.', 34.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1514228742587-9b130788b144?w=600&h=600&fit=crop', 98, 'KITC-036'),
('Immersion Blender', 'Handheld immersion blender with multiple attachments. Puree anywhere.', 49.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1514228742587-9b130788b144?w=600&h=600&fit=crop', 87, 'KITC-037'),
('Ice Cream Maker', 'Automatic ice cream maker. Makes 1.5 quarts in 25 minutes.', 79.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1514228742587-9b130788b144?w=600&h=600&fit=crop', 56, 'KITC-038'),
('Toaster 4-Slice', 'Stainless steel toaster with extra-wide slots. Bagel and defrost settings.', 54.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1514228742587-9b130788b144?w=600&h=600&fit=crop', 72, 'KITC-039'),
('Timer Digital', 'Digital kitchen timer with magnetic back. Multiple timers.', 12.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1514228742587-9b130788b144?w=600&h=600&fit=crop', 234, 'KITC-040'),

-- Kitchen Linens
('Kitchen Towel Set', 'Absorbent cotton kitchen towels. Set of 6 in assorted colors.', 19.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 167, 'KITC-041'),
('Apron Chef', 'Professional chef apron with adjustable straps. Durable and comfortable.', 24.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 123, 'KITC-042'),
('Oven Mitt Set', 'Heat-resistant oven mitts with silicone grip. Pair of 2.', 14.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 198, 'KITC-043'),
('Placemat Set', 'Waterproof placemats set of 4. Easy to clean.', 16.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 145, 'KITC-044'),
('Table Runner Linen', 'Elegant linen table runner. Adds sophistication to any table.', 29.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 89, 'KITC-045'),

-- Table Accessories
('Salt and Pepper Shakers', 'Stainless steel salt and pepper shakers with adjustable grinders.', 19.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=600&h=600&fit=crop', 234, 'KITC-046'),
('Napkin Holder', 'Elegant napkin holder in stainless steel. Holds 50 napkins.', 24.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 156, 'KITC-047'),
('Candle Holder Set', 'Modern candle holder set. Adds ambiance to dining.', 34.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 98, 'KITC-048'),
('Coaster Set Cork', 'Eco-friendly cork coaster set. Absorbs moisture.', 12.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 178, 'KITC-049'),
('Bread Basket', 'Woven bread basket with handles. Perfect for serving bread.', 19.99, 'Kitchen & Dining', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=600&fit=crop', 134, 'KITC-050');

-- ==============================================
-- HOME & LIVING CATEGORY - 50 PRODUCTS
-- ==============================================

INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku) VALUES

-- Lighting
('Smart LED Light Strip', '16 million colors, voice control compatible, and app control. Transform your space instantly.', 34.99, 'Home & Living', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=600&h=600&fit=crop', 76, 'HOME-001'),
('Minimalist Wall Clock', 'Sleek modern wall clock with silent movement. Perfect for any room decor.', 29.99, 'Home & Living', 'https://images.unsplash.com/photo-1533416784636-2b0ccf8b1a8c?w=600&h=600&fit=crop', 52, 'HOME-002'),
('Essential Oil Diffuser', 'Ultrasonic aromatherapy diffuser with 7 color LED lights and timer function.', 39.99, 'Home & Living', 'https://images.unsplash.com/photo-1570045276920-0c8e01c0c8c0?w=600&h=600&fit=crop', 34, 'HOME-003'),
('Desk Lamp LED', 'Modern LED desk lamp with adjustable brightness and color modes.', 44.99, 'Home & Living', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=600&h=600&fit=crop', 67, 'HOME-004'),
('Table Lamp Ceramic', 'Decorative ceramic table lamp with fabric shade. Adds warmth to any room.', 49.99, 'Home & Living', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=600&h=600&fit=crop', 56, 'HOME-005'),

-- Furniture & Decor
('Cordless Vacuum Cleaner', 'Lightweight, powerful cordless vacuum with 40-minute runtime. Perfect for quick cleanups.', 159.99, 'Home & Living', 'https://images.unsplash.com/photo-1558452919-08ae4aea8a29?w=600&h=600&fit=crop', 28, 'HOME-006'),
('Bamboo Cutting Board Set', 'Sustainable bamboo cutting boards in 3 sizes. Natural antibacterial properties.', 44.99, 'Home & Living', 'https://images.unsplash.com/photo-1574417709637-933fe00ec5cd?w=600&h=600&fit=crop', 61, 'HOME-007'),
('Throw Pillow Set', 'Soft decorative throw pillows set of 4. Multiple colors available.', 39.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 89, 'HOME-008'),
('Wall Art Canvas', 'Modern abstract canvas wall art. Ready to hang.', 49.99, 'Home & Living', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop', 67, 'HOME-009'),
('Floor Mirror Full-Length', 'Stylish full-length floor mirror with frame. Lean or mount options.', 79.99, 'Home & Living', 'https://images.unsplash.com/photo-1533416784636-2b0ccf8b1a8c?w=600&h=600&fit=crop', 45, 'HOME-010'),

-- Storage & Organization
('Storage Bins Set', 'Clear plastic storage bins in various sizes. Stackable design.', 34.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 123, 'HOME-011'),
('Shoe Rack Organizer', 'Expandable shoe rack with 20 compartments. Space-saving design.', 29.99, 'Home & Living', 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=600&h=600&fit=crop', 98, 'HOME-012'),
('Closet Organizer System', 'Modular closet organizer with adjustable shelves and hanging rods.', 79.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 67, 'HOME-013'),
('Under-Bed Storage', 'Rolling under-bed storage containers. Maximize space.', 24.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 156, 'HOME-014'),
('Hanging Wardrobe Organizer', 'Door-mounted wardrobe organizer with multiple pockets.', 19.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 178, 'HOME-015'),

-- Bedding & Linens
('Comforter Set Queen', 'Down alternative comforter set with matching pillow shams.', 89.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 78, 'HOME-016'),
('Bed Sheet Set Cotton', '100% cotton bed sheet set. Soft and breathable.', 49.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 134, 'HOME-017'),
('Weighted Blanket', 'Therapeutic weighted blanket. Promotes better sleep. 15 lbs.', 79.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 89, 'HOME-018'),
('Memory Foam Pillow', 'Contour memory foam pillow. Supports neck and spine.', 39.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 145, 'HOME-019'),
('Mattress Topper Cooling', 'Gel-infused cooling mattress topper. Queen size.', 69.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 67, 'HOME-020'),

-- Rugs & Carpets
('Area Rug Modern', 'Soft modern area rug in neutral colors. 5x7 feet.', 89.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 54, 'HOME-021'),
('Doormat Welcome', 'Bristle welcome doormat with personalized message.', 19.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 167, 'HOME-022'),
('Bath Mat Set', 'Absorbent bath mat set with non-slip backing.', 24.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 145, 'HOME-023'),
('Runner Rug', 'Decorative runner rug for hallway or entryway.', 39.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 89, 'HOME-024'),
('Accent Rug Cowhide', 'Genuine cowhide accent rug. Unique and stylish.', 149.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 34, 'HOME-025'),

-- Curtains & Window Treatments
('Blackout Curtains Set', 'Room-darkening curtains in multiple colors. Set of 2 panels.', 49.99, 'Home & Living', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=600&h=600&fit=crop', 98, 'HOME-026'),
('Blinds Cordless', 'Cordless window blinds for easy operation. Safety compliant.', 59.99, 'Home & Living', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=600&h=600&fit=crop', 76, 'HOME-027'),
('Curtain Rod Set', 'Decorative curtain rod with finials. Adjustable length.', 29.99, 'Home & Living', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=600&h=600&fit=crop', 123, 'HOME-028'),
('Window Film Privacy', 'Decorative window film for privacy. Easy to apply.', 19.99, 'Home & Living', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=600&h=600&fit=crop', 178, 'HOME-029'),
('Sheer Curtains', 'Elegant sheer curtains for soft light filtering.', 34.99, 'Home & Living', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=600&h=600&fit=crop', 134, 'HOME-030'),

-- Planters & Garden
('Indoor Plant Stand', 'Modern plant stand with 3 tiers. Holds multiple plants.', 49.99, 'Home & Living', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop', 87, 'HOME-031'),
('Ceramic Planters Set', 'Decorative ceramic planters in assorted sizes. Drainage holes included.', 39.99, 'Home & Living', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop', 112, 'HOME-032'),
('Watering Can', 'Stylish watering can with long spout. Perfect for indoor plants.', 19.99, 'Home & Living', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop', 156, 'HOME-033'),
('Grow Light LED', 'LED grow light for indoor plants. Full spectrum lighting.', 34.99, 'Home & Living', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=600&h=600&fit=crop', 98, 'HOME-034'),
('Plant Fertilizer', 'Organic plant fertilizer with nutrients. Safe for all plants.', 12.99, 'Home & Living', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop', 234, 'HOME-035'),

-- Home Fragrance
('Scented Candle Set', 'Soy wax candles in assorted scents. Long burning time.', 24.99, 'Home & Living', 'https://images.unsplash.com/photo-1570045276920-0c8e01c0c8c0?w=600&h=600&fit=crop', 145, 'HOME-036'),
('Wax Melts Variety', 'Scented wax melts for warmers. Multiple fragrances.', 14.99, 'Home & Living', 'https://images.unsplash.com/photo-1570045276920-0c8e01c0c8c0?w=600&h=600&fit=crop', 178, 'HOME-037'),
('Reed Diffuser', 'Bamboo reed diffuser with natural scents. Continuous fragrance.', 29.99, 'Home & Living', 'https://images.unsplash.com/photo-1570045276920-0c8e01c0c8c0?w=600&h=600&fit=crop', 123, 'HOME-038'),
('Room Spray Air Freshener', 'Natural air freshener spray. Eliminates odors.', 16.99, 'Home & Living', 'https://images.unsplash.com/photo-1570045276920-0c8e01c0c8c0?w=600&h=600&fit=crop', 198, 'HOME-039'),
('Incense Set', 'Natural incense sticks with holder. Relaxing aromatherapy.', 12.99, 'Home & Living', 'https://images.unsplash.com/photo-1570045276920-0c8e01c0c8c0?w=600&h=600&fit=crop', 167, 'HOME-040'),

-- Home Accessories
('Picture Frame Set', 'Gallery wall picture frames in multiple sizes. Set of 6.', 34.99, 'Home & Living', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop', 145, 'HOME-041'),
('Wall Shelves Floating', 'Floating wall shelves set of 3. Modern minimalist design.', 39.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 112, 'HOME-042'),
('Decorative Vase Set', 'Glass decorative vases in various sizes. Modern design.', 29.99, 'Home & Living', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop', 156, 'HOME-043'),
('Bookends Set', 'Decorative bookends for library organization. Heavy duty.', 19.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 178, 'HOME-044'),
('Trinket Dish', 'Decorative trinket dish for jewelry and small items.', 12.99, 'Home & Living', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop', 234, 'HOME-045'),

-- Laundry & Cleaning
('Laundry Basket', 'Collapsible laundry basket with handles. Easy to carry.', 24.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 156, 'HOME-046'),
('Clothes Hangers Set', 'Non-slip velvet clothes hangers. Set of 50.', 19.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 234, 'HOME-047'),
('Drying Rack Retractable', 'Wall-mounted retractable drying rack. Space-saving.', 34.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 123, 'HOME-048'),
('Cleaning Supplies Kit', 'Essential cleaning supplies kit. Environmentally friendly.', 29.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 145, 'HOME-049'),
('Trash Can Stainless', 'Stainless steel trash can with foot pedal. Odor-resistant.', 39.99, 'Home & Living', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 98, 'HOME-050');

-- ==============================================
-- SPORTS & FITNESS CATEGORY - 50 PRODUCTS
-- ==============================================

INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku) VALUES

-- Exercise Equipment
('Adjustable Dumbbells Set', 'Space-saving adjustable dumbbells from 5-50 lbs. Perfect for home gym.', 199.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1534367507873-d2d7e24d797f?w=600&h=600&fit=crop', 41, 'SPRT-001'),
('Yoga Mat Premium', 'Eco-friendly non-slip yoga mat with carrying strap. Thick and comfortable.', 34.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop', 83, 'SPRT-002'),
('Running Shoes Trail', 'Lightweight trail running shoes with excellent grip and cushioning. Perfect for outdoor runs.', 119.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop', 67, 'SPRT-003'),
('Adjustable Resistance Bands', 'Set of 5 resistance bands with door anchor and workout guide. Total body training.', 29.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=600&fit=crop', 95, 'SPRT-004'),
('Pull-Up Bar Doorway', 'Adjustable doorway pull-up bar. No drilling required.', 34.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1534367507873-d2d7e24d797f?w=600&h=600&fit=crop', 78, 'SPRT-005'),

-- Cardio Equipment
('Jump Rope Speed', 'Professional speed jump rope with ball bearings. Adjustable length.', 19.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop', 156, 'SPRT-006'),
('Exercise Bike Stationary', 'Foldable exercise bike with adjustable resistance. Digital display.', 149.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1534367507873-d2d7e24d797f?w=600&h=600&fit=crop', 34, 'SPRT-007'),
('Treadmill Compact', 'Compact folding treadmill with incline. Perfect for home use.', 299.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1534367507873-d2d7e24d797f?w=600&h=600&fit=crop', 22, 'SPRT-008'),
('Rowing Machine', 'Magnetic resistance rowing machine. Full-body workout.', 399.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1534367507873-d2d7e24d797f?w=600&h=600&fit=crop', 18, 'SPRT-009'),
('Step Platform Adjustable', 'Adjustable step platform with risers. Interchangeable heights.', 49.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop', 98, 'SPRT-010'),

-- Strength Training
('Kettlebell Set', 'Set of 3 kettlebells in different weights. Vinyl coated.', 89.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1534367507873-d2d7e24d797f?w=600&h=600&fit=crop', 56, 'SPRT-011'),
('Adjustable Bench', 'Folding adjustable bench for strength training. Multiple positions.', 149.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1534367507873-d2d7e24d797f?w=600&h=600&fit=crop', 45, 'SPRT-012'),
('Barbell Set', 'Olympic barbell set with plates. Total 300 lbs.', 299.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1534367507873-d2d7e24d797f?w=600&h=600&fit=crop', 28, 'SPRT-013'),
('Ab Roller Wheel', 'Professional ab roller wheel. Strengthens core muscles.', 24.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1534367507873-d2d7e24d797f?w=600&h=600&fit=crop', 167, 'SPRT-014'),
('Sandbag Training', 'Adjustable sandbag training kit. Multiple exercises.', 59.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1534367507873-d2d7e24d797f?w=600&h=600&fit=crop', 78, 'SPRT-015'),

-- Fitness Accessories
('Foam Roller Set', 'High-density foam roller set. Recovery and stretching.', 34.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop', 123, 'SPRT-016'),
('Exercise Ball', 'Anti-burst exercise ball in multiple sizes. Supports up to 600 lbs.', 24.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop', 145, 'SPRT-017'),
('Grip Strengthener', 'Adjustable grip strengthener. Rehabilitate and strengthen hands.', 12.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1534367507873-d2d7e24d797f?w=600&h=600&fit=crop', 234, 'SPRT-018'),
('Wrist Weights Set', 'Adjustable wrist weights set. 2-5 lbs per weight.', 29.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1534367507873-d2d7e24d797f?w=600&h=600&fit=crop', 112, 'SPRT-019'),
('Push-Up Stands', 'Ergonomic push-up stands. Reduce wrist strain.', 19.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1534367507873-d2d7e24d797f?w=600&h=600&fit=crop', 178, 'SPRT-020'),

-- Activewear
('Athletic Shorts', 'Moisture-wicking athletic shorts. Multiple colors available.', 29.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1506629082632-401017062e57?w=600&h=600&fit=crop', 234, 'SPRT-021'),
('Compression Leggings', 'High-waisted compression leggings. Supportive and comfortable.', 39.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1534367507873-d2d7e24d797f?w=600&h=600&fit=crop', 167, 'SPRT-022'),
('Sports Bra Support', 'High-impact sports bra. Maximum support during workouts.', 34.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1534367507873-d2d7e24d797f?w=600&h=600&fit=crop', 189, 'SPRT-023'),
('Workout Tank Top', 'Breathable workout tank top. Quick-dry material.', 24.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1534367507873-d2d7e24d797f?w=600&h=600&fit=crop', 198, 'SPRT-024'),
('Athletic Socks Pack', 'Moisture-wicking athletic socks pack of 6. Cushioned sole.', 16.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1586350977773-bf48b6c7355c?w=600&h=600&fit=crop', 267, 'SPRT-025'),

-- Hydration & Recovery
('Sports Water Bottle', 'Insulated stainless steel bottle keeps drinks cold for 24 hours. BPA-free.', 24.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 138, 'SPRT-026'),
('Hydration Backpack', 'Running hydration backpack with 2L bladder. Hands-free hydration.', 79.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 67, 'SPRT-027'),
('Protein Shaker Bottle', 'Professional protein shaker with mixing ball. Leak-proof.', 14.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 245, 'SPRT-028'),
('Ice Pack Reusable', 'Flexible ice pack for injuries. Reusable and durable.', 12.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 189, 'SPRT-029'),
('Recovery Massage Gun', 'Handheld percussion massager. Deep tissue relief.', 149.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 52, 'SPRT-030'),

-- Swimming & Water Sports
('Swimming Goggles', 'Anti-fog swimming goggles with UV protection. Adjustable straps.', 24.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 156, 'SPRT-031'),
('Pool Noodles', 'Float pool noodles pack of 4. Fun for all ages.', 12.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 234, 'SPRT-032'),
('Water Bottle Float', 'Inflatable water bottle pool float. Chairs and lounger.', 29.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 123, 'SPRT-033'),
('Beach Towel Large', 'Quick-dry beach towel. Extra large size.', 34.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 145, 'SPRT-034'),
('Snorkel Set', 'Complete snorkel set with mask and fins. Underwater adventure.', 59.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 78, 'SPRT-035'),

-- Outdoor Sports
('Camping Tent', '4-person camping tent with rainfly. Easy setup.', 149.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 56, 'SPRT-036'),
('Sleeping Bag', 'Mummy sleeping bag rated for cold weather. Compression sack included.', 79.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 67, 'SPRT-037'),
('Hiking Backpack', 'Ergonomic hiking backpack with hydration compartment. 40L capacity.', 129.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', 54, 'SPRT-038'),
('Trekking Poles', 'Adjustable trekking poles with shock absorption. Carbon fiber.', 69.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 78, 'SPRT-039'),
('Headlamp Rechargeable', 'Bright LED headlamp for hands-free lighting. 200 lumens.', 34.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 156, 'SPRT-040'),

-- Team Sports
('Basketball Official', 'Official size basketball with composite leather. Perfect grip.', 34.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop', 145, 'SPRT-041'),
('Soccer Ball Professional', 'FIFA approved soccer ball. Premium quality construction.', 49.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop', 134, 'SPRT-042'),
('Football Official', 'Official size football with composite leather. Durable construction.', 39.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop', 123, 'SPRT-043'),
('Volleyball Set', 'Complete volleyball set with net and poles. Official size.', 129.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop', 45, 'SPRT-044'),
('Tennis Racket', 'Professional tennis racket with string. Lightweight and powerful.', 89.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop', 67, 'SPRT-045'),

-- Fitness Tech
('Fitness Tracker Band', 'Activity tracker with heart rate monitoring. Water-resistant.', 79.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1544117519-31a4b719223c?w=600&h=600&fit=crop', 134, 'SPRT-046'),
('Smart Scale', 'Body composition smart scale. Syncs with fitness apps.', 64.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1544117519-31a4b719223c?w=600&h=600&fit=crop', 112, 'SPRT-047'),
('Heart Rate Monitor', 'Chest strap heart rate monitor. Accurate real-time tracking.', 49.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1544117519-31a4b719223c?w=600&h=600&fit=crop', 156, 'SPRT-048'),
('GPS Running Watch', 'GPS-enabled running watch with training features.', 199.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1544117519-31a4b719223c?w=600&h=600&fit=crop', 78, 'SPRT-049'),
('Bluetooth Sport Headphones', 'Wireless sport headphones with sweat resistance. Secure fit.', 89.99, 'Sports & Fitness', 'https://images.unsplash.com/photo-1544117519-31a4b719223c?w=600&h=600&fit=crop', 98, 'SPRT-050');

-- ==============================================
-- BEAUTY & PERSONAL CARE CATEGORY - 50 PRODUCTS
-- ==============================================

INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku) VALUES

-- Skincare
('Natural Face Cleanser', 'Gentle cleansing gel with aloe vera and chamomile. Suitable for all skin types.', 19.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 92, 'BEAU-001'),
('Face Moisturizer Daily', 'Hydrating daily moisturizer with SPF 30. Lightweight and non-greasy formula.', 24.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228720-da61a533e4eb?w=600&h=600&fit=crop', 74, 'BEAU-002'),
('Face Mask Sheet Set', 'Pack of 10 hydrating face masks. Korean beauty inspired.', 24.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 89, 'BEAU-003'),
('Vitamin C Serum', 'Brightening vitamin C serum. Reduces dark spots and evens skin tone.', 34.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 67, 'BEAU-004'),
('Retinol Night Cream', 'Anti-aging retinol night cream. Reduces fine lines and wrinkles.', 49.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 56, 'BEAU-005'),

-- Hair Care
('Hair Dryer Professional', 'Ionic hair dryer with ceramic coating. Reduces frizz and damage. Fast drying.', 49.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=600&fit=crop', 38, 'BEAU-006'),
('Hair Straightener', 'Professional hair straightener with ceramic plates. Heats up fast.', 39.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=600&fit=crop', 52, 'BEAU-007'),
('Curling Iron Set', 'Set of 3 curling irons in different sizes. Creates various curl styles.', 54.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=600&fit=crop', 45, 'BEAU-008'),
('Hair Brush Set', 'Professional hair brush set with multiple styles. Detangling and volumizing.', 29.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=600&fit=crop', 123, 'BEAU-009'),
('Hair Clips Set', 'Decorative hair clips and pins set. Holds hair securely.', 12.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=600&fit=crop', 189, 'BEAU-010'),

-- Grooming & Shaving
('Electric Toothbrush', 'Sonic electric toothbrush with 5 cleaning modes and 3-month battery life.', 69.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1544759857-5c4403c4b63c?w=600&h=600&fit=crop', 55, 'BEAU-011'),
('Men''s Grooming Kit', 'Complete grooming kit with beard trimmer, hair clipper, and accessories.', 79.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=600&fit=crop', 49, 'BEAU-012'),
('Beard Care Kit', 'Complete beard grooming set with oil, balm, and brush.', 39.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=600&fit=crop', 87, 'BEAU-013'),
('Safety Razor', 'Premium safety razor with stainless steel handle. Close shave.', 34.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=600&fit=crop', 134, 'BEAU-014'),
('Shaving Cream', 'Premium shaving cream with natural ingredients. Smooth shave.', 14.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=600&fit=crop', 178, 'BEAU-015'),

-- Makeup
('Foundation Liquid', 'Full coverage liquid foundation. SPF 15 protection.', 29.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 156, 'BEAU-016'),
('Lipstick Set', 'Matte lipstick set in assorted colors. Long-lasting formula.', 24.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 167, 'BEAU-017'),
('Mascara Waterproof', 'Volumizing waterproof mascara. Lengthens and curls lashes.', 19.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 189, 'BEAU-018'),
('Eyeshadow Palette', '16-color eyeshadow palette with matte and shimmer shades.', 34.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 145, 'BEAU-019'),
('Makeup Brush Set', 'Professional makeup brush set with 12 brushes. Synthetic bristles.', 39.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 134, 'BEAU-020'),

-- Body Care
('Body Lotion Moisturizing', 'Rich body lotion with shea butter. Smooths and hydrates skin.', 19.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 198, 'BEAU-021'),
('Body Wash Set', 'Gentle body wash set in multiple scents. Hydrating formula.', 24.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 167, 'BEAU-022'),
('Exfoliating Body Scrub', 'Sugar body scrub with natural oils. Removes dead skin.', 22.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 145, 'BEAU-023'),
('Sunscreen SPF 50', 'Broad spectrum sunscreen SPF 50. Water-resistant.', 16.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 234, 'BEAU-024'),
('Body Oil Nourishing', 'Silky body oil for all skin types. Absorbs quickly.', 27.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 123, 'BEAU-025'),

-- Bath & Shower
('Bath Bomb Set', 'Fizzy bath bombs with essential oils. Relaxing aromatherapy.', 19.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 178, 'BEAU-026'),
('Bath Sponge', 'Natural sea sponge for bathing. Gentle exfoliation.', 12.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 234, 'BEAU-027'),
('Shower Caddy', 'Waterproof shower caddy organizer. Holds all bath essentials.', 24.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 156, 'BEAU-028'),
('Towels Set Luxury', 'Plush cotton towels set of 4. Highly absorbent.', 49.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 89, 'BEAU-029'),
('Robes Set', 'Cozy bathrobe set for spa-like experience.', 64.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 67, 'BEAU-030'),

-- Nail Care
('Nail Polish Set', 'Long-lasting nail polish set in assorted colors. Chip-resistant.', 24.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 189, 'BEAU-031'),
('Nail Clipper Set', 'Professional nail clipper set with multiple sizes. Stainless steel.', 12.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 234, 'BEAU-032'),
('Nail File Set', 'Emery boards and glass files set. Smooth finishing.', 9.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 267, 'BEAU-033'),
('Cuticle Pusher', 'Stainless steel cuticle pusher. Clean and professional.', 7.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 289, 'BEAU-034'),
('Base Coat Top Coat', 'Nail polish base coat and top coat set. Prevents chipping.', 14.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 198, 'BEAU-035'),

-- Dental Care
('Toothpaste Whitening', 'Advanced whitening toothpaste. Removes stains effectively.', 9.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1544759857-5c4403c4b63c?w=600&h=600&fit=crop', 345, 'BEAU-036'),
('Mouthwash Fresh', 'Antibacterial mouthwash for fresh breath. Alcohol-free.', 12.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1544759857-5c4403c4b63c?w=600&h=600&fit=crop', 267, 'BEAU-037'),
('Dental Floss', 'Premium dental floss with wax coating. Easy to use.', 7.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1544759857-5c4403c4b63c?w=600&h=600&fit=crop', 289, 'BEAU-038'),
('Tongue Scraper', 'Stainless steel tongue scraper. Removes bacteria.', 6.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1544759857-5c4403c4b63c?w=600&h=600&fit=crop', 234, 'BEAU-039'),
('Teeth Whitening Kit', 'Professional teeth whitening kit with LED light.', 49.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1544759857-5c4403c4b63c?w=600&h=600&fit=crop', 123, 'BEAU-040'),

-- Fragrance
('Perfume Set', 'Elegant perfume set in assorted scents. Long-lasting fragrance.', 59.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 89, 'BEAU-041'),
('Cologne Set', 'Men''s cologne set in classic scents. Sophisticated fragrance.', 54.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=600&fit=crop', 98, 'BEAU-042'),
('Body Mist Set', 'Light body mist set for daily use. Refreshing scents.', 24.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 156, 'BEAU-043'),
('Roll-On Perfume', 'Convenient roll-on perfume. Perfect for travel.', 19.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 178, 'BEAU-044'),
('Soap Set Luxury', 'Handcrafted luxury soap set. Natural ingredients.', 29.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 145, 'BEAU-045'),

-- Tools & Accessories
('Mirror Magnifying', 'LED magnifying mirror with adjustable lighting. Perfect for grooming.', 34.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 167, 'BEAU-046'),
('Tweezers Set', 'Professional tweezers set with multiple styles. Precise grooming.', 14.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 234, 'BEAU-047'),
('Cosmetic Bag', 'Leather cosmetic bag with compartments. Travel-friendly.', 29.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', 156, 'BEAU-048'),
('Makeup Organizer', 'Acrylic makeup organizer with drawers. Clear compartments.', 39.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 134, 'BEAU-049'),
('Cotton Swabs', 'Premium cotton swabs pack of 500. Soft and gentle.', 7.99, 'Beauty & Personal Care', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', 345, 'BEAU-050');

-- ==============================================
-- OFFICE & STUDY CATEGORY - 50 PRODUCTS
-- ==============================================

INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku) VALUES

-- Furniture
('Ergonomic Office Chair', 'Comfortable ergonomic chair with lumbar support and adjustable height. All-day comfort.', 249.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 31, 'OFFC-001'),
('Standing Desk Converter', 'Adjustable standing desk converter that fits any desk. Promotes healthy posture.', 199.99, 'Office & Study', 'https://images.unsplash.com/photo-1587330979470-16b34d76e914?w=600&h=600&fit=crop', 22, 'OFFC-002'),
('Desk Organizer Set', 'Bamboo desk organizer with multiple compartments. Keep your desk tidy.', 34.99, 'Office & Study', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 87, 'OFFC-003'),
('Monitor Stand with Storage', 'Wooden monitor stand with drawers and USB hub. Organize your workspace.', 49.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 63, 'OFFC-004'),
('File Cabinet', '2-drawer file cabinet with lock. Organize documents securely.', 149.99, 'Office & Study', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 45, 'OFFC-005'),

-- Computer Accessories
('Wireless Keyboard & Mouse', 'Sleek wireless keyboard and mouse combo with long battery life. Silent typing.', 79.99, 'Office & Study', 'https://images.unsplash.com/photo-1587829191301-4b34e2b6d83d?w=600&h=600&fit=crop', 54, 'OFFC-006'),
('Laptop Stand Aluminum', 'Adjustable aluminum laptop stand with ventilation. Ergonomic design.', 34.99, 'Office & Study', 'https://images.unsplash.com/photo-1599995905957-187fd7c93c80?w=600&h=600&fit=crop', 145, 'OFFC-007'),
('USB-C Hub Multi-Port', '7-in-1 USB-C hub with HDMI, USB ports, and card reader.', 59.99, 'Office & Study', 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop', 123, 'OFFC-008'),
('External Monitor', '27-inch 4K external monitor. Ideal for productivity.', 299.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 34, 'OFFC-009'),
('Cable Management Kit', 'Desk cable organizer with clips and sleeves. Clean workspace.', 19.99, 'Office & Study', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 156, 'OFFC-010'),

-- Writing Supplies
('Pen Set Premium', 'Rollerball pen set with smooth ink flow. Multiple colors.', 24.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 234, 'OFFC-011'),
('Notebook Set', 'Premium notebooks with lined pages. Set of 3.', 19.99, 'Office & Study', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 198, 'OFFC-012'),
('Sticky Notes Set', 'Colorful sticky notes in various sizes. Organize your thoughts.', 9.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 345, 'OFFC-013'),
('Highlighters Set', 'Multicolor highlighters for notes and documents.', 7.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 267, 'OFFC-014'),
('Mechanical Pencils', 'Professional mechanical pencils with lead refills.', 12.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 289, 'OFFC-015'),

-- Organization
('Desk Calendar', 'Large desk calendar with monthly view. Stay organized.', 14.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 178, 'OFFC-016'),
('Label Maker', 'Portable label maker with multiple fonts and sizes.', 79.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 67, 'OFFC-017'),
('File Folders Set', 'Hanging file folders in assorted colors. Organize documents.', 19.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 167, 'OFFC-018'),
('Mail Organizer', 'Desktop mail organizer with compartments. Sort mail efficiently.', 24.99, 'Office & Study', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 145, 'OFFC-019'),
('Drawer Organizer', 'Expandable drawer organizer for office supplies.', 16.99, 'Office & Study', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 189, 'OFFC-020'),

-- Lighting
('Desk Lamp LED', 'Modern LED desk lamp with adjustable brightness. Eye-friendly.', 44.99, 'Office & Study', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=600&h=600&fit=crop', 98, 'OFFC-021'),
('Light Bar Monitor', 'LED light bar that mounts to monitor. Reduces eye strain.', 39.99, 'Office & Study', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=600&h=600&fit=crop', 112, 'OFFC-022'),
('Task Light', 'Adjustable task light with clamp. Flexible positioning.', 29.99, 'Office & Study', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=600&h=600&fit=crop', 134, 'OFFC-023'),
('Lamp with USB Port', 'Desk lamp with built-in USB charging port. Dual functionality.', 34.99, 'Office & Study', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=600&h=600&fit=crop', 123, 'OFFC-024'),
('Light Ring Desk', 'LED light ring for video calls. Professional lighting.', 49.99, 'Office & Study', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=600&h=600&fit=crop', 89, 'OFFC-025'),

-- Storage
('Document Holder', 'Adjustable document holder for reading. Reduces neck strain.', 24.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 156, 'OFFC-026'),
('Paper Trays Set', 'Stackable paper trays for organization. Set of 3.', 19.99, 'Office & Study', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 178, 'OFFC-027'),
('Pen Holder', 'Modern pen holder with multiple compartments.', 12.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 234, 'OFFC-028'),
('Magazine Holder', 'Steel magazine holder. Keeps reading materials organized.', 16.99, 'Office & Study', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 167, 'OFFC-029'),
('Book Ends', 'Decorative bookends for library organization. Heavy duty.', 19.99, 'Office & Study', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 178, 'OFFC-030'),

-- Ergonomic Accessories
('Wrist Rest Keyboard', 'Ergonomic keyboard wrist rest. Reduces strain.', 14.99, 'Office & Study', 'https://images.unsplash.com/photo-1587829191301-4b34e2b6d83d?w=600&h=600&fit=crop', 189, 'OFFC-031'),
('Wrist Rest Mouse', 'Gel mouse wrist rest. Comfortable support.', 12.99, 'Office & Study', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=600&fit=crop', 198, 'OFFC-032'),
('Footrest Adjustable', 'Ergonomic footrest with adjustable height. Improves posture.', 34.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 134, 'OFFC-033'),
('Posture Corrector', 'Back support cushion for office chair. Aligns spine.', 29.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 145, 'OFFC-034'),
('Anti-Fatigue Mat', 'Comfortable anti-fatigue mat for standing desk.', 49.99, 'Office & Study', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 112, 'OFFC-035'),

-- Tech Accessories
('USB Extension Cable', '6ft USB extension cable with gold-plated connectors.', 8.99, 'Office & Study', 'https://images.unsplash.com/photo-1587825143148-eac8c0cb0173?w=600&h=600&fit=crop', 298, 'OFFC-036'),
('USB Hub Powered', 'Powered USB hub with 7 ports. Fast data transfer.', 39.99, 'Office & Study', 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop', 156, 'OFFC-037'),
('Surge Protector', 'Power strip with surge protection. 8 outlets.', 24.99, 'Office & Study', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 189, 'OFFC-038'),
('Battery Backup', 'UPS battery backup for computer. 600VA capacity.', 89.99, 'Office & Study', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 67, 'OFFC-039'),
('Webcam HD', '1080p HD webcam with microphone. Great for video calls.', 79.99, 'Office & Study', 'https://images.unsplash.com/photo-1598550880863-4e7aaef27844?w=600&h=600&fit=crop', 98, 'OFFC-040'),

-- Productivity Tools
('Timer Pomodoro', 'Focus timer with Pomodoro technique. Increases productivity.', 24.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 145, 'OFFC-041'),
('Whiteboard Dry Erase', 'Magnetic whiteboard with markers. Easy to clean.', 39.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 123, 'OFFC-042'),
('Memo Board Cork', 'Cork memo board with tacks. Pin important notes.', 19.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 167, 'OFFC-043'),
('Desktop Organizer', 'All-in-one desktop organizer for supplies.', 29.99, 'Office & Study', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 156, 'OFFC-044'),
('Cable Ties Set', 'Reusable cable ties for organizing cords. Set of 100.', 9.99, 'Office & Study', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 289, 'OFFC-045'),

-- Presentation Tools
('Presentation Remote', 'Wireless presentation remote with laser pointer.', 29.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 134, 'OFFC-046'),
('Document Scanner', 'Portable document scanner with wireless connectivity.', 149.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 56, 'OFFC-047'),
('Paper Shredder', 'Cross-cut paper shredder with auto-feed. Secure disposal.', 89.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 78, 'OFFC-048'),
('Calculator Desktop', 'Desktop calculator with large display. Solar powered.', 24.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 167, 'OFFC-049'),
('Stamp Set', 'Custom stamp set for office use. Signature and date stamps.', 19.99, 'Office & Study', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=600&fit=crop', 145, 'OFFC-050');

-- ==============================================
-- BOOKS & MEDIA CATEGORY - 50 PRODUCTS
-- ==============================================

INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku) VALUES

-- Book Collections
('Best Sellers Book Collection', 'Set of 5 bestselling novels from top authors. Hardcover editions.', 89.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 43, 'BOOK-001'),
('Cookbook: Healthy Recipes', '200+ healthy recipes with colorful photos. Perfect for home cooks.', 24.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 67, 'BOOK-002'),
('Business Strategy Guide', 'Essential guide for entrepreneurs and business leaders. Practical insights.', 19.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 54, 'BOOK-003'),
('Photography Fundamentals', 'Comprehensive guide to digital photography. Learn composition and lighting.', 29.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 41, 'BOOK-004'),
('Science Fiction Novel', 'Award-winning science fiction novel. First in bestselling trilogy.', 16.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 89, 'BOOK-005'),

-- Educational Books
('Programming Guide Python', 'Complete guide to Python programming for beginners. Hands-on exercises.', 34.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 112, 'BOOK-006'),
('Web Design Handbook', 'Modern web design principles and best practices. Color illustrations.', 27.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 78, 'BOOK-007'),
('Digital Marketing Guide', 'Comprehensive digital marketing strategies. Updated for 2024.', 24.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 67, 'BOOK-008'),
('Financial Planning Book', 'Guide to personal finance and investment. Build wealth smartly.', 22.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 89, 'BOOK-009'),
('Language Learning Spanish', 'Interactive Spanish learning book with audio CDs. Beginner to advanced.', 39.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 76, 'BOOK-010'),

-- Fiction & Literature
('Mystery Thriller Novel', 'Page-turning mystery thriller with unexpected twists.', 15.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 123, 'BOOK-011'),
('Romance Novel Collection', 'Heartwarming romance novels. Set of 3.', 24.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 98, 'BOOK-012'),
('Fantasy Epic Series', 'Epic fantasy series first book. Magic and adventure.', 18.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 87, 'BOOK-013'),
('Classic Literature Set', 'Timeless classics collection. 5 books in one set.', 49.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 56, 'BOOK-014'),
('Poetry Collection', 'Modern poetry collection from renowned poets.', 14.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 134, 'BOOK-015'),

-- Biographies & Memoirs
('Inspirational Biography', 'Life story of influential leader. Motivational read.', 19.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 78, 'BOOK-016'),
('Celebrity Memoir', 'Candid memoir from famous personality. Revealing insights.', 22.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 89, 'BOOK-017'),
('Historical Biography', 'Detailed biography of historical figure. Well-researched.', 24.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 67, 'BOOK-018'),
('Sports Biography', 'Journey of legendary athlete. Inspiring story.', 17.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 98, 'BOOK-019'),
('Entrepreneur Biography', 'Success story of business mogul. Lessons learned.', 21.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 87, 'BOOK-020'),

-- Reference Books
('Dictionary Comprehensive', 'Complete dictionary with 200,000+ definitions.', 34.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 112, 'BOOK-021'),
('Thesaurus Modern', 'Modern thesaurus with synonyms and antonyms.', 24.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 98, 'BOOK-022'),
('Atlas World', 'Detailed world atlas with maps and statistics.', 39.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 76, 'BOOK-023'),
('Encyclopedia Set', 'Complete encyclopedia set covering all topics.', 149.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 34, 'BOOK-024'),
('Grammar Guide', 'Complete guide to English grammar. Clear explanations.', 19.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 134, 'BOOK-025'),

-- Audiobooks
('Audiobook Fiction', 'Popular fiction audiobook narrated by professional voice actor.', 19.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 89, 'BOOK-026'),
('Audiobook Self-Help', 'Motivational self-help audiobook for personal growth.', 22.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 78, 'BOOK-027'),
('Audiobook Business', 'Business strategy audiobook for professionals.', 24.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 67, 'BOOK-028'),
('Audiobook History', 'Engaging history audiobook with sound effects.', 21.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 87, 'BOOK-029'),
('Audiobook Collection', 'Classic audiobook collection set of 5.', 59.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 45, 'BOOK-030'),

-- Magazines & Periodicals
('Magazine Subscription', '12-month magazine subscription. Popular lifestyle magazine.', 24.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 167, 'BOOK-031'),
('Tech Magazine', 'Latest tech trends magazine. Monthly issues.', 12.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 198, 'BOOK-032'),
('Fashion Magazine', 'Trendy fashion magazine with style tips.', 11.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 189, 'BOOK-033'),
('Sports Magazine', 'Sports news and analysis magazine.', 10.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 178, 'BOOK-034'),
('Travel Magazine', 'Inspirational travel magazine with destinations.', 11.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 156, 'BOOK-035'),

-- eBooks & Digital
('eBook Reader', 'E-ink ebook reader with 8GB storage. Easy on eyes.', 119.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 78, 'BOOK-036'),
('Digital Magazine Subscription', '1-year digital magazine access. All devices.', 19.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 234, 'BOOK-037'),
('eBook Gift Card', 'eBook store gift card. Redeemable for any book.', 25.00, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 567, 'BOOK-038'),
('Audiobook Membership', '3-month audiobook membership. Unlimited access.', 29.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 189, 'BOOK-039'),
('Digital Library Access', 'Annual digital library membership. Thousands of books.', 49.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 156, 'BOOK-040'),

-- Children's Books
('Children''s Storybook', 'Engaging children''s storybook with colorful illustrations.', 12.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 198, 'BOOK-041'),
('Picture Book Set', 'Set of 5 picture books for young readers.', 29.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 156, 'BOOK-042'),
('Educational Activity Book', 'Learning activity book with fun exercises.', 9.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 267, 'BOOK-043'),
('Bedtime Story Collection', 'Classic bedtime stories collection. Calming tales.', 24.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 134, 'BOOK-044'),
('Coloring Book Set', 'Adult coloring books set with colored pencils.', 19.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 189, 'BOOK-045'),

-- Specialty Books
('Art Book Collection', 'Beautiful art book collection with high-quality prints.', 79.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 67, 'BOOK-046'),
('Music Theory Book', 'Complete guide to music theory and composition.', 34.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 89, 'BOOK-047'),
('Architecture Design Book', 'Modern architecture and design inspiration book.', 49.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 56, 'BOOK-048'),
('Cooking Technique Book', 'Professional cooking techniques illustrated guide.', 39.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 78, 'BOOK-049'),
('DIY Project Book', 'Creative DIY projects with step-by-step instructions.', 24.99, 'Books & Media', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 123, 'BOOK-050');

-- ==============================================
-- TOYS & GAMES CATEGORY - 50 PRODUCTS
-- ==============================================

INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku) VALUES

-- Educational Toys
('Educational Building Blocks', 'Colorful building blocks set for creative play. Develops motor skills.', 29.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 73, 'TOYS-001'),
('Puzzle Set', 'Set of 4 jigsaw puzzles in different difficulty levels. Ages 6+', 24.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 98, 'TOYS-002'),
('Magnetic Tiles', 'Magnetic building tiles set. Stimulates creativity and imagination.', 49.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 87, 'TOYS-003'),
('Science Kit', 'Educational science experiment kit. Learn through play.', 39.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 76, 'TOYS-004'),
('Telescope for Kids', 'Beginner telescope for astronomy. Perfect for young explorers.', 79.99, 'Toys & Games', 'https://images.unsplash.com/photo-1507598641400-ec353624cfa6?w=600&h=600&fit=crop', 54, 'TOYS-005'),

-- Board Games
('Board Game Collection', 'Set of 5 classic board games. Perfect for family game nights.', 59.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 38, 'TOYS-006'),
('Chess Set', 'Staunton chess set with wooden board. Classic design.', 34.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 67, 'TOYS-007'),
('Monopoly Classic', 'Classic Monopoly board game. Hours of fun.', 29.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 89, 'TOYS-008'),
('Strategy Game', 'Complex strategy board game for adults. Multiple players.', 49.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 56, 'TOYS-009'),
('Card Game Set', 'Classic card games collection. Set of 10.', 19.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 134, 'TOYS-010'),

-- Action Figures & Dolls
('Action Figure Set', 'Popular action figures set. Highly detailed.', 24.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 123, 'TOYS-011'),
('Doll Collection', 'Beautiful doll collection with accessories.', 39.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 98, 'TOYS-012'),
('RC Drone with Camera', '4K camera drone with GPS. Auto-return and altitude hold features.', 199.99, 'Toys & Games', 'https://images.unsplash.com/photo-1507598641400-ec353624cfa6?w=600&h=600&fit=crop', 26, 'TOYS-013'),
('RC Car', 'High-speed RC car with remote control. Rechargeable battery.', 89.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 67, 'TOYS-014'),
('Robot Toy', 'Interactive robot toy with voice commands. Educational fun.', 79.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 54, 'TOYS-015'),

-- Puzzles & Games
('Rubik''s Cube Collection', 'Set of 3 Rubik''s cubes in different sizes. Classic puzzle game.', 19.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 95, 'TOYS-016'),
('3D Puzzle Set', 'Architectural 3D puzzles set. Challenging and rewarding.', 34.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 78, 'TOYS-017'),
('Brain Teaser Set', 'Set of challenging brain teasers. Improve problem-solving.', 24.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 112, 'TOYS-018'),
('Word Search Book', 'Large word search puzzle book. 100 puzzles.', 12.99, 'Toys & Games', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 178, 'TOYS-019'),
('Sudoku Book', 'Sudoku puzzle book with solutions. Multiple difficulty levels.', 9.99, 'Toys & Games', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 234, 'TOYS-020'),

-- Arts & Crafts
('Art Supplies Set', 'Complete art supplies set with crayons, markers, and paints.', 34.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 145, 'TOYS-021'),
('Coloring Book Set', 'Adult coloring books set with colored pencils.', 19.99, 'Toys & Games', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 189, 'TOYS-022'),
('Origami Paper Set', 'Origami paper set with instruction book. Create beautiful figures.', 14.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 167, 'TOYS-023'),
('Scrapbook Kit', 'Complete scrapbook kit with stickers and accessories.', 29.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 123, 'TOYS-024'),
('Jewelry Making Kit', 'DIY jewelry making kit for kids. Create unique pieces.', 24.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 156, 'TOYS-025'),

-- Electronic Learning
('Electronic Learning Tablet', 'Interactive educational tablet for kids. 100+ games and activities.', 79.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 47, 'TOYS-026'),
('Learning Computer', 'Educational computer for kids. Teaches letters, numbers, and more.', 49.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 67, 'TOYS-027'),
('Karaoke Machine', 'Portable karaoke machine with microphone. Family fun.', 89.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 54, 'TOYS-028'),
('Electronic Keyboard', 'Mini electronic keyboard for kids. Multiple sounds.', 69.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 76, 'TOYS-029'),
('Smart Watch for Kids', 'GPS tracker smartwatch for kids. Communication and safety.', 99.99, 'Toys & Games', 'https://images.unsplash.com/photo-1544117519-31a4b719223c?w=600&h=600&fit=crop', 45, 'TOYS-030'),

-- Outdoor Toys
('Bike with Training Wheels', 'Kids bike with removable training wheels. Ages 5-8', 149.99, 'Toys & Games', 'https://images.unsplash.com/photo-1507598641400-ec353624cfa6?w=600&h=600&fit=crop', 56, 'TOYS-031'),
('Scooter Kick', 'Adjustable kick scooter for kids. Foldable design.', 49.99, 'Toys & Games', 'https://images.unsplash.com/photo-1507598641400-ec353624cfa6?w=600&h=600&fit=crop', 78, 'TOYS-032'),
('Skateboard Complete', 'Complete skateboard with trucks and wheels. Ready to ride.', 79.99, 'Toys & Games', 'https://images.unsplash.com/photo-1507598641400-ec353624cfa6?w=600&h=600&fit=crop', 67, 'TOYS-033'),
('Water Blaster Set', 'Super soaker water blaster set. Perfect for summer.', 29.99, 'Toys & Games', 'https://images.unsplash.com/photo-1507598641400-ec353624cfa6?w=600&h=600&fit=crop', 112, 'TOYS-034'),
('Jump Rope Set', 'Adjustable jump rope set for kids. Active play.', 14.99, 'Toys & Games', 'https://images.unsplash.com/photo-1507598641400-ec353624cfa6?w=600&h=600&fit=crop', 189, 'TOYS-035'),

-- Collectibles
('Collectible Figure Set', 'Limited edition collectible figures. Highly detailed.', 49.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 87, 'TOYS-036'),
('Trading Cards Set', 'Popular trading cards collection. Start collecting.', 19.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 234, 'TOYS-037'),
('Minifigure Collection', 'Collectible minifigure set. Display or play.', 24.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 156, 'TOYS-038'),
('Collectible Coin Set', 'Commemorative coin set in display case.', 34.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 123, 'TOYS-039'),
('Sticker Collection', 'Large sticker collection pack. 500+ stickers.', 12.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 267, 'TOYS-040'),

-- Classic Toys
('Yo-Yo Set', 'Professional yo-yo set with multiple styles. Learn tricks.', 19.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 178, 'TOYS-041'),
('Slingshot', 'Safe slingshot for outdoor play. Ages 10+', 14.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 145, 'TOYS-042'),
('Marbles Set', 'Classic marbles set with shooter. Timeless fun.', 9.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 234, 'TOYS-043'),
('Jack-in-the-Box', 'Classic jack-in-the-box toy. Surprise and delight.', 24.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 156, 'TOYS-044'),
('Spinning Top', 'Professional spinning top set with accessories.', 12.99, 'Toys & Games', 'https://images.unsplash.com/photo-1607370007000-6c1069cc20b4?w=600&h=600&fit=crop', 198, 'TOYS-045'),

-- Sports Toys
('Kids Basketball Set', 'Adjustable height basketball set for kids. Ages 3-7', 49.99, 'Toys & Games', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop', 87, 'TOYS-046'),
('Soccer Goal Set', 'Portable soccer goal set. Perfect for backyard play.', 39.99, 'Toys & Games', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop', 98, 'TOYS-047'),
('Tennis Set Kids', 'Junior tennis set with rackets and balls.', 34.99, 'Toys & Games', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop', 112, 'TOYS-048'),
('Frisbee Set', 'Set of 3 frisbees in different colors. Outdoor fun.', 14.99, 'Toys & Games', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop', 189, 'TOYS-049'),
('Nerf Gun Set', 'S foam dart blaster set. Safe and fun.', 39.99, 'Toys & Games', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=600&fit=crop', 134, 'TOYS-050');

-- ==============================================
-- PET SUPPLIES CATEGORY - 50 PRODUCTS
-- ==============================================

INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku) VALUES

-- Food & Treats
('Dog Food Premium Dry', 'Nutritious dry dog food with real meat. 30lb bag.', 49.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 82, 'PETS-001'),
('Cat Food Wet', 'Grain-free wet cat food. Variety pack of 24 cans.', 34.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=600&fit=crop', 95, 'PETS-002'),
('Dog Treats Training', 'Soft training treats for dogs. High value rewards.', 12.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 178, 'PETS-003'),
('Cat Treats Variety', 'Assorted cat treats in multiple flavors. Pack of 20.', 14.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=600&fit=crop', 167, 'PETS-004'),
('Bird Seed Mix', 'Premium bird seed mix for all birds. 10lb bag.', 19.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 134, 'PETS-005'),

-- Toys & Entertainment
('Cat Scratching Post', 'Tall cat scratching post with sisal rope. Includes hanging toys.', 39.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=600&fit=crop', 58, 'PETS-006'),
('Dog Toy Set', 'Indestructible dog toy set. Multiple textures.', 24.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 145, 'PETS-007'),
('Feather Wand Cat', 'Interactive feather wand toy for cats. Hours of play.', 12.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=600&fit=crop', 198, 'PETS-008'),
('Squeaky Toy Set', 'Dog squeaky toy set. Pack of 5.', 19.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 167, 'PETS-009'),
('Ball Launcher Dog', 'Automatic ball launcher for dogs. Great exercise.', 79.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 67, 'PETS-010'),

-- Leashes & Collars
('Dog Leash Retractable', 'Heavy-duty retractable leash extends up to 26 feet. Comfortable grip.', 24.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 103, 'PETS-011'),
('Dog Collar Set', 'Adjustable dog collar set with ID tags. Multiple colors.', 14.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 189, 'PETS-012'),
('Harness Dog', 'Escape-proof dog harness. Comfortable and secure.', 29.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 134, 'PETS-013'),
('Cat Harness', 'Escape-proof cat harness for outdoor adventures.', 24.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=600&fit=crop', 156, 'PETS-014'),
('Leash Double', 'Dual dog leash for walking two dogs at once.', 34.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 98, 'PETS-015'),

-- Beds & Accessories
('Dog Bed Orthopedic', 'Memory foam dog bed for joint support. Machine washable.', 79.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 67, 'PETS-016'),
('Cat Bed Cave', 'Cozy cave bed for cats. Provides security and warmth.', 39.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=600&fit=crop', 89, 'PETS-017'),
('Pet Blanket', 'Soft fleece pet blanket. Perfect for cuddling.', 19.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 198, 'PETS-018'),
('Elevated Dog Bed', 'Cooling elevated dog bed. Mesh fabric with frame.', 49.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 78, 'PETS-019'),
('Pet Pillow', 'Comfortable pet pillow with removable cover.', 24.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 145, 'PETS-020'),

-- Carriers & Travel
('Pet Carrier Travel', 'Airline-approved pet carrier with ventilation. Comfortable for small pets.', 44.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=600&fit=crop', 51, 'PETS-021'),
('Backpack Pet Carrier', 'Hands-free backpack pet carrier. Perfect for adventures.', 69.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=600&fit=crop', 56, 'PETS-022'),
('Car Seat Cover', 'Waterproof car seat cover. Protects car interior.', 34.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 123, 'PETS-023'),
('Car Safety Harness', 'Dog car safety harness. Keeps pet secure.', 29.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 134, 'PETS-024'),
('Travel Bowl Set', 'Collapsible travel bowls for food and water.', 14.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 178, 'PETS-025'),

-- Grooming & Hygiene
('Pet Brush Set', 'Professional grooming brush set for all coat types.', 19.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 167, 'PETS-026'),
('Nail Clippers Pet', 'Professional pet nail clippers with safety guard.', 12.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 234, 'PETS-027'),
('Shampoo Pet', 'Organic pet shampoo for sensitive skin. Gentle formula.', 14.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 189, 'PETS-028'),
('Toothbrush Pet', 'Pet toothbrush with pet-safe toothpaste. Oral care.', 9.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 267, 'PETS-029'),
('Ear Cleaner Pet', 'Pet ear cleaning solution with applicator. Gentle and safe.', 11.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 198, 'PETS-030'),

-- Training & Behavior
('Clicker Training', 'Pet training clicker with wrist strap. Positive reinforcement.', 7.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 289, 'PETS-031'),
('Training Treats', 'High-value training treats for dogs. Small size perfect for training.', 14.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 234, 'PETS-032'),
('Potty Training Pads', 'Absorbent potty training pads for puppies. Pack of 100.', 19.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 178, 'PETS-033'),
('Training Guide Book', 'Complete pet training guide book. Step-by-step instructions.', 24.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop', 156, 'PETS-034'),
('Anti-Bark Device', 'Ultrasonic anti-bark device. Humane training tool.', 34.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 123, 'PETS-035'),

-- Health & Wellness
('Automatic Pet Feeder', 'Programmable automatic pet feeder with portion control. Perfect for busy owners.', 89.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 34, 'PETS-036'),
('Water Fountain Pet', 'Automatic pet water fountain. Keeps water fresh and flowing.', 49.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 87, 'PETS-037'),
('Pet First Aid Kit', 'Complete pet first aid kit with essentials. Emergency preparedness.', 34.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 134, 'PETS-038'),
('Flea & Tick Treatment', 'Monthly flea and tick prevention treatment. 6-month supply.', 39.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 145, 'PETS-039'),
('Pet Supplements', 'Joint support supplements for dogs. Promotes mobility.', 29.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 167, 'PETS-040'),

-- Litter & Waste
('Cat Litter Premium', 'Clumping cat litter with odor control. 20lb bag.', 22.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=600&fit=crop', 189, 'PETS-041'),
('Litter Box Enclosed', 'Enclosed litter box with privacy door. Reduces odor.', 39.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=600&fit=crop', 98, 'PETS-042'),
('Litter Scoop', 'Heavy-duty litter scoop with ergonomic handle.', 9.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=600&fit=crop', 234, 'PETS-043'),
('Waste Bags', 'Biodegradable dog waste bags. Pack of 120.', 12.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 198, 'PETS-044'),
('Poo Bag Dispenser', 'Convenient poo bag dispenser with attachment. Clip to leash.', 14.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 178, 'PETS-045'),

-- Accessories
('Pet ID Tag', 'Engraved pet ID tag with contact information.', 9.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 267, 'PETS-046'),
('Pet Camera', 'Wi-Fi pet camera with treat dispenser. Monitor remotely.', 149.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 67, 'PETS-047'),
('GPS Tracker Pet', 'GPS tracker collar for pets. Real-time location tracking.', 79.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 54, 'PETS-048'),
('Pet Stroller', 'Comfortable pet stroller for walks. Folds for storage.', 89.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=600&h=600&fit=crop', 45, 'PETS-049'),
('Pet Gate', 'Adjustable pet gate for doorways. Safety and boundaries.', 49.99, 'Pet Supplies', 'https://images.unsplash.com/photo-1589924691995-877dc69d7a5a?w=600&h=600&fit=crop', 98, 'PETS-050');

-- ==============================================
-- OTHER ESSENTIALS CATEGORY - 50 PRODUCTS
-- ==============================================

INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku) VALUES

-- Travel Essentials
('Travel Backpack', 'Durable 40L travel backpack with laptop compartment and compression straps. Perfect for trips.', 89.99, 'Other Essentials', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', 56, 'ESSN-001'),
('Packing Cubes Set', 'Set of 4 packing cubes in different sizes. Organize your luggage efficiently.', 29.99, 'Other Essentials', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', 71, 'ESSN-002'),
('Digital Luggage Scale', 'Handheld digital luggage scale with LCD display. Avoid overweight fees.', 18.99, 'Other Essentials', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=600&fit=crop', 103, 'ESSN-003'),
('Travel Adapter Universal', 'Universal travel adapter with 4 USB ports. Works in 150+ countries.', 24.99, 'Other Essentials', 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop', 89, 'ESSN-004'),
('Portable Phone Stand', 'Adjustable aluminum phone stand for desk or travel. Compatible with all phones.', 14.99, 'Other Essentials', 'https://images.unsplash.com/photo-1595925961061-6dc2b06e3b92?w=600&h=600&fit=crop', 127, 'ESSN-005'),

-- Car Accessories
('Car Phone Mount', 'Magnetic car phone mount with 360-degree rotation. Strong hold on any surface.', 19.99, 'Other Essentials', 'https://images.unsplash.com/photo-1595925961061-6dc2b06e3b92?w=600&h=600&fit=crop', 94, 'ESSN-006'),
('Emergency Car Kit', 'Complete emergency kit with jumper cables, flashlight, and first aid supplies.', 59.99, 'Other Essentials', 'https://images.unsplash.com/photo-1619119994738-d196e6599117?w=600&h=600&fit=crop', 45, 'ESSN-007'),
('Car Charger Fast', 'Dual USB fast car charger with 2.4A output. Charge devices quickly.', 12.99, 'Other Essentials', 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop', 234, 'ESSN-008'),
('Car Air Freshener', 'Long-lasting car air freshener. Multiple scents available.', 9.99, 'Other Essentials', 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop', 289, 'ESSN-009'),
('Steering Wheel Cover', 'Non-slip steering wheel cover. Comfortable grip.', 16.99, 'Other Essentials', 'https://images.unsplash.com/photo-1619119994738-d196e6599117?w=600&h=600&fit=crop', 178, 'ESSN-010'),

-- Tools & Hardware
('Multi-Tool Pocket Knife', 'Compact multi-tool with 12 functions. Essential for outdoor adventures.', 34.99, 'Other Essentials', 'https://images.unsplash.com/photo-1591539690158-0f0b0cca9e5b?w=600&h=600&fit=crop', 62, 'ESSN-011'),
('Tool Set Basic', 'Essential tool set for home repairs. 20-piece set.', 49.99, 'Other Essentials', 'https://images.unsplash.com/photo-1591539690158-0f0b0cca9e5b?w=600&h=600&fit=crop', 87, 'ESSN-012'),
('Flashlight LED', 'Bright LED flashlight with rechargeable battery. 1000 lumens.', 19.99, 'Other Essentials', 'https://images.unsplash.com/photo-1619119994738-d196e6599117?w=600&h=600&fit=crop', 167, 'ESSN-013'),
('Tape Measure', 'Professional tape measure with magnetic hook. 25ft.', 14.99, 'Other Essentials', 'https://images.unsplash.com/photo-1591539690158-0f0b0cca9e5b?w=600&h=600&fit=crop', 198, 'ESSN-014'),
('Screwdriver Set', 'Magnetic screwdriver set with multiple bits.', 24.99, 'Other Essentials', 'https://images.unsplash.com/photo-1591539690158-0f0b0cca9e5b?w=600&h=600&fit=crop', 145, 'ESSN-015'),

-- Safety & Emergency
('Solar Power Bank', 'Eco-friendly solar power bank with built-in flashlight. Charge your devices anywhere.', 44.99, 'Other Essentials', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop', 51, 'ESSN-016'),
('First Aid Kit Compact', 'Compact first aid kit with essential supplies. Perfect for home, car, or travel.', 29.99, 'Other Essentials', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=600&fit=crop', 78, 'ESSN-017'),
('Fire Extinguisher', 'Home fire extinguisher. ABC rated for all fire types.', 39.99, 'Other Essentials', 'https://images.unsplash.com/photo-1619119994738-d196e6599117?w=600&h=600&fit=crop', 98, 'ESSN-018'),
('Smoke Detector', 'Battery-powered smoke detector with test button.', 19.99, 'Other Essentials', 'https://images.unsplash.com/photo-1619119994738-d196e6599117?w=600&h=600&fit=crop', 156, 'ESSN-019'),
('Emergency Whistle', 'Loud emergency whistle for safety. Metal construction.', 7.99, 'Other Essentials', 'https://images.unsplash.com/photo-1619119994738-d196e6599117?w=600&h=600&fit=crop', 234, 'ESSN-020'),

-- Storage & Organization
('Storage Bins', 'Clear storage bins with lids. Stackable design.', 12.99, 'Other Essentials', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 267, 'ESSN-021'),
('Closet Organizer', 'Modular closet organizer system. Maximize space.', 39.99, 'Other Essentials', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 123, 'ESSN-022'),
('Shoe Organizer', 'Over-door shoe organizer with 24 pockets.', 24.99, 'Other Essentials', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 178, 'ESSN-023'),
('Jewelry Organizer', 'Deluxe jewelry organizer with compartments. Keeps jewelry tangle-free.', 29.99, 'Other Essentials', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 134, 'ESSN-024'),
('Cable Organizer', 'Cable management system for electronics. Clean setup.', 16.99, 'Other Essentials', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 189, 'ESSN-025'),

-- Household Supplies
('Trash Bags', 'Heavy-duty trash bags pack of 75. 13-gallon size.', 14.99, 'Other Essentials', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 345, 'ESSN-026'),
('Paper Towels', 'Absorbent paper towels pack of 12 rolls.', 24.99, 'Other Essentials', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 234, 'ESSN-027'),
('Toilet Paper', 'Soft toilet paper pack of 24 rolls.', 29.99, 'Other Essentials', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 267, 'ESSN-028'),
('Laundry Detergent', 'Concentrated laundry detergent. 150 loads.', 34.99, 'Other Essentials', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 198, 'ESSN-029'),
('Dish Soap', 'Premium dish soap with antibacterial properties. 24oz.', 7.99, 'Other Essentials', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 289, 'ESSN-030'),

-- Hardware & Maintenance
('Command Strips', 'Damage-free hanging strips. Pack of 12.', 9.99, 'Other Essentials', 'https://images.unsplash.com/photo-1591539690158-0f0b0cca9e5b?w=600&h=600&fit=crop', 267, 'ESSN-031'),
('Duct Tape', 'Heavy-duty duct tape for repairs. 2 rolls.', 11.99, 'Other Essentials', 'https://images.unsplash.com/photo-1591539690158-0f0b0cca9e5b?w=600&h=600&fit=crop', 234, 'ESSN-032'),
('Light Bulbs LED', 'Energy-efficient LED light bulbs pack of 6. Long-lasting.', 24.99, 'Other Essentials', 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=600&h=600&fit=crop', 189, 'ESSN-033'),
('Extension Cord', 'Heavy-duty extension cord. 25ft length.', 19.99, 'Other Essentials', 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop', 167, 'ESSN-034'),
('Batteries Pack', 'Long-lasting batteries pack of 24. AA and AAA.', 19.99, 'Other Essentials', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop', 234, 'ESSN-035'),

-- Office & Desk
('Desk Pad Mouse', 'Large desk pad with mouse area. Smooth surface.', 19.99, 'Other Essentials', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 198, 'ESSN-036'),
('Cable Management Box', 'Desktop cable organizer box. Keeps cords tidy.', 24.99, 'Other Essentials', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 156, 'ESSN-037'),
('Pen Holder', 'Modern pen holder for desk organization.', 9.99, 'Other Essentials', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 234, 'ESSN-038'),
('Stapler Heavy Duty', 'Professional stapler with 1000 staples capacity.', 19.99, 'Other Essentials', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 167, 'ESSN-039'),
('Paper Clips Set', 'Assorted paper clips in multiple sizes. Pack of 500.', 7.99, 'Other Essentials', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 289, 'ESSN-040'),

-- Outdoor & Camping
('Camping Tent', '4-person camping tent with rainfly. Easy setup.', 149.99, 'Other Essentials', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 56, 'ESSN-041'),
('Sleeping Bag', 'Mummy sleeping bag rated for cold weather. Compression sack included.', 79.99, 'Other Essentials', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 67, 'ESSN-042'),
('Camping Chair', 'Compact folding camping chair. Supports 300 lbs.', 34.99, 'Other Essentials', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 89, 'ESSN-043'),
('Headlamp LED', 'Bright LED headlamp for hands-free lighting. 200 lumens.', 34.99, 'Other Essentials', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 156, 'ESSN-044'),
('Cooler Portable', 'Hard-sided cooler with wheels. Keeps food cold for days.', 89.99, 'Other Essentials', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 78, 'ESSN-045'),

-- Miscellaneous
('Umbrella Compact', 'Windproof compact umbrella. Fits in purse or backpack.', 19.99, 'Other Essentials', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 198, 'ESSN-046'),
('Key Finder', 'Bluetooth key finder with app. Never lose keys again.', 24.99, 'Other Essentials', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop', 167, 'ESSN-047'),
('Luggage Tag', 'Durable luggage tag with contact information.', 7.99, 'Other Essentials', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', 234, 'ESSN-048'),
('Money Clip', 'Slim metal money clip with card holder. Compact and secure.', 14.99, 'Other Essentials', 'https://images.unsplash.com/photo-1624222247344-550fb60583fd?w=600&h=600&fit=crop', 234, 'ESSN-049'),
('Water Bottle Insulated', 'Stainless steel water bottle keeps drinks cold for 24 hours. BPA-free.', 24.99, 'Other Essentials', 'https://images.unsplash.com/photo-1602143407151-7e406dc6ffde?w=600&h=600&fit=crop', 138, 'ESSN-050');

