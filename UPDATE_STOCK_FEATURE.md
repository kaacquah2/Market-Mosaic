# Update Stock Feature - How It Works

## Overview

The **"Update All Stock"** button on the admin page automatically updates the stock quantity for **ALL products** in your database with random stock numbers.

## Location

**Admin Dashboard** → `http://localhost:3000/admin` → **"Update All Stock" button** (in Quick Actions section)

## What It Does

### When You Click the Button:

1. ✅ **Fetches all products** from the database
2. ✅ **Generates random stock** for each product (between 10-100 units)
3. ✅ **Updates each product** with the new stock quantity
4. ✅ **Shows success message** with count of updated products
5. ✅ **Auto-hides message** after 5 seconds

### Example:
```
Before:
- Product A: stock_quantity = 5
- Product B: stock_quantity = 0
- Product C: stock_quantity = 200

After clicking "Update All Stock":
- Product A: stock_quantity = 47 (random)
- Product B: stock_quantity = 82 (random)
- Product C: stock_quantity = 23 (random)
```

## How It Works (Technical)

### 1. Button Component
**File:** `components/admin/update-stock-button.tsx`

```typescript
<Button onClick={handleUpdateStock}>
  Update All Stock
</Button>
```

- Shows "Updating..." while processing
- Displays success/error message
- Auto-clears message after 5 seconds

### 2. Server Action
**File:** `app/admin/actions.ts`

```typescript
export async function updateAllProductsStock() {
  // 1. Get all products
  const { data: products } = await supabase
    .from('products')
    .select('id, name')
  
  // 2. Generate random stock for each (10-100)
  const updates = products.map(async (product) => {
    const stockQuantity = Math.floor(Math.random() * 90) + 10
    
    // 3. Update the product
    await supabase
      .from('products')
      .update({ stock_quantity: stockQuantity })
      .eq('id', product.id)
  })
  
  // 4. Wait for all updates to complete
  await Promise.all(updates)
  
  return { success: true, updated: products.length }
}
```

### 3. Random Stock Range
- **Minimum:** 10 units
- **Maximum:** 100 units
- **Formula:** `Math.floor(Math.random() * 90) + 10`

## When to Use This Feature

### ✅ Good Use Cases:

1. **Testing** - Quickly populate stock for testing/development
2. **Demo** - Show products as "in stock" for demonstrations
3. **Reset** - Reset all stock levels after testing
4. **Initial Setup** - Give all new products some stock

### ⚠️ Use With Caution:

1. **Production** - Don't use on live store with real inventory!
2. **Accurate Tracking** - Overwrites real inventory counts
3. **No Undo** - Can't revert to previous stock levels

## Expected Behavior

### Success:
```
✅ Successfully updated 150 products with stock!
```
- All products now have random stock between 10-100
- Products appear as "in stock" on the site
- Stock filter will work correctly

### Error Scenarios:

**No Products Found:**
```
❌ No products found
```
- Database has no products yet
- Need to add products first

**Database Error:**
```
❌ Failed to update stock
```
- Check Supabase connection
- Verify admin has permission to update products

## Testing the Feature

### Step 1: Before Clicking
Open browser console (F12) and run:
```javascript
// Check current stock levels
const { createClient } = await import('@/lib/supabase/client')
const supabase = createClient()
const { data } = await supabase.from('products').select('name, stock_quantity').limit(5)
console.table(data)
```

### Step 2: Click "Update All Stock"
Watch for the success message

### Step 3: After Clicking
Run the same query again:
```javascript
const { data } = await supabase.from('products').select('name, stock_quantity').limit(5)
console.table(data)
```

You'll see all stock quantities changed to random numbers between 10-100!

## Customizing Stock Range

If you want to change the stock range, edit `app/admin/actions.ts`:

### Current (10-100):
```typescript
const stockQuantity = Math.floor(Math.random() * 90) + 10
```

### Custom Examples:

**Range: 50-500**
```typescript
const stockQuantity = Math.floor(Math.random() * 450) + 50
```

**Range: 100-1000**
```typescript
const stockQuantity = Math.floor(Math.random() * 900) + 100
```

**Fixed Amount (always 50)**
```typescript
const stockQuantity = 50
```

**Based on Product Category** (more advanced)
```typescript
// Fetch product with category
const { data: products } = await supabase
  .from('products')
  .select('id, name, category')

// Set different ranges by category
const updates = products.map(async (product) => {
  let stockQuantity
  
  if (product.category === 'Electronics') {
    stockQuantity = Math.floor(Math.random() * 20) + 5 // 5-25
  } else if (product.category === 'Clothing') {
    stockQuantity = Math.floor(Math.random() * 90) + 10 // 10-100
  } else {
    stockQuantity = Math.floor(Math.random() * 50) + 10 // 10-60
  }
  
  await supabase
    .from('products')
    .update({ stock_quantity: stockQuantity })
    .eq('id', product.id)
})
```

## Related Features

### Individual Product Stock Update
Go to: `/admin/products`
- Click on any product
- Edit stock quantity manually
- Save

### View Current Stock
SQL query in Supabase:
```sql
-- See all product stock levels
SELECT name, stock_quantity, category 
FROM products 
ORDER BY stock_quantity DESC;

-- See out of stock products
SELECT name, stock_quantity 
FROM products 
WHERE stock_quantity = 0 OR stock_quantity IS NULL;

-- See low stock products (< 20)
SELECT name, stock_quantity 
FROM products 
WHERE stock_quantity < 20
ORDER BY stock_quantity ASC;
```

## Permissions Required

**Only admins can use this feature.**

The admin check happens on the server:
- User must be logged in
- User must have `role = 'admin'` in `user_roles` table
- If not admin, button won't show or action will fail

## Alternative: SQL Script

You can also update stock directly in Supabase SQL Editor:

```sql
-- Set all products to random stock 10-100
UPDATE products
SET stock_quantity = floor(random() * 90 + 10)::int;

-- Set all products to specific amount
UPDATE products
SET stock_quantity = 50;

-- Set stock based on category
UPDATE products
SET stock_quantity = 
  CASE 
    WHEN category = 'Electronics' THEN floor(random() * 20 + 5)::int
    WHEN category = 'Clothing' THEN floor(random() * 90 + 10)::int
    ELSE floor(random() * 50 + 10)::int
  END;
```

## Summary

**Purpose:** Quickly update stock for all products  
**Range:** 10-100 units (random)  
**Speed:** Updates all products in parallel  
**Safety:** Admin-only feature  
**Use Case:** Testing, demos, initial setup  

---

**The feature is ready to use - just click the button on the admin page!** 📦

