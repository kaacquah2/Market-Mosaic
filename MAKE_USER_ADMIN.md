# Make Your Account an Admin

## Problem
You're logged in as `kaacquah2004@gmail.com` but when trying to access `/admin`, you're redirected because you don't have admin permissions in the database.

## Solution

You need to add your user to the `user_roles` table with the 'admin' role.

### Step 1: Get Your User ID

First, you need your user ID. Run this in the **browser console** (F12) while logged in:

```javascript
// Open console on any page after logging in
const supabase = window.__supabase || require('@/lib/supabase/client').createClient()
const { data } = await supabase.auth.getUser()
console.log('Your User ID:', data.user.id)
```

Or you can find it in Supabase Dashboard:
1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Find your email: `kaacquah2004@gmail.com`
4. Copy the **ID** (it looks like: `5b7a6f1f-39d0-46f9-a5de-d0deb019f300`)

### Step 2: Add Admin Role in Supabase Dashboard

**Option A: Using SQL Editor (Recommended)**

1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Paste this SQL (replace `YOUR_USER_ID` with your actual ID):

```sql
-- First, make sure the user_roles table exists
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id)
);

-- Add your user as admin
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'admin')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';

-- Verify it worked
SELECT * FROM user_roles WHERE user_id = 'YOUR_USER_ID';
```

5. Click **Run** (or press Ctrl+Enter)
6. You should see your user role in the results

**Option B: Using Table Editor**

1. Go to **Table Editor** in Supabase Dashboard
2. Find the `user_roles` table (create it if it doesn't exist)
3. Click **Insert** → **Insert row**
4. Fill in:
   - `user_id`: Your user ID (paste it)
   - `role`: `admin` (type this exactly)
5. Click **Save**

### Step 3: Test Admin Access

1. **Clear your browser cache** or use Ctrl+Shift+R (hard refresh)
2. Make sure you're logged in as `kaacquah2004@gmail.com`
3. Navigate to: `http://localhost:3000/admin`
4. ✅ You should now see the Admin Dashboard!

### Step 4: Verify It's Working

Open browser console (F12) and run:

```javascript
const supabase = window.__supabase || require('@/lib/supabase/client').createClient()
const { data: { user } } = await supabase.auth.getUser()
const { data: userRole } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', user.id)
  .single()
console.log('Your role:', userRole?.role)
// Should output: "Your role: admin"
```

## Quick SQL Script for Your Account

Based on the console logs, your user ID is: `5b7a6f1f-39d0-46f9-a5de-d0deb019f300`

Copy this complete script into Supabase SQL Editor:

```sql
-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own role
CREATE POLICY "Users can read their own role" ON user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow admins to manage all roles
CREATE POLICY "Admins can manage all roles" ON user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Add kaacquah2004@gmail.com as admin
INSERT INTO user_roles (user_id, role)
VALUES ('5b7a6f1f-39d0-46f9-a5de-d0deb019f300', 'admin')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';

-- Verify
SELECT 
  ur.role,
  au.email,
  ur.created_at
FROM user_roles ur
JOIN auth.users au ON au.id = ur.user_id
WHERE ur.user_id = '5b7a6f1f-39d0-46f9-a5de-d0deb019f300';
```

## Troubleshooting

### Issue: "Table user_roles does not exist"
**Solution**: Run the CREATE TABLE command from the script above first.

### Issue: Still can't access admin after adding role
**Solutions**:
1. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear cache**: F12 → Application → Clear storage
3. **Log out and log back in**
4. **Check browser console** for errors

### Issue: "Unique constraint violation"
This means your user already has a role. Update it instead:

```sql
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = '5b7a6f1f-39d0-46f9-a5de-d0deb019f300';
```

### Issue: RLS Policy blocking the query
If you see permission errors, temporarily disable RLS:

```sql
-- Disable RLS temporarily (NOT recommended for production)
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
```

Then after adding your admin role, re-enable it:

```sql
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
```

## What Admins Can Access

Once you're an admin, you'll have access to:
- ✅ `/admin` - Admin Dashboard
- ✅ `/admin/products` - Product Management
- ✅ `/admin/products/new` - Add New Products
- ✅ `/admin/orders` - Order Management
- ✅ `/admin/orders/[id]` - Order Details & Tracking
- ✅ `/admin/campaigns` - Marketing Campaigns

## Adding More Admins Later

To add another user as admin:

```sql
-- Find the user's ID first
SELECT id, email FROM auth.users WHERE email = 'new-admin@example.com';

-- Then add them as admin
INSERT INTO user_roles (user_id, role)
VALUES ('their-user-id-here', 'admin')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';
```

## Security Note

⚠️ **Important**: Only add trusted users as admins! Admins have full access to:
- View all orders
- Manage all products
- Update inventory
- View customer information
- Send marketing campaigns

---

**After running the SQL script, refresh your browser and try accessing `/admin` again!** 🚀

