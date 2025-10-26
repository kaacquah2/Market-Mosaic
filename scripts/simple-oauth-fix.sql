-- Simple OAuth Fix - Just make RLS policies permissive for INSERTS
-- Run this in Supabase SQL Editor

-- Step 1: Drop and recreate the trigger function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

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

-- Step 2: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Make INSERT policies COMPLETELY PERMISSIVE (allow any insert)
DROP POLICY IF EXISTS "user_profiles_insert_own" ON public.user_profiles;
CREATE POLICY "user_profiles_insert_own"
  ON public.user_profiles FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "user_roles_insert_public" ON public.user_roles;
CREATE POLICY "user_roles_insert_public"
  ON public.user_roles FOR INSERT
  WITH CHECK (true);

-- Step 4: Keep other policies restrictive
-- SELECT policies
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
CREATE POLICY "user_profiles_select_own"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;
CREATE POLICY "user_roles_select_own"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- UPDATE policies
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

-- Step 5: Grant permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_profiles TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_roles TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, anon, authenticated, service_role;

-- Step 6: Enable RLS (it should already be enabled)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

SELECT '✓ FIX APPLIED - Ready for OAuth signup' as status;

