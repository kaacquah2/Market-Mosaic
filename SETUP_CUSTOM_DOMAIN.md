# Setup Custom Domain for Email Sending

## The Problem
You can't send emails to other users because Resend only allows testing to your own verified email address.

## Solution: Add Custom Domain to Vercel

### Step 1: Deploy Your App to Vercel (if not already deployed)

1. Push your code to GitHub/GitLab
2. Go to https://vercel.com
3. Import your repository
4. Deploy your app

### Step 2: Add Custom Domain in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Domains**
3. Click **Add Domain**
4. Enter your domain (e.g., `yourstore.com`)
5. Follow Vercel's instructions to verify ownership

### Step 3: Configure DNS

Add these DNS records to your domain provider:

**For apex domain (yourstore.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 4: Verify Domain in Resend

1. Go to https://resend.com/domains
2. Click **Add Domain**
3. Enter your domain
4. Add the DNS records provided by Resend to your domain provider
5. Wait for verification (usually 5-10 minutes)

### Step 5: Update Your .env File

After domain is verified, update your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=contact@yourdomain.com  # Use your verified domain
```

### Step 6: Deploy Changes

Push your changes and Vercel will automatically deploy:

```bash
git add .
git commit -m "Update email config"
git push
```

## Alternative: Use a Subdomain

If you don't have a domain yet, you can use Vercel's built-in domains:

1. Your app will be at: `https://your-app.vercel.app`
2. Or use Vercel's suggested domain in Settings → Domains

## Quick Alternative: Use Nodemailer (No Domain Needed)

If you want to send emails without setting up a domain:

1. Install Nodemailer: `npm install nodemailer`
2. Use SMTP (Gmail, Outlook, etc.)
3. No domain verification needed!

Would you like me to show you how to switch to Nodemailer instead?

## Testing

After setup, test the email functionality:
- Go through checkout process
- Emails should now send to any recipient

---

**Need help?** Check out:
- Vercel Docs: https://vercel.com/docs/domains
- Resend Docs: https://resend.com/docs

