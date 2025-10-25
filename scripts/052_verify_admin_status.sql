-- Verify your admin status and user_roles setup
-- Run this to check if you're set up as admin

-- Check if you're logged in and have admin role
SELECT 
  'Current User Check' as check_type,
  auth.uid() as your_user_id,
  auth.email() as your_email,
  public.is_admin() as is_admin_status,
  ur.role as your_role,
  ur.user_id as role_user_id
FROM public.user_roles ur
WHERE ur.user_id = auth.uid();

-- If no results above, check all user roles
SELECT 
  'All User Roles' as check_type,
  u.email,
  ur.role,
  ur.user_id
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC
LIMIT 10;

-- Test the is_admin function directly
SELECT 
  'Function Test' as check_type,
  public.is_admin() as returns_true_if_admin;

