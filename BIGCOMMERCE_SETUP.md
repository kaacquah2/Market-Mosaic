# 🛍️ BigCommerce API Integration Guide

## Overview
This guide will help you integrate BigCommerce API to fetch real products with real images into your e-commerce app.

## 📋 Prerequisites
- BigCommerce store account
- Products already in your BigCommerce store

## 🔑 Step 1: Get BigCommerce API Credentials

### A. Get Store Hash

1. Log into your BigCommerce admin panel
2. Go to **Settings** → **API Accounts**
3. Click **Create API Account**
4. Your store URL will look like: `https://abc123.store-1.bigcommerce.com`
   - The **Store Hash** is the part before `.store-1` (e.g., `abc123`)

### B. Get Access Token

1. In **Settings** → **API Accounts**
2. Click **Create API Account**
3. Set the following permissions:
   - ✅ **Products** - Read
   - ✅ **Products** - Modify
4. Click **Save**
5. Copy the **Access Token** (you'll only see it once!)

## ⚙️ Step 2: Configure Environment Variables

Open `.env.local` and add your credentials:

```env
BIGCOMMERCE_STORE_HASH=your_store_hash_here
BIGCOMMERCE_ACCESS_TOKEN=your_access_token_here
```

**Example:**
```env
BIGCOMMERCE_STORE_HASH=abc123
BIGCOMMERCE_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚀 Step 3: Fetch Products from BigCommerce

Run the Python script to fetch products:

```bash
python scripts/fetch_bigcommerce_products.py
```

This will:
1. Connect to BigCommerce API
2. Fetch all products
3. Generate SQL INSERT statements
4. Create `scripts/040_bigcommerce_products.sql`

## 📥 Step 4: Import Products to Supabase

1. Open `scripts/040_bigcommerce_products.sql`
2. Copy ALL content
3. Paste into Supabase SQL Editor
4. Click **Run**

## ✅ Step 5: Verify Import

Run this query in Supabase:

```sql
SELECT COUNT(*) as total_products FROM public.products;
```

Check products by category:
```sql
SELECT category, COUNT(*) as count 
FROM public.products 
GROUP BY category 
ORDER BY count DESC;
```

View sample products:
```sql
SELECT name, image_url, price, stock_quantity 
FROM public.products 
LIMIT 10;
```

## 🎨 What You Get

✅ **Real Products** - Actual products from your BigCommerce store
✅ **Real Images** - Product images from BigCommerce
✅ **Prices** - Actual product prices
✅ **Stock** - Real inventory levels
✅ **Categories** - Product categories from BigCommerce
✅ **SKUs** - Product SKUs

## 🔄 Updating Products

To refresh products from BigCommerce:

1. Run `python scripts/fetch_bigcommerce_products.py`
2. Import the new SQL file into Supabase

## 🚨 Troubleshooting

### "No products found"
- Check your BigCommerce store has products
- Verify API credentials are correct
- Check API permissions are set correctly

### "Authentication failed"
- Verify Store Hash is correct
- Verify Access Token is correct
- Check token hasn't expired

### "Rate limit exceeded"
- BigCommerce has rate limits
- Wait a few minutes and try again
- Consider pagination for large product catalogs

## 📚 BigCommerce API Documentation

- [Products API](https://developer.bigcommerce.com/api-docs/storefront/products)
- [Authentication](https://developer.bigcommerce.com/api-docs/getting-started/authentication)
- [Rate Limits](https://developer.bigcommerce.com/api-docs/getting-started/rate-limits)

---

**Ready to fetch real products!** 🚀

