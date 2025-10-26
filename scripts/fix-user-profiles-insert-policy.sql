-- Fix user_profiles insert policy to allow trigger function to work
-- The handle_new_user() trigger runs as SECURITY DEFINER and needs to insert into user_profiles

-- Step 1: Grant necessary permissions to the function
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_profiles TO postgres, service_role;

-- Step 2: Drop existing function and trigger
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 3: Temporarily disable RLS to allow inserts from trigger
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Step 4: Create the function with proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if profile already exists
  IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = NEW.id) THEN
    INSERT INTO public.user_profiles (user_id)
    VALUES (NEW.id);
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Error creating user profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Re-enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 7: Recreate policies
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
CREATE POLICY "user_profiles_select_own"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_profiles_insert_own" ON public.user_profiles;
CREATE POLICY "user_profiles_insert_own"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
CREATE POLICY "user_profiles_update_own"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_profiles_delete_none" ON public.user_profiles;
CREATE POLICY "user_profiles_delete_none"
  ON public.user_profiles FOR DELETE
  USING (false);

