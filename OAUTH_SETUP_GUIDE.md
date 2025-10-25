# OAuth Authentication Setup Guide

## Problem
Google and GitHub authentication shows "access blocked" because the OAuth providers are not configured in your Supabase project.

## Solution

### Step 1: Configure GitHub OAuth

1. **Create GitHub OAuth App**
   - Go to https://github.com/settings/developers
   - Click "New OAuth App"
   - Fill in the details:
     - **Application name**: Market Mosaic (or your app name)
     - **Homepage URL**: `http://localhost:3000` (for development) or your production URL
     - **Authorization callback URL**: `https://bxochkubnwuiecdyafry.supabase.co/auth/v1/callback`
   - Click "Register application"
   - **Copy the Client ID and Client Secret**

2. **Configure in Supabase**
   - Go to your Supabase project: https://supabase.com/dashboard
   - Navigate to: **Authentication** → **Providers**
   - Find **GitHub** provider
   - Enable it
   - Paste your GitHub **Client ID** and **Client Secret**
   - Click **Save**

### Step 2: Configure Google OAuth

1. **Create Google OAuth Credentials**
   - Go to https://console.cloud.google.com/
   - Create a new project or select existing one
   - Enable **Google+ API**
   - Navigate to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client ID**
   - Choose **Web application**
   - Fill in:
     - **Name**: Market Mosaic
     - **Authorized JavaScript origins**: 
       - `http://localhost:3000` (for development)
       - `https://bxochkubnwuiecdyafry.supabase.co` (Supabase URL)
     - **Authorized redirect URIs**:
       - `https://bxochkubnwuiecdyafry.supabase.co/auth/v1/callback`
   - Click **Create**
   - **Copy the Client ID and Client Secret**

2. **Configure in Supabase**
   - Go to your Supabase project dashboard
   - Navigate to: **Authentication** → **Providers**
   - Find **Google** provider
   - Enable it
   - Paste your Google **Client ID** and **Client Secret**
   - Click **Save**

### Step 3: Update Supabase Redirect URLs

In your Supabase dashboard:
1. Go to **Authentication** → **URL Configuration**
2. Add these redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-production-domain.com/auth/callback`

### Step 4: Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/auth/login`

3. Click on "Google" or "GitHub" buttons

4. You should be redirected to the OAuth provider's login page

5. After successful authentication, you'll be redirected back to your app

## Troubleshooting

### Common Issues

**Issue**: "Access blocked" error
- **Solution**: Make sure OAuth providers are properly configured in Supabase dashboard with correct Client IDs and Secrets

**Issue**: Redirect URL mismatch
- **Solution**: Ensure the callback URL in your OAuth provider matches exactly: `https://bxochkubnwuiecdyafry.supabase.co/auth/v1/callback`

**Issue**: "Application not found"
- **Solution**: Verify your Supabase project URL and API keys in `.env.local`

**Issue**: OAuth provider shows error
- **Solution**: Check that Google+ API is enabled in Google Cloud Console

### Check Your Current Configuration

Your Supabase project URL: `https://bxochkubnwuiecdyafry.supabase.co`

Callback URL to use: `https://bxochkubnwuiecdyafry.supabase.co/auth/v1/callback`

## Additional Notes

- For **production**, update the redirect URLs to your actual domain
- Each OAuth provider requires separate configuration
- Keep your Client Secrets secure and never commit them to version control
- The `.env.local` file already contains your Supabase credentials

## Verify Setup

After configuration, test by:
1. Opening developer console (F12)
2. Go to Network tab
3. Click on Google/GitHub button
4. Look for successful redirect to OAuth provider
5. Check for any error messages in console

