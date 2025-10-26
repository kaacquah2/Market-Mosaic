import { createClient } from "@/lib/supabase/server"
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'

export interface TwoFactorSetup {
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
  emailSent: boolean
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, token, code } = await request.json()

    switch (action) {
      case 'generate': {
        // Generate a 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        
        // Store code temporarily in database with 10-minute expiration
        const expiresAt = new Date()
        expiresAt.setMinutes(expiresAt.getMinutes() + 10)

        const { error: insertError } = await supabase
          .from('two_factor_sessions')
          .insert({
            user_id: user.id,
            session_token: code,
            expires_at: expiresAt.toISOString(),
            verified: false
          })

        if (insertError) {
          console.error('Failed to store 2FA code:', insertError)
          return Response.json({ error: 'Failed to store 2FA code' }, { status: 500 })
        }

        // Send code via email using Resend
        try {
          const resendApiKey = process.env.RESEND_API_KEY
          
          if (resendApiKey) {
            const emailHtml = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Two-Factor Authentication Setup</h2>
                <p>Your verification code is:</p>
                <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                  <h1 style="color: #2563eb; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
                </div>
                <p style="color: #666;">This code will expire in 10 minutes.</p>
                <p style="color: #666;">If you didn't request this code, you can safely ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 12px;">Market Mosaic - Your verification code</p>
              </div>
            `
            
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: 'Market Mosaic <noreply@marketmosaic.com>',
                to: [user.email!],
                subject: 'Your 2FA Verification Code',
                html: emailHtml,
              }),
            })
            
            console.log(`2FA code sent to ${user.email}`)
          } else {
            console.log(`2FA Code for ${user.email}: ${code}`)
          }
        } catch (emailError) {
          console.error('Failed to send email:', emailError)
          // Don't fail the request, code is still stored
        }

        // Generate backup codes for emergency access
        const backupCodes: string[] = []
        for (let i = 0; i < 10; i++) {
          backupCodes.push(Math.random().toString(36).substring(2, 10).toUpperCase())
        }

        // Store backup codes
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            backup_codes: backupCodes
          })
          .eq('user_id', user.id)

        return Response.json({
          secret: code,
          qrCodeUrl: '', // Not needed for email-based
          backupCodes,
          emailSent: true,
          message: `A 6-digit code has been sent to ${user.email}`
        } as TwoFactorSetup)
      }

      case 'verify': {
        if (!code) {
          return Response.json({ error: 'Code is required' }, { status: 400 })
        }

        // Check if code exists in two_factor_sessions (for initial setup)
        const { data: session, error: sessionError } = await supabase
          .from('two_factor_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('session_token', code)
          .eq('verified', false)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        let isValid = false
        let backupCodeUsed = false

        if (session && !sessionError) {
          // Code found in sessions - mark as verified
          isValid = true
        } else {
          // Check if it's a backup code
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('backup_codes')
            .eq('user_id', user.id)
            .single()

          if (!profileError && profile && profile.backup_codes && profile.backup_codes.includes(code)) {
            isValid = true
            backupCodeUsed = true
            
            // Remove the used backup code
            const updatedBackupCodes = profile.backup_codes.filter((c: string) => c !== code)
            await supabase
              .from('user_profiles')
              .update({ backup_codes: updatedBackupCodes })
              .eq('user_id', user.id)
          }
        }

        if (!isValid) {
          return Response.json({ error: 'Invalid or expired code' }, { status: 400 })
        }

        // Enable 2FA for the user
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            two_factor_enabled: true,
            two_factor_secret: 'EMAIL', // Mark as email-based
            last_2fa_verification: new Date().toISOString()
          })
          .eq('user_id', user.id)

        if (updateError) {
          console.error('Failed to enable 2FA:', updateError)
          return Response.json({ error: 'Failed to enable 2FA' }, { status: 500 })
        }

        return Response.json({ 
          success: true,
          backupCodeUsed 
        })
      }

      case 'check': {
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('two_factor_enabled')
          .eq('user_id', user.id)
          .single()

        if (error || !profile) {
          return Response.json({ enabled: false })
        }

        return Response.json({ enabled: profile.two_factor_enabled || false })
      }

      case 'disable': {
        if (!code) {
          return Response.json({ error: 'Code is required' }, { status: 400 })
        }

        // Get user's profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('backup_codes, two_factor_enabled')
          .eq('user_id', user.id)
          .single()

        if (profileError || !profile) {
          return Response.json({ error: 'User profile not found' }, { status: 404 })
        }

        if (!profile.two_factor_enabled) {
          return Response.json({ error: '2FA is not enabled' }, { status: 400 })
        }

        // Check if it's a backup code
        let isValid = false
        if (profile.backup_codes && profile.backup_codes.includes(code)) {
          isValid = true
          
          // Remove the used backup code
          const updatedBackupCodes = profile.backup_codes.filter((c: string) => c !== code)
          await supabase
            .from('user_profiles')
            .update({ backup_codes: updatedBackupCodes })
            .eq('user_id', user.id)
        }

        // Also check if there's a valid session code
        const { data: session } = await supabase
          .from('two_factor_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('session_token', code)
          .gt('expires_at', new Date().toISOString())
          .single()

        if (session && !isValid) {
          isValid = true
        }

        if (!isValid) {
          return Response.json({ error: 'Invalid code' }, { status: 400 })
        }

        // Disable 2FA
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            two_factor_enabled: false,
            two_factor_secret: null,
            backup_codes: null,
            last_2fa_verification: null
          })
          .eq('user_id', user.id)

        if (updateError) {
          return Response.json({ error: 'Failed to disable 2FA' }, { status: 500 })
        }

        return Response.json({ success: true })
      }

      case 'send-login-code': {
        // Generate and send a code for login
        const loginCode = Math.floor(100000 + Math.random() * 900000).toString()
        
        const expiresAt = new Date()
        expiresAt.setMinutes(expiresAt.getMinutes() + 10)

        await supabase
          .from('two_factor_sessions')
          .insert({
            user_id: user.id,
            session_token: loginCode,
            expires_at: expiresAt.toISOString(),
            verified: false
          })

        // Send login code via email using Resend
        try {
          const resendApiKey = process.env.RESEND_API_KEY
          
          if (resendApiKey) {
            const emailHtml = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Login Verification</h2>
                <p>Your login code is:</p>
                <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                  <h1 style="color: #2563eb; font-size: 32px; margin: 0; letter-spacing: 5px;">${loginCode}</h1>
                </div>
                <p style="color: #666;">This code will expire in 10 minutes.</p>
                <p style="color: #999; font-size: 12px;">If you didn't attempt to log in, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 12px;">Market Mosaic</p>
              </div>
            `
            
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: 'Market Mosaic <noreply@marketmosaic.com>',
                to: [user.email!],
                subject: 'Your Login Verification Code',
                html: emailHtml,
              }),
            })
            
            console.log(`Login code sent to ${user.email}`)
          } else {
            console.log(`Login code for ${user.email}: ${loginCode}`)
          }
        } catch (emailError) {
          console.error('Failed to send login code email:', emailError)
        }

        return Response.json({ 
          success: true, 
          message: `Code sent to ${user.email}` 
        })
      }

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('2FA error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

