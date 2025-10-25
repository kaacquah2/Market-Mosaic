-- Make kaacquah2004@gmail.com an admin
-- Run this in Supabase SQL Editor

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'kaacquah2004@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Verify it worked
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE email = 'kaacquah2004@gmail.com';

