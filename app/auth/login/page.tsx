"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Github, Chrome, Mail, AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [touched, setTouched] = useState({ email: false, password: false })
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false)
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null)
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false)
  const router = useRouter()

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      return "Email is required"
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address"
    }
    return null
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (touched.email) {
      setEmailError(validateEmail(value))
    }
  }

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }))
    setEmailError(validateEmail(email))
  }

  // Check for OAuth error in URL params and prevent auto-redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    
    // Check for error in URL
    const errorParam = params.get("error") || hashParams.get("error")
    if (errorParam) {
      setError(errorParam)
    }
    
    // Clean up any OAuth-related parameters from URL (access_token, code, etc.)
    // These should only be processed on the callback page
    const oauthParams = ['access_token', 'refresh_token', 'code', 'error', 'error_description', 'state']
    let hasOAuthParams = false
    
    oauthParams.forEach(param => {
      if (params.has(param) || hashParams.has(param)) {
        hasOAuthParams = true
      }
    })
    
    // If there are OAuth params on the login page (shouldn't happen), clean the URL
    if (hasOAuthParams) {
      console.log("Cleaning OAuth parameters from login page URL")
      window.history.replaceState({}, "", "/auth/login")
      
      // If there's an error, keep it displayed
      if (!errorParam) {
        // Reload the page to start fresh
        window.location.href = "/auth/login"
      }
    }
    
    // Check if user is already logged in and redirect to home
    const checkExistingSession = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      // Only redirect if there's a valid, active session
      if (session && session.user) {
        console.log("User already logged in, redirecting to home")
        router.push("/")
      }
    }
    
    checkExistingSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate email
    const emailValidationError = validateEmail(email)
    if (emailValidationError) {
      setEmailError(emailValidationError)
      setTouched({ email: true, password: true })
      return
    }

    if (!password) {
      setTouched({ email: true, password: true })
      return
    }

    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setEmailError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) throw error
      router.push("/")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      setError(errorMessage)
      
      // Check if it's an email error
      if (errorMessage.toLowerCase().includes("email") || errorMessage.toLowerCase().includes("user")) {
        setEmailError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: "google" | "github") => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      // Signal that OAuth is starting (prevents session manager from clearing PKCE)
      if (typeof window !== 'undefined' && (window as any).__oauthStart) {
        (window as any).__oauthStart()
      }
      sessionStorage.setItem('oauth-in-progress', 'true')
      
      console.log('🔐 Starting OAuth flow with', provider)
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) throw error
      
      // OAuth redirect will happen automatically
      console.log('🔐 OAuth redirect initiated')
    } catch (error: unknown) {
      console.error('❌ OAuth error:', error)
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsLoading(false)
      
      // Clear OAuth flag on error
      sessionStorage.removeItem('oauth-in-progress')
      if (typeof window !== 'undefined' && (window as any).__oauthComplete) {
        (window as any).__oauthComplete()
      }
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsForgotPasswordLoading(true)
    setForgotPasswordError(null)
    setForgotPasswordSuccess(false)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      setForgotPasswordSuccess(true)
    } catch (error: unknown) {
      setForgotPasswordError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsForgotPasswordLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 sm:p-6 md:p-10 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="text-center mb-2">
            <Link
              href="/"
              className="inline-block text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              Market Mosaic
            </Link>
            <p className="text-sm text-muted-foreground mt-2">Welcome back</p>
          </div>
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold">Sign in</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    aria-invalid={touched.email && !!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                    className={emailError && touched.email ? "border-destructive" : ""}
                    autoComplete="email"
                  />
                  {touched.email && emailError && (
                    <p id="email-error" className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {emailError}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="text-sm text-primary hover:underline font-medium"
                          onClick={() => {
                            setForgotPasswordEmail(email)
                            setForgotPasswordError(null)
                            setForgotPasswordSuccess(false)
                          }}
                        >
                          Forgot password?
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Reset Password</DialogTitle>
                          <DialogDescription>
                            Enter your email address and we'll send you a link to reset your password.
                          </DialogDescription>
                        </DialogHeader>
                        {!forgotPasswordSuccess ? (
                          <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="forgot-email">Email</Label>
                              <Input
                                id="forgot-email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                value={forgotPasswordEmail}
                                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                              />
                            </div>
                            {forgotPasswordError && (
                              <p className="text-sm text-destructive">{forgotPasswordError}</p>
                            )}
                            <div className="flex gap-2">
                              <Button
                                type="submit"
                                className="flex-1"
                                disabled={isForgotPasswordLoading}
                              >
                                {isForgotPasswordLoading ? "Sending..." : "Send Reset Link"}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsForgotPasswordOpen(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-green-600">
                              <Mail className="h-4 w-4" />
                              <span className="text-sm font-medium">Email sent!</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Check your email for a password reset link. If you don't see it, check your spam folder.
                            </p>
                            <Button
                              onClick={() => {
                                setIsForgotPasswordOpen(false)
                                setForgotPasswordSuccess(false)
                                setForgotPasswordEmail("")
                              }}
                              className="w-full"
                            >
                              Close
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                  <PasswordInput
                    id="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                    aria-invalid={touched.password && !password}
                    autoComplete="current-password"
                    className={touched.password && !password ? "border-destructive" : ""}
                  />
                  {touched.password && !password && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Password is required
                    </p>
                  )}
                </div>
                
                {error && !emailError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground text-xs font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuthLogin("google")}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Chrome className="h-4 w-4" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuthLogin("github")}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
              </div>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Don&apos;t have an account? </span>
                <Link 
                  href="/auth/sign-up" 
                  className="text-primary font-semibold hover:underline"
                >
                  Create account
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
