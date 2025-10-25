-- Complete Products Setup - All Categories Combined
-- Run this script in Supabase SQL Editor
-- This script will clear all products and add Baby, Food, and Electronics category products

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

-- Step 3: Insert all category products
INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku, is_active, tags) VALUES

-- ============================================
-- BABY CATEGORY PRODUCTS (14 products)
-- ============================================
('Baby Boy Gift Bouquet', 'Beautiful gift set featuring foil balloon, plush giraffe toy, knitted bear booties, baby socks, nasal aspirator, and baby bottle. Perfect for celebrating a new baby boy!', 79.99, 'Baby', '/placeholder.svg?height=400&width=400', 50, 'BABY-BOY-GIFT-001', true, ARRAY['gift set', 'baby boy', 'newborn', 'toys', 'clothing']),
('Interactive Baby Bath Tub Set', 'Complete bath time experience with tub, water-spraying crab toy, sunflower shower toy, fishing rod toy, floating turtle toys, and colorful bath balls. Makes bath time fun!', 59.99, 'Baby', '/placeholder.svg?height=400&width=400', 30, 'BABY-BATH-TUB-001', true, ARRAY['bath', 'toys', 'interactive', 'bath time']),
('Johnson''s Baby Care Collection', 'Gentle skincare set featuring baby cream, baby bath, and baby lotion. Formulated with milk and rice for delicate baby skin. Complete skincare routine.', 24.99, 'Baby', '/placeholder.svg?height=400&width=400', 100, 'JOHNSONS-BABY-SET-001', true, ARRAY['skincare', 'bath', 'lotion', 'gentle']),
('Personalized Baby Bathrobe Set', 'Luxurious soft bathrobes perfect for after bath time. Available with personalization options for names like Sophia, Matthew, or Kinsley. Terry cloth material.', 34.99, 'Baby', '/placeholder.svg?height=400&width=400', 75, 'BABY-BATHROBE-001', true, ARRAY['bathrobe', 'personalized', 'soft', 'terry cloth']),
('Stylish Diaper Bag Backpack', 'Multi-functional navy blue diaper bag with spacious compartments, side pockets for bottles, and multiple carrying options. Perfect for on-the-go parents.', 49.99, 'Baby', '/placeholder.svg?height=400&width=400', 40, 'DIAPER-BAG-001', true, ARRAY['diaper bag', 'backpack', 'travel', 'organization']),
('Nestle Nestum Rice Cereal', 'Organic rice cream cereal without gluten, fortified with iron, zinc, and vitamins A & C. Suitable from 4 months. No added sugars, easy digestion.', 12.99, 'Baby', '/placeholder.svg?height=400&width=400', 150, 'NESTUM-RICE-001', true, ARRAY['cereal', 'organic', 'gluten-free', 'nutrition']),
('Nestle Golden Morn Cereal', 'Fortified maize and soya protein cereal for growing kids. Rich in nutrients and delicious taste. Net weight 900g.', 8.99, 'Baby', '/placeholder.svg?height=400&width=400', 200, 'GOLDEN-MORN-001', true, ARRAY['cereal', 'protein', 'nutrition', 'kid-friendly']),
('Mustela Newborn Arrival Gift Set', 'Complete natural skincare set for delicate newborn skin. Includes gentle shampoo, cleansing gel, cleansing water, body lotion, and diaper rash cream with avocado.', 45.99, 'Baby', '/placeholder.svg?height=400&width=400', 60, 'MUSTELA-NEWBORN-001', true, ARRAY['newborn', 'skincare', 'natural', 'gift set']),
('Momcozy Wearable Breast Pump', 'Compact, hands-free wearable breast pump system with matching carrying case. Portable design for modern moms on the go.', 89.99, 'Baby', '/placeholder.svg?height=400&width=400', 25, 'MOMCOZY-PUMP-001', true, ARRAY['breast pump', 'wearable', 'portable', 'feeding']),
('Nestle Tropical Fruits Baby Food', 'Stage 2 baby food featuring tropical fruits like banana, mango, and pineapple. No added sugar, suitable from 6 months. 120g jar.', 4.99, 'Baby', '/placeholder.svg?height=400&width=400', 250, 'NESTLE-FRUITS-001', true, ARRAY['baby food', 'fruits', 'stage 2', 'no sugar']),
('Thule Luxe Baby Stroller', 'Premium three-wheel stroller with cream bassinet and black frame. Features adjustable handlebar, spacious storage basket, and smooth-riding wheels.', 349.99, 'Baby', '/placeholder.svg?height=400&width=400', 15, 'THULE-STROLLER-001', true, ARRAY['stroller', 'bassinet', 'premium', 'travel']),
('Modern Baby Bouncer Swing', 'Elegant baby bouncer with plush padding, 5-point safety harness, overhead mobile with star and moon toys, and electronic controls for soothing motion.', 199.99, 'Baby', '/placeholder.svg?height=400&width=400', 20, 'BABY-BOUNCER-001', true, ARRAY['bouncer', 'swing', 'safety', 'entertainment']),
('Nestle Nido FortiGrow Milk Powder', 'Instant full cream milk powder fortified with high-quality proteins, iron, Vitamin C, calcium, and Vitamin D. Net weight 2500g. Perfect for growing children.', 28.99, 'Baby', '/placeholder.svg?height=400&width=400', 80, 'NIDO-FORTIGROW-001', true, ARRAY['milk powder', 'nutrition', 'fortified', 'calcium']),
('Nestle Cerelac Kids Multicereals & Fruits', 'Delicious cereal with fruit crunchies for kids 3 years and up. Contains wheat, strawberries, mango, banana, and berries. 380g can.', 10.99, 'Baby', '/placeholder.svg?height=400&width=400', 120, 'CERELAC-KIDS-001', true, ARRAY['cereal', 'kids', 'fruits', 'crunchies']),

