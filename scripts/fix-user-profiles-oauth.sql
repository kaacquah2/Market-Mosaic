-- Fix OAuth "Database error saving new user" issue
-- This script ensures the trigger properly creates user profiles during OAuth signup

-- Step 1: Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 2: Create a robust function that handles profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile_id UUID;
BEGIN
  -- Try to insert the profile
  INSERT INTO public.user_profiles (user_id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW())
  ON CONFLICT (user_id) DO NOTHING
  RETURNING id INTO v_profile_id;
  
  -- If successful, insert user role as well
  IF v_profile_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role, created_at, updated_at)
    VALUES (NEW.id, 'customer', NOW(), NOW())
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail the auth operation if profile creation fails
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Step 3: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, service_role;
GRANT ALL ON public.user_profiles TO postgres, service_role;
GRANT ALL ON public.user_roles TO postgres, service_role;

-- Step 5: Verify the setup
SELECT 
  'Trigger created successfully' as status,
  tgname as trigger_name,
  tgtype::text as trigger_type
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

SELECT 
  'Function created successfully' as status,
  p.proname as function_name,
  p.prosecdef as security_definer
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND p.proname = 'handle_new_user';

