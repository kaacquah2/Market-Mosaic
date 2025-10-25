# How to Access the Admin Page

## Steps to Access Admin Dashboard

### 1. First, ensure you have a user account
- Go to `http://localhost:3000/auth/sign-up` (or your app URL)
- Create an account with your email

### 2. Set up your admin role in Supabase

You need to manually assign the admin role to your user account. Here's how:

#### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run this SQL query (replace with your actual email):

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'your-email@example.com';
```

#### Option B: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Find your user and copy their User ID (UUID)
4. Go to **Table Editor** → **user_roles**
5. Click **Insert row** and add:
   - `user_id`: Paste the UUID
   - `role`: `admin`

### 3. Access the admin page

Once you've set your role as admin:
- Navigate to: `http://localhost:3000/admin`
- The page will show:
  - Dashboard with statistics
  - Product management
  - Order management
  - Quick actions

## Important Notes

- **Security**: Only users with `role = 'admin'` can access the admin pages
- **Auto-redirect**: If you're not logged in, you'll be redirected to `/auth/login`
- **Role check**: If you don't have admin role, you'll be redirected to `/`

## Admin Pages Available

- `/admin` - Main dashboard
- `/admin/products` - Product management
- `/admin/products/new` - Add new product
- `/admin/products/[id]` - Edit product
- `/admin/orders` - View all orders
- `/admin/orders/[id]` - Order details

## Creating Additional Admins

Once you have one admin, you can create more admins by running this SQL:

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'another-admin@example.com';
```

## Troubleshooting

**Issue**: Redirected to login page
- **Solution**: Make sure you're logged in to your account

**Issue**: Redirected to homepage (/)
- **Solution**: Your user doesn't have admin role. Follow step 2 above to assign the role.

**Issue**: Role not found
- **Solution**: Make sure you've run the `013_create_user_roles.sql` script in Supabase SQL Editor

