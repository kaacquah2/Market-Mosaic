# How to View and Manage User Roles in Supabase

## Understanding the Structure

The `user_roles` table is **NOT** in the Authentication section. It's a separate table in your database.

## Step-by-Step Guide

### Step 1: Check if the Table Exists

1. Go to **Supabase Dashboard**
2. Click **Table Editor** (not Authentication)
3. Look for a table called `user_roles` in the list

If you **don't see** the `user_roles` table:

### Step 2: Create the user_roles Table

1. Go to **SQL Editor** in Supabase
2. Copy and run `scripts/013_create_user_roles.sql` OR run this:

```sql
-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "user_roles_select_own"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "user_roles_insert_public"
  ON public.user_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_roles_update_admin"
  ON public.user_roles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "user_roles_delete_admin"
  ON public.user_roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );
```

### Step 3: View the user_roles Table

1. Go to **Table Editor** in Supabase
2. Click on the **`user_roles`** table
3. You should see columns: `id`, `user_id`, `role`, `created_at`, `updated_at`

### Step 4: Add Yourself as Admin

If the table is empty or you don't have an entry:

1. Click **Insert** → **Insert row**
2. Fill in:
   - **user_id**: Get this from Authentication → Users → Copy your User ID
   - **role**: Type `admin`
3. Click **Save**

### Step 5: Verify Your Admin Status

Run this in SQL Editor:

```sql
SELECT 
  u.email,
  u.id as user_id,
  ur.role,
  ur.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY ur.created_at DESC;
```

This will show all users with their roles.

## Quick Reference

| Location | What You See |
|----------|-------------|
| **Authentication → Users** | User accounts (email, password, etc.) |
| **Table Editor → user_roles** | User roles (admin, customer, etc.) |

## Common Issues

### "Table doesn't exist"
- Run the SQL script to create it
- Check you're in the correct Supabase project

### "Can't see user_roles table"
- Make sure you're in **Table Editor**, not Authentication
- Refresh the page
- Check the table list sidebar

### "Permission denied"
- This is normal - the table has RLS policies
- Use SQL Editor to insert data instead

## Alternative: Use SQL Editor Only

If you can't see the table in Table Editor, just use SQL Editor:

```sql
-- Make yourself admin (replace with your email)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Verify
SELECT u.email, ur.role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE email = 'your-email@example.com';
```

