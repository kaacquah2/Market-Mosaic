-- FINAL ADMIN SETUP - Run this in Supabase SQL Editor
-- This will make kaacquah2004@gmail.com an admin

-- Step 1: Drop and recreate table fresh
DROP TABLE IF EXISTS user_roles CASCADE;

CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id)
);

-- Step 2: DO NOT enable RLS yet - test without it first
-- We'll enable it only after confirming admin access works

-- Step 3: Add your admin role
INSERT INTO user_roles (user_id, role)
VALUES ('5b7a6f1f-39d0-46f9-a5de-d0deb019f300', 'admin');

-- Step 4: Verify it's there
SELECT 
  ur.role,
  au.email,
  au.id
FROM user_roles ur
JOIN auth.users au ON au.id = ur.user_id;

-- You should see: admin | kaacquah2004@gmail.com | 5b7a6f1f-39d0-46f9-a5de-d0deb019f300

