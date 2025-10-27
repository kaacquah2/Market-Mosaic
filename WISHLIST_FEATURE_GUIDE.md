# Wishlist Feature - Complete Guide

## Overview

The **Wishlist** feature allows users to save products they're interested in for later purchase. It's like a favorites list or bookmark system for products.

## How It Works

### 🎯 **Main Features:**

1. **Add to Wishlist** - Save products for later
2. **View Wishlist** - See all saved items at `/wishlist`
3. **Remove from Wishlist** - Delete items you no longer want
4. **Add to Cart** - Move wishlist items to cart
5. **Wishlist Count** - Badge showing number of items

---

## Where Users Interact With Wishlist

### 1️⃣ **Product Pages** (`/products` and `/products/[id]`)
- **Heart Icon** on each product card
- Click to add/remove from wishlist
- Filled heart ❤️ = In wishlist
- Empty heart 🤍 = Not in wishlist

### 2️⃣ **Wishlist Page** (`/wishlist`)
- View all saved items
- Remove items (click filled heart)
- Add items to cart
- See product details (price, rating, stock)

### 3️⃣ **Navigation Bar**
- Heart icon with badge showing count
- Click to go to wishlist page

---

## User Flow Example

```
1. User browses products
   ↓
2. Sees a product they like but don't want to buy now
   ↓
3. Clicks heart icon ❤️
   ↓
4. Product saved to wishlist
   ↓
5. Later, user goes to /wishlist
   ↓
6. Sees all saved products
   ↓
7. Either:
   - Adds to cart 🛒
   - Removes from wishlist 🗑️
```

---

## Database Structure

### Table: `wishlist_items`

```sql
CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id) -- User can't add same product twice
);

-- Indexes for performance
CREATE INDEX idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX idx_wishlist_items_product_id ON wishlist_items(product_id);
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Users can only see their own wishlist
CREATE POLICY "Users can view own wishlist" ON wishlist_items
  FOR SELECT USING (auth.uid() = user_id);

-- Users can add to their wishlist
CREATE POLICY "Users can add to wishlist" ON wishlist_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can remove from their wishlist
CREATE POLICY "Users can remove from wishlist" ON wishlist_items
  FOR DELETE USING (auth.uid() = user_id);
```

---

## Code Structure

### Service Layer: `lib/wishlist-service.ts`

**Main Methods:**

#### 1. **Get Wishlist Items**
```typescript
async getWishlistItems(): Promise<WishlistItem[]>
```
- Fetches all wishlist items for current user
- Includes product details (name, price, image, rating)
- Returns empty array if not logged in

#### 2. **Add to Wishlist**
```typescript
async addToWishlist(productId: string): Promise<boolean>
```
- Adds product to user's wishlist
- Checks if already in wishlist (prevents duplicates)
- Returns `true` on success, `false` on failure

#### 3. **Remove from Wishlist**
```typescript
async removeFromWishlist(wishlistItemId: string): Promise<boolean>
```
- Removes item by wishlist item ID
- User must own the item
- Returns `true` on success

#### 4. **Remove by Product ID**
```typescript
async removeFromWishlistByProductId(productId: string): Promise<boolean>
```
- Removes item by product ID (alternative method)
- Useful when you only know the product ID

#### 5. **Check if in Wishlist**
```typescript
async isInWishlist(productId: string): Promise<boolean>
```
- Checks if a specific product is in user's wishlist
- Returns `true` if in wishlist, `false` otherwise

#### 6. **Get Count**
```typescript
async getWishlistCount(): Promise<number>
```
- Returns total number of items in wishlist
- Used for navigation badge

---

## Features in Detail

### ✨ **1. Add to Wishlist**

**Where:** Product cards, product detail pages

**How it works:**
```typescript
// User clicks heart icon
await wishlistService.addToWishlist(productId)

// Database inserts:
{
  user_id: "user-uuid",
  product_id: "product-uuid",
  created_at: "2025-01-27T..."
}
```

**Visual Feedback:**
- Heart icon fills with red color ❤️
- Optional: Toast notification "Added to wishlist!"

---

### ✨ **2. View Wishlist**

**Where:** `/wishlist` page

**Shows:**
- Product image
- Product name
- Category
- Price
- Rating (if available)
- Stock status
- "Add to Cart" button
- "Remove from Wishlist" button (heart icon)

**Layout:**
- Grid of product cards (4 per row on desktop)
- Responsive (adjusts for mobile/tablet)
- Empty state if no items

---

### ✨ **3. Remove from Wishlist**

**Where:** 
- Wishlist page (click filled heart)
- Product pages (click filled heart to toggle off)

**How it works:**
```typescript
// User clicks filled heart
await wishlistService.removeFromWishlist(wishlistItemId)

// Database deletes the row
DELETE FROM wishlist_items WHERE id = 'item-id'
```

**Visual Feedback:**
- Item disappears from wishlist page
- Heart icon becomes empty 🤍 on product pages

---

### ✨ **4. Add to Cart from Wishlist**

**Where:** Wishlist page

