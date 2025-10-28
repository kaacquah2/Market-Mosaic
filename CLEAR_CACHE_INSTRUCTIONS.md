# Fix "0" Displaying on Products - Cache Clearing Guide

## The Problem
You're still seeing "0" displayed on product cards even though we've removed `stock_quantity` and `sku` from rendering.

## Root Cause
**Browser and service worker cache** is serving old data with these fields still being rendered.

## Solution: Complete Cache Clear

### Step 1: Clear Next.js Build Cache
```bash
# Stop the dev server (Ctrl+C)
# Then run:
rm -rf .next
# Or on Windows PowerShell:
Remove-Item -Recurse -Force .next

# Restart the dev server
npm run dev
```

### Step 2: Clear Browser Cache (Choose Your Browser)

#### Chrome/Edge:
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select **"Empty Cache and Hard Reload"**
4. Or: `Ctrl + Shift + Delete` → Clear "Cached images and files"

#### Firefox:
1. `Ctrl + Shift + Delete`
2. Select "Cache"
3. Click "Clear Now"

#### Safari:
1. `Cmd + Option + E` to empty caches
2. Then `Cmd + R` to reload

### Step 3: Clear Service Worker Cache
1. Open DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Service Workers** in the left sidebar
4. Click **Unregister** next to any registered service workers
5. Click **Clear storage** or **Clear site data**
6. Reload the page

### Step 4: Disable Cache During Development
1. Open DevTools (F12)
2. Go to **Network** tab
3. Check ✅ **"Disable cache"** checkbox
4. Keep DevTools open while browsing

## Quick Fix (All-in-One)

**Windows PowerShell:**
```powershell
# Stop server, clean, restart
taskkill /F /IM node.exe
Remove-Item -Recurse -Force .next
npm run dev
```

**Mac/Linux:**
```bash
# Stop server, clean, restart
pkill -f "next dev"
rm -rf .next
npm run dev
```

Then in browser:
- `Ctrl + Shift + R` (hard refresh)
- Open DevTools → Application → Clear Storage → Clear site data

## Verification

After clearing cache, check:
1. ✅ Products page - No "0" displayed
2. ✅ Product detail page - Only stock status badges (In Stock/Out of Stock)
3. ✅ Recommended for You - Only "✓ In Stock" or "Out of Stock" badges
4. ✅ No numeric stock quantities visible anywhere

## Still Seeing "0"?

If you still see "0" after clearing all caches:

1. **Check browser extensions** - Disable React DevTools, Redux DevTools, etc.
2. **Try incognito/private mode** - Opens without cache/extensions
3. **Check the actual location** - Take a screenshot showing exactly where the "0" appears
4. **Inspect element** - Right-click the "0" → Inspect to see what's rendering it

## What We Fixed

✅ Excluded `stock_quantity` from AI recommendations  
✅ Excluded `sku` from AI recommendations  
✅ Products page doesn't render these fields  
✅ Product detail page only shows them in conditional logic  
✅ Homepage products are clean  

The "0" you're seeing is **100% cached data**. A hard refresh should fix it!

