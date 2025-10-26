"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Shield, Smartphone, Key, AlertTriangle, CheckCircle, Copy, Download, Mail } from "lucide-react"
import { twoFactorService, TwoFactorSetup } from "@/lib/two-factor-service"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

export function TwoFactorSettings() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    check2FAStatus()
  }, [])

  const check2FAStatus = async () => {
    try {
      const supabase = createClient()
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)

      if (currentUser) {
        const enabled = await twoFactorService.is2FAEnabled(currentUser.id)
        setIsEnabled(enabled)
      }
    } catch (error) {
      console.error("Error checking 2FA status:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle2FA = async (enabled: boolean) => {
    if (!user) return

    if (enabled) {
      // Enable 2FA - show setup dialog
      setIsEnabled(true)
    } else {
      // Disable 2FA - show confirmation dialog
      const token = prompt("Enter your 2FA code to disable:")
      if (token) {
        try {
          const success = await twoFactorService.disable2FA(user.id, token)
          if (success) {
            setIsEnabled(false)
            alert("2FA has been disabled successfully")
          } else {
            alert("Invalid 2FA code")
          }
        } catch (error) {
          console.error("Error disabling 2FA:", error)
          alert("Failed to disable 2FA")
        }
      }
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading 2FA settings...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">2FA Status</h3>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={isEnabled ? "default" : "secondary"}>
              {isEnabled ? "Enabled" : "Disabled"}
            </Badge>
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggle2FA}
            />
          </div>
        </div>

        {isEnabled ? (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Two-factor authentication is enabled. Your account is protected with an additional security layer.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <BackupCodesDialog />
              <RegenerateBackupCodesDialog />
            </div>
          </div>
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Two-factor authentication is disabled. Enable it to add an extra layer of security to your account.
            </AlertDescription>
          </Alert>
        )}

        {!isEnabled && (
          <Setup2FADialog onSetupComplete={check2FAStatus} />
        )}
      </CardContent>
    </Card>
  )
}

function Setup2FADialog({ onSetupComplete }: { onSetupComplete: () => void }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'setup' | 'verify'>('setup')
  const [setupData, setSetupData] = useState<TwoFactorSetup | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
    }
    getUser()
  }, [])

  const handleSetup = async () => {
    if (!user) return

    setLoading(true)
    try {
      const data = await twoFactorService.generateSecret(user.id)
      setSetupData(data)
      setStep('verify')
      
      // Show user-friendly message about email
      if (data.emailSent && data.message) {
        alert(data.message)
      }
    } catch (error) {
      console.error("Error setting up 2FA:", error)
      alert("Failed to set up 2FA")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!user || !verificationCode) return

    setLoading(true)
    try {
      const success = await twoFactorService.enable2FA(user.id, verificationCode)
      if (success) {
        setOpen(false)
        setStep('setup')
        setVerificationCode('')
        setSetupData(null)
        onSetupComplete()
        alert("2FA has been enabled successfully!")
      } else {
        alert("Invalid verification code")
      }
    } catch (error) {
      console.error("Error verifying 2FA:", error)
      alert("Failed to verify 2FA code")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Set Up 2FA
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
        </DialogHeader>
        
        {step === 'setup' ? (
          <div className="space-y-4">
            <div className="text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Step 1: Get Verification Code</h3>
              <p className="text-sm text-muted-foreground">
                We'll send a 6-digit verification code to your email address. You'll also receive backup codes for emergency access.
              </p>
            </div>
            
            <Button onClick={handleSetup} disabled={loading} className="w-full">
              {loading ? "Sending Code..." : "Send Verification Code to Email"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Step 2: Enter Verification Code</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check your email for the 6-digit verification code. Enter it below to complete the setup.
              </p>
              {setupData?.emailSent && (
                <p className="text-sm text-green-600 font-medium mb-4">
                  ✓ Code sent to your email!
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('setup')} className="flex-1">
                Back
              </Button>
              <Button onClick={handleVerify} disabled={loading || verificationCode.length !== 6} className="flex-1">
                {loading ? "Verifying..." : "Verify & Enable"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function BackupCodesDialog() {
  const [open, setOpen] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
    }
    getUser()
  }, [])

  const fetchBackupCodes = async () => {
    if (!user) return

    setLoading(true)
    try {
      const codes = await twoFactorService.getBackupCodes(user.id)
      setBackupCodes(codes)
    } catch (error) {
      console.error("Error fetching backup codes:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  const downloadCodes = () => {
    const content = backupCodes.join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'backup-codes.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={fetchBackupCodes}>
          <Key className="h-4 w-4 mr-2" />
          View Backup Codes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Backup Codes</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Save these backup codes in a safe place. Each code can only be used once.
            </AlertDescription>
          </Alert>
          
          {loading ? (
            <p className="text-center text-muted-foreground">Loading backup codes...</p>
          ) : (
            <div className="space-y-2">
              {backupCodes.map((code, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <code className="font-mono">{code}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(code)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadCodes} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" onClick={() => {
              const allCodes = backupCodes.join('\n')
              copyToClipboard(allCodes)
            }} className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function RegenerateBackupCodesDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
    }
    getUser()
  }, [])

  const handleRegenerate = async () => {
    if (!user) return

    const token = prompt("Enter your 2FA code to regenerate backup codes:")
    if (!token) return

    setLoading(true)
    try {
      const verification = await twoFactorService.verifyToken(user.id, token)
      if (!verification.isValid) {
        alert("Invalid 2FA code")
        return
      }

      const newCodes = await twoFactorService.regenerateBackupCodes(user.id)
      alert(`New backup codes generated:\n${newCodes.join('\n')}`)
      setOpen(false)
    } catch (error) {
      console.error("Error regenerating backup codes:", error)
      alert("Failed to regenerate backup codes")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Key className="h-4 w-4 mr-2" />
          Regenerate Codes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Regenerate Backup Codes</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This will invalidate all existing backup codes and generate new ones. Make sure to save the new codes.
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleRegenerate} disabled={loading} className="flex-1">
              {loading ? "Regenerating..." : "Regenerate"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