**How it works:**
```typescript
// User clicks "Add to Cart" button
await cartService.addToCart(productId, 1)

// Item stays in wishlist
// Also appears in cart
```

**Note:** Item remains in wishlist after adding to cart. User must manually remove if desired.

---

### ✨ **5. Wishlist Count Badge**

**Where:** Navigation bar (heart icon)

**Shows:** Number of items in wishlist (e.g., "5")

**Updates:** 
- Real-time when user adds/removes items
- Fetched on page load

---

## Setup Instructions

### Step 1: Create Database Table

Run this in **Supabase SQL Editor:**

```sql
-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON wishlist_items(product_id);

-- Enable RLS
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlist_items;
CREATE POLICY "Users can view own wishlist" ON wishlist_items
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add to wishlist" ON wishlist_items;
CREATE POLICY "Users can add to wishlist" ON wishlist_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove from wishlist" ON wishlist_items;
CREATE POLICY "Users can remove from wishlist" ON wishlist_items
  FOR DELETE USING (auth.uid() = user_id);

-- Verify
SELECT * FROM wishlist_items LIMIT 1;
```

### Step 2: Test It

1. **Log in** to your app
2. **Go to products page:** `http://localhost:3000/products`
3. **Click heart icon** on any product
4. **Go to wishlist:** `http://localhost:3000/wishlist`
5. **Verify** product appears

---

## Testing the Wishlist

### Browser Console Test

```javascript
// Check if wishlist service is working
const { wishlistService } = await import('@/lib/wishlist-service')

// Get current wishlist
const items = await wishlistService.getWishlistItems()
console.log('Wishlist items:', items)

// Add a product (replace with actual product ID)
const success = await wishlistService.addToWishlist('product-id-here')
console.log('Added:', success)

// Get count
const count = await wishlistService.getWishlistCount()
console.log('Count:', count)
```

### SQL Test

```sql
-- See all wishlist items with product details
SELECT 
  wi.id,
  wi.created_at,
  p.name as product_name,
  p.price,
  au.email as user_email
FROM wishlist_items wi
JOIN products p ON p.id = wi.product_id
JOIN auth.users au ON au.id = wi.user_id
ORDER BY wi.created_at DESC;

-- See wishlist count per user
SELECT 
  au.email,
  COUNT(wi.id) as wishlist_count
FROM auth.users au
LEFT JOIN wishlist_items wi ON wi.user_id = au.id
GROUP BY au.email
ORDER BY wishlist_count DESC;
```

---

## User Experience

### ✅ **When It Works Well:**

1. User logged in
2. Clicks heart → instant visual feedback
3. Goes to wishlist → sees all saved items
4. Can add to cart or remove easily
5. Badge shows accurate count

### ⚠️ **Common Issues:**

**Issue:** Heart icon doesn't change
- **Cause:** Not logged in
- **Solution:** Redirect to login page

**Issue:** Product not in wishlist page
- **Cause:** Database query error or RLS blocking
- **Solution:** Check RLS policies and console errors

**Issue:** Can't remove from wishlist
- **Cause:** RLS policy or wrong item ID
- **Solution:** Check user owns the item

---

## Customization Ideas

### 1. **Wishlist Limit**

Limit users to 50 items:

```typescript
async addToWishlist(productId: string): Promise<boolean> {
  // Check current count
  const count = await this.getWishlistCount()
  
  if (count >= 50) {
    throw new Error('Wishlist limit reached (50 items max)')
  }
  
  // Continue with add...
}
```

### 2. **Wishlist Sharing**

Allow users to share wishlist with others:

```sql
-- Add share_token column
ALTER TABLE wishlist_items ADD COLUMN share_token UUID DEFAULT gen_random_uuid();

-- Create shareable link
-- https://yoursite.com/wishlist/shared/{share_token}
```

### 3. **Price Drop Alerts**

Notify users when wishlist item goes on sale:

```sql
-- Track original price
ALTER TABLE wishlist_items ADD COLUMN saved_price DECIMAL(10,2);

-- Check for price drops
SELECT 
  wi.*,
  p.name,
  p.price as current_price,
  wi.saved_price,
  (wi.saved_price - p.price) as discount
FROM wishlist_items wi
JOIN products p ON p.id = wi.product_id
WHERE p.price < wi.saved_price;
```

### 4. **Move All to Cart**

Add button to move entire wishlist to cart:

```typescript
async moveAllToCart(): Promise<boolean> {
  const items = await this.getWishlistItems()
  
  for (const item of items) {
    await cartService.addToCart(item.product_id, 1)
  }
  
  return true
}
```

---

## Summary

**Purpose:** Save products for later purchase  
**Access:** Heart icon on product cards + `/wishlist` page  
**Database:** `wishlist_items` table  
**Security:** RLS ensures users only see their own wishlist  
**Features:** Add, remove, view, add to cart, count badge  

**Current Status:**
- ✅ Code is ready and functional
- ⚠️ Database table needs to be created (run SQL above)
- ✅ UI is complete with heart icons and wishlist page

---

**Run the SQL script to set up the database, then your wishlist will be fully functional!** ❤️

