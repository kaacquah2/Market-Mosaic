# Cache Optimization Guide

## Space-Saving Changes Applied

### 1. Memory Cache Optimization (lib/cache-service.ts)
- **Max Size**: Reduced from 100 to 50 entries (-50%)
- **Default TTL**: Reduced from 5 minutes to 3 minutes (-40%)
- **Impact**: Fewer entries expire sooner, reducing memory footprint

### 2. Application-Level Cache Tuning
- All `cacheService.set()` calls now use 3-minute TTL instead of 5
- Applies to:
  - User preferences cache
  - Trending products cache
  - Homepage recommendations cache

### 3. .next Build Cache Management
**Current Size**: ~422 MB

#### To Clear .next Cache:
```bash
# Delete the build cache
rm -rf .next
# Or on Windows:
rmdir /s .next
```

#### Next.js Cache Optimization
Your project has several cache mechanisms:

1. **.next/static** - Static assets cache (can be large)
2. **.next/server** - Server-side rendered pages cache
3. **Middleware cache** - Request/response caching

### 4. Additional Space-Saving Options

#### Option A: Disable Image Optimization (Already Applied)
Your `next.config.mjs` has:
```javascript
images: {
  unoptimized: true,
  // This saves space but uses more bandwidth
}
```

#### Option B: Limit Static Generation
Add to `next.config.mjs`:
```javascript
staticPageGenerationTimeout: 60, // Reduced from 300
```

#### Option C: Add .next to .gitignore (if not already)
This prevents committing large build files:
```
.next/
```

#### Option D: Configure Browser Cache Aggressively
Already configured in `middleware.ts`:
- Static assets: 31536000 seconds (1 year)
- Images: 86400 seconds (1 day)

### 5. Recommended Next Steps

1. **Clear existing cache**:
   ```bash
   rm -rf .next
   npm run build
   ```
   The rebuild will be smaller due to new cache limits.

2. **Monitor Cache Usage**:
   - Check `cacheService.size()` in your application
   - Implement cache cleanup on user logout
   - Add cache statistics to admin dashboard

3. **Consider External Caching**:
   - Use Redis for distributed caching (if deploying to production)
   - Use CDN for static assets
   - Implement database query result caching at Supabase level

4. **Production Deployment**:
   - On Vercel/Netlify, `.next` cache is handled automatically
   - Consider using Next.js's ISR (Incremental Static Regeneration)
   - Enable automatic cache purging on content updates

## Expected Results

After these changes:
- **Memory Usage**: ~50% reduction (50 entries vs 100)
- **Cache Duration**: 40% shorter (3 min vs 5 min)
- **Fresh Data**: Users see more recent data more quickly
- **Build Size**: Unchanged, but runtime memory usage reduced

## Trade-offs

**Pros**:
- Less memory usage
- More frequent data freshness
- Faster cache eviction

**Cons**:
- More frequent API/database calls
- Slightly higher CPU usage (more cache misses)

## Monitoring

To monitor cache effectiveness, you can add:
```typescript
console.log('Cache size:', cacheService.size())
console.log('Cache hit rate:', hitRate)
```

## Emergency Cache Clear

If you need to clear all caches immediately:
```typescript
import { cacheService } from '@/lib/cache-service'
cacheService.clear()
```

