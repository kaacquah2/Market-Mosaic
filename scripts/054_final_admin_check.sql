-- Final verification that everything is set up correctly
-- Run this to confirm you're ready to upload products

-- Check if you're recognized as admin
SELECT 
  'Admin Status Check' as check_type,
  auth.uid() as your_user_id,
  auth.email() as your_email,
  public.is_admin() as returns_true_if_admin,
  ur.role as your_role
FROM public.user_roles ur
WHERE ur.user_id = auth.uid();

-- Check products table policies
SELECT 
  'Products Policies' as check_type,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- Check if products table is ready for inserts
SELECT 
  'Table Ready' as check_type,
  'products' as table_name,
  COUNT(*) as existing_products
FROM products;

