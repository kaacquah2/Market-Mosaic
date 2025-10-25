-- Create wishlist table for user favorites
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on wishlist_items table
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Users can view their own wishlist
CREATE POLICY "wishlist_items_select_own"
  ON public.wishlist_items FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own wishlist items
CREATE POLICY "wishlist_items_insert_own"
  ON public.wishlist_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own wishlist items
CREATE POLICY "wishlist_items_delete_own"
  ON public.wishlist_items FOR DELETE
  USING (auth.uid() = user_id);

-- Users cannot update wishlist items (no update needed)
CREATE POLICY "wishlist_items_update_none"
  ON public.wishlist_items FOR UPDATE
  USING (false);
