-- Complete Food Products Setup
-- Run this script in Supabase SQL Editor
-- This script will clear all products and add food category products

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

-- Step 3: Insert food category products
INSERT INTO public.products (name, description, price, category, image_url, stock_quantity, sku, is_active, tags) VALUES

-- Oreo Milkshake
('Oreo Milkshake', 'Creamy white milkshake heavily speckled with crushed Oreo cookies, topped with whipped cream and whole Oreo cookies. Served in a tall glass with silver and paper straws.', 8.99, 'Food', '/placeholder.svg?height=400&width=400', 100, 'MILKSHAKE-OREO-001', true, ARRAY['milkshake', 'dessert', 'oreo', 'drink']),

-- Jollof Rice with Grilled Chicken
('Jollof Rice with Grilled Chicken', 'Traditional West African orange-red tomato-based rice with green peas and diced bell peppers, served with three pieces of grilled chicken drumsticks. Garnished with parsley and lime.', 14.99, 'Food', '/placeholder.svg?height=400&width=400', 80, 'JOLLOF-CHICKEN-001', true, ARRAY['jollof rice', 'chicken', 'african', 'spicy']),

-- Seafood Boil
('Cajun Seafood Boil Platter', 'Generous seafood feast featuring bright orange crab legs, large shrimp, corn on the cob, smoked sausage, potatoes, and hard-boiled eggs. All drenched in spicy Cajun sauce with dipping sauces.', 45.99, 'Food', '/placeholder.svg?height=400&width=400', 50, 'SEAFOOD-BOIL-001', true, ARRAY['seafood', 'cajun', 'crab', 'shrimp', 'spicy']),

-- Sprite Soda
('Sprite Soda', 'Refreshing lemon-lime carbonated soft drink. Ice cold and bubbly with crisp citrus flavor. Perfect for any occasion.', 2.99, 'Food', '/placeholder.svg?height=400&width=400', 200, 'DRINK-SPRITE-001', true, ARRAY['soda', 'lemon-lime', 'drink', 'cold']),

-- Strawberry Drink
('Tropical Strawberry Drink', 'Sparkling reddish-pink strawberry beverage filled with ice cubes, garnished with fresh strawberries. Served in a stemmed glass with tropical beach vibes.', 6.99, 'Food', '/placeholder.svg?height=400&width=400', 120, 'DRINK-STRAWBERRY-001', true, ARRAY['strawberry', 'carbonated', 'drink', 'fruity']),

-- Waakye Rice Bowl
('Waakye Rice Bowl', 'Traditional Ghanaian rice and beans dish with fried plantains, tomato stew, shito pepper sauce, gari foto, and boiled egg. Garnished with fresh lettuce leaves.', 12.99, 'Food', '/placeholder.svg?height=400&width=400', 90, 'WAAKYE-BOWL-001', true, ARRAY['waakye', 'african', 'rice', 'plantains', 'traditional']),

-- Whole Fish with Sauce
('Grilled Fish with Red Sauce', 'Whole grilled fish generously coated in chunky tomato-based sauce with diced tomatoes, onions, and bell peppers. Served with crinkle-cut fries and extra sauce on the side.', 18.99, 'Food', '/placeholder.svg?height=400&width=400', 60, 'FISH-GRILLED-001', true, ARRAY['fish', 'grilled', 'spicy', 'fries']),

-- Grilled Chicken with Fried Yuca
('Grilled Chicken with Yuca Fries', 'Succulent grilled chicken thigh and drumstick with crispy golden-brown skin. Served with thick-cut fried yuca sticks and a fresh green chimichurri sauce.', 15.99, 'Food', '/placeholder.svg?height=400&width=400', 85, 'CHICKEN-YUCA-001', true, ARRAY['chicken', 'grilled', 'yuca', 'latin']),

-- Fried Yam and Peppered Gizzard
('Fried Yam and Peppered Gizzard', 'Crispy golden fried yam pieces served with spicy peppered gizzard mixed with colorful bell peppers, onions, and sausage pieces in a rich savory sauce.', 13.99, 'Food', '/placeholder.svg?height=400&width=400', 75, 'YAM-GIZZARD-001', true, ARRAY['yam', 'gizzard', 'spicy', 'nigerian']),

-- Chicken and Spaghetti
('Grilled Chicken with Spaghetti', 'Large piece of grilled chicken thigh over a bed of spaghetti mixed with diced red bell peppers and fresh herbs. Perfectly seasoned and served hot.', 16.99, 'Food', '/placeholder.svg?height=400&width=400', 95, 'CHICKEN-SPAGHETTI-001', true, ARRAY['chicken', 'spaghetti', 'italian', 'grilled']),

