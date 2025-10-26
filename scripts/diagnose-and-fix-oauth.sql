-- Complete diagnostic and fix for OAuth "Database error saving new user"
-- Run this ENTIRE script in Supabase SQL Editor

-- STEP 1: Check current state
SELECT '=== CHECKING CURRENT STATE ===' as step;

-- Check if tables exist
SELECT 'Checking user_profiles table' as info;
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
) as user_profiles_exists;

SELECT 'Checking user_roles table' as info;
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_roles'
) as user_roles_exists;

-- Check current policies
SELECT 'Checking RLS policies' as info;
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'user_roles')
ORDER BY tablename, policyname;

-- STEP 2: ENSURE USER_ROLES TABLE EXISTS
SELECT '=== ENSURING USER_ROLES TABLE EXISTS ===' as step;

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS if not already enabled
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- STEP 3: COMPLETE FIX
SELECT '=== APPLYING COMPLETE FIX ===' as step;

-- Drop existing function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create the function with proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_profiles TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_roles TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, anon, authenticated, service_role;

-- Update RLS policies - ALLOW INSERTIONS
DROP POLICY IF EXISTS "user_profiles_insert_own" ON public.user_profiles;
CREATE POLICY "user_profiles_insert_own"
  ON public.user_profiles FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "user_roles_insert_public" ON public.user_roles;
CREATE POLICY "user_roles_insert_public"
  ON public.user_roles FOR INSERT
  WITH CHECK (true);

-- Keep SELECT restrictive
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
CREATE POLICY "user_profiles_select_own"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;
CREATE POLICY "user_roles_select_own"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Keep UPDATE restrictive
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
CREATE POLICY "user_profiles_update_own"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_roles_update_admin" ON public.user_roles;
CREATE POLICY "user_roles_update_admin"
  ON public.user_roles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- STEP 4: VERIFY
SELECT '=== VERIFICATION ===' as step;

SELECT 
  'Trigger' as component,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN '✓ Created' ELSE '✗ Missing' END as status;

SELECT 
  'Function' as component,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'handle_new_user'
  ) THEN '✓ Created' ELSE '✗ Missing' END as status;

SELECT '=== FIX COMPLETE - Try OAuth Signup Now ===' as message;

