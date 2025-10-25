# Main Page vs Admin Page - Complete Guide

## Main Page (Homepage)

**URL**: `http://localhost:3000/` or just `/`

**Who can access**: Everyone (public)

**Purpose**: Shopping website for customers

**Features**:
- Browse products
- Search products
- Filter by category
- View product details
- Add to cart
- User account features
- Wishlist
- Checkout

**Design**: Customer-facing e-commerce shop

---

## Admin Page

**URL**: `http://localhost:3000/admin`

**Who can access**: Only users with admin role

**Purpose**: Manage the website

**Features**:
- View statistics (total products, orders, revenue, customers)
- Upload products with images
- Manage products (edit, delete)
- View all orders
- Track order status
- Manage inventory
- View customer information

**Design**: Dashboard with metrics and management tools

---

## How to Access Admin Page

### Step 1: Make Yourself Admin

Run this SQL in Supabase SQL Editor:

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'kaacquah2004@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

### Step 2: Log Out

Log out of your current session

### Step 3: Log Back In

Log in with your email: `kaacquah2004@gmail.com`

### Step 4: Navigate to Admin

**Option A**: Type URL directly
```
http://localhost:3000/admin
```

**Option B**: Click admin link (if visible in navigation)
```
/admin
```

**Option C**: From homepage, manually type `/admin` in address bar

---

## Visual Differences

### Main Page (`/`)
- Product grid showing items for sale
- Search bar
- Shopping cart icon
- User account menu
- Categories sidebar
- "Add to Cart" buttons

### Admin Page (`/admin`)
- Statistics cards (Total Products, Orders, Revenue, Customers)
- Performance metrics
- Quick action buttons
- Recent orders table
- "Upload Product" button
- Management controls

---

## Admin Page Structure

```
/admin
  ├── Dashboard (main admin page)
  ├── Products (/admin/products)
  │   ├── View all products
  │   └── Upload new product (/admin/products/new)
  └── Orders (/admin/orders)
      └── View/manage orders
```

---

## Why You Can't Access Admin Page

The admin page checks your role in the database:

```typescript
// This code runs on the admin page
const { data: userRole } = await supabase
  .from("user_roles")
  .select("role")
  .eq("user_id", user.id)
  .single()

if (!userRole || userRole.role !== 'admin') {
  redirect("/")  // Redirects to home if not admin
}
```

**If you see the main page instead of admin**, it means:
- You don't have an entry in `user_roles` table
- Your role is not set to 'admin'
- You need to run the SQL command above

---

## Quick Access Checklist

- [ ] Created account (`kaacquah2004@gmail.com`)
- [ ] Ran SQL to assign admin role
- [ ] Logged out and logged back in
- [ ] Navigate to `http://localhost:3000/admin`
- [ ] See admin dashboard with statistics

---

## Troubleshooting

### "Still redirecting to home page"
1. Check browser console for errors
2. Verify admin role in database:
   ```sql
   SELECT u.email, ur.role 
   FROM auth.users u
   LEFT JOIN public.user_roles ur ON u.id = ur.user_id
   WHERE email = 'kaacquah2004@gmail.com';
   ```
3. Clear browser cache
4. Try incognito/private mode

### "Can't find admin link"
- The admin link only appears AFTER you successfully access `/admin`
- Use direct URL: `localhost:3000/admin`

### "Permission denied"
- Make sure you ran the SQL script
- Check that `user_roles` table exists
- Verify your email is correct

---

## What You Can Do as Admin

1. ✅ Upload products with images
2. ✅ View all orders
3. ✅ Manage inventory
4. ✅ View sales statistics
5. ✅ Track customer orders
6. ✅ Edit product details
7. ✅ Update stock levels

---

## Test It Now

1. **Run the SQL** (if you haven't already)
2. **Log out** of your app
3. **Log back in**
4. **Go to**: `localhost:3000/admin`
5. **You should see**: Admin Dashboard with stats cards

If you still see the main shopping page, share what you see and I'll help troubleshoot!

