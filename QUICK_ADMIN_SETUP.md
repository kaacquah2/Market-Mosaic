# Quick Admin Setup Guide

## One-Command Admin Setup

Run this single SQL command in your Supabase SQL Editor (replace with your email):

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## Find Your Email First

If you don't know your email, run this:

```sql
SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 5;
```

Then use that email in the INSERT command above.

## Verify It Worked

```sql
SELECT 
  u.email,
  ur.role,
  public.is_admin(ur.user_id) as is_admin
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'your-email@example.com';
```

The `is_admin` column should return `true`.

## Next Steps

1. Log out of your web app
2. Log back in
3. Try uploading a product in Admin Dashboard
4. Check if it appears in the database:

```sql
SELECT * FROM products ORDER BY created_at DESC LIMIT 1;
```

## Troubleshooting

### "No user found"
- Make sure you've logged into the app at least once
- Check the email spelling exactly as it appears

### "Still not working"
- Make sure you logged out and back in after adding the role
- Clear browser cache
- Check browser console for errors

