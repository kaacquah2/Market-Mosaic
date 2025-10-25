# Admin Product Upload Feature Guide

## Overview

The admin dashboard now supports uploading products with images directly to the website. Admins can upload product images from their computer or use image URLs.

## Features

- ✅ Direct file upload for product images
- ✅ Image URL fallback option
- ✅ Image preview before uploading
- ✅ File validation (type and size)
- ✅ Additional product fields (SKU, stock quantity, weight)
- ✅ Category selection dropdown
- ✅ Responsive design

## Setup Instructions

### Step 1: Create Storage Bucket in Supabase

1. Go to your Supabase dashboard
2. Navigate to **Storage** section
3. Click **Create Bucket**
4. Set bucket name as: `product-images`
5. Make it **Public** (uncheck "Private bucket")
6. Click **Create**

**OR** run the SQL script provided:

```sql
-- Run scripts/040_create_product_images_storage.sql in your Supabase SQL Editor
```

### Step 2: Configure Storage Policies

The SQL script will automatically create the necessary policies, but you can also do it manually:

#### Allow Public Read Access
Go to Storage → Policies → product-images → New Policy
- Policy name: `Public read access`
- Target roles: `public`
- Operation: `SELECT`
- Policy definition: `Bucket = 'product-images'`

#### Allow Authenticated Upload
Go to Storage → Policies → product-images → New Policy
- Policy name: `Authenticated upload`
- Target roles: `authenticated`
- Operation: `INSERT`
- Policy definition: `Bucket = 'product-images'`

### Step 3: Verify Admin Access

Make sure your user has admin role in the `user_roles` table:

```sql
SELECT * FROM user_roles WHERE user_id = 'your-user-id';
```

If you don't have admin access, add it:

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('your-user-id', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## Usage

### Accessing the Product Upload Page

1. Log in as an admin user
2. Navigate to **Admin Dashboard** → **Products**
3. Click **Add Product** button

### Uploading a Product

#### Method 1: Upload Image File

1. Fill in product details (name, price, category)
2. Click **Upload Image File**
3. Select an image from your computer (JPG, PNG, GIF, WebP)
4. Image preview will appear
5. Optionally fill in additional fields (SKU, stock, weight)
6. Click **Create Product**

#### Method 2: Use Image URL

1. Fill in product details
2. Enter an image URL in the **Enter Image URL** field
3. The URL field works when no file is uploaded
4. Click **Create Product**

### Product Fields

- **Product Name** (required): Name of the product
- **Description** (optional): Detailed product description
- **Price** (required): Product price in USD
- **Category** (required): Select from dropdown
- **Stock Quantity** (optional): Available inventory
- **SKU** (optional): Product SKU code
- **Weight** (optional): Product weight in pounds
- **Image**: Either upload file or provide URL

### Image Requirements

- **Accepted formats**: JPG, PNG, GIF, WebP
- **Maximum size**: 5MB
- **Recommended dimensions**: 800x800px or larger
- **Aspect ratio**: Square (1:1) recommended

## Troubleshooting

### "Failed to upload image" Error

1. Check if the storage bucket exists:
   ```sql
   SELECT * FROM storage.buckets WHERE id = 'product-images';
   ```

2. Verify storage policies are set correctly
3. Check Supabase logs for detailed error messages

### "Unauthorized" Error

1. Verify you're logged in as admin
2. Check admin role in database:
   ```sql
   SELECT * FROM user_roles WHERE user_id = 'your-user-id';
   ```

### Image Not Displaying

1. Check browser console for errors
2. Verify image URL is accessible
3. Check Supabase storage bucket permissions
4. Ensure image file was uploaded successfully

### Storage Bucket Not Found

Run the setup SQL script again:
```sql
-- Run scripts/040_create_product_images_storage.sql
```

## File Structure

```
app/
  admin/
    actions.ts              # Server actions for upload
    products/
      new/
        page.tsx            # Product upload form
scripts/
  040_create_product_images_storage.sql  # Storage setup
```

## Server Actions

### `uploadProductImage(file: File)`

Uploads a single image file to Supabase storage.

**Parameters:**
- `file`: File object to upload

**Returns:**
```typescript
{ success: boolean, url?: string, error?: string }
```

### `createProductWithImage(formData: FormData)`

Creates a new product with optional image upload.

**Parameters:**
- `formData`: FormData containing product fields

**Returns:**
```typescript
{ success: boolean, error?: string }
```

## Security

- Only authenticated admin users can upload products
- File type validation prevents malicious uploads
- File size limit prevents abuse
- Admin role is verified on both client and server
- Storage policies enforce proper access control

## Future Enhancements

- [ ] Multiple image upload for product gallery
- [ ] Image cropping and editing
- [ ] Bulk product upload via CSV
- [ ] Drag and drop image upload
- [ ] Image optimization before upload
- [ ] Category management interface
- [ ] Product variants and options

## Support

For issues or questions:
1. Check Supabase logs
2. Review browser console errors
3. Verify database permissions
4. Check storage bucket configuration

