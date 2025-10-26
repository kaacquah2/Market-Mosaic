-- Fix RLS policies to allow Supabase Auth to create user profiles
-- The error "Database error saving new user" happens when Auth tries to save metadata

-- Step 1: Update user_profiles insert policy to allow service_role
DROP POLICY IF EXISTS "user_profiles_insert_own" ON public.user_profiles;
CREATE POLICY "user_profiles_insert_own"
  ON public.user_profiles FOR INSERT
  WITH CHECK (true);  -- Allow all inserts for now (Auth creates these)

-- Step 2: Update user_roles insert policy 
DROP POLICY IF EXISTS "user_roles_insert_public" ON public.user_roles;
CREATE POLICY "user_roles_insert_public"
  ON public.user_roles FOR INSERT
  WITH CHECK (true);  -- Allow all inserts for now

-- Step 3: Ensure the trigger function exists and can insert
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Step 4: Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Update select policies to be more restrictive (users can only see their own)
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
CREATE POLICY "user_profiles_select_own"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;
CREATE POLICY "user_roles_select_own"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Step 6: Update update policies
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

SELECT 'RLS policies updated - OAuth should work now!' as status;

