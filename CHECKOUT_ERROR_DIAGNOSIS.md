# Checkout Error Diagnosis Guide

## Overview
The checkout system has been updated with detailed error logging to help identify issues. When you try to checkout now, you'll see specific error messages instead of the generic "Checkout failed" message.

## Improved Error Handling

### What Was Changed:

**Backend (`app/api/checkout/route.ts`):**
1. ✅ **Stripe Initialization Error Handling**: Catches missing `STRIPE_SECRET_KEY` explicitly
2. ✅ **Stripe Session Creation Error Handling**: Shows specific Stripe API errors
3. ✅ **Database Order Creation Error Handling**: Shows specific database errors
4. ✅ **Order Items Error Handling**: Logs but doesn't fail checkout if items fail
5. ✅ **Empty State/Postal Code Handling**: Now uses `|| ""` for countries that don't require these fields

**Frontend (`app/checkout/page.tsx`):**
1. ✅ **Better Error Parsing**: Now parses JSON error responses to show specific messages
2. ✅ **Improved Console Logging**: Better debugging information
3. ✅ **User-Friendly Alerts**: Shows the actual error message from the API

## Common Checkout Errors and Solutions

### 1. "Payment system not configured. Please contact support."
**Cause**: Missing `STRIPE_SECRET_KEY` environment variable

**Solution**:
```bash
# Add to your .env.local file:
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

**Steps**:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
3. Add it to `.env.local` in your project root
4. Restart your development server: `npm run dev`

---

### 2. "Stripe error: [specific message]"
**Cause**: Stripe API rejected the request

**Common Stripe Errors**:
- **"Invalid API Key"**: Wrong or expired Stripe key
- **"Amount must be at least [amount]"**: Total is too low (Stripe requires minimum amounts)
- **"Invalid currency"**: Currency code issue

**Solution**:
- Check your Stripe API key is correct and active
- Ensure cart total meets Stripe's minimum (usually $0.50 USD)
- Verify currency code in `lib/config.ts` matches Stripe's supported currencies

---

### 3. "Database error: [specific message]"
**Cause**: Database constraint or connection issue

**Common Database Errors**:
- **"duplicate key value"**: Order with same ID already exists
- **"foreign key constraint"**: User or product doesn't exist
- **"not-null constraint"**: Required field is missing
- **"permission denied"**: RLS policy blocking insert

**Solution**:
```sql
-- Check if orders table exists and has correct structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'orders';

-- Ensure user_roles table is set up correctly
SELECT * FROM user_roles WHERE user_id = 'your-user-id';
```

---

### 4. "Unauthorized"
**Cause**: User not logged in or session expired

**Solution**:
- Log out and log back in
- Clear browser cache and cookies
- Check Supabase project is running

---

## How to Test the Checkout Now

1. **Clear the browser console** (F12 → Console → Clear)
2. **Try to checkout** with items in your cart
3. **Check the console** for detailed error messages
4. **Check the terminal/server logs** for backend errors
5. **Look for specific error messages** that now include:
   - Stripe initialization errors
   - Stripe API errors with details
   - Database errors with table/column names
   - RLS policy errors

## Debug Checklist

When checkout fails, check these in order:

### ✅ Environment Variables
```bash
# Required in .env.local:
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### ✅ Stripe Account
- Account is activated
- API keys are from the correct environment (test/live)
- Currency matches your config

### ✅ Database Tables
```sql
-- Check orders table exists
SELECT * FROM orders LIMIT 1;

-- Check order_items table exists
SELECT * FROM order_items LIMIT 1;

-- Check shipping_methods table has data
SELECT * FROM shipping_methods;
```

### ✅ User Session
- User is logged in
- User has a profile in `user_profiles`
- Session hasn't expired

### ✅ Cart
- Cart has items
- Products exist in database
- Prices are valid numbers

## Testing with Different Countries

The checkout now handles different address formats:
- ✅ Countries with required state (US, Canada, India, etc.)
- ✅ Countries without required state (UK, France, most EU, etc.)
- ✅ Countries with optional postal codes (Philippines, Hong Kong, etc.)

The API now uses empty strings (`""`) for state/postal code when not provided, so it won't cause database errors.

## Next Steps

1. **Try checkout again** - you should now see a specific error message
2. **Share the error message** - the new error will tell exactly what's wrong
3. **Check the solutions above** - most issues can be fixed with the steps provided

## Example Error Messages You Might See

### Good Error Messages (specific and actionable):
```
"Payment system not configured. Please contact support."
→ Need to add STRIPE_SECRET_KEY

"Stripe error: No such customer: cus_123"
→ Invalid customer ID

"Database error: null value in column 'user_id' violates not-null constraint"
→ User session issue

"Database error: insert or update on table 'order_items' violates foreign key constraint"
→ Product doesn't exist in database
```

### What You Won't See Anymore:
```
"Checkout failed"  ❌ (Too vague)
→ Replaced with specific error messages ✅
```

## Need More Help?

If you still get errors, provide:
1. The exact error message from the alert
2. Console logs (browser F12)
3. Server logs (terminal where `npm run dev` is running)
4. Which country you selected for shipping

This will help diagnose the issue quickly!

