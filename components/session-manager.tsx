"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

/**
 * Session Manager - Clears session when user leaves/closes the browser
 * This forces users to log in again when they return
 */
export function SessionManager() {
  useEffect(() => {
    // DISABLED: This component was causing issues with session persistence
    // It was logging users out when navigating between pages
    // If you need session clearing, implement it differently
    
    console.log('⚠️ SessionManager is currently DISABLED to fix login issues')
    
    return () => {
      // No cleanup needed
    }
    
    /* ORIGINAL CODE - DISABLED FOR NOW
    
    // Mark when OAuth flow is in progress
    let oauthInProgress = false
    
    // Listen for OAuth flow starting (when user clicks OAuth button)
    const handleOAuthStart = () => {
      oauthInProgress = true
      sessionStorage.setItem('oauth-in-progress', 'true')
      console.log('🔐 OAuth flow started, session clearing disabled')
    }
    
    // Listen for OAuth flow completion
    const handleOAuthComplete = () => {
      oauthInProgress = false
      sessionStorage.removeItem('oauth-in-progress')
      console.log('✅ OAuth flow completed, session clearing re-enabled')
    }
    
    // Check if OAuth was in progress from previous page
    if (sessionStorage.getItem('oauth-in-progress') === 'true') {
      oauthInProgress = true
    }
    
    // Listen for successful auth to clear the OAuth flag
    const supabaseForListener = createClient()
    const { data: { subscription } } = supabaseForListener.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        handleOAuthComplete()
      }
    })
    
    // Clear session when page is about to unload (closing tab, navigating away, etc.)
    const handleBeforeUnload = async () => {
      try {
        // Don't run on any auth pages (login, signup, callback, etc.)
        const isAuthPage = window.location.pathname.startsWith('/auth/')
        if (isAuthPage) {
          console.log('📍 On auth page, skipping session clear')
          return // Let auth flow complete
        }
        
        // Don't run if OAuth is in progress
        if (oauthInProgress || sessionStorage.getItem('oauth-in-progress') === 'true') {
          console.log('🔐 OAuth in progress, skipping session clear')
          return
        }

        console.log('🧹 Clearing session on page unload')
        const supabase = createClient()
        
        // Clear all Supabase-related localStorage BUT keep PKCE verifier for OAuth
        const keys = Object.keys(localStorage)
        keys.forEach(key => {
          if (key.includes('supabase') || key.includes('sb-')) {
            // Preserve PKCE verifier and auth tokens
            // PKCE keys: code-verifier, code_verifier, pkce-code-verifier
            const shouldPreserve = 
              key.includes('code-verifier') || 
              key.includes('code_verifier') || 
              key.includes('code-challenge') || 
              key.includes('code_challenge') ||
              key.includes('pkce') ||
              key.includes('-auth-token') ||
              key.endsWith('-auth-token-code-verifier')
            
            if (!shouldPreserve) {
              localStorage.removeItem(key)
            }
          }
        })
        
        // Don't clear sessionStorage with OAuth flag
        const sessionKeys = Object.keys(sessionStorage)
        sessionKeys.forEach(key => {
          if (key.includes('supabase') || key.includes('sb-')) {
            if (key !== 'oauth-in-progress') {
              sessionStorage.removeItem(key)
            }
          }
        })
        
        // Sign out the user (this clears auth cookies)
        await supabase.auth.signOut()
      } catch (error) {
        // Silently fail - don't block the page unload
        console.error('Error clearing session:', error)
      }
    }

    // ... rest of disabled code
    
    */
  }, [])

  return null // This component doesn't render anything
}

