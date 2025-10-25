-- Make yourself an admin
-- Run this in your Supabase SQL Editor

-- Step 1: Replace 'your-email@example.com' with your actual email address
-- Step 2: Run this SQL query

-- Assign admin role to your user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Verify your admin status
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE email = 'your-email@example.com';

