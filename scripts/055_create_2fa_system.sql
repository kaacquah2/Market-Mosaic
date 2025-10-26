-- Add 2FA fields to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS two_factor_secret TEXT,
ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS backup_codes TEXT[],
ADD COLUMN IF NOT EXISTS last_2fa_verification TIMESTAMP WITH TIME ZONE;

-- Create 2FA sessions table for temporary verification
CREATE TABLE IF NOT EXISTS public.two_factor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE
);

-- Enable RLS on two_factor_sessions table
ALTER TABLE public.two_factor_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "two_factor_sessions_select_own" ON public.two_factor_sessions;
DROP POLICY IF EXISTS "two_factor_sessions_insert_own" ON public.two_factor_sessions;
DROP POLICY IF EXISTS "two_factor_sessions_update_own" ON public.two_factor_sessions;
DROP POLICY IF EXISTS "two_factor_sessions_delete_own" ON public.two_factor_sessions;

-- Users can view their own 2FA sessions
CREATE POLICY "two_factor_sessions_select_own"
  ON public.two_factor_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own 2FA sessions
CREATE POLICY "two_factor_sessions_insert_own"
  ON public.two_factor_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own 2FA sessions
CREATE POLICY "two_factor_sessions_update_own"
  ON public.two_factor_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own 2FA sessions
CREATE POLICY "two_factor_sessions_delete_own"
  ON public.two_factor_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_two_factor_sessions_user_id ON public.two_factor_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_two_factor_sessions_session_token ON public.two_factor_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_two_factor_sessions_expires_at ON public.two_factor_sessions(expires_at);

-- Create function to clean up expired 2FA sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_2fa_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.two_factor_sessions 
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to generate backup codes
CREATE OR REPLACE FUNCTION public.generate_backup_codes()
RETURNS TEXT[] AS $$
DECLARE
  codes TEXT[] := '{}';
  i INTEGER;
BEGIN
  FOR i IN 1..10 LOOP
    codes := array_append(codes, substring(md5(random()::text) from 1 for 8));
  END LOOP;
  RETURN codes;
END;
$$ LANGUAGE plpgsql;
