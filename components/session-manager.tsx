"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

/**
 * Session Manager - Clears session when user leaves/closes the browser
 * This forces users to log in again when they return
 */
export function SessionManager() {
  useEffect(() => {
    // Clear session when page is about to unload (closing tab, navigating away, etc.)
    const handleBeforeUnload = async () => {
      try {
        // Don't run on OAuth callback URLs or auth pages
        const isAuthPage = window.location.pathname.includes('/auth/')
        if (isAuthPage) {
          return // Let OAuth flow complete
        }

        const supabase = createClient()
        
        // Clear all Supabase-related localStorage BUT keep PKCE verifier for OAuth
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
          if (key.includes('supabase') || key.includes('sb-')) {
            // Don't clear PKCE verifier during OAuth flow (it's needed for auth)
            if (!key.includes('code_verifier') && !key.includes('code_challenge') && !key.includes('pkce')) {
              localStorage.removeItem(key)
            }
          }
        })
        
        // Clear all Supabase-related sessionStorage
        const sessionKeys = Object.keys(sessionStorage)
        sessionKeys.forEach(key => {
          if (key.includes('supabase') || key.includes('sb-')) {
            sessionStorage.removeItem(key)
          }
        })
        
        // Sign out the user (this clears auth cookies)
        await supabase.auth.signOut()
      } catch (error) {
        // Silently fail - don't block the page unload
        console.error('Error clearing session:', error)
      }
    }

    // Clear session when tab becomes hidden (user switches tabs or minimizes)
    const handleVisibilityChange = async () => {
      // Don't clear on visibility change - this interferes with OAuth redirects
      // Only clear on actual page unload (browser close, navigate away)
    }

    // Listen for page unload
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    // Listen for visibility changes (tab switching, minimizing)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return null // This component doesn't render anything
}

