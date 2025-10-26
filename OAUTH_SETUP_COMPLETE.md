# Complete OAuth Setup for Google and GitHub

Your Supabase URL: **https://sjhfmoxdxasyachkklru.supabase.co**
Callback URL: **https://sjhfmoxdxasyachkklru.supabase.co/auth/v1/callback**

---

## 🔧 **Step 1: Configure Google OAuth**

### A. Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select Project**
   - Click on project dropdown at top
   - Click "New Project"
   - Name it "Market Mosaic" (or your choice)
   - Click "Create"

3. **Enable Google+ API**
   - Go to: https://console.cloud.google.com/apis/library
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "+ CREATE CREDENTIALS"
   - Select "OAuth client ID"
   - If prompted, choose "Web application"
   
5. **Configure OAuth Client**
   - Name: `Market Mosaic`
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `https://sjhfmoxdxasyachkklru.supabase.co`
   - Authorized redirect URIs:
     - `https://sjhfmoxdxasyachkklru.supabase.co/auth/v1/callback`
   - Click "CREATE"
   
6. **Copy Credentials**
   - Copy the **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)
   - Copy the **Client Secret**

### B. Configure in Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/sjhfmoxdxasyachkklru

2. **Navigate to Authentication**
   - Left sidebar → **Authentication** → **Providers**
   - Scroll down to find "Google"

3. **Enable and Configure Google**
   - Toggle **Enable Google provider** to ON
   - Paste your **Client ID** from Google Cloud Console
   - Paste your **Client Secret** from Google Cloud Console
   - Click **Save**

---

## 🔧 **Step 2: Configure GitHub OAuth**

### A. Create GitHub OAuth App

1. **Go to GitHub Developer Settings**
   - Visit: https://github.com/settings/developers
   - Sign in if needed

2. **Create New OAuth App**
   - Click "New OAuth App" button
   - Fill in the form:
     - **Application name**: `Market Mosaic`
     - **Homepage URL**: `http://localhost:3000`
     - **Authorization callback URL**: `https://sjhfmoxdxasyachkklru.supabase.co/auth/v1/callback`
   - Click "Register application"

3. **Copy Credentials**
   - Copy the **Client ID**
   - Generate and copy the **Client Secret**:
     - Click "Generate a new client secret"
     - Copy the secret immediately (you won't see it again)

### B. Configure in Supabase

1. **In Supabase Dashboard**
   - Go to **Authentication** → **Providers**
   - Find "GitHub"

2. **Enable and Configure GitHub**
   - Toggle **Enable GitHub provider** to ON
   - Paste your **Client ID** from GitHub
   - Paste your **Client Secret** from GitHub
   - Click **Save**

---

## 🔧 **Step 3: Configure Supabase Redirect URLs**

1. **In Supabase Dashboard**
   - Go to **Authentication** → **URL Configuration**

2. **Add Site URL**
   - **Site URL**: `http://localhost:3000`

3. **Add Redirect URLs**
   Add these URLs one by one:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000
   https://your-production-domain.com/auth/callback
   ```

4. **Click Save**

---

## 🧪 **Step 4: Test OAuth Login**

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Navigate to login page**
   - Go to: http://localhost:3000/auth/login

3. **Test Google OAuth**
   - Click the "Google" button
   - You should be redirected to Google login
   - Sign in with your Google account
   - You should be redirected back to your app

4. **Test GitHub OAuth**
   - Click the "GitHub" button
   - You should be redirected to GitHub login
   - Sign in with your GitHub account
   - You should be redirected back to your app

---

## ✅ **Verification Checklist**

- [ ] Google OAuth enabled in Supabase
- [ ] Google Client ID and Secret configured
- [ ] GitHub OAuth enabled in Supabase
- [ ] GitHub Client ID and Secret configured
- [ ] Redirect URLs added in Supabase
- [ ] Google OAuth app created in Google Cloud Console
- [ ] GitHub OAuth app created in GitHub
- [ ] Tested Google login successfully
- [ ] Tested GitHub login successfully

---

## 🐛 **Troubleshooting**

### Issue: "Access blocked" error
**Solution**: Make sure:
- OAuth providers are enabled in Supabase dashboard
- Client IDs and Secrets are correct
- Callback URL matches exactly: `https://sjhfmoxdxasyachkklru.supabase.co/auth/v1/callback`

### Issue: "Redirect URI mismatch
**Solution**: Check that callback URL in OAuth provider matches:
- Google: In Google Cloud Console → Credentials → Your OAuth client
- GitHub: In GitHub → Settings → Developer settings → OAuth Apps → Your app

### Issue: OAuth buttons don't work
**Solution**: 
- Check browser console for errors
- Verify `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL`
- Make sure development server is running

### Issue: Authentication works but user not created
**Solution**: 
- Check if user_roles table exists
- Verify RLS policies allow user creation
- Check Supabase logs for errors

---

## 📝 **Important URLs**

- **Supabase Dashboard**: https://supabase.com/dashboard/project/sjhfmoxdxasyachkklru
- **Google Cloud Console**: https://console.cloud.google.com/
- **GitHub Developer Settings**: https://github.com/settings/developers
- **Supabase Project URL**: https://sjhfmoxdxasyachkklru.supabase.co
- **Callback URL**: https://sjhfmoxdxasyachkklru.supabase.co/auth/v1/callback

---

## 🎉 **You're All Set!**

Once configured, users can log in with:
- Email/password
- Google OAuth
- GitHub OAuth

All authentication is handled by Supabase Auth with automatic user profile creation.

