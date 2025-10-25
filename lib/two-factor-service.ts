import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import { createClient } from "@/lib/supabase/client"

export interface TwoFactorSetup {
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
}

export interface TwoFactorVerification {
  isValid: boolean
  backupCodeUsed?: boolean
}

export class TwoFactorService {
  private supabase = createClient()

  async generateSecret(userId: string): Promise<TwoFactorSetup> {
    // Generate a new secret
    const secret = speakeasy.generateSecret({
      name: `Market Mosaic (${userId})`,
      issuer: 'Market Mosaic',
      length: 32
    })

    // Generate QR code URL
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!)

    // Generate backup codes
    const backupCodes = this.generateBackupCodes()

    // Store the secret and backup codes in the database
    const { error } = await this.supabase
      .from('user_profiles')
      .update({
        two_factor_secret: secret.base32,
        backup_codes: backupCodes
      })
      .eq('user_id', userId)

    if (error) {
      throw new Error('Failed to store 2FA secret')
    }

    return {
      secret: secret.base32,
      qrCodeUrl,
      backupCodes
    }
  }

  async verifyToken(userId: string, token: string): Promise<TwoFactorVerification> {
    // Get user's 2FA secret
    const { data: profile, error: profileError } = await this.supabase
      .from('user_profiles')
      .select('two_factor_secret, backup_codes')
      .eq('user_id', userId)
      .single()

    if (profileError || !profile) {
      throw new Error('User profile not found')
    }

    if (!profile.two_factor_secret) {
      throw new Error('2FA not set up for this user')
    }

    // First, try to verify as TOTP token
    const isValidToken = speakeasy.totp.verify({
      secret: profile.two_factor_secret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow 2 time steps before/after current time
    })

    if (isValidToken) {
      return { isValid: true }
    }

    // If TOTP fails, check if it's a backup code
    if (profile.backup_codes && profile.backup_codes.includes(token)) {
      // Remove the used backup code
      const updatedBackupCodes = profile.backup_codes.filter((code: string) => code !== token)
      
      await this.supabase
        .from('user_profiles')
        .update({ backup_codes: updatedBackupCodes })
        .eq('user_id', userId)

      return { isValid: true, backupCodeUsed: true }
    }

    return { isValid: false }
  }

  async enable2FA(userId: string, token: string): Promise<boolean> {
    const verification = await this.verifyToken(userId, token)
    
    if (!verification.isValid) {
      return false
    }

    // Enable 2FA for the user
    const { error } = await this.supabase
      .from('user_profiles')
      .update({
        two_factor_enabled: true,
        last_2fa_verification: new Date().toISOString()
      })
      .eq('user_id', userId)

    return !error
  }

  async disable2FA(userId: string, token: string): Promise<boolean> {
    const verification = await this.verifyToken(userId, token)
    
    if (!verification.isValid) {
      return false
    }

    // Disable 2FA for the user
    const { error } = await this.supabase
      .from('user_profiles')
      .update({
        two_factor_enabled: false,
        two_factor_secret: null,
        backup_codes: null,
        last_2fa_verification: null
      })
      .eq('user_id', userId)

    return !error
  }

  async is2FAEnabled(userId: string): Promise<boolean> {
    const { data: profile, error } = await this.supabase
      .from('user_profiles')
      .select('two_factor_enabled')
      .eq('user_id', userId)
      .single()

    if (error || !profile) {
      return false
    }

    return profile.two_factor_enabled || false
  }

  async create2FASession(userId: string): Promise<string> {
    // Generate a session token
    const sessionToken = this.generateSessionToken()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10) // 10 minutes

    // Store the session
    const { error } = await this.supabase
      .from('two_factor_sessions')
      .insert({
        user_id: userId,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString()
      })

    if (error) {
      throw new Error('Failed to create 2FA session')
    }

    return sessionToken
  }

  async verify2FASession(sessionToken: string, token: string): Promise<boolean> {
    // Get the session
    const { data: session, error: sessionError } = await this.supabase
      .from('two_factor_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (sessionError || !session) {
      return false
    }

    // Verify the token
    const verification = await this.verifyToken(session.user_id, token)
    
    if (!verification.isValid) {
      return false
    }

    // Mark session as verified
    await this.supabase
      .from('two_factor_sessions')
      .update({ verified: true })
      .eq('id', session.id)

    return true
  }

  async getBackupCodes(userId: string): Promise<string[]> {
    const { data: profile, error } = await this.supabase
      .from('user_profiles')
      .select('backup_codes')
      .eq('user_id', userId)
      .single()

    if (error || !profile) {
      return []
    }

    return profile.backup_codes || []
  }

  async regenerateBackupCodes(userId: string): Promise<string[]> {
    const newBackupCodes = this.generateBackupCodes()

    const { error } = await this.supabase
      .from('user_profiles')
      .update({ backup_codes: newBackupCodes })
      .eq('user_id', userId)

    if (error) {
      throw new Error('Failed to regenerate backup codes')
    }

    return newBackupCodes
  }

  private generateBackupCodes(): string[] {
    const codes: string[] = []
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase())
    }
    return codes
  }

  private generateSessionToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  async cleanupExpiredSessions(): Promise<void> {
    await this.supabase.rpc('cleanup_expired_2fa_sessions')
  }
}

export const twoFactorService = new TwoFactorService()
