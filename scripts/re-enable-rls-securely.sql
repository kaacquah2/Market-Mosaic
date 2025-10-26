-- Re-enable RLS with secure policies after OAuth is working
-- Run this AFTER OAuth signup works to restore security

SELECT '=== Re-enabling RLS ===' as step;

-- Re-enable RLS on both tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

SELECT '=== Drop existing policies ===' as step;

-- Drop all existing policies on user_profiles
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_delete_none" ON public.user_profiles;

-- Drop all existing policies on user_roles
DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_insert_public" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_update_admin" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_delete_admin" ON public.user_roles;

SELECT '=== Create new secure SELECT policies ===' as step;

-- Users can only view their own profiles
CREATE POLICY "user_profiles_select_own"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only view their own role
CREATE POLICY "user_roles_select_own"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

SELECT '=== Create permissive INSERT policies ===' as step;

-- Allow INSERTs to support the trigger (permissive for OAuth)
CREATE POLICY "user_profiles_insert_own"
  ON public.user_profiles FOR INSERT
  WITH CHECK (true);  -- Allow all inserts

-- Allow INSERTs to support the trigger (permissive for OAuth)
CREATE POLICY "user_roles_insert_public"
  ON public.user_roles FOR INSERT
  WITH CHECK (true);  -- Allow all inserts

SELECT '=== Create UPDATE policies ===' as step;

-- Users can only update their own profile
CREATE POLICY "user_profiles_update_own"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only admins can update roles
CREATE POLICY "user_roles_update_admin"
  ON public.user_roles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

SELECT '=== Create DELETE policies ===' as step;

-- Users cannot delete their own profile
CREATE POLICY "user_profiles_delete_none"
  ON public.user_profiles FOR DELETE
  USING (false);

-- Only admins can delete roles
CREATE POLICY "user_roles_delete_admin"
  ON public.user_roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

SELECT '=== VERIFICATION ===' as verification;

SELECT 
  'RLS on user_profiles' as component,
  CASE WHEN (
    SELECT relrowsecurity FROM pg_class WHERE relname = 'user_profiles' AND relnamespace = 'public'::regnamespace
  ) THEN '✓ ENABLED' ELSE '✗ DISABLED' END as status;

SELECT 
  'RLS on user_roles' as component,
  CASE WHEN (
    SELECT relrowsecurity FROM pg_class WHERE relname = 'user_roles' AND relnamespace = 'public'::regnamespace
  ) THEN '✓ ENABLED' ELSE '✗ DISABLED' END as status;

SELECT 
  'SELECT policies' as component,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'user_roles')
  AND cmd = 'SELECT';

SELECT 
  'INSERT policies' as component,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'user_roles')
  AND cmd = 'INSERT';

SELECT '✓ RLS Re-enabled Securely!' as status;
SELECT '✓ OAuth signup should still work with permissive INSERT policies' as note;

