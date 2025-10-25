-- Fix RLS policies for notification_templates to allow public reads
-- This allows the application to read templates without authentication

-- Drop existing policy
DROP POLICY IF EXISTS "Templates are viewable by authenticated users" ON notification_templates;

-- Create new policy that allows public read access
CREATE POLICY "Templates are publicly readable" ON notification_templates
  FOR SELECT USING (true);

-- Allow anonymous users to read templates
GRANT SELECT ON notification_templates TO anon;

-- Verify the change
SELECT 'RLS policy updated. Public can now read templates.' as status;

