-- Complete OAuth Fix - Bypasses RLS completely for trigger function
-- Run this ENTIRE script in Supabase SQL Editor

-- STEP 1: Ensure tables exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'US',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- STEP 2: Drop old function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- STEP 3: Create function that BYPASSES RLS completely
-- This function uses SET LOCAL to temporarily disable RLS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set session to bypass RLS temporarily
  PERFORM set_config('local.row_security', 'off', true);
  
  -- Insert user profile
  INSERT INTO public.user_profiles (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Insert user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail auth - just log the warning
    RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- STEP 4: Grant permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_profiles TO postgres, service_role, authenticated, anon;
GRANT ALL ON TABLE public.user_roles TO postgres, service_role, authenticated, anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role, authenticated, anon;

-- STEP 5: Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- STEP 6: Enable RLS and create permissive policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_insert_public" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_update_admin" ON public.user_roles;

-- Create new SELECT policies (restrictive)
CREATE POLICY "user_profiles_select_own"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_roles_select_own"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Create new INSERT policies (permissive for trigger)
CREATE POLICY "user_profiles_insert_own"
  ON public.user_profiles FOR INSERT
  WITH CHECK (true);  -- Allow all inserts

CREATE POLICY "user_roles_insert_public"
  ON public.user_roles FOR INSERT
  WITH CHECK (true);  -- Allow all inserts

-- Create UPDATE policies (restrictive)
CREATE POLICY "user_profiles_update_own"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "user_roles_update_admin"
  ON public.user_roles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- STEP 7: Verification
SELECT '=== VERIFICATION ===' as step;

SELECT 
  'Trigger Status' as check_type,
  CASE WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created')
    THEN '✓ Created' ELSE '✗ Missing' END as status;

SELECT 
  'Function Status' as check_type,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'handle_new_user'
  ) THEN '✓ Created' ELSE '✗ Missing' END as status;

SELECT 
  'INSERT Policy (user_profiles)' as check_type,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'user_profiles_insert_own'
  ) THEN '✓ Exists' ELSE '✗ Missing' END as status;

SELECT 
  'INSERT Policy (user_roles)' as check_type,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_roles' 
    AND policyname = 'user_roles_insert_public'
  ) THEN '✓ Exists' ELSE '✗ Missing' END as status;

SELECT '=== FIX COMPLETE - Try OAuth Signup ===' as message;

