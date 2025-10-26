# How 2FA Codes Work - Simple Guide

## The Key Concept
**You DON'T receive codes - you generate them yourself on your phone!**

## Complete Flow

### Step 1: Setting Up 2FA (One Time)

1. Go to your Account Settings → Two-Factor Authentication
2. Click "Set Up 2FA"
3. Click "Generate QR Code"
4. A black and white QR code appears on screen
5. Open **Google Authenticator** or **Authy** on your phone
6. Click "Add Account" or the "+" button
7. Choose "Scan a QR code"
8. Point your phone camera at the QR code on your screen
9. The app captures the secret from the QR code
10. The app starts showing a 6-digit code that changes every 30 seconds

**That's it! Setup complete.**

---

### Step 2: Getting Your Code (When You Log In)

When you need to log in with 2FA enabled:

1. Enter your email and password
2. System asks for your 2FA code
3. **Open your authenticator app on your phone**
4. **Look at the current 6-digit code**
5. Type that code into the website
6. Submit - you're logged in!

---

## Visual Example

```
┌─────────────────────────────┐
│  Website Login Page         │
│  ✓ Email: user@example.com │
│  ✓ Password: ••••••••••     │
│                             │
│  Enter 2FA Code: [______]   │
│         [Submit]             │
└─────────────────────────────┘
           ↑
           │
           │ You look at your phone app
           │
           ▼
┌─────────────────────────────┐
│  Google Authenticator       │
│                             │
│  Market Mosaic              │
│  ┌─────────────────┐        │
│  │   4  2  3  8  1  6  │ ← Copy this code
│  └─────────────────┘        │
│        ⏱ 12s                │
│                             │
│  The number changes          │
│  every 30 seconds            │
└─────────────────────────────┘
```

---

## What Happens Behind the Scenes

### When You Scan the QR Code:

The QR code contains a **secret key** that looks like this:
```
JBSWY3DPEHPK3PXP
```

This secret is:
- Stored in your database
- Stored in your phone's authenticator app
- **NEVER sent over email or SMS**

### When You Log In:

1. Your phone calculates a code using:
   - The secret (stored in app)
   - Current time
   - A mathematical formula (HMAC-SHA1)

2. The website calculates the same code using:
   - The secret (stored in database)
   - Current time
   - The same mathematical formula

3. Both calculations should match!

4. If they match → Login successful
5. If they don't → Login fails

---

## Download an Authenticator App

### For iPhone:
- [Google Authenticator (App Store)](https://apps.apple.com/app/google-authenticator/id388497605)
- [Microsoft Authenticator (App Store)](https://apps.apple.com/app/microsoft-authenticator/id983156458)
- [Authy (App Store)](https://apps.apple.com/app/authy/id494168017)

### For Android:
- [Google Authenticator (Play Store)](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2)
- [Microsoft Authenticator (Play Store)](https://play.google.com/store/apps/details?id=com.microsoft.authenticator)
- [Authy (Play Store)](https://play.google.com/store/apps/details?id=com.authy.authy_mobile)

### For Desktop (Optional):
- [Authy Desktop](https://authy.com/download/)
- [1Password](https://1password.com/) (can store 2FA secrets)

---

## Example Session

### Setting Up (First Time):
```
You: [Enable 2FA]
Website: [Shows QR Code]
You: [Open Google Authenticator on phone]
You: [Scan QR code]
Authenticator: "Market Mosaic added ✓"
Authenticator: [Shows code: 123456]
You: [Enter 123456 on website]
Website: "2FA Enabled successfully!"
```

### Logging In (Every Time After):
```
You: [Enter email and password]
Website: "Enter your 2FA code:"
You: [Check phone - code is: 789012]
You: [Enter 789012]
Website: "Login successful!"
```

---

## Common Questions

### Q: What if I lose my phone?
A: Use your **backup codes** (10 codes saved during setup). Each can only be used once.

### Q: What are backup codes?
A: One-time passwords you can use if you lose your phone. They're shown during setup - **save them somewhere safe!**

### Q: Why don't codes come via SMS?
A: SMS can be intercepted. This method is more secure because the secret never leaves your device.

### Q: What if my phone battery dies?
A: The codes are calculated locally - they work even offline. Just use the current code shown.

### Q: Can I use the same code twice?
A: No! Codes expire after 30 seconds. Each code is unique and time-based.

### Q: What if the code doesn't work?
A: 
1. Check your phone's time is correct
2. Make sure you're using the **current** code (they change every 30 seconds)
3. Try waiting for a fresh code
4. If still failing, use a backup code

---

## Why This is Secure

✅ Secret never sent over network  
✅ Codes expire every 30 seconds  
✅ Works offline on your phone  
✅ Server never stores your actual password + code  
✅ Even if someone hacks the database, they still need your phone  
✅ Backup codes provide emergency access  

---

## Quick Start Checklist

- [ ] Download an authenticator app on your phone
- [ ] Go to Account Settings
- [ ] Enable 2FA
- [ ] Scan the QR code with your app
- [ ] Save the backup codes shown
- [ ] Verify with a code from the app
- [ ] Done! Now you're more secure

---

## Important Reminders

1. **Codes change every 30 seconds** - use the current one
2. **Need accurate time** - enable auto time sync on your phone
3. **Backup codes are important** - save them safely
4. **One-time use only** - backup codes can't be reused
5. **No SMS needed** - everything happens locally on your device

---

## Visual Timeline

```
Setup Day (Once):
┌─────────────────────────────────────────────┐
│ 1. Scan QR code                              │
│ 2. App stores secret                        │
│ 3. App starts generating codes              │
│ 4. Save backup codes                         │
└─────────────────────────────────────────────┘

Every Login (After Setup):
┌─────────────────────────────────────────────┐
│ 1. Open auth app on phone                  │
│ 2. See current 6-digit code               │
│ 3. Enter code on website                   │
│ 4. Login successful                         │
└─────────────────────────────────────────────┘
```

Remember: **Codes appear on your phone's authenticator app, not in your email or SMS!**

