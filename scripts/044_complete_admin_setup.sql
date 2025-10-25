-- Complete admin setup for kaacquah2004@gmail.com
-- Run this ENTIRE script in Supabase SQL Editor

-- Step 1: First, get your user ID to verify
SELECT id, email FROM auth.users WHERE email = 'kaacquah2004@gmail.com';

-- Step 2: Check if you have any role entry
SELECT * FROM public.user_roles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'kaacquah2004@gmail.com');

-- Step 3: Insert or update your admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'kaacquah2004@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Step 4: Verify the admin role was assigned
SELECT 
  u.email,
  u.id as user_id,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE email = 'kaacquah2004@gmail.com';

