"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  const ensureUserProfile = async (user: any) => {
    // Add a timeout to prevent blocking the redirect
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Profile check timed out after 3 seconds')), 3000)
    )
    
    const profileWork = async () => {
      console.log("👤 ensureUserProfile: Starting for user", user.id)
      const supabase = createClient()
      const authMetadata = user.user_metadata || {}
      
      console.log("👤 ensureUserProfile: Checking if profile exists...")
      // Check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from("user_profiles")
        .select("id, user_id")
        .eq("user_id", user.id)
        .single()

      console.log("👤 ensureUserProfile: Query completed")

      if (checkError) {
        console.log("👤 ensureUserProfile: Check error (expected if no profile):", checkError.code, checkError.message)
      }

      if (!existingProfile) {
        console.log("👤 ensureUserProfile: No profile found, creating...")
        // Profile doesn't exist, create it
        const { error } = await supabase
          .from("user_profiles")
          .insert({
            user_id: user.id,
            first_name: authMetadata.first_name || authMetadata.name?.split(' ')[0] || null,
            last_name: authMetadata.last_name || authMetadata.name?.split(' ').slice(1).join(' ') || null,
          })

        if (error && error.code !== '23505') { // 23505 is unique constraint violation
          console.error("👤 ensureUserProfile: Error creating profile:", error)
        } else if (error?.code === '23505') {
          console.log("👤 ensureUserProfile: Profile already exists (race condition)")
        } else {
          console.log("👤 ensureUserProfile: Profile created successfully")
        }
      } else {
        console.log("👤 ensureUserProfile: Profile already exists:", existingProfile.id)
      }
      
      console.log("👤 ensureUserProfile: Completed")
    }
    
    try {
      // Race between the profile work and the timeout
      await Promise.race([profileWork(), timeoutPromise])
    } catch (error) {
      console.error("👤 ensureUserProfile: Error or timeout:", error)
      // Don't throw - we don't want to block login if profile creation fails
    }
  }

  useEffect(() => {
    const supabase = createClient()
    let redirected = false
    let timeoutId: NodeJS.Timeout | null = null

    // Check for OAuth error in URL
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    if (errorParam) {
      console.error("OAuth error:", errorParam, errorDescription)
      setError(errorDescription || errorParam)
      setTimeout(() => {
        router.push(`/auth/login?error=${encodeURIComponent(errorDescription || errorParam)}`)
      }, 2000)
      return
    }

    const handleSuccess = async (session: any) => {
      if (redirected) {
        console.log("⚠️ Already redirected, skipping...")
        return
      }
      
      console.log("✅ Successfully authenticated:", session?.user?.email)
      console.log("🔄 Starting redirect process...")
      
      // Mark as redirected FIRST to prevent double-processing
      redirected = true
      
      // Clear any pending timeouts IMMEDIATELY
      if (timeoutId) {
        console.log("⏰ Clearing timeout...")
        clearTimeout(timeoutId)
        timeoutId = null
      }
      
      // Clear OAuth in-progress flag
      sessionStorage.removeItem('oauth-in-progress')
      if (typeof window !== 'undefined' && (window as any).__oauthComplete) {
        (window as any).__oauthComplete()
      }
      
      // Ensure user profile exists in database
      if (session?.user) {
        console.log("👤 Ensuring user profile...")
        try {
          await ensureUserProfile(session.user)
          console.log("✅ User profile ensured")
        } catch (err) {
          console.error("⚠️ Error ensuring user profile (non-critical):", err)
          // Don't block redirect on profile creation errors
        }
      } else {
        console.log("⚠️ No user in session, skipping profile creation")
      }
      
      // Small delay to ensure everything is set up
      console.log("⏳ Waiting 200ms before redirect...")
      await new Promise(resolve => setTimeout(resolve, 200))
      
      console.log("🚀 Redirecting to home page NOW...")
      console.log("🔍 Router object:", router)
      console.log("🔍 Window location:", window.location.href)
      
      try {
        // Try Next.js router first
        router.push("/")
        console.log("✅ router.push('/') called")
        
        // Wait a moment to see if it works
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // If we're still here, force a redirect
        if (window.location.pathname === "/auth/callback") {
          console.log("⚠️ router.push didn't work, using window.location...")
          window.location.href = "/"
        }
      } catch (err) {
        console.error("❌ Error calling router.push:", err)
        // Fallback to direct navigation
        console.log("⚠️ Falling back to window.location...")
        window.location.href = "/"
      }
    }

    const handleOAuthCallback = async () => {
      try {
        console.log("Starting OAuth callback processing...")
        console.log("URL:", window.location.href)
        
        // Check if we have a code in the URL (OAuth callback)
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        
        if (code) {
          console.log("🔑 Found OAuth code, exchanging for session...")
          
          // Explicitly exchange the code for a session (PKCE flow)
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            console.error("❌ Error exchanging code for session:", exchangeError)
            throw exchangeError
          }
          
          console.log("📦 Exchange response:", { hasSession: !!data.session, hasUser: !!data.session?.user })
          
          if (data.session) {
            console.log("✅ OAuth callback processed successfully:", data.session.user.email)
            console.log("📞 Calling handleSuccess...")
            await handleSuccess(data.session)
            console.log("✅ handleSuccess completed, returning true")
            return true
          } else {
            console.log("⚠️ Exchange succeeded but no session in response")
          }
        }
        
        // Fallback: check for existing session (might have been set by detectSessionInUrl)
        console.log("No code found, checking for existing session...")
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error("Error getting session:", sessionError)
          throw sessionError
        }
        
        if (session && session.user) {
          console.log("Found existing session:", session.user.email)
          await handleSuccess(session)
          return true
        }
        
        console.log("No session found yet")
        return false
      } catch (err) {
        console.error("Error handling OAuth callback:", err)
        throw err
      }
    }

    // Listen for auth state changes as backup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔔 Auth state changed:", event, session?.user?.email, "redirected:", redirected)
      
      if (redirected) {
        console.log("⚠️ Already redirected, ignoring auth state change")
        return
      }
      
      if (!session) {
        console.log("⚠️ No session in auth state change")
        return
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        console.log("🔔 Auth state listener calling handleSuccess...")
        await handleSuccess(session)
      }
    })

    // Main callback handling with retries
    const processCallback = async (attempt = 1) => {
      console.log(`🔄 processCallback attempt ${attempt}, redirected:`, redirected)
      
      if (redirected) {
        console.log("⚠️ Already redirected in processCallback, stopping")
        return
      }
      
      try {
        const success = await handleOAuthCallback()
        
        console.log("📊 handleOAuthCallback returned:", success, "redirected:", redirected)
        
        if (success) {
          console.log("✅ OAuth callback successful! Stopping retries.")
          return // Successfully processed
        }
        
        // If no session found, retry (but fewer times since we're explicit now)
        if (attempt < 3) {
          const delay = 500 * attempt // 500ms, 1000ms, 1500ms
          console.log(`🔁 Retry ${attempt}/3: waiting ${delay}ms for OAuth callback...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          return processCallback(attempt + 1)
        }
        
        // All retries exhausted
        console.error("❌ Failed to establish session after 3 attempts")
        throw new Error("Failed to establish session after OAuth callback. Please try again.")
      } catch (err) {
        console.error("❌ Error processing callback (attempt", attempt, "):", err)
        
        // Don't retry on explicit errors (like PKCE verification failed)
        const errorMessage = err instanceof Error ? err.message : String(err)
        if (errorMessage.includes('PKCE') || errorMessage.includes('invalid') || errorMessage.includes('expired')) {
          console.error("❌ Unrecoverable OAuth error:", errorMessage)
          setError(errorMessage)
          setTimeout(() => {
            router.push(`/auth/login?error=${encodeURIComponent(errorMessage)}`)
          }, 2000)
          return
        }
        
        // Retry on network or temporary errors
        if (attempt < 3) {
          const delay = 500 * attempt
          console.log(`🔁 Retrying after error (${attempt}/3)...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          return processCallback(attempt + 1)
        }
        
        // Final failure
        console.error("❌ Final failure after all retries")
        setError(err instanceof Error ? err.message : "Authentication failed")
        setTimeout(() => {
          router.push("/auth/login?error=Authentication%20failed")
        }, 2000)
      }
    }

    console.log("🚀 Starting processCallback...")
    processCallback()

    // Set a timeout fallback (increased to 20 seconds)
    timeoutId = setTimeout(() => {
      console.log("⏰ Timeout fired! Checking redirected status:", redirected)
      if (!redirected) {
        console.error("❌ OAuth callback timed out after 20 seconds")
        console.error("⚠️ This should not happen - auth appeared to succeed but redirect didn't work")
        setError("Authentication timed out. Please try again.")
        setTimeout(() => {
          router.push("/auth/login?error=Authentication%20timed%20out")
        }, 2000)
      } else {
        console.log("✅ Timeout fired but already redirected - this is normal, ignoring")
      }
    }, 20000)

    return () => {
      subscription.unsubscribe()
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="text-center max-w-md">
        {error ? (
          <>
            <div className="text-red-500 text-2xl mb-4">✕</div>
            <p className="mt-4 text-sm text-red-600 font-semibold">{error}</p>
            <p className="mt-2 text-xs text-muted-foreground">Redirecting to login...</p>
            <p className="mt-4 text-xs text-muted-foreground">If this persists, please try logging in again.</p>
          </>
        ) : (
          <>
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-sm font-semibold text-foreground">Completing authentication...</p>
            <p className="mt-2 text-xs text-muted-foreground">Please wait while we sign you in.</p>
            <p className="mt-4 text-xs text-muted-foreground">If this takes more than 15 seconds, please try again.</p>
          </>
        )}
      </div>
    </div>
  )
}

