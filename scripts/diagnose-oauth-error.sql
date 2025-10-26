-- Diagnostic script to find the OAuth issue
-- Run this in Supabase SQL Editor and check the output

-- Check if trigger exists
SELECT 
  'Trigger Check' as check_type,
  CASE WHEN EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created')
    THEN 'EXISTS' ELSE 'MISSING' END as status;

-- Check if function exists  
SELECT 
  'Function Check' as check_type,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'handle_new_user'
  ) THEN 'EXISTS' ELSE 'MISSING' END as status;

-- Check current policies on user_profiles
SELECT 
  'Policy Name' as policy_column,
  policyname,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'user_profiles'
ORDER BY policyname;

-- Check current policies on user_roles
SELECT 
  'Policy Name' as policy_column,
  policyname,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'user_roles'
ORDER BY policyname;

-- Check if tables exist and their structure
SELECT 
  'Table Check' as check_type,
  table_name,
  CASE WHEN table_name IN ('user_profiles', 'user_roles') 
    THEN 'EXISTS' ELSE 'OTHER' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'user_roles');

-- Check grants on user_profiles
SELECT 
  'Grants on user_profiles' as info,
  grantee, privilege_type
FROM information_schema.table_privileges 
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
ORDER BY grantee, privilege_type;

-- Check grants on user_roles
SELECT 
  'Grants on user_roles' as info,
  grantee, privilege_type
FROM information_schema.table_privileges 
WHERE table_schema = 'public' 
  AND table_name = 'user_roles'
ORDER BY grantee, privilege_type;

