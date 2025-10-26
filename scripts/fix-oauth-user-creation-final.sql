-- Final fix for OAuth user creation error
-- This version properly bypasses RLS using service_role permissions

-- Step 1: Remove old trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 2: Create a simpler function that will work with RLS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert profile (should work with SECURITY DEFINER and proper grants)
  INSERT INTO public.user_profiles (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Insert role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Step 3: Ensure proper grants
GRANT USAGE ON SCHEMA public TO authenticated, anon, service_role, postgres;
GRANT ALL ON TABLE public.user_profiles TO authenticated, service_role, postgres;
GRANT ALL ON TABLE public.user_roles TO authenticated, service_role, postgres;

-- Step 4: Important - Grant execute on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated, anon, service_role;

-- Step 5: Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verify
SELECT 'Setup complete' as status;

