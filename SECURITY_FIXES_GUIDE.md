# Security Fixes Guide

This guide addresses the database linter security warnings from Supabase.

## 1. Function Search Path Security (CRITICAL)

### Issue
Several database functions have mutable search paths, which can lead to search path injection attacks.

### Affected Functions
- `create_user_notification_preferences`
- `log_notification_delivery`
- `update_return_timestamp`
- `update_ticket_timestamp`
- `cleanup_expired_2fa_sessions`
- `generate_backup_codes`
- `update_product_rating`
- `is_admin`
- `get_user_role`

### Fix Applied
A SQL script has been created to fix all affected functions by adding `SET search_path = ''` to their definitions. This prevents search path injection attacks by ensuring functions don't rely on the caller's search_path setting.

### How to Apply the Fix

⚠️ **IMPORTANT**: Read this section carefully if you have existing admin policies!

**Step 1: Check for conflicts**
If you get an error about `is_admin` not being unique, it means you have both UUID and TEXT versions of the function. Continue to Step 2.

**Step 2: Apply the main security fix**
**Option 1: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Open the file: `scripts/fix-function-search-path-security.sql`
4. Copy and paste the entire contents into the SQL Editor
5. Click "Run" to execute the script

**Option 2: Using Supabase CLI**
```bash
supabase db execute --file scripts/fix-function-search-path-security.sql
```

**Step 3: Update admin policies (if needed)**
If you were previously using `is_admin(auth.jwt() ->> 'email')` in your policies, you'll need to run:

```bash
# In Supabase SQL Editor or CLI
supabase db execute --file scripts/migrate-is-admin-policies.sql
```

This updates your admin policies to use the modern UUID-based `is_admin()` function that works with the `user_roles` table.

### Verification
After running the script, you can verify the fixes were applied by checking the database linter in Supabase Dashboard or by running:

```sql
SELECT 
  p.proname as function_name,
  pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN (
    'create_user_notification_preferences',
    'log_notification_delivery',
    'update_return_timestamp',
    'update_ticket_timestamp',
    'cleanup_expired_2fa_sessions',
    'generate_backup_codes',
    'update_product_rating',
    'is_admin',
    'get_user_role'
  )
ORDER BY p.proname;
```

You should see `SET search_path = ''` in the function definitions.

---

## 2. Auth OTP Long Expiry (SECURITY WARNING)

### Issue
OTP (One-Time Password) expiry is set to more than an hour, which is a security risk.

### Recommended Fix
1. Go to Supabase Dashboard → Authentication → Settings
2. Find "Email OTP" settings
3. Set the OTP expiry to 3600 seconds (1 hour) or less
4. Recommended value: **600 seconds (10 minutes)**

**Manual Steps:**
1. Navigate to: Authentication → Settings
2. Find "Email OTP Expiry"
3. Update to 600 (for 10 minutes) or 3600 (for 1 hour)
4. Click "Save"

---

## 3. Leaked Password Protection Disabled (SECURITY WARNING)

### Issue
Leaked password protection is disabled. Supabase Auth can check passwords against HaveIBeenPwned.org to prevent use of compromised passwords.

### Recommended Fix
Enable this feature in Supabase Dashboard.

**Manual Steps:**
1. Go to Supabase Dashboard → Authentication → Settings
2. Find "Password Security" or "Leaked Password Protection"
3. Enable the feature
4. Click "Save"

Or configure via SQL (if available):
```sql
UPDATE auth.config 
SET enable_leaked_password_protection = true;
```

---

## Summary

### Immediate Action Required (Run SQL Script)
✅ **Apply the function search path security fix**
- File: `scripts/fix-function-search-path-security.sql`
- This is a critical security fix

### Manual Configuration Required (Dashboard)
⚠️ **Configure OTP expiry**
- Set to 600 seconds (10 minutes) or less
- Location: Authentication → Settings

⚠️ **Enable leaked password protection**
- Enable the feature in Authentication → Settings

---

## After Applying Fixes

1. Re-run the database linter in Supabase Dashboard
2. Verify all warnings are resolved
3. Test your application to ensure functionality is not affected
4. Monitor logs for any issues

## Reference Links
- [Function Search Path Security](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable)
- [Going to Production - Security](https://supabase.com/docs/guides/platform/going-into-prod#security)
- [Password Security](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

