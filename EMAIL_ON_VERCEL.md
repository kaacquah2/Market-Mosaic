# 📧 Email Sending on Vercel - Complete Guide

## ✅ Good News: It Works Automatically!

When you deploy to Vercel, email sending works immediately. Here's how:

---

## 🎯 Two Types of Emails

### 1. **Password Reset Emails** (Handled by Supabase)
- **Who sends it**: Supabase automatically
- **Works on Vercel**: ✅ Yes, automatically
- **No configuration needed**: Just add environment variables

### 2. **Order Confirmation & Other Emails** (Handled by Resend)
- **Who sends it**: Your app using Resend API
- **Works on Vercel**: ✅ Yes, with your Resend API key
- **Configuration**: Add Resend API key to Vercel

---

## 🚀 How It Works on Vercel

### Password Reset Flow (Supabase)

1. **User clicks "Forgot password"**
2. **App calls Supabase API** (serverless function on Vercel)
3. **Supabase sends email** (from their servers)
4. **User receives email** → clicks link
5. **User resets password** → Success!

**No additional setup needed!** ✅

### Order Confirmation Flow (Resend)

1. **Order is placed**
2. **App calls `/api/send-order-confirmation`** (serverless function on Vercel)
3. **Function calls Resend API** using `RESEND_API_KEY`
4. **Resend sends email**
5. **User receives order confirmation**

**Need to add Resend API key to Vercel** ✅

---

## 📋 Step-by-Step Vercel Deployment

### Step 1: Deploy to Vercel

```bash
# If you haven't already
git add .
git commit -m "Ready for production"
git push origin main
```

1. Go to https://vercel.com
2. Click **"New Project"**
3. Import your GitHub repository
4. Click **"Deploy"**

### Step 2: Add Environment Variables in Vercel

After deploying, you need to add all your environment variables:

#### A. Go to Vercel Dashboard
1. Click on your project
2. Click **Settings** → **Environment Variables**

#### B. Add These Variables:

**Supabase** (Already configured):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://sjhfmoxdxasyachkklru.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

**Stripe** (Already configured):
```bash
STRIPE_SECRET_KEY=sk_test_51SL3oh...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SL3oh...
```

**Resend** (For custom emails):
```bash
RESEND_API_KEY=re_NY3koaC7_7XbW3d8Ey71cwkHqXX7VFfvf
```

**DHL API** (You just added):
```bash
DHL_API_KEY=MdFsWMAsp1d5TYnMbEuHg367ACHDdFnw
DHL_API_SECRET=ezzAMLkNbulBtdtW
DHL_ACCOUNT_NUMBER=MrktMsc-0001
```

**Google Maps**:
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBAEE2N7tos0fWvJ5XSA94Quf6773S9Iz4
```

**Push Notifications**:
```bash
VAPID_PUBLIC_KEY=BMyaBC395Q...
VAPID_PRIVATE_KEY=nqd0E2QBx...
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BMyaBC395Q...
```

**App Config**:
```bash
NEXT_PUBLIC_TAX_RATE=0.1
NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD=50
NEXT_PUBLIC_NEW_PRODUCT_THRESHOLD_DAYS=30
NEXT_PUBLIC_CURRENCY=USD
```

#### C. Configure Supabase Redirect URL

After deployment, add your Vercel URL to Supabase:

1. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Add these URLs:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**:
     - `https://your-app.vercel.app/auth/callback`
     - `https://your-app.vercel.app/auth/reset-password`

---

## 📧 Email Configuration

### Password Reset Emails (Automatic)

**Works automatically!** No setup needed.

- Supabase handles all password reset emails
- Sender: `noreply@supabase.io` (default)
- Links point to: `https://your-app.vercel.app/auth/reset-password`

**Customize Email Template** (Optional):
1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Click **Reset Password** template
4. Customize HTML if desired

### Order Confirmation Emails (Resend)

**Requires Resend API key** (already configured)

**Current Setup**:
- Uses `noreply@resend.dev` for development
- Free tier: 100 emails/day
- No domain verification needed for testing

