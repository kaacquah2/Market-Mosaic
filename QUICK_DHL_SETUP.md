# 🚀 Quick DHL API Setup

## ✅ What You Have

You received from DHL:
- **Key** (Client ID)
- **Secret** (Client Secret)

## 📝 Add to .env.local

Open your `.env.local` file and add:

```bash
# DHL API Credentials
DHL_API_KEY=your_dhl_key_here
DHL_API_SECRET=your_dhl_secret_here
```

**Replace with your actual values:**
- Replace `your_dhl_key_here` with the **Key** you received
- Replace `your_dhl_secret_here` with the **Secret** you received

### Example:

```bash
DHL_API_KEY=abc123def456ghi789jkl
DHL_API_SECRET=xyz789uvw456rst123opq
```

## 🎯 That's It!

After adding these credentials:

1. ✅ Restart your development server
2. ✅ DHL tracking will work automatically
3. ✅ Users will see real-time DHL package tracking
4. ✅ No additional setup needed

## 🧪 Test It

To test if it works:

1. Create an order with a DHL tracking number
2. Go to `/account/orders/[order-id]`
3. You should see DHL tracking with live updates

## ⚠️ Important

- **Never commit** `.env.local` to git
- **Keep your Secret secure** - never share it
- **Rotate credentials** if compromised

## 📖 Need Help?

See `DHL_API_CREDENTIALS_GUIDE.md` for detailed documentation.

