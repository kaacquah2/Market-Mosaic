# Supabase Connection Fix

## Issue
Your Supabase project is returning a 404 error, which means:
- The project might be paused
- The project URL might be incorrect
- The project might have been deleted

## Solution

### Option 1: Check Your Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Check if your project exists and is active
3. If paused, click "Restore" to reactivate it

### Option 2: Create a New Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be fully provisioned
5. Copy the new project URL and anon key
6. Update `.env.local` with the new credentials

### Option 3: Update .env.local
Replace the Supabase credentials in `.env.local` with your current project's credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## How to Get Your Supabase Credentials
1. Go to your Supabase project dashboard
2. Click on "Settings" (gear icon)
3. Click on "API"
4. Copy:
   - Project URL (under "Project URL")
   - Anon public key (under "Project API keys")

## After Updating
1. Restart your development server
2. Clear your browser cache
3. Try accessing the products page again