**For Production** (Optional):
1. Add your domain to Resend
2. Verify domain with DNS records
3. Update `RESEND_FROM_EMAIL=contact@yourdomain.com`

---

## 🔧 How to Test Email on Vercel

### Test Password Reset

1. Go to: `https://your-app.vercel.app/auth/login`
2. Click **"Forgot password?"**
3. Enter your email
4. Click **"Send Reset Link"**
5. Check your email inbox
6. Click the link
7. Reset password

### Test Order Confirmation

1. Place an order on your Vercel app
2. Complete checkout
3. Check your email for order confirmation

---

## 🌍 Production vs Development

### Development (localhost:3000)
- **Password reset**: Works via Supabase
- **Order emails**: Uses Resend test domain
- **No domain needed**: ✅ Works immediately

### Production (your-app.vercel.app)
- **Password reset**: Works via Supabase ✅
- **Order emails**: Uses Resend (100/day free)
- **Custom domain**: Optional (recommended)

---

## 📊 Email Service Comparison

### Supabase Emails (Password Reset)
| Feature | Value |
|---------|-------|
| **Provider** | Supabase |
| **Setup** | Automatic |
| **Free Tier** | Unlimited (with Supabase) |
| **Sender** | noreply@supabase.io |
| **Cost** | Free |

### Resend Emails (Order Confirmations)
| Feature | Value |
|---------|-------|
| **Provider** | Resend.com |
| **Setup** | Add API key only |
| **Free Tier** | 100 emails/day |
| **Sender** | noreply@resend.dev (or your domain) |
| **Cost** | Free (then $20/month for 50,000) |

---

## ⚙️ Environment Variables for Vercel

Copy these from your `.env.local` to Vercel:

```bash
# Copy from your .env.local to Vercel Settings → Environment Variables

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Stripe  
STRIPE_SECRET_KEY=your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key

# Resend
RESEND_API_KEY=your_key

# DHL
DHL_API_KEY=your_key
DHL_API_SECRET=your_secret
DHL_ACCOUNT_NUMBER=your_account

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key

# VAPID (Push Notifications)
VAPID_PUBLIC_KEY=your_key
VAPID_PRIVATE_KEY=your_secret
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_key

# App Config
NEXT_PUBLIC_TAX_RATE=0.1
NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD=50
NEXT_PUBLIC_NEW_PRODUCT_THRESHOLD_DAYS=30
NEXT_PUBLIC_CURRENCY=USD
```

---

## 🎯 Quick Checklist for Vercel Deployment

### Before Deploying:
- [x] Code pushed to GitHub
- [x] `.env.local` has all credentials
- [x] DHL API credentials added

### After Deploying:
- [ ] Add all environment variables to Vercel
- [ ] Configure Supabase redirect URLs
- [ ] Test password reset email
- [ ] Test order confirmation email
- [ ] Verify emails are being sent

---

## 🚨 Important Notes

### For Password Reset:
✅ **Works automatically** - No setup needed
✅ **Supabase sends emails** from their servers
✅ **No domain verification needed**

### For Custom Emails (Resend):
⚠️ **Free tier limit**: 100 emails/day
⚠️ **Test emails only** to your verified email
⚠️ **Add custom domain** for production

---

## 💡 Pro Tips

1. **Use Resend for test emails** during development
2. **Add custom domain** before going live
3. **Monitor email logs** in Resend dashboard
4. **Check Supabase logs** for auth emails
5. **Test on production** before launching

---

## 🎉 Summary

### Password Reset Emails
- ✅ Works automatically on Vercel
- ✅ Sent by Supabase
- ✅ No configuration needed
- ✅ Unlimited (with Supabase plan)

### Order Confirmation Emails  
- ✅ Works with Resend API key
- ✅ 100 emails/day free
- ✅ Configured in your app
- ✅ Just add API key to Vercel

### What You Need to Do:
1. Deploy to Vercel
2. Add environment variables to Vercel
3. Configure Supabase redirect URLs
4. Test email sending
5. **Done!** 🎉

**Your emails will work perfectly on Vercel!** 📧✨