-- ============================================
-- FOOD CATEGORY PRODUCTS (21 products)
-- ============================================
('Oreo Milkshake', 'Creamy white milkshake heavily speckled with crushed Oreo cookies, topped with whipped cream and whole Oreo cookies. Served in a tall glass with silver and paper straws.', 8.99, 'Food', '/placeholder.svg?height=400&width=400', 100, 'MILKSHAKE-OREO-001', true, ARRAY['milkshake', 'dessert', 'oreo', 'drink']),
('Jollof Rice with Grilled Chicken', 'Traditional West African orange-red tomato-based rice with green peas and diced bell peppers, served with three pieces of grilled chicken drumsticks. Garnished with parsley and lime.', 14.99, 'Food', '/placeholder.svg?height=400&width=400', 80, 'JOLLOF-CHICKEN-001', true, ARRAY['jollof rice', 'chicken', 'african', 'spicy']),
('Cajun Seafood Boil Platter', 'Generous seafood feast featuring bright orange crab legs, large shrimp, corn on the cob, smoked sausage, potatoes, and hard-boiled eggs. All drenched in spicy Cajun sauce with dipping sauces.', 45.99, 'Food', '/placeholder.svg?height=400&width=400', 50, 'SEAFOOD-BOIL-001', true, ARRAY['seafood', 'cajun', 'crab', 'shrimp', 'spicy']),
('Sprite Soda', 'Refreshing lemon-lime carbonated soft drink. Ice cold and bubbly with crisp citrus flavor. Perfect for any occasion.', 2.99, 'Food', '/placeholder.svg?height=400&width=400', 200, 'DRINK-SPRITE-001', true, ARRAY['soda', 'lemon-lime', 'drink', 'cold']),
('Tropical Strawberry Drink', 'Sparkling reddish-pink strawberry beverage filled with ice cubes, garnished with fresh strawberries. Served in a stemmed glass with tropical beach vibes.', 6.99, 'Food', '/placeholder.svg?height=400&width=400', 120, 'DRINK-STRAWBERRY-001', true, ARRAY['strawberry', 'carbonated', 'drink', 'fruity']),
('Waakye Rice Bowl', 'Traditional Ghanaian rice and beans dish with fried plantains, tomato stew, shito pepper sauce, gari foto, and boiled egg. Garnished with fresh lettuce leaves.', 12.99, 'Food', '/placeholder.svg?height=400&width=400', 90, 'WAAKYE-BOWL-001', true, ARRAY['waakye', 'african', 'rice', 'plantains', 'traditional']),
('Grilled Fish with Red Sauce', 'Whole grilled fish generously coated in chunky tomato-based sauce with diced tomatoes, onions, and bell peppers. Served with crinkle-cut fries and extra sauce on the side.', 18.99, 'Food', '/placeholder.svg?height=400&width=400', 60, 'FISH-GRILLED-001', true, ARRAY['fish', 'grilled', 'spicy', 'fries']),
('Grilled Chicken with Yuca Fries', 'Succulent grilled chicken thigh and drumstick with crispy golden-brown skin. Served with thick-cut fried yuca sticks and a fresh green chimichurri sauce.', 15.99, 'Food', '/placeholder.svg?height=400&width=400', 85, 'CHICKEN-YUCA-001', true, ARRAY['chicken', 'grilled', 'yuca', 'latin']),
('Fried Yam and Peppered Gizzard', 'Crispy golden fried yam pieces served with spicy peppered gizzard mixed with colorful bell peppers, onions, and sausage pieces in a rich savory sauce.', 13.99, 'Food', '/placeholder.svg?height=400&width=400', 75, 'YAM-GIZZARD-001', true, ARRAY['yam', 'gizzard', 'spicy', 'nigerian']),
('Grilled Chicken with Spaghetti', 'Large piece of grilled chicken thigh over a bed of spaghetti mixed with diced red bell peppers and fresh herbs. Perfectly seasoned and served hot.', 16.99, 'Food', '/placeholder.svg?height=400&width=400', 95, 'CHICKEN-SPAGHETTI-001', true, ARRAY['chicken', 'spaghetti', 'italian', 'grilled']),
('Grilled Chicken Skewers with Yam Fries', 'Four succulent grilled chicken skewers with bell peppers, served on fresh arugula. Accompanied by thick-cut fried yam fries and a chunky tomato relish.', 17.99, 'Food', '/placeholder.svg?height=400&width=400', 70, 'SKEWERS-YAM-001', true, ARRAY['chicken', 'skewers', 'grilled', 'yam']),
('Colorful Fried Rice', 'Aromatic fried rice with rich orange-red hue, mixed with bright green peas, green beans, red bell peppers, and fresh herbs. Garnished with parsley sprig.', 11.99, 'Food', '/placeholder.svg?height=400&width=400', 100, 'FRIED-RICE-001', true, ARRAY['fried rice', 'vegetables', 'asian', 'colorful']),
('Lemon Pie Slice', 'Decadent lemon cheesecake with smooth pale yellow filling, golden-brown graham cracker crust, topped with whipped cream swirls and lemon zest. Garnished with fresh lemon slice.', 7.99, 'Food', '/placeholder.svg?height=400&width=400', 150, 'DESSERT-LEMON-PIE-001', true, ARRAY['lemon', 'pie', 'dessert', 'creamy']),
('Coca-Cola', 'Classic refreshing cola beverage. Ice cold with the iconic flavor everyone loves. Perfect with any meal.', 2.99, 'Food', '/placeholder.svg?height=400&width=400', 300, 'DRINK-COKE-001', true, ARRAY['cola', 'soda', 'drink', 'classic']),
('Steamed Crab', 'Large succulent crab cooked to perfection, generously seasoned with herbs and spices. Served with lemon slices and fresh dill garnish. A seafood delight!', 28.99, 'Food', '/placeholder.svg?height=400&width=400', 40, 'CRAB-STEAMED-001', true, ARRAY['crab', 'seafood', 'steamed', 'fresh']),
('Rainbow Sprinkled Cupcake', 'Vanilla cupcake with pink ruffled liner, topped with smooth off-white and light pink frosting swirls. Heavily decorated with colorful sprinkles in red, orange, yellow, green, blue, purple, pink, and white.', 4.99, 'Food', '/placeholder.svg?height=400&width=400', 200, 'CUPCAKE-SPRINKLES-001', true, ARRAY['cupcake', 'dessert', 'sprinkles', 'birthday']),
('Double Chocolate Brownies', 'Two rich, dense fudgy brownies with crinkled glossy tops and dark chocolate flavor. Stacked on a white plate, ready to indulge your sweet tooth.', 5.99, 'Food', '/placeholder.svg?height=400&width=400', 180, 'BROWNIES-DOUBLE-001', true, ARRAY['brownies', 'chocolate', 'dessert', 'fudgy']),
('Fanta Orange Soda', 'Vibrant orange carbonated soft drink with 100% natural flavors. Caffeine-free and bursting with refreshing citrus taste.', 2.99, 'Food', '/placeholder.svg?height=400&width=400', 250, 'DRINK-FANTA-001', true, ARRAY['orange', 'soda', 'drink', 'fruity']),
('Tropical Sunrise Cocktail', 'Bright orange-red cocktail with citrus flavors, served over ice in a stemmed glass. Garnished with lemon slice, fresh mint leaves, and a black straw.', 9.99, 'Food', '/placeholder.svg?height=400&width=400', 110, 'COCKTAIL-TROPICAL-001', true, ARRAY['cocktail', 'alcoholic', 'tropical', 'refreshing']),
('Glazed Chicken Wings', 'Approximately 10-12 succulent chicken wings coated in thick, glossy, sticky sweet glaze with a hint of spice. Perfect crispy skin and tender meat.', 13.99, 'Food', '/placeholder.svg?height=400&width=400', 130, 'WINGS-GLAZED-001', true, ARRAY['chicken wings', 'glazed', 'spicy', 'american']),
('Caramel Cheesecake Slice', 'Rich, creamy cheesecake slice with smooth pale yellow filling and graham cracker crust. Generously drizzled with golden caramel sauce, topped with whipped cream swirl and biscuit crumbles.', 8.99, 'Food', '/placeholder.svg?height=400&width=400', 140, 'CHEESECAKE-CARAMEL-001', true, ARRAY['cheesecake', 'caramel', 'dessert', 'indulgent']),

