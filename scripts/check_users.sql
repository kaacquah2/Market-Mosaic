-- Check if there are any users in the auth.users table
SELECT 
    COUNT(*) as total_users
FROM auth.users;

-- Show sample users
SELECT 
    id,
    email,
    created_at
FROM auth.users
LIMIT 5;
