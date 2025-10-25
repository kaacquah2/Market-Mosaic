-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products are publicly readable
CREATE POLICY "products_select_public"
  ON public.products FOR SELECT
  USING (true);

-- Only admins can insert products (we'll check admin status in app logic)
CREATE POLICY "products_insert_admin"
  ON public.products FOR INSERT
  WITH CHECK (false);

-- Only admins can update products
CREATE POLICY "products_update_admin"
  ON public.products FOR UPDATE
  USING (false);

-- Only admins can delete products
CREATE POLICY "products_delete_admin"
  ON public.products FOR DELETE
  USING (false);
