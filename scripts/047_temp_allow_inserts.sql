-- Temporarily allow inserts to products table for seeding
-- This script temporarily disables RLS enforcement for product inserts

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "products_insert_admin" ON public.products;

-- Create a temporary policy that allows all inserts
CREATE POLICY "products_insert_temp"
  ON public.products FOR INSERT
  WITH CHECK (true);

-- Also allow updates and deletes temporarily
DROP POLICY IF EXISTS "products_update_admin" ON public.products;
DROP POLICY IF EXISTS "products_delete_admin" ON public.products;

CREATE POLICY "products_update_temp"
  ON public.products FOR UPDATE
  USING (true);

CREATE POLICY "products_delete_temp"
  ON public.products FOR DELETE
  USING (true);

-- Now products can be inserted without authentication
-- Run your insert script after this

