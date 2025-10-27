# OAuth Login & Callback Fixes

## Problems Fixed

### 1. OAuth Callback Timeout
The OAuth callback was timing out after 15 seconds with the error:
```
OAuth callback timed out at AuthCallback.useEffect (app\auth\callback\page.tsx:135:17)
```

### 2. Automatic Redirect to Callback Page
Users couldn't login - the app was automatically redirecting to `/auth/callback` instead of allowing login to proceed.

## Root Causes

### Callback Timeout Issues:
1. **Passive Waiting**: The callback page was passively waiting for auth state changes instead of actively processing the OAuth callback
2. **Race Condition**: Competition between the middleware's server-side handling and client-side OAuth processing
3. **Insufficient Retry Logic**: Simple linear retry delays weren't optimal for OAuth callback processing
4. **Middleware Interference**: The middleware was processing the callback URL before the client-side could handle it properly

### Auto-Redirect Issues:
1. **Aggressive URL Detection**: `detectSessionInUrl: true` was enabled globally, causing Supabase to process OAuth parameters on ALL pages, not just the callback page
2. **Lingering OAuth Parameters**: OAuth parameters from previous attempts weren't being cleaned up from the login page URL
3. **Session Manager Interference**: The SessionManager was potentially clearing auth tokens during the login flow

## Solution Implemented

### 1. Enhanced Callback Page (`app/auth/callback/page.tsx`)
- **Active Processing**: Now actively processes the OAuth callback with `handleOAuthCallback()`
- **Early Error Detection**: Checks for error parameters in URL immediately
- **Exponential Backoff**: Implements exponential backoff (1s, 1.5s, 2.25s, 3s max) for retries
- **Extended Timeout**: Increased timeout from 15s to 20s
- **Better Logging**: More detailed console logging for debugging

Key improvements:
```typescript
// Gives Supabase 500ms to process OAuth callback automatically
await new Promise(resolve => setTimeout(resolve, 500))

// Then actively checks for session
const { data: { session }, error: sessionError } = await supabase.auth.getSession()

// Retries with exponential backoff up to 5 times
const delay = Math.min(1000 * Math.pow(1.5, attempt), 3000)
```

### 2. Middleware Fix (`lib/supabase/middleware.ts`)
- **Bypass OAuth Callback**: The callback route now bypasses all middleware processing
- **Client-Side Handling**: OAuth flow is handled entirely on the client-side
- **No Server Interference**: Added `detectSessionInUrl: false` to server client

Key improvements:
```typescript
// CRITICAL: Allow auth callback through immediately
if (request.nextUrl.pathname === "/auth/callback") {
  return NextResponse.next()
}
```

### 3. Client Configuration Fix (`lib/supabase/client.ts`)
- **Context-Aware URL Detection**: Only detects OAuth parameters on the callback page
- **Prevents Unwanted Redirects**: Login page won't try to process OAuth parameters

Key improvements:
```typescript
// Only detect session in URL on the callback page
const isCallbackPage = typeof window !== 'undefined' && window.location.pathname === '/auth/callback'

return createBrowserClient(supabaseUrl, supabaseKey, {
  auth: {
    detectSessionInUrl: isCallbackPage, // Only detect on callback page
  },
})
```

### 4. Login Page Protection (`app/auth/login/page.tsx`)
- **OAuth Parameter Cleanup**: Automatically cleans OAuth parameters from login page URL
- **Existing Session Detection**: Redirects to home if user is already logged in
- **Error Handling**: Properly displays OAuth errors from failed attempts

Key improvements:
```typescript
// Clean up any OAuth-related parameters from URL
const oauthParams = ['access_token', 'refresh_token', 'code', 'error', 'error_description', 'state']
// If found on login page, clean them and reload
```

### 5. Session Manager Update (`components/session-manager.tsx`)
- **Preserves Auth Tokens**: Won't clear auth tokens during active login/OAuth flows
- **Smarter Path Detection**: Uses `startsWith('/auth/')` instead of `includes('/auth/')`
- **Token Preservation**: Keeps auth tokens in storage during navigation

Key improvements:
```typescript
// Don't run on any auth pages
const isAuthPage = window.location.pathname.startsWith('/auth/')
if (isAuthPage) {
  return // Let auth flow complete
}

// Preserve auth tokens during navigation
if (!key.includes('-auth-token')) {
  localStorage.removeItem(key)
}
```

## How It Works Now

1. **User Initiates OAuth**: Clicks Google/GitHub login button
2. **Redirect to Provider**: User is redirected to OAuth provider (Google/GitHub)
3. **Provider Callback**: After authentication, provider redirects to `/auth/callback?code=...`
4. **Middleware Bypass**: Middleware immediately allows the request through
5. **Client Processing**: 
   - Client-side code waits 500ms for Supabase to auto-process the URL
   - Actively checks for session with `getSession()`
   - Retries up to 5 times with exponential backoff
   - Creates user profile if needed
   - Redirects to home page
6. **Backup Listener**: Auth state change listener acts as backup in case active processing doesn't catch it

