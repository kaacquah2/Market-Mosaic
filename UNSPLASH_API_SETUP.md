# Unsplash API Keys Setup Guide

## Overview

Unsplash provides two types of API keys for different use cases:

1. **Access Key** (Public) - Safe for client-side use
2. **Secret Key** (Private) - Must be kept secret, server-side only

## Getting Your Keys

### Step 1: Create Unsplash Account
1. Visit https://unsplash.com/developers
2. Sign up or log in

### Step 2: Create Application
1. Click "Your Apps" → "New Application"
2. Accept the API Use and Guidelines
3. Fill in application details:
   - Name: Your Ecommerce App
   - Description: Product image management
   - Website: Your website URL (or localhost for development)

### Step 3: Get Your Keys
After creating the application, you'll see:
- **Access Key**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Secret Key**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Configuration

### Add to .env.local

```env
# Unsplash API Configuration
# Access Key (public): Use in client-side requests
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_access_key_here

# Secret Key (private): Use in server-side requests only
UNSPLASH_SECRET_KEY=your_secret_key_here
```

## Usage Examples

### Client-Side (Access Key)

```typescript
// In client components
const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

const fetchImage = async () => {
  const response = await fetch(
    `https://api.unsplash.com/photos/random?client_id=${accessKey}&query=product`
  )
  const data = await response.json()
  return data.urls.regular
}
```

### Server-Side (Secret Key)

```typescript
// In server-side API routes (app/api/...)
const secretKey = process.env.UNSPLASH_SECRET_KEY

export async function GET() {
  const response = await fetch(
    `https://api.unsplash.com/photos/random?client_id=${secretKey}&query=product`
  )
  const data = await response.json()
  return Response.json({ imageUrl: data.urls.regular })
}
```

## Security Best Practices

### ✅ DO:
- Use `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` in client-side code only
- Use `UNSPLASH_SECRET_KEY` in server-side API routes only
- Keep Secret Key out of git repositories
- Add `.env.local` to `.gitignore`

### ❌ DON'T:
- Expose Secret Key in client-side code
- Commit API keys to version control
- Share keys publicly
- Use Secret Key in `NEXT_PUBLIC_` prefixed variables

## API Rate Limits

### Free Tier (Demo)
- **50 requests per hour**
- Sufficient for development and small projects
- Rate limit resets every hour

### Production
- Upgrade to paid plans for higher limits
- Monitor usage in Unsplash dashboard
- Implement caching to reduce API calls

## Current Implementation

**Note**: The current product seed script (`scripts/018_replace_all_products.sql`) uses **public source URLs** from Unsplash. These don't require API keys:

```sql
image_url = 'https://images.unsplash.com/photo-1544117519-31a4b719223c?w=600&h=600&fit=crop'
```

### When You Need API Keys

You'll need API keys if you want to:
- Fetch random images dynamically
- Search by keywords
- Get image metadata
- Track usage statistics
- Access premium features

## Example Use Cases

### 1. Dynamic Product Image Loading

```typescript
// app/api/products/[id]/image/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  
  const secretKey = process.env.UNSPLASH_SECRET_KEY
  const response = await fetch(
    `https://api.unsplash.com/photos/random?client_id=${secretKey}&query=${category}&w=600&h=600`
  )
  
  const data = await response.json()
  return Response.json({ imageUrl: data.urls.regular })
}
```

### 2. Product Image Search

```typescript
// Search for product images
const searchImages = async (query: string) => {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
  const response = await fetch(
    `https://api.unsplash.com/search/photos?client_id=${accessKey}&query=${query}&per_page=10`
  )
  
  const data = await response.json()
  return data.results.map((photo: any) => ({
    id: photo.id,
    url: photo.urls.regular,
    description: photo.description
  }))
}
```

## Troubleshooting

### "Invalid API key" Error
- Verify key is copied correctly (no extra spaces)
- Check if key is active in Unsplash dashboard
- Ensure you're using the correct key type (Access vs Secret)

### Rate Limit Exceeded
- Wait for the hour to reset
- Upgrade to higher tier
- Implement caching to reduce requests

### Images Not Loading
- Check API key permissions
- Verify network connectivity
- Check browser console for errors
- Ensure CORS is configured properly

## Environment Variables Summary

```env
# Public (client-side safe)
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_access_key

# Private (server-side only)
UNSPLASH_SECRET_KEY=your_secret_key
```

## Next Steps

1. ✅ Get your Unsplash API keys
2. ✅ Add them to `.env.local`
3. ✅ Restart your development server
4. ✅ Test API calls (optional)
5. ✅ Use public URLs for product images (current setup)

---

**Remember**: The current product catalog uses public Unsplash URLs and doesn't require API keys. You only need keys if you want to fetch images dynamically via the API.

