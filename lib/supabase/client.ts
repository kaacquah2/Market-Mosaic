import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  // Only detect session in URL on the callback page to prevent unwanted redirects
  const isCallbackPage = typeof window !== 'undefined' && window.location.pathname === '/auth/callback'

  // Configure browser client with standard settings for OAuth/PKCE
  return createBrowserClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true, // Required for PKCE verifier storage
      autoRefreshToken: true, // Enable auto-refresh for better session management
      detectSessionInUrl: isCallbackPage, // Only detect on callback page
      flowType: 'pkce', // Use PKCE flow for security
    },
  })
}
