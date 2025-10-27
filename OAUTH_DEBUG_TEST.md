# OAuth Debug Test Guide

## What I Just Fixed

The OAuth callback was timing out because:
1. **Session Manager was potentially clearing PKCE verifier** when navigating to OAuth provider
2. **Not explicitly exchanging OAuth code** for session
3. **No clear logging** to see what was happening

## New Features Added

### 1. Explicit Code Exchange
The callback page now explicitly exchanges the OAuth code for a session using `exchangeCodeForSession()` instead of relying on automatic detection.

### 2. OAuth-In-Progress Flag
- When you click "Sign in with Google/GitHub", a flag is set: `oauth-in-progress`
- This prevents the SessionManager from clearing your PKCE verifier
- Flag is cleared when login completes

### 3. Better Logging
You'll now see detailed console logs:
- 🔐 OAuth flow started
- 📍 URL and code detection
- ✅ Success or ❌ Error with details

## How to Test (IMPORTANT - Follow These Steps!)

### Step 1: Open Browser DevTools
```
Press F12 to open DevTools
Go to Console tab
```

### Step 2: Clear Everything First
```
In DevTools:
- Application tab → Storage → Clear site data
- Or just use Incognito/Private window
```

### Step 3: Start OAuth Login
```
1. Go to http://localhost:3000/auth/login
2. Open Console (F12)
3. Click "Sign in with Google" (or GitHub)
```

### Step 4: Watch Console Logs

You should see:
```
✅ 🔐 Starting OAuth flow with google
✅ 🔐 OAuth redirect initiated
   [Browser redirects to Google...]
   [You complete OAuth on Google...]
   [Browser redirects back to /auth/callback]
✅ Starting OAuth callback processing...
✅ URL: http://localhost:3000/auth/callback?code=...
✅ Found OAuth code, exchanging for session...
✅ OAuth callback processed successfully: your@email.com
✅ ✅ Successfully authenticated: your@email.com
✅ OAuth callback successful!
   [Redirects to home page]
```

### Step 5: Check for Errors

If you see any of these, tell me EXACTLY what the error says:

❌ **"Error exchanging code for session"**
- This means PKCE verifier is missing or invalid
- Check if you see the error details in console

❌ **"No code found, checking for existing session..."**
- The OAuth callback URL doesn't have a `code` parameter
- Check the full URL in the console log

❌ **"❌ Unrecoverable OAuth error: PKCE"**
- PKCE verifier was cleared during OAuth flow
- Should NOT happen now with the new OAuth flag

❌ **"OAuth callback timed out after 20 seconds"**
- Still timing out - check Supabase configuration

## What Each Log Means

| Log | Meaning | Action |
|-----|---------|--------|
| 🔐 Starting OAuth flow | Login initiated | ✅ Good |
| 🔐 OAuth redirect initiated | Redirect to Google/GitHub starting | ✅ Good |
| 📍 On auth page, skipping session clear | Session manager won't interfere | ✅ Good |
| 🔐 OAuth in progress, skipping session clear | PKCE verifier protected | ✅ Good |
| Starting OAuth callback processing... | Callback page loaded | ✅ Good |
| Found OAuth code, exchanging... | Code detected, exchanging | ✅ Good |
| OAuth callback processed successfully | Session created! | ✅ Good |
| ✅ Successfully authenticated | Profile created | ✅ Good |

## Troubleshooting

### If OAuth Still Times Out:

1. **Check the URL when on /auth/callback**
   - Does it have `?code=` in the URL?
   - If yes: PKCE verifier issue
   - If no: Supabase redirect URL misconfigured

2. **Check Console for PKCE Errors**
   ```
   Look for: "PKCE" or "verifier" or "code_verifier"
   ```

3. **Check localStorage**
   ```
   In DevTools:
   Application → Local Storage → your domain
   Look for keys containing "code-verifier" or "pkce"
   Should exist when on /auth/callback
   ```

4. **Check Supabase Dashboard**
   ```
   Authentication → URL Configuration
   Redirect URLs MUST include:
   - http://localhost:3000/auth/callback
   ```

5. **Check Network Tab**
   ```
   In DevTools → Network tab
   Look for requests to your Supabase URL
   Check if any fail with 400 or 401
   ```

### If You See "PKCE verification failed":

This means the code verifier was cleared. Check:
```javascript
// In console while on callback page:
Object.keys(localStorage).filter(k => k.includes('verifier') || k.includes('pkce'))

// Should return something like:
// ["sb-[project]-auth-token-code-verifier"]
```

If this returns empty `[]`, the verifier was cleared. This shouldn't happen with the new code.

### If Still Broken:

Share with me:
1. **Full console output** (all logs from clicking OAuth button to timeout)
2. **The callback URL** (the full URL shown in console: `URL: ...`)
3. **localStorage keys** (run the code above in console)
4. **Any error messages** (exact text of any errors)

## Expected Behavior Now

### ✅ CORRECT (Should happen):
- OAuth completes in **1-2 seconds** (not 20!)
- Console shows clear success logs with ✅
- Redirects to home page smoothly
- No "timeout" errors

### ❌ INCORRECT (Tell me if this happens):
- ~~Times out after 20 seconds~~
- ~~"No code found" message~~
- ~~"PKCE verification failed"~~
- ~~Stuck on callback page~~

## Quick Test Checklist

- [ ] Cleared browser storage (or using incognito)
- [ ] Console is open (F12)
- [ ] Clicked "Sign in with Google/GitHub"
- [ ] Saw "🔐 Starting OAuth flow" in console
- [ ] Completed OAuth on provider page
- [ ] Returned to /auth/callback
- [ ] Saw "Found OAuth code, exchanging..." in console
- [ ] Saw "OAuth callback processed successfully" in console
- [ ] Redirected to home page within 1-2 seconds

If ALL checked: **✅ OAuth is working!**

If ANY failed: **Share console logs with me**

---

**Try it now and let me know what you see in the console!** 🔍

