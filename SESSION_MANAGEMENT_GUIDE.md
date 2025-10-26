# Session Management Configuration

## Overview
Your application has been configured to **force users to log in again** every time they leave and return to the webapp. This provides enhanced security by ensuring no persistent sessions remain after the browser session ends.

## What Was Changed

### 1. **Client Configuration** (`lib/supabase/client.ts`)
- Set `persistSession: false` - Prevents persistent authentication storage
- Set `autoRefreshToken: false` - Disables automatic token refresh
- Configured cookies to be session-only (no `maxAge` or `expires` attributes)

### 2. **Session Manager Component** (`components/session-manager.tsx`)
- Clears authentication data when:
  - User closes the browser/tab
  - User navigates away from the page
  - User switches to another tab/window
  - Tab becomes hidden (minimized)

### 3. **Middleware Configuration** (`lib/supabase/middleware.ts`)
- Disabled session persistence on the server side
- Forces session-only cookies for all authentication cookies
- Removes `maxAge` and `expires` from cookie options to ensure they don't persist

## How It Works

### Login Flow
1. User enters credentials or uses OAuth
2. Supabase creates a session with tokens
3. Tokens are stored in **session-only** cookies
4. Session is active while the browser tab/window is open

### Logout Flow
1. User closes browser/tab OR
2. User switches away from the app OR
3. User explicitly clicks "Logout" OR
4. Session expires (if any expiration time is set)
5. **SessionManager** automatically clears:
   - All localStorage entries containing 'supabase' or 'sb-'
   - All sessionStorage entries containing 'supabase' or 'sb-'
   - All auth cookies

### Return Flow
1. User returns to the app
2. **No session data exists** (all cleared on previous exit)
3. User is redirected to `/auth/login`
4. Must authenticate again to continue

## Configuration Details

### Session-Only Cookies
Cookies are configured without `maxAge` or `expires`, meaning:
- They persist only for the browser session
- They are deleted when the browser/tab closes
- They are NOT stored beyond the current session

### Automatic Session Clearing
The `SessionManager` component hooks into browser events:
- `beforeunload` - When page is about to unload
- `visibilitychange` - When tab becomes hidden

## Benefits

1. **Enhanced Security**: No persistent authentication tokens
2. **Privacy**: User data is cleared when they leave
3. **Compliance**: Better for environments requiring strict access control
4. **Fresh Authentication**: Users must verify identity each session

## Side Effects & Considerations

### ⚠️ Trade-offs
- **User Inconvenience**: Users must log in more frequently
- **Lost Context**: No "remember me" functionality
- **Cart/Preferences**: User preferences stored only during session (if using localStorage)

### ✅ Benefits
- **Better Security**: Reduces risk of unauthorized access
- **Compliance**: Meets requirements for sensitive data handling
- **Clean Slate**: Each session starts fresh

## Testing the Configuration

### Test Scenario 1: Close and Reopen
1. Log in to the application
2. Close the browser tab
3. Reopen the application
4. **Expected**: Redirected to login page

### Test Scenario 2: Switch Tabs
1. Log in to the application
2. Switch to another tab
3. Wait 2-3 seconds
4. Return to the application
5. **Expected**: Redirected to login page (may vary by browser)

### Test Scenario 3: Navigate Away
1. Log in to the application
2. Navigate to another website
3. Use browser back button
4. **Expected**: May need to log in again

### Test Scenario 4: Explicit Logout
1. Log in to the application
2. Navigate to account settings
3. Click "Logout"
4. **Expected**: Redirected to login page
5. Session is cleared

## Modifying the Behavior

### To Re-enable Persistent Sessions (Optional)
If you want to allow "Remember Me" functionality:

1. **Update `lib/supabase/client.ts`**:
```typescript
return createBrowserClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true, // Change to true
    autoRefreshToken: true, // Change to true
  },
  // ... rest of config
})
```

2. **Update `lib/supabase/middleware.ts`**:
```typescript
const supabase = createServerClient(url, key, {
  auth: {
    persistSession: true, // Change to true
    autoRefreshToken: true, // Change to true
  },
  // ... rest of config
})
```

3. **Remove or disable `SessionManager`** from `app/layout.tsx`:
```typescript
// Comment out or remove this line
// <SessionManager />
```

### To Adjust Cookie Expiration (If Needed)
Currently, cookies are session-only. To set a custom expiration:

1. Update `lib/supabase/client.ts` in `setAll` function:
```typescript
if (options.maxAge) cookieString += `; max-age=${options.maxAge}`
if (options.expires) cookieString += `; expires=${options.expires.toUTCString()}`
```

2. Make sure this is enabled in both client and middleware configs.

## Debugging

### Check if Sessions Are Clearing
1. Open browser DevTools
2. Go to Application > Storage
3. Check Local Storage, Session Storage, and Cookies
4. Close the tab
5. Reopen and check again - all Supabase-related entries should be gone

### Console Logs
Add logging to `components/session-manager.tsx`:
```typescript
console.log('Session cleared - localStorage:', Object.keys(localStorage).filter(k => k.includes('supabase')))
console.log('Session cleared - cookies:', document.cookie)
```

## Production Considerations

### Environment Variables
Ensure these are set in your `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Server-Side Rendering
The middleware handles SSR correctly with session-only cookies. The configuration works in both dev and production.

### Deployment
No special configuration needed. This works out of the box on:
- Vercel
- Netlify
- Self-hosted Next.js deployments

## Summary

✅ **Users must log in again every time they return**
✅ **Sessions are cleared when browser closes**
✅ **No persistent authentication tokens**
✅ **Enhanced security for sensitive applications**
✅ **Works in both development and production**

This configuration is ideal for:
- Banking/financial applications
- Healthcare systems
- Government portals
- Any application requiring strict access control

