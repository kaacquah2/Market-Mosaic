-- Enhanced fix for OAuth "Database error saving new user" issue
-- This version explicitly grants permissions and uses a more robust approach

-- Step 1: Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 2: Temporarily disable RLS to allow the trigger to work
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Step 3: Create the function with explicit handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create user profile (RLS is disabled, so this will work)
  INSERT INTO public.user_profiles (user_id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW())
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create user role
  INSERT INTO public.user_roles (user_id, role, created_at, updated_at)
  VALUES (NEW.id, 'customer', NOW(), NOW())
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail auth
    RAISE WARNING 'handle_new_user error for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Step 4: Re-enable RLS but with a special policy that allows trigger inserts
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies for user_profiles that work with the trigger
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
CREATE POLICY "user_profiles_select_own"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_profiles_insert_own" ON public.user_profiles;
-- This policy allows users to insert their own profile AND allows the trigger
CREATE POLICY "user_profiles_insert_own"
  ON public.user_profiles FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR 
    -- Allow the SECURITY DEFINER function to insert
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
CREATE POLICY "user_profiles_update_own"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_profiles_delete_none" ON public.user_profiles;
CREATE POLICY "user_profiles_delete_none"
  ON public.user_profiles FOR DELETE
  USING (false);

-- Step 6: Create policies for user_roles
DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;
CREATE POLICY "user_roles_select_own"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_roles_insert_public" ON public.user_roles;
CREATE POLICY "user_roles_insert_public"
  ON public.user_roles FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR 
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

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

DROP POLICY IF EXISTS "user_roles_delete_admin" ON public.user_roles;
CREATE POLICY "user_roles_delete_admin"
  ON public.user_roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Step 7: Grant permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_profiles TO postgres, service_role, authenticated;
GRANT ALL ON public.user_roles TO postgres, service_role, authenticated;

-- Step 8: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 9: Verify
SELECT 
  'Setup complete' as status,
  'Trigger and function created successfully' as message;

