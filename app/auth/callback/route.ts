import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error, errorDescription)
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("error", errorDescription || "Authentication failed")
    return NextResponse.redirect(url)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error("Error exchanging code for session:", exchangeError)
      const url = new URL("/auth/login", request.url)
      url.searchParams.set("error", exchangeError.message)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.redirect(new URL("/", request.url))
}
