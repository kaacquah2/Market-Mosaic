# Production Deployment Guide

This guide walks you through deploying Market Mosaic to production.

## 🚀 Quick Deployment to Vercel (Recommended)

### Step 1: Prepare Your Environment Variables

For **Vercel deployment**, update your environment variables:

```bash
# In Vercel dashboard > Project Settings > Environment Variables

# Production Domain
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-app-name.vercel.app

# Or if using custom domain
NEXT_PUBLIC_APP_URL=https://www.yourdomain.com
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://www.yourdomain.com

# Set Node Environment
NODE_ENV=production
```

### Step 2: Update Supabase OAuth Redirect URLs

Go to your Supabase Dashboard:
1. **Authentication** → **URL Configuration**
2. Add your production URLs:
   - **Site URL**: `https://your-app-name.vercel.app`
   - **Redirect URLs**: 
     - `https://your-app-name.vercel.app/auth/callback`
     - `https://yourdomain.com/auth/callback` (if using custom domain)

3. **Providers** → **Google**
   - Update **Authorized redirect URIs** in Google Cloud Console:
     - `https://your-app-name.vercel.app/auth/callback`

4. **Providers** → **GitHub**
   - Update **Authorization callback URL** in GitHub:
     - `https://your-app-name.vercel.app/auth/callback`

### Step 3: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Or push to GitHub and connect to Vercel
git push origin master
# Then connect your repo at vercel.com/new
```

### Step 4: Set Environment Variables in Vercel

After deploying, add all your environment variables in Vercel dashboard:

1. Go to your project in Vercel
2. **Settings** → **Environment Variables**
3. Add all variables from `.env.local` (except sensitive keys)
4. For each variable, select **Production**, **Preview**, and **Development** environments

**Important variables to set:**
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=
```

### Step 5: Update Stripe Webhooks

1. Go to **Stripe Dashboard** → **Developers** → **Webhooks**
2. Add endpoint: `https://your-app-name.vercel.app/api/checkout/confirm`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`

## 🌐 Custom Domain Setup

If you have a custom domain (e.g., `www.marketmosaic.com`):

### 1. Add Domain in Vercel

1. Go to your project → **Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

### 2. Update Environment Variables

```bash
NEXT_PUBLIC_APP_URL=https://www.yourdomain.com
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://www.yourdomain.com
```

### 3. Update All OAuth Provider Redirects

Update Google, GitHub, and Supabase with your custom domain instead of the Vercel URL.

## 📋 Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Supabase OAuth redirect URLs updated
- [ ] Google OAuth redirect URLs updated
- [ ] GitHub OAuth redirect URLs updated
- [ ] Stripe webhook endpoint configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Test OAuth login flow
- [ ] Test checkout process
- [ ] Test email notifications
- [ ] Test push notifications

## 🔧 Post-Deployment Testing

After deployment, test these critical flows:

1. **User Registration** (`/auth/sign-up`)
2. **User Login** (`/auth/login`)
3. **OAuth Login** (Google/GitHub)
4. **Profile Update** (`/account` → Profile tab)
5. **Add to Cart** → **Checkout** → **Payment**
6. **Order Confirmation Email**
7. **Push Notifications**

## 🚨 Production Security Checklist

- [ ] Use `STRIPE_SECRET_KEY` (production keys) instead of test keys
- [ ] Limit `NEXT_PUBLIC_SUPABASE_ANON_KEY` to necessary permissions
- [ ] Enable Supabase RLS (Row Level Security) on all tables
- [ ] Set up proper CORS configuration
- [ ] Enable rate limiting on API routes
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Enable analytics tracking
- [ ] Set up backup for Supabase database
- [ ] Configure proper logging

## 📊 Monitoring & Analytics

### Recommended Tools:

1. **Vercel Analytics** (built-in)
   ```bash
   npm install @vercel/analytics
   ```

2. **Error Tracking: Sentry**
   ```bash
   npm install @sentry/nextjs
   ```

3. **Performance: Web Vitals**
   - Already included in Next.js

## 🔄 CI/CD Pipeline

Your Git workflow:
```bash
# Local development
git checkout -b feature/new-feature
# ... make changes ...
git commit -m "feat: new feature"
git push origin feature/new-feature

# After PR merge to master
# → Vercel automatically deploys to production
```

## 💡 Tips

1. **Always test on preview deployments first** before merging to master
2. **Use Vercel's preview URLs** to test OAuth before production
3. **Keep your Stripe keys in test mode** until you're ready for real payments
4. **Monitor your Vercel usage** to avoid hitting limits
5. **Set up alerts** for errors and deployment failures

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Stripe Docs**: https://stripe.com/docs

---

**Ready to deploy?** Follow the steps above and your app will be live in minutes! 🚀

