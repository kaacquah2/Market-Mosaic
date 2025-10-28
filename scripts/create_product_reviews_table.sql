-- Create product_reviews table for review system
-- Run this in Supabase SQL Editor

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, user_id) -- One review per user per product
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON public.product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON public.product_reviews(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Anyone can read reviews
CREATE POLICY "Anyone can view reviews"
  ON public.product_reviews
  FOR SELECT
  USING (true);

-- Users can insert their own reviews (must be authenticated)
CREATE POLICY "Users can create their own reviews"
  ON public.product_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
  ON public.product_reviews
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews"
  ON public.product_reviews
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can do everything
CREATE POLICY "Admins can do everything with reviews"
  ON public.product_reviews
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_product_review_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_product_reviews_updated_at ON public.product_reviews;
CREATE TRIGGER update_product_reviews_updated_at
  BEFORE UPDATE ON public.product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_product_review_updated_at();

-- Verify the table was created
SELECT 
  'product_reviews table created successfully' as status,
  COUNT(*) as review_count
FROM public.product_reviews;