-- Chicken Skewers with Yam Fries
('Grilled Chicken Skewers with Yam Fries', 'Four succulent grilled chicken skewers with bell peppers, served on fresh arugula. Accompanied by thick-cut fried yam fries and a chunky tomato relish.', 17.99, 'Food', '/placeholder.svg?height=400&width=400', 70, 'SKEWERS-YAM-001', true, ARRAY['chicken', 'skewers', 'grilled', 'yam']),

-- Fried Rice
('Colorful Fried Rice', 'Aromatic fried rice with rich orange-red hue, mixed with bright green peas, green beans, red bell peppers, and fresh herbs. Garnished with parsley sprig.', 11.99, 'Food', '/placeholder.svg?height=400&width=400', 100, 'FRIED-RICE-001', true, ARRAY['fried rice', 'vegetables', 'asian', 'colorful']),

-- Lemon Pie
('Lemon Pie Slice', 'Decadent lemon cheesecake with smooth pale yellow filling, golden-brown graham cracker crust, topped with whipped cream swirls and lemon zest. Garnished with fresh lemon slice.', 7.99, 'Food', '/placeholder.svg?height=400&width=400', 150, 'DESSERT-LEMON-PIE-001', true, ARRAY['lemon', 'pie', 'dessert', 'creamy']),

-- Coca-Cola
('Coca-Cola', 'Classic refreshing cola beverage. Ice cold with the iconic flavor everyone loves. Perfect with any meal.', 2.99, 'Food', '/placeholder.svg?height=400&width=400', 300, 'DRINK-COKE-001', true, ARRAY['cola', 'soda', 'drink', 'classic']),

-- Whole Crab
('Steamed Crab', 'Large succulent crab cooked to perfection, generously seasoned with herbs and spices. Served with lemon slices and fresh dill garnish. A seafood delight!', 28.99, 'Food', '/placeholder.svg?height=400&width=400', 40, 'CRAB-STEAMED-001', true, ARRAY['crab', 'seafood', 'steamed', 'fresh']),

-- Sprinkled Cupcake
('Rainbow Sprinkled Cupcake', 'Vanilla cupcake with pink ruffled liner, topped with smooth off-white and light pink frosting swirls. Heavily decorated with colorful sprinkles in red, orange, yellow, green, blue, purple, pink, and white.', 4.99, 'Food', '/placeholder.svg?height=400&width=400', 200, 'CUPCAKE-SPRINKLES-001', true, ARRAY['cupcake', 'dessert', 'sprinkles', 'birthday']),

-- Chocolate Brownies
('Double Chocolate Brownies', 'Two rich, dense fudgy brownies with crinkled glossy tops and dark chocolate flavor. Stacked on a white plate, ready to indulge your sweet tooth.', 5.99, 'Food', '/placeholder.svg?height=400&width=400', 180, 'BROWNIES-DOUBLE-001', true, ARRAY['brownies', 'chocolate', 'dessert', 'fudgy']),

-- Fanta Orange
('Fanta Orange Soda', 'Vibrant orange carbonated soft drink with 100% natural flavors. Caffeine-free and bursting with refreshing citrus taste.', 2.99, 'Food', '/placeholder.svg?height=400&width=400', 250, 'DRINK-FANTA-001', true, ARRAY['orange', 'soda', 'drink', 'fruity']),

-- Tropical Cocktail
('Tropical Sunrise Cocktail', 'Bright orange-red cocktail with citrus flavors, served over ice in a stemmed glass. Garnished with lemon slice, fresh mint leaves, and a black straw.', 9.99, 'Food', '/placeholder.svg?height=400&width=400', 110, 'COCKTAIL-TROPICAL-001', true, ARRAY['cocktail', 'alcoholic', 'tropical', 'refreshing']),

-- Glazed Chicken Wings
('Glazed Chicken Wings', 'Approximately 10-12 succulent chicken wings coated in thick, glossy, sticky sweet glaze with a hint of spice. Perfect crispy skin and tender meat.', 13.99, 'Food', '/placeholder.svg?height=400&width=400', 130, 'WINGS-GLAZED-001', true, ARRAY['chicken wings', 'glazed', 'spicy', 'american']),

-- Caramel Cheesecake
('Caramel Cheesecake Slice', 'Rich, creamy cheesecake slice with smooth pale yellow filling and graham cracker crust. Generously drizzled with golden caramel sauce, topped with whipped cream swirl and biscuit crumbles.', 8.99, 'Food', '/placeholder.svg?height=400&width=400', 140, 'CHEESECAKE-CARAMEL-001', true, ARRAY['cheesecake', 'caramel', 'dessert', 'indulgent']);

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

