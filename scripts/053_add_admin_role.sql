-- Add yourself as admin
-- IMPORTANT: Replace 'your-email@example.com' with your actual email address

-- First, let's see what users exist
SELECT 
  id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- Then, add your user as admin (replace the email below)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'your-email@example.com'  -- CHANGE THIS TO YOUR EMAIL
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Verify it worked
SELECT 
  u.email,
  ur.role,
  ur.created_at as role_created_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';

