# How to Make Yourself an Admin

## Quick Steps

### Option 1: Using SQL Script (Recommended)

1. **Log in to your application** first to create your user account
   
2. **Go to your Supabase Dashboard** → SQL Editor

3. **Copy and run this SQL** (replace with your email):
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin' 
   FROM auth.users 
   WHERE email = 'your-email@example.com'
   ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
   ```

4. **Verify it worked**:
   ```sql
   SELECT 
     u.email,
     ur.role
   FROM auth.users u
   LEFT JOIN public.user_roles ur ON u.id = ur.user_id
   WHERE email = 'your-email@example.com';
   ```

5. **Log out and log back in** to your app

### Option 2: Using Supabase Dashboard

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Find your user account
3. Copy your **User ID** (UUID)
4. Go to **Table Editor** → **user_roles**
5. Click **Insert** → **Insert row**
6. Set:
   - `user_id`: Paste your UUID
   - `role`: `admin`
7. Click **Save**

### Option 3: Direct Database Query

If you need to find your user ID first:

```sql
-- Find your user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Then assign admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('your-user-id-here', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## Troubleshooting

### "No user found" Error
- Make sure you've logged in to the app at least once
- Check that your email is correct (case-sensitive)

### "Already exists" Error
- You may already have a role assigned
- Run the UPDATE version instead:
  ```sql
  UPDATE public.user_roles
  SET role = 'admin'
  WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
  ```

### Can't Access Admin Dashboard
- Log out and log back in after assigning admin role
- Clear browser cache
- Check browser console for errors

## Verify Admin Access

After assigning admin role, you should be able to:
- ✅ Access `/admin` dashboard
- ✅ Access `/admin/products` page
- ✅ Upload products and images
- ✅ Manage orders

## Making Multiple Admins

To add more admins, just run the same SQL with different emails:

```sql
-- Add multiple admins
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email IN ('admin1@example.com', 'admin2@example.com')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## Security Note

⚠️ **Important**: Only grant admin access to trusted users. Admins can:
- Upload/manage products
- View all orders
- Modify site content
- Access sensitive information

## File Location

The SQL script is also available at: `scripts/041_make_admin.sql`

