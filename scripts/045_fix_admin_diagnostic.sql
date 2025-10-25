-- DIAGNOSTIC AND FIX SCRIPT FOR kaacquah2004@gmail.com
-- Run this ENTIRE script in Supabase SQL Editor

-- Step 1: Check if user exists
SELECT 'Step 1: Checking user exists' as step;
SELECT id, email, created_at FROM auth.users WHERE email = 'kaacquah2004@gmail.com';

-- Step 2: Check current role
SELECT 'Step 2: Checking current role' as step;
SELECT * FROM public.user_roles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'kaacquah2004@gmail.com');

-- Step 3: TEMPORARILY DISABLE RLS to ensure we can insert
SELECT 'Step 3: Temporarily disabling RLS' as step;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Step 4: Delete any existing entry and insert fresh
SELECT 'Step 4: Inserting admin role' as step;
DELETE FROM public.user_roles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'kaacquah2004@gmail.com');

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'kaacquah2004@gmail.com';

-- Step 5: Re-enable RLS
SELECT 'Step 5: Re-enabling RLS' as step;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 6: Verify the admin role
SELECT 'Step 6: Verifying admin role' as step;
SELECT 
  u.email,
  u.id as user_id,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE email = 'kaacquah2004@gmail.com';

-- Step 7: Test admin check function
SELECT 'Step 7: Testing admin check' as step;
SELECT public.is_admin((SELECT id FROM auth.users WHERE email = 'kaacquah2004@gmail.com'));

