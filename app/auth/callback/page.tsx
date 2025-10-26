"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallback() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const ensureUserProfile = async (user: any) => {
    try {
      const supabase = createClient()
      const authMetadata = user.user_metadata || {}
      
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("id, user_id")
        .eq("user_id", user.id)
        .single()

      if (!existingProfile) {
        // Profile doesn't exist, create it
        const { error } = await supabase
          .from("user_profiles")
          .insert({
            user_id: user.id,
            first_name: authMetadata.first_name || authMetadata.name?.split(' ')[0] || null,
            last_name: authMetadata.last_name || authMetadata.name?.split(' ').slice(1).join(' ') || null,
          })

        if (error && error.code !== '23505') { // 23505 is unique constraint violation
          console.error("Error creating user profile:", error)
        }
      }
    } catch (error) {
      console.error("Error ensuring user profile:", error)
    }
  }

  useEffect(() => {
    const supabase = createClient()
    let redirected = false

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      
      if (redirected) return

      if (event === 'SIGNED_IN' && session) {
        console.log("Successfully authenticated:", session.user?.email)
        
        // Ensure user profile exists in database
        if (session.user) {
          await ensureUserProfile(session.user)
        }
        
        redirected = true
        // Small delay to ensure everything is set up
        await new Promise(resolve => setTimeout(resolve, 300))
        router.push("/")
      } else if (event === 'USER_UPDATED' && session) {
        console.log("User updated, redirecting:", session.user?.email)
        
        // Ensure user profile exists when user is updated
        if (session.user) {
          await ensureUserProfile(session.user)
        }
        
        redirected = true
        await new Promise(resolve => setTimeout(resolve, 300))
        router.push("/")
      }
    })

    // Also check if there's already a session (in case the event already fired)
    const checkSession = async () => {
      // Give some time for detectSessionInUrl to process
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (redirected) return

      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error("Error getting session:", sessionError)
        setError(sessionError.message)
        setTimeout(() => {
          router.push(`/auth/login?error=${encodeURIComponent(sessionError.message)}`)
        }, 2000)
        return
      }

      if (session && !redirected) {
        console.log("Found existing session:", session.user?.email)
        redirected = true
        router.push("/")
      }
    }

    checkSession()

    // Set a timeout fallback in case nothing happens
    const timeout = setTimeout(() => {
      if (!redirected) {
        console.error("OAuth callback timed out")
        setError("Authentication timed out")
        router.push("/auth/login?error=Authentication%20timed%20out")
      }
    }, 10000) // 10 second timeout

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [router])

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-500 text-2xl mb-4">✕</div>
            <p className="mt-4 text-sm text-red-600">{error}</p>
            <p className="mt-2 text-xs text-muted-foreground">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-sm text-muted-foreground">Completing authentication...</p>
          </>
        )}
      </div>
    </div>
  )
}

