-- Fix Function Search Path Security Warnings
-- This script adds SET search_path to all functions to prevent search path injection attacks
-- Reference: https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable

-- 1. Fix create_user_notification_preferences function
CREATE OR REPLACE FUNCTION public.create_user_notification_preferences()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 2. Fix log_notification_delivery function
CREATE OR REPLACE FUNCTION public.log_notification_delivery(
  p_user_id UUID,
  p_campaign_id UUID,
  p_template_id UUID,
  p_title VARCHAR(255),
  p_message TEXT,
  p_type VARCHAR(50),
  p_channel VARCHAR(20),
  p_action_url VARCHAR(500) DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.user_notifications (
    user_id, campaign_id, template_id, title, message, type, 
    channel, action_url, metadata, status, sent_at
  ) VALUES (
    p_user_id, p_campaign_id, p_template_id, p_title, p_message, 
    p_type, p_channel, p_action_url, p_metadata, 'sent', NOW()
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- 3. Fix update_return_timestamp function
CREATE OR REPLACE FUNCTION public.update_return_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 4. Fix update_ticket_timestamp function
CREATE OR REPLACE FUNCTION public.update_ticket_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 5. Fix cleanup_expired_2fa_sessions function
CREATE OR REPLACE FUNCTION public.cleanup_expired_2fa_sessions()
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.two_factor_sessions 
  WHERE expires_at < NOW();
END;
$$;

-- 6. Fix generate_backup_codes function
CREATE OR REPLACE FUNCTION public.generate_backup_codes()
RETURNS TEXT[]
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  codes TEXT[] := '{}';
  i INTEGER;
BEGIN
  FOR i IN 1..10 LOOP
    codes := array_append(codes, substring(md5(random()::text) from 1 for 8));
  END LOOP;
  RETURN codes;
END;
$$;

-- 7. Fix update_product_rating function
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  UPDATE public.products 
  SET updated_at = NOW()
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 8. Fix is_admin function
-- Note: The old TEXT-based version (is_admin(user_email TEXT)) must be dropped first
-- as it conflicts with the UUID-based version. The UUID version uses user_roles table.

-- Drop the old deprecated TEXT version first
DROP FUNCTION IF EXISTS public.is_admin(user_email TEXT);

-- Create the UUID-based is_admin function with search_path fix
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE public.user_roles.user_id = is_admin.user_id 
    AND public.user_roles.role = 'admin'
  );
END;
$$;

-- 9. Fix get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS VARCHAR
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_role VARCHAR;
BEGIN
  SELECT role INTO user_role 
  FROM public.user_roles 
  WHERE public.user_roles.user_id = get_user_role.user_id;
  
  RETURN COALESCE(user_role, 'customer');
END;
$$;

-- Grant execute permissions where needed
GRANT EXECUTE ON FUNCTION public.log_notification_delivery TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role TO authenticated;

-- Verify the fixes
SELECT 
  p.proname as function_name,
  pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN (
    'create_user_notification_preferences',
    'log_notification_delivery',
    'update_return_timestamp',
    'update_ticket_timestamp',
    'cleanup_expired_2fa_sessions',
    'generate_backup_codes',
    'update_product_rating',
    'is_admin',
    'get_user_role'
  )
ORDER BY p.proname;