-- ============================================
-- ELECTRONICS CATEGORY PRODUCTS (28 products)
-- ============================================
('Braided USB 3.0 Cable', 'Premium braided USB 3.0 cable with gold-plated connectors. Features both USB-A and USB-C ends for versatile connectivity.', 12.99, 'Electronics', '/placeholder.svg?height=400&width=400', 150, 'ELEC-USB-CABLE-001', true, ARRAY['usb cable', 'charging', 'data transfer', 'braided']),
('Multi-Port USB Charger Hub', '10-port USB charger hub with 8x 5V/2.4A ports and 2x 5V/1A ports. Perfect for charging multiple devices simultaneously.', 29.99, 'Electronics', '/placeholder.svg?height=400&width=400', 100, 'ELEC-CHARGER-HUB-001', true, ARRAY['usb charger', 'multi-port', 'charging station', 'hub']),
('MicroSD Card 16GB Class 10', 'High-speed microSD card with Class 10 rating and UHS Speed Class 1 (U1). Perfect for smartphones, cameras, and tablets.', 9.99, 'Electronics', '/placeholder.svg?height=400&width=400', 200, 'ELEC-MICROSD-16GB-001', true, ARRAY['microsd', 'memory card', 'storage', 'class 10']),
('SD Card 512GB Ultra Fast', 'Massive 512GB SD card with blazing fast 170MB/s read speeds. Ideal for professional photography and 4K video recording.', 89.99, 'Electronics', '/placeholder.svg?height=400&width=400', 50, 'ELEC-SD-512GB-001', true, ARRAY['sd card', 'storage', '512gb', 'photography']),
('MicroSD Card 128GB Pro', 'Professional grade 128GB microSD card with high-speed performance for action cameras and drones.', 24.99, 'Electronics', '/placeholder.svg?height=400&width=400', 80, 'ELEC-MICROSD-128GB-001', true, ARRAY['microsd', '128gb', 'storage', 'professional']),
('Nokia BL-5C Mobile Phone Battery', 'Original Nokia BL-5C rechargeable battery with reliable power for Nokia feature phones.', 19.99, 'Electronics', '/placeholder.svg?height=400&width=400', 60, 'ELEC-BATTERY-NOKIA-001', true, ARRAY['battery', 'nokia', 'mobile phone', 'rechargeable']),
('Beikell USB 3.0 Card Reader with SD/MicroSD', 'Dual USB-C and USB-A card reader with USB 3.0 speeds. Includes 512GB SD card and 128GB microSD card.', 69.99, 'Electronics', '/placeholder.svg?height=400&width=400', 40, 'ELEC-CARDREADER-001', true, ARRAY['card reader', 'usb 3.0', 'usb-c', 'sd card', 'microsd']),
('JBL Wireless Earbuds Pro', 'True wireless earbuds with active noise cancellation, powerful bass, and IPX7 waterproof rating. Includes charging case.', 129.99, 'Electronics', '/placeholder.svg?height=400&width=400', 90, 'ELEC-JBL-EARBUDS-001', true, ARRAY['earbuds', 'wireless', 'jbl', 'noise cancelling', 'waterproof']),
('Hitage Wireless Neckband Earphones', 'Stylish black and blue wireless neckband earphones with clear audio and comfortable fit. Perfect for sports and daily use.', 39.99, 'Electronics', '/placeholder.svg?height=400&width=400', 120, 'ELEC-NECKBAND-001', true, ARRAY['earphones', 'wireless', 'neckband', 'bluetooth', 'sports']),
('JBL Tune 710BT Wireless Headphones', 'Over-ear wireless headphones with JBL Pure Bass Sound, 50-hour battery life, and multi-point connection.', 79.99, 'Electronics', '/placeholder.svg?height=400&width=400', 70, 'ELEC-JBL-HEADPHONES-001', true, ARRAY['headphones', 'over-ear', 'wireless', 'jbl', 'audio']),
('JBL Flip 6 Portable Waterproof Speaker', 'Powerful portable speaker with rich bass, IP67 waterproof and dustproof rating, and 12 hours of playtime.', 129.95, 'Electronics', '/placeholder.svg?height=400&width=400', 85, 'ELEC-JBL-FLIP6-001', true, ARRAY['speaker', 'portable', 'waterproof', 'bluetooth', 'jbl']),
('Nokia 105 Feature Phone', 'Classic durable Nokia feature phone with long battery life, essential calling and texting capabilities.', 29.99, 'Electronics', '/placeholder.svg?height=400&width=400', 100, 'ELEC-NOKIA-105-001', true, ARRAY['feature phone', 'nokia', 'basic phone', 'mobile']),
('Redmi 5G Smartphone', 'Premium 5G smartphone with 48MP AI camera, vibrant display, and powerful performance.', 349.99, 'Electronics', '/placeholder.svg?height=400&width=400', 45, 'ELEC-REDMI-5G-001', true, ARRAY['smartphone', '5g', 'redmi', 'mobile phone', 'camera']),
('Smartwatch Fitness Tracker', 'Advanced smartwatch with heart rate monitoring, activity tracking, GPS, and health metrics. Compatible with iOS and Android.', 99.99, 'Electronics', '/placeholder.svg?height=400&width=400', 110, 'ELEC-SMARTWATCH-001', true, ARRAY['smartwatch', 'fitness tracker', 'wearable', 'health', 'gps']),
('Huawei Mobile Wi-Fi Hotspot', 'Portable 4G LTE Wi-Fi hotspot supporting up to 32 devices. Perfect for travel and remote work with reliable connectivity.', 79.99, 'Electronics', '/placeholder.svg?height=400&width=400', 30, 'ELEC-WIFI-HOTSPOT-001', true, ARRAY['wifi hotspot', 'mobile wifi', 'huawei', '4g', 'portable']),
('9D Edge-to-Edge Glass Shield Screen Protector', 'Premium tempered glass screen protector with full edge-to-edge coverage and maximum protection against scratches and impacts.', 24.99, 'Electronics', '/placeholder.svg?height=400&width=400', 180, 'ELEC-SCREEN-GUARD-001', true, ARRAY['screen protector', 'tempered glass', 'protection', 'phone accessory']),
('Ultra-Slim Laptop 15-inch', 'Premium ultra-slim laptop with high-resolution display, fast processor, and all-day battery life. Perfect for work and entertainment.', 899.99, 'Electronics', '/placeholder.svg?height=400&width=400', 25, 'ELEC-LAPTOP-001', true, ARRAY['laptop', 'computer', 'ultrabook', 'portable']),
('Gaming Console Next-Gen', 'Next-generation gaming console with stunning graphics, fast loading times, and exclusive game library.', 499.99, 'Electronics', '/placeholder.svg?height=400&width=400', 35, 'ELEC-GAMING-CONSOLE-001', true, ARRAY['gaming', 'console', 'video games', 'entertainment']),
('55-inch 4K Ultra HD Smart TV', 'Immersive 55-inch Smart TV with 4K resolution, HDR, voice control, and streaming apps built-in.', 699.99, 'Electronics', '/placeholder.svg?height=400&width=400', 20, 'ELEC-SMART-TV-001', true, ARRAY['smart tv', '4k', 'television', 'home entertainment']),
('Wireless Mouse and Keyboard Combo', 'Ergonomic wireless mouse and keyboard combo with long battery life and reliable connection.', 49.99, 'Electronics', '/placeholder.svg?height=400&width=400', 95, 'ELEC-MOUSE-KEYBOARD-001', true, ARRAY['mouse', 'keyboard', 'wireless', 'computer accessory']),
('Smart Home Hub', 'Central smart home hub to control lights, thermostats, security, and all your smart devices from one app.', 89.99, 'Electronics', '/placeholder.svg?height=400&width=400', 55, 'ELEC-SMART-HUB-001', true, ARRAY['smart home', 'hub', 'automation', 'iot']),
('Portable Power Bank 20000mAh', 'High-capacity portable power bank with fast charging for smartphones, tablets, and laptops.', 39.99, 'Electronics', '/placeholder.svg?height=400&width=400', 130, 'ELEC-POWERBANK-001', true, ARRAY['power bank', 'portable charger', 'battery', 'charging']),
('4K Action Camera with Waterproof Case', 'Compact 4K action camera with image stabilization, waterproof housing, and multiple mounting options.', 149.99, 'Electronics', '/placeholder.svg?height=400&width=400', 40, 'ELEC-ACTION-CAM-001', true, ARRAY['action camera', '4k', 'waterproof', 'adventure', 'photography']),
('E-Reader with Backlight', 'High-resolution e-reader with adjustable backlight, long battery life, and access to millions of books.', 119.99, 'Electronics', '/placeholder.svg?height=400&width=400', 65, 'ELEC-EREADER-001', true, ARRAY['e-reader', 'books', 'reading', 'tablet']),
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

