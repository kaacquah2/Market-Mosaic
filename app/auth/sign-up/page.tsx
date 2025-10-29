"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { AlertCircle, Loader2, CheckCircle2, XCircle } from "lucide-react"

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    repeatPassword: false,
  })
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null)
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

  // Password requirements
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^a-zA-Z0-9]/.test(password),
  }

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean)

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

  // Check password match
  useEffect(() => {
    if (touched.repeatPassword && repeatPassword) {
      if (password !== repeatPassword) {
        setPasswordMatchError("Passwords do not match")
      } else {
        setPasswordMatchError(null)
      }
    } else {
      setPasswordMatchError(null)
    }
  }, [password, repeatPassword, touched.repeatPassword])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      repeatPassword: true,
    })

    // Validate all fields
    const emailValidationError = validateEmail(email)
    if (emailValidationError) {
      setEmailError(emailValidationError)
    }

    if (!firstName.trim()) {
      setError("First name is required")
      setIsLoading(false)
      return
    }

    if (!lastName.trim()) {
      setError("Last name is required")
      setIsLoading(false)
      return
    }

    if (emailValidationError) {
      setError(emailValidationError)
      setIsLoading(false)
      return
    }

    if (!allRequirementsMet || password.length < 8) {
      setError("Password does not meet all requirements")
      setIsLoading(false)
      return
    }

    if (password !== repeatPassword) {
      setPasswordMatchError("Passwords do not match")
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setEmailError(null)
    setPasswordMatchError(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}`,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },
        },
      })
      if (error) throw error
      
      // Update user profile with name
      if (data.user) {
        const { error: profileError } = await supabase
          .from("user_profiles")
          .update({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          })
          .eq("user_id", data.user.id)
        
        if (profileError) {
          console.error("Error updating profile:", profileError)
        }
      }
      
      router.push("/auth/sign-up-success")
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
            <p className="text-sm text-muted-foreground mt-2">Create your account</p>
          </div>
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold">Create account</CardTitle>
              <CardDescription>Sign up to start shopping</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, firstName: true }))}
                      aria-invalid={touched.firstName && !firstName.trim()}
                      autoComplete="given-name"
                      className={touched.firstName && !firstName.trim() ? "border-destructive" : ""}
                    />
                    {touched.firstName && !firstName.trim() && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Required
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, lastName: true }))}
                      aria-invalid={touched.lastName && !lastName.trim()}
                      autoComplete="family-name"
                      className={touched.lastName && !lastName.trim() ? "border-destructive" : ""}
                    />
                    {touched.lastName && !lastName.trim() && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Required
                      </p>
                    )}
                  </div>
                </div>

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
                    autoComplete="email"
                    className={emailError && touched.email ? "border-destructive" : ""}
                  />
                  {touched.email && emailError && (
                    <p id="email-error" className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {emailError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    id="password"
                    placeholder="Create a password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                    showStrength={true}
                    aria-invalid={touched.password && !allRequirementsMet}
                    autoComplete="new-password"
                    className={touched.password && !allRequirementsMet ? "border-destructive" : ""}
                  />
                  {password && (
                    <div className="space-y-2 pt-1">
                      <p className="text-xs font-medium text-foreground">Password requirements:</p>
                      <ul className="space-y-1.5 text-xs">
                        <li className={`flex items-center gap-2 ${passwordRequirements.minLength ? "text-green-600 dark:text-green-500" : "text-muted-foreground"}`}>
                          {passwordRequirements.minLength ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          At least 8 characters
                        </li>
                        <li className={`flex items-center gap-2 ${passwordRequirements.hasUpperCase ? "text-green-600 dark:text-green-500" : "text-muted-foreground"}`}>
                          {passwordRequirements.hasUpperCase ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          One uppercase letter
                        </li>
                        <li className={`flex items-center gap-2 ${passwordRequirements.hasLowerCase ? "text-green-600 dark:text-green-500" : "text-muted-foreground"}`}>
                          {passwordRequirements.hasLowerCase ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          One lowercase letter
                        </li>
                        <li className={`flex items-center gap-2 ${passwordRequirements.hasNumber ? "text-green-600 dark:text-green-500" : "text-muted-foreground"}`}>
                          {passwordRequirements.hasNumber ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          One number
                        </li>
                        <li className={`flex items-center gap-2 ${passwordRequirements.hasSpecialChar ? "text-green-600 dark:text-green-500" : "text-muted-foreground"}`}>
                          {passwordRequirements.hasSpecialChar ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          One special character
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repeat-password">Confirm password</Label>
                  <PasswordInput
                    id="repeat-password"
                    placeholder="Confirm your password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, repeatPassword: true }))}
                    aria-invalid={touched.repeatPassword && !!passwordMatchError}
                    autoComplete="new-password"
                    className={passwordMatchError && touched.repeatPassword ? "border-destructive" : ""}
                  />
                  {touched.repeatPassword && passwordMatchError && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {passwordMatchError}
                    </p>
                  )}
                  {touched.repeatPassword && repeatPassword && !passwordMatchError && password === repeatPassword && (
                    <p className="text-sm text-green-600 dark:text-green-500 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Passwords match
                    </p>
                  )}
                </div>

                {error && (
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
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>

                <div className="mt-6 text-center text-sm">
                  <span className="text-muted-foreground">Already have an account? </span>
                  <Link 
                    href="/auth/login" 
                    className="text-primary font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
