# API Keys Configuration Guide

This guide shows you how to obtain all the API keys needed for your Market Mosaic application.

## ✅ VAPID Keys (Push Notifications)

**Status: Already Generated!** ✅

Your VAPID keys have been generated and added to `.env.local`:
- **Public Key**: `BMyaBC395QZh6XggQmsvIKQGrmCCdIvL1PnHpr0Y4_CfpRWX-gfAW3EdJ4ghyBEx-GH3tHrHC5OIvXlS34wTeJU`
- **Private Key**: `nqd0E2QBxCI5vKn6A4SScJD4s0VZ-TIoGIdoDINEkQ4`

**To generate new keys (if needed):**
```bash
npx web-push generate-vapid-keys
```

---

## 🔐 Supabase API Keys

**Current Status**: Already configured in `.env.local`

Your Supabase keys are set. To get new ones:

1. Go to: https://supabase.com/dashboard
2. Select your project
3. **Settings** → **API**
4. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 💳 Stripe API Keys

**Current Status**: Test keys already configured

Your Stripe test keys are working. For production:

### Test Keys (Current)
- Already in `.env.local`
- Use these for development

### Production Keys

1. Go to: https://dashboard.stripe.com/apikeys
2. **Switch to live mode** (top right)
3. Copy:
   - `Secret key` → `STRIPE_SECRET_KEY`
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Important**: Only use production keys when you're ready to accept real payments!

---

## 🗺️ Google Maps API Key

**Current Status**: Already configured

To get a new key or increase quota:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click **"Create Credentials"** → **"API Key"**
3. Restrict the key:
   - **Application restrictions**: HTTP referrers
   - **API restrictions**: Enable **Maps JavaScript API**
4. Copy the key to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

**Note**: Google Maps has a free tier with $200 credit per month.

---

## 📧 Resend API Key (Email Service)

**Current Status**: Already configured

Your Resend API key is set. To get a new one:

1. Go to: https://resend.com/api-keys
2. Click **"Create API Key"**
3. Copy the key to `RESEND_API_KEY`

**Features**:
- 100 emails/day free tier
- Transactional emails
- Order confirmations
- Password resets

---

## 🔐 OAuth Providers (Google & GitHub)

### Google OAuth

**Setup Required**:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 credentials:
   - **Application type**: Web application
   - **Name**: Market Mosaic
   - **Authorized redirect URIs**:
     - `http://localhost:3000/auth/callback` (development)
     - `https://your-domain.com/auth/callback` (production)
3. Copy:
   - **Client ID** and **Client Secret**

**Then configure in Supabase**:
1. Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Enable Google provider
3. Paste Client ID and Client Secret
4. Save

### GitHub OAuth

**Setup Required**:

1. Go to: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: Market Mosaic
   - **Homepage URL**: Your domain
   - **Authorization callback URL**:
     - `http://localhost:3000/auth/callback` (development)
     - `https://your-domain.com/auth/callback` (production)
4. Copy:
   - **Client ID** and **Client Secret**

**Then configure in Supabase**:
1. Supabase Dashboard → **Authentication** → **Providers** → **GitHub**
2. Enable GitHub provider
3. Paste Client ID and Client Secret
4. Save

---

## 📊 Google Analytics (Optional)

1. Go to: https://analytics.google.com
2. Create a new property
3. Get your **Measurement ID** (GA-XXXXXXXXX)
4. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
   ```

---

## 🔍 Unsplash API (Product Images)

**Current Status**: Already configured for development

Your Unsplash keys are set. To get your own:

1. Go to: https://unsplash.com/developers
2. Create a developer account
3. Create an application
4. Copy:
   - **Access Key** → `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`
   - **Secret Key** → `UNSPLASH_SECRET_KEY`

**Note**: Unsplash has generous free tier limits.

---

## ✅ Verification Checklist

After setting up all keys, verify:

- [ ] VAPID keys generated and added
- [ ] Supabase keys configured
- [ ] Stripe keys configured (test or production)
- [ ] Google Maps API key configured
- [ ] Resend API key configured
- [ ] Google OAuth configured in Supabase
- [ ] GitHub OAuth configured in Supabase
- [ ] OAuth redirect URLs set for both development and production

---

## 🚨 Important Security Notes

1. **Never commit `.env.local` to Git**
   - It's already in `.gitignore`
   - Double-check it's not tracked

2. **Use different keys for development and production**
   - Keep test keys for development
   - Use production keys only in production

3. **Rotate keys regularly**
   - If a key is compromised, generate new ones
   - Update all environment variables immediately

4. **Restrict API keys**
   - Add IP restrictions where possible
   - Enable API restrictions in Google Cloud Console
   - Use the minimum necessary permissions

---

## 💡 Quick Reference

| Service | Key Name | Where to Get |
|---------|----------|--------------|
| VAPID | Generated | `npx web-push generate-vapid-keys` |
| Supabase | Dashboard | supabase.com/dashboard |
| Stripe | Dashboard | dashboard.stripe.com |
| Google Maps | Console | console.cloud.google.com |
| Resend | Dashboard | resend.com/api-keys |
| Google OAuth | Console | console.cloud.google.com |
| GitHub OAuth | Settings | github.com/settings |
| Unsplash | Developer | unsplash.com/developers |

---

## 🆘 Need Help?

- **Supabase**: https://supabase.com/docs
- **Stripe**: https://stripe.com/docs
- **Google Cloud**: https://cloud.google.com/docs
- **Resend**: https://resend.com/docs

Your development environment is now fully configured! 🎉

