-- Migrate is_admin policies from TEXT-based to UUID-based version
-- This script updates policies that were using the old TEXT version of is_admin

-- Note: This is only needed if you had policies using is_admin(auth.jwt() ->> 'email')
-- If you're starting fresh or already using the UUID version, you can skip this script.

-- The new is_admin function signature is: is_admin(user_id UUID)
-- It uses the user_roles table instead of hardcoded emails

-- Example policies that need updating (if they exist):
-- Old: WITH CHECK (public.is_admin(auth.jwt() ->> 'email'))
-- New: WITH CHECK (public.is_admin())

-- Product policies (if they were using the old TEXT version)
-- Check what policies exist first
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND policyname LIKE '%admin%'
ORDER BY tablename, policyname;

-- If you find policies using the old TEXT version, you'll need to update them.
-- For example, if products table policies exist:

-- Re-create product admin policies to use UUID version
DROP POLICY IF EXISTS "products_insert_admin" ON public.products;
DROP POLICY IF EXISTS "products_update_admin" ON public.products;
DROP POLICY IF EXISTS "products_delete_admin" ON public.products;

-- Recreate with the correct UUID-based is_admin function
CREATE POLICY "products_insert_admin"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "products_update_admin"
  ON public.products FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "products_delete_admin"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- Check which tables exist before creating policies
-- This script now safely handles tables that might not exist

-- Check if categories table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'categories') THEN
    -- Category policies
    DROP POLICY IF EXISTS "categories_insert_admin" ON public.categories;
    DROP POLICY IF EXISTS "categories_update_admin" ON public.categories;
    DROP POLICY IF EXISTS "categories_delete_admin" ON public.categories;

    CREATE POLICY "categories_insert_admin"
      ON public.categories FOR INSERT
      WITH CHECK (public.is_admin());

    CREATE POLICY "categories_update_admin"
      ON public.categories FOR UPDATE
      USING (public.is_admin());

    CREATE POLICY "categories_delete_admin"
      ON public.categories FOR DELETE
      USING (public.is_admin());
      
    RAISE NOTICE 'Updated categories table policies';
  END IF;
END $$;

-- Check for other common tables that might need admin policies
DO $$
BEGIN
  -- orders table
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
    DROP POLICY IF EXISTS "orders_insert_admin" ON public.orders;
    CREATE POLICY "orders_insert_admin" ON public.orders FOR INSERT WITH CHECK (public.is_admin());
    RAISE NOTICE 'Updated orders table policies';
  END IF;
  
  -- users table (if you have a custom users table)
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_profiles') THEN
    DROP POLICY IF EXISTS "user_profiles_update_admin" ON public.user_profiles;
    CREATE POLICY "user_profiles_update_admin" ON public.user_profiles FOR UPDATE USING (public.is_admin());
    RAISE NOTICE 'Updated user_profiles table policies';
  END IF;
  
  -- user_roles table
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_roles') THEN
    DROP POLICY IF EXISTS "user_roles_all_admin" ON public.user_roles;
    CREATE POLICY "user_roles_all_admin" ON public.user_roles FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
    RAISE NOTICE 'Updated user_roles table policies';
  END IF;
END $$;

-- Verify all admin policies are now using the UUID version
SELECT 
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND (qual LIKE '%is_admin%' OR with_check LIKE '%is_admin%')
ORDER BY tablename, policyname;

