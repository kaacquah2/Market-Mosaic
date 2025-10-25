# Fix Admin Product Upload to Database

## Problem
When uploading products through the admin page, they're not being saved to the database due to incorrect Row Level Security (RLS) policies.

## Root Cause
The products table RLS policies are using an old email-based admin check instead of the `user_roles` table method that your app uses.

## Solution

### Step 1: Run the Fix SQL Script

Go to your **Supabase Dashboard** → **SQL Editor** and run:

```sql
-- File: scripts/051_fix_products_admin_policies.sql
```

Or paste this directly:

```sql
-- Fix products table admin policies to use user_roles instead of hardcoded emails
-- This ensures that when admins upload products through the admin page, they are properly saved to the database

-- First, ensure the correct is_admin function exists (from user_roles setup)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = is_admin.user_id 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the old email-based policies
DROP POLICY IF EXISTS "products_insert_admin" ON public.products;
DROP POLICY IF EXISTS "products_update_admin" ON public.products;
DROP POLICY IF EXISTS "products_delete_admin" ON public.products;

-- Create new policies that use the user_roles-based is_admin function
CREATE POLICY "products_insert_admin"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "products_update_admin"
  ON public.products FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "products_delete_admin"
  ON public.products FOR DELETE
  USING (public.is_admin());
```

### Step 2: Verify Your Admin Role

Make sure you have admin access in the `user_roles` table:

```sql
-- Check your role
SELECT 
  u.email,
  ur.role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'your-email@example.com';
```

If you don't have admin role, add it:

```sql
-- Replace with your email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

### Step 3: Ensure Storage Bucket Exists

For image uploads to work, make sure the storage bucket exists:

```sql
-- Run scripts/040_create_product_images_storage.sql
-- Or check if it exists:
SELECT * FROM storage.buckets WHERE id = 'product-images';
```

### Step 4: Test Product Upload

1. Log out and log back in to refresh your session
2. Go to Admin Dashboard → Products → Add Product
3. Fill in the product details and upload
4. Check the products table to verify it was saved:

```sql
SELECT * FROM products ORDER BY created_at DESC LIMIT 1;
```

## What Changed

### Before
- Products table policies checked admin status via hardcoded email addresses
- Admin check didn't match your app's `user_roles` table system
- Product inserts were blocked by RLS

### After
- Products table policies use the `user_roles` table to check admin status
- The `is_admin()` function queries the `user_roles` table
- Admins can now successfully insert products into the database

## Verification

After running the fix, verify the policies are correct:

```sql
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;
```

You should see:
- `products_insert_admin` with `WITH CHECK (public.is_admin())`
- `products_update_admin` with `USING (public.is_admin())`
- `products_delete_admin` with `USING (public.is_admin())`

## Troubleshooting

### Still Can't Upload Products?

1. **Check console errors** - Open browser dev tools and look for errors
2. **Verify admin role** - Make sure your user_id is in `user_roles` with role='admin'
3. **Check RLS** - Ensure RLS is enabled on products table
4. **Storage errors** - Check if image upload is the issue (try URL instead)

### Check Supabase Logs

Go to Supabase Dashboard → Logs → Postgres Logs to see detailed error messages.

### Still Having Issues?

Run this diagnostic query:

```sql
-- Check if you're recognized as admin
SELECT 
  auth.uid() as current_user_id,
  public.is_admin() as is_admin_check,
  ur.role as your_role
FROM public.user_roles ur
WHERE ur.user_id = auth.uid();
```

This should return `is_admin_check = true` and `your_role = 'admin'`.

