-- EMERGENCY FIX: Temporarily disables RLS to allow OAuth signup
-- Run this in Supabase SQL Editor
-- WARNING: This makes inserts completely open - restrict after testing

SELECT '=== STEP 1: Drop existing trigger ===' as step;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

SELECT '=== STEP 2: Temporarily DISABLE RLS ===' as step;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

SELECT '=== STEP 3: Create simple trigger function ===' as step;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user error: %', SQLERRM;
    RETURN NEW;
END;
$$;

SELECT '=== STEP 4: Create trigger ===' as step;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

SELECT '=== STEP 5: Grant permissions ===' as step;
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_profiles TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_roles TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, anon, authenticated, service_role;

SELECT '=== VERIFICATION ===' as verification;
SELECT 
  'Trigger' as component,
  CASE WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created')
    THEN '✓ EXISTS' ELSE '✗ MISSING' END as status;

SELECT 
  'Function' as component,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'handle_new_user'
  ) THEN '✓ EXISTS' ELSE '✗ MISSING' END as status;

SELECT 
  'RLS on user_profiles' as component,
  CASE WHEN (
    SELECT relrowsecurity FROM pg_class WHERE relname = 'user_profiles' AND relnamespace = 'public'::regnamespace
  ) THEN 'ENABLED' ELSE 'DISABLED' END as status;

SELECT 
  'RLS on user_roles' as component,
  CASE WHEN (
    SELECT relrowsecurity FROM pg_class WHERE relname = 'user_roles' AND relnamespace = 'public'::regnamespace
  ) THEN 'ENABLED' ELSE 'DISABLED' END as status;

SELECT '✓ SETUP COMPLETE - Try OAuth signup NOW' as message;
SELECT '⚠ WARNING: RLS is DISABLED on user_profiles and user_roles' as warning;

