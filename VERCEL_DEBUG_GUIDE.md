# Vercel Deployment Debugging Guide

## Issue: Account Page Loading Forever on Vercel

### Quick Fixes

#### 1. Check Environment Variables in Vercel

Go to your Vercel project dashboard:
1. **Settings** → **Environment Variables**
2. Verify these variables are set correctly:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://sjhfmoxdxasyachkklru.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-vercel-app.vercel.app
```

#### 2. Redeploy After Environment Variable Changes

After updating environment variables:
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger redeploy

#### 3. Check Vercel Function Logs

1. Go to **Deployments** → **Latest deployment** → **Build Logs**
2. Look for errors related to:
   - `user_profiles` table queries
   - Authentication failures
   - RLS (Row Level Security) policy issues

#### 4. Test Database Connection

Create a test endpoint:
```typescript
// app/test-db/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('products').select('count')
  return NextResponse.json({ data, error })
}
```

Visit: `https://your-app.vercel.app/test-db`

### Common Issues and Solutions

#### Issue: "Timeout waiting for Supabase response"

**Cause**: Slow database queries, especially with RLS policies

**Solution 1**: Add indexes to speed up queries
```sql
-- Run in Supabase SQL Editor
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
```

**Solution 2**: Optimize RLS policies
```sql
-- Run in Supabase SQL Editor
-- Make sure policies are efficient
EXPLAIN ANALYZE SELECT * FROM user_profiles WHERE user_id = 'user-id-here';
```

#### Issue: "PGRST116" - No rows returned

**Cause**: Profile doesn't exist for the user

**Solution**: The code now handles this with `.maybeSingle()` and error handling. This should work, but if it doesn't:

1. Check if the trigger creates profiles on signup
2. Manually create profile if needed:
```sql
INSERT INTO user_profiles (user_id) 
VALUES ('user-id-here') 
ON CONFLICT (user_id) DO NOTHING;
```

#### Issue: CORS/Network errors

**Cause**: Supabase connection issues

**Solution**:
1. Check Supabase project is active
2. Verify API keys in Vercel match Supabase dashboard
3. Check if Supabase project has reached quota limits

### Debug Steps

#### Step 1: Check Supabase RLS Policies

Run in Supabase SQL Editor:
```sql
-- Check if policies exist
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

-- Test query as authenticated user
-- You'll need to test this with your actual user ID
SELECT * FROM user_profiles WHERE user_id = 'your-user-id';
```

#### Step 2: Test with Debug Endpoint

I've added a debug endpoint to your app:
Visit: `https://your-app.vercel.app/debug/account`

This will show:
- Authentication status
- Profile fetch timing and results
- Orders fetch timing and results
- Any errors

#### Step 3: Check Vercel Function Logs

1. Go to Vercel Dashboard
2. **Deployments** → **Latest** → **Logs**
3. Look for:
   - Timeout errors
   - Database connection errors
   - RLS policy violations

### Updated Code Changes

I've updated `app/account/page.tsx` to:
- Use `.maybeSingle()` instead of `.single()` (handles missing profiles)
- Add comprehensive error handling
- Gracefully handle timeouts
- Continue rendering even if profile/orders fetch fails

### Deployment Checklist

Before redeploying, ensure:

- [ ] Environment variables are set in Vercel
- [ ] Supabase project is active
- [ ] RLS policies allow user to read their own profile
- [ ] Database indexes are created
- [ ] OAuth callback URLs are updated
- [ ] No pending migrations in Supabase

### Quick Test

After fixes, test this flow:

1. ✅ Visit homepage
2. ✅ Login
3. ✅ Redirect to homepage after login
4. ✅ Navigate to `/account`
5. ✅ Page loads within 3 seconds
6. ✅ User info displays
7. ✅ Orders display (or "No orders" message)

### If Still Not Working

1. **Check Vercel Logs**:
   ```bash
   vercel logs --follow
   ```

2. **Check Supabase Logs**:
   - Go to Supabase Dashboard
   - **Logs** → **Postgres Logs**
   - Look for slow queries

3. **Use the Debug Endpoint**:
   ```
   https://your-app.vercel.app/debug/account
   ```
   This will show exactly what's failing.

4. **Disable RLS Temporarily** (for testing only):
   ```sql
   ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
   ```
   If this fixes it, the issue is with RLS policies.

### Monitoring

Set up monitoring:
1. **Vercel Analytics**: Already enabled
2. **Error Tracking**: Consider Sentry
3. **Performance**: Check Vercel Speed Insights

### Success Indicators

✅ Account page loads in < 3 seconds
✅ No errors in Vercel logs
✅ No errors in browser console
✅ Profile data displays correctly
✅ Orders load or show "No orders" message

---

**Next Steps**: 
1. Redeploy with updated code
2. Test the debug endpoint
3. Check logs for specific errors
4. Share debug endpoint results if still failing


