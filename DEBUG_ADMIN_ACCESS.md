# Debug Admin Access

## Step 1: Verify Role Was Created

Run this in **Supabase SQL Editor**:

```sql
-- Check if the role exists
SELECT * FROM user_roles WHERE user_id = '5b7a6f1f-39d0-46f9-a5de-d0deb019f300';

-- Also check all roles
SELECT ur.*, au.email 
FROM user_roles ur 
LEFT JOIN auth.users au ON au.id = ur.user_id;
```

**Expected output:** You should see your user ID with `role: 'admin'`

---

## Step 2: Test the Query From Browser

Open browser console (F12) on your app, paste this and press Enter:

```javascript
const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
const supabase = createClient(
  'https://sjhfmoxdxasyachkklru.supabase.co',
  'YOUR_ANON_KEY_HERE'  // Get from Supabase Dashboard → Settings → API
)

// Get your user
const { data: { user } } = await supabase.auth.getUser()
console.log('Current User:', user?.id, user?.email)

// Check your role
const { data: userRole, error } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', user.id)
  .single()

console.log('User Role:', userRole)
console.log('Error:', error)
```

**What to look for:**
- If `userRole` is `{ role: 'admin' }` → Role exists ✅
- If `error` says "permission denied" → RLS policy issue
- If `error` says "no rows" → Role wasn't created

---

## Step 3: Simple Fix - Disable RLS Temporarily

If the query above shows a permission error, the RLS policies are blocking it. 

Run this in **Supabase SQL Editor**:

```sql
-- Temporarily disable RLS to test
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;

-- Verify you can now see your role
SELECT * FROM user_roles WHERE user_id = '5b7a6f1f-39d0-46f9-a5de-d0deb019f300';
```

Then **refresh your browser** and try accessing `/admin` again.

If it works now, the issue is the RLS policies. We'll fix them properly after.

---

## Step 4: Clear Everything and Start Fresh

If nothing above works, let's start completely fresh:

```sql
-- Drop everything and start over
DROP TABLE IF EXISTS user_roles CASCADE;

-- Create table WITHOUT RLS initially
CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id)
);

-- Insert your admin role
INSERT INTO user_roles (user_id, role)
VALUES ('5b7a6f1f-39d0-46f9-a5de-d0deb019f300', 'admin');

-- Verify it's there
SELECT * FROM user_roles;
```

**Don't enable RLS yet** - just test if admin access works without it first.

Refresh browser and try `/admin` again.

---

## Step 5: Check Session/Login Status

Make sure you're actually logged in. In browser console:

```javascript
const { createClient } = require('@/lib/supabase/client')
const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()

console.log('Logged in as:', user?.email)
console.log('User ID:', user?.id)

// Should show: kaacquah2004@gmail.com and 5b7a6f1f-39d0-46f9-a5de-d0deb019f300
```

If this shows `null`, you're not logged in. Log out and log back in.

---

## Step 6: Hard Refresh Everything

Sometimes Next.js caches things:

1. **Clear browser cache**: Ctrl+Shift+Delete → Clear everything
2. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)  
3. **Log out completely**: Go to your app, log out
4. **Stop dev server**: Ctrl+C in terminal
5. **Clear Next.js cache**: 
   ```bash
   rm -rf .next
   npm run dev
   ```
6. **Log back in**: Go to login page, sign in again
7. **Try /admin**: Navigate to `http://localhost:3000/admin`

---

## Step 7: Check What Error You're Getting

When you try to access `/admin`, what happens?

**A) Redirects to `/auth/login`**
- Issue: Not logged in OR admin check is failing
- Check console for error messages

**B) Redirects to `/` (home page)**
- Issue: You're logged in but admin check failed
- This means the role query returned nothing or isn't 'admin'

**C) Shows a blank page or loading forever**
- Issue: Query is hanging
- Check network tab for failed requests

**D) Shows error message**
- Tell me the exact error message

---

## Quick Test Without Database

Let's temporarily bypass the admin check to confirm the page itself works.

Open `app/admin/page.tsx` and temporarily comment out the admin check:

```typescript
// TEMPORARY - REMOVE THIS AFTER TESTING
// if (!userRole || userRole.role !== 'admin') {
//   redirect("/")
// }
```

Save, refresh, and try `/admin` again. If it works now, the issue is definitely the database query.

**Don't forget to uncomment this after testing!**

---

## Tell Me:

1. What does Step 1 (SQL query) show?
2. What does Step 2 (browser console) show?
3. What happens when you go to `/admin`? (Which behavior: A, B, C, or D?)

Then I can give you the exact fix! 🔍