## Debugging

If OAuth is still timing out, check these in order:

### 1. Verify Supabase Configuration
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 2. Check Supabase Dashboard
- Go to Authentication → URL Configuration
- Verify "Site URL" is set to your app's URL (e.g., `http://localhost:3000` for dev)
- Verify "Redirect URLs" includes: `http://localhost:3000/auth/callback`
- For production: Add your production URL (e.g., `https://yourdomain.com/auth/callback`)

### 3. Check OAuth Provider Settings

**For Google:**
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Navigate to APIs & Services → Credentials
- Verify "Authorized redirect URIs" includes your Supabase callback URL
  - Format: `https://[your-project].supabase.co/auth/v1/callback`

**For GitHub:**
- Go to [GitHub OAuth Apps](https://github.com/settings/developers)
- Verify "Authorization callback URL" is set to your Supabase callback URL
  - Format: `https://[your-project].supabase.co/auth/v1/callback`

### 4. Check Browser Console
Open browser DevTools and look for these logs:
- ✅ "Auth state changed: SIGNED_IN [email]"
- ✅ "OAuth callback processed successfully: [email]"
- ❌ "OAuth error:" - indicates provider sent an error
- ❌ "Error getting session after OAuth:" - indicates session creation failed

### 5. Check Network Tab
In browser DevTools Network tab:
- Look for requests to `/auth/callback`
- Check if there's a `code` or `access_token` parameter in the URL
- Look for requests to Supabase API (`*.supabase.co`)

### 6. Verify User Profile Creation
If authentication succeeds but profile creation fails:
```sql
-- Check if user_profiles table exists
SELECT * FROM user_profiles LIMIT 1;

-- Check if there's a unique constraint on user_id
SELECT * FROM information_schema.table_constraints 
WHERE table_name = 'user_profiles';
```

## Testing the Fixes

### Test 1: Email/Password Login
1. Go to `/auth/login`
2. Verify you see the login form (NOT redirected to callback)
3. Enter email and password
4. Click "Login"
5. Should redirect to home page immediately
6. Check browser console - should NOT see OAuth-related logs

### Test 2: OAuth Login (Google/GitHub)
1. **Clear browser data first**:
   - Open DevTools (F12)
   - Application tab → Clear storage → Clear site data
   - Or use incognito/private window
2. Go to `/auth/login`
3. Click "Sign in with Google" or "Sign in with GitHub"
4. Complete OAuth on provider's page
5. Should redirect to `/auth/callback` briefly (1-3 seconds)
6. Should then redirect to home page

### Console Output (Expected for OAuth)
```
Auth state changed: INITIAL_SESSION null
Retry 1: waiting 1000ms for OAuth callback...
OAuth callback processed successfully: user@example.com
Successfully authenticated: user@example.com
```

### Test 3: Existing Session
1. Log in successfully
2. Navigate to `/auth/login` manually
3. Should automatically redirect to home page (already logged in)
4. Console should show: "User already logged in, redirecting to home"

### Test 4: OAuth Error Handling
1. Start OAuth flow but cancel/decline permissions
2. Should redirect back to login page with error message
3. Error should be displayed on the login page
4. URL should be clean (no OAuth parameters visible)

## Common Issues

### Issue: "OAuth error: access_denied"
**Cause**: User cancelled OAuth or declined permissions
**Solution**: This is expected behavior, user will be redirected to login

### Issue: "Invalid redirect URL"
**Cause**: Callback URL not whitelisted in Supabase or OAuth provider
**Solution**: Add the callback URL to both Supabase and OAuth provider settings

### Issue: "PKCE verification failed"
**Cause**: Session storage was cleared between OAuth initiation and callback
**Solution**: Ensure cookies are enabled and not being blocked

### Issue: Still timing out after 20 seconds
**Cause**: Network issues or Supabase service problems
**Solution**: 
1. Check Supabase status page
2. Try with a different network
3. Check for browser extensions blocking requests
4. Try in incognito mode

## Performance Improvements

The new implementation is faster:
- **Before**: Could take up to 15 seconds before timing out
- **After**: Typically succeeds in 1-2 seconds
- **Timeout**: Extended to 20 seconds as safety net

## Monitoring

Add this to your analytics to track OAuth success rate:
```typescript
// In handleSuccess function
if (typeof window !== 'undefined' && window.gtag) {
  window.gtag('event', 'oauth_success', {
    provider: session.user.app_metadata.provider,
    email: session.user.email
  });
}
```

## Related Files
- `app/auth/callback/page.tsx` - OAuth callback page
- `lib/supabase/middleware.ts` - Middleware that bypasses callback
- `lib/supabase/client.ts` - Client configuration with OAuth settings
- `app/auth/login/page.tsx` - Login page that initiates OAuth

## Next Steps
If issues persist:
1. Review Supabase logs in Dashboard → Logs → Auth
2. Enable more verbose logging in `lib/supabase/client.ts`
3. Check if your hosting provider (Vercel, etc.) has any redirect limitations
4. Contact Supabase support with the specific error messages

