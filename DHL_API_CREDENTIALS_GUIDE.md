# 📦 DHL API Credentials - Step by Step Guide

## What You Need for Order Tracking

For automated order tracking with DHL, you need these specific APIs and credentials.

## 🎯 Required DHL APIs

### 1. **DHL Express Tracking API** (Primary - Recommended)

**API Name**: MyDHL API - Tracking
**Purpose**: Real-time package tracking
**Credentials Needed**:
- `DHL_API_KEY` - Your client ID (API key)
- `DHL_API_SECRET` - Your client secret
- `DHL_ACCOUNT_NUMBER` - Your DHL account number (optional)

**What It Does**:
- Track packages in real-time
- Get location updates
- View delivery status
- Receive tracking history

**Sign Up**: https://developer.dhl.com/

---

### 2. **Alternative: DHL Parcel Tracking API**

**API Name**: DHL Parcel API - Tracking
**Purpose**: Track DHL Parcel shipments
**Credentials Needed**:
- `DHL_API_KEY`
- `DHL_ACCOUNT_NUMBER`

**When to Use**: If you use DHL Parcel instead of DHL Express

---

## 📋 DHL Portal Steps

When you sign up at https://developer.dhl.com/, you'll see multiple APIs. Here's what to select:

### Step 1: Create Account
1. Go to https://developer.dhl.com/
2. Click "Register" or "Sign Up"
3. Fill in your details
4. Verify your email

### Step 2: Subscribe to APIs

In the DHL Developer Portal:

#### **Select These APIs:**

✅ **MyDHL API** → **Track and Trace**
   - This is the main tracking API
   - Purpose: Real-time package tracking
   - What you'll use: 90% of tracking operations

✅ **DHL Location API** (Optional but useful)
   - Purpose: Get location coordinates
   - What you'll use: For map integration

#### **Skip These:**

❌ **Shipping API** - Not needed for tracking only
❌ **Rate API** - Not needed for tracking only
❌ **Labeling API** - Not needed for tracking only

### Step 3: Generate Credentials

After subscribing to the APIs:

1. Go to **"My Apps"** or **"Credentials"**
2. Create a new application
3. You'll receive:
   - **API Key** (Client ID or API Key)
   - **Account Number** (Your DHL shipping account number)

### Step 4: Copy Your Credentials

You'll get something like this:

```
Key (Client ID): your_dhl_key_here
Secret (Client Secret): your_dhl_secret_here
Account Number: 12345678 (optional)
```

**Important**: 
- **Key** → goes in `DHL_API_KEY`
- **Secret** → goes in `DHL_API_SECRET`

---

## 🔑 Credential Format

For your `.env.local` file, you need:

```bash
# DHL API Configuration
DHL_API_KEY=your_api_key_from_portal
DHL_API_SECRET=your_client_secret_from_portal
DHL_ACCOUNT_NUMBER=your_dhl_account_number
```

### Important Notes:

1. **DHL_API_KEY** - This is your Client ID / API Key from DHL portal
2. **DHL_API_SECRET** - This is your Client Secret from DHL portal (keep this secret!)
3. **DHL_ACCOUNT_NUMBER** - This is your DHL shipping account number (optional for some endpoints)

---

## 📝 What Each Credential Does

### DHL_API_KEY (Client ID)
- Used to authenticate your API requests
- Sent as DHL-API-Key header
- Format: Usually a long alphanumeric string
- Example: `your_client_id_here`
- **What you received**: This is your Key

### DHL_API_SECRET (Client Secret)
- Used to authenticate your API requests
- Kept secret, never exposed in frontend code
- Format: Usually a long alphanumeric string
- Example: `your_client_secret_here`
- **What you received**: This is your Secret

### DHL_ACCOUNT_NUMBER
- Your DHL shipping account number (optional)
- Used to identify your shipping account
- Format: Usually 8-10 digits
- Example: `12345678`

---

## 🧪 Testing Your Credentials

Once you add your credentials to `.env.local`:

### Test DHL Tracking

```bash
# Test with a real DHL tracking number
curl -X POST http://localhost:3000/api/tracking/update \
  -H "Content-Type: application/json" \
  -d '{"orderId":"your-order-id"}'
```

### Expected Response

```json
{
  "tracking_number": "1234567890",
  "carrier": "dhl",
  "status": "in_transit",
  "current_location": "Distribution Center",
  "estimated_delivery": "2025-01-15T12:00:00Z",
  "tracking_history": [
    {
      "status": "shipped",
      "location": "Origin Facility",
      "description": "Package shipped",
      "timestamp": "2025-01-10T10:00:00Z"
    }
  ]
}
```

---

## 🚨 Common Issues

### Issue 1: "Invalid API Key"
- **Solution**: Check that you copied the full API key without spaces
- **Solution**: Verify you're using the correct environment (sandbox vs production)

### Issue 2: "Account Not Found"
- **Solution**: Ensure your DHL account number is correct
- **Solution**: Make sure your account is active with DHL

### Issue 3: "API Not Subscribed"
- **Solution**: Go back to the DHL portal and subscribe to "Track and Trace" API
- **Solution**: Wait a few minutes for subscription to activate

---

## 📊 DHL API Limitations

### Rate Limits
- **Free Tier**: 100 requests/day
- **Paid Plans**: Higher limits available
- **Documentation**: https://developer.dhl.com/api-reference/tracking

### What's Included
✅ Real-time tracking
✅ Location updates
✅ Delivery status
✅ Estimated delivery
✅ Tracking history

### What's Not Included
❌ Creating shipments (need separate Shipping API)
❌ Getting shipping rates (need Rate API)
❌ Label printing (need Labeling API)

---

## 🎯 Summary: What to Select in DHL Portal

When you're on the DHL developer portal selecting APIs:

### **Recommended Selection:**

1. ✅ **MyDHL API** - Track and Trace
   - This is the main one you need
   - Provides real-time tracking
   - Free tier available

2. ✅ **DHL Location API** (Optional)
   - For map integration
   - Not essential but useful

### **Skip These:**

❌ **MyDHL API** - Shipping (creating shipments)
❌ **MyDHL API** - Rating (get shipping costs)
❌ **MyDHL API** - Labeling (print labels)

---

## 🔐 Security Best Practices

1. **Never commit** API keys to git
2. **Use environment variables** (`.env.local`)
3. **Rotate keys** periodically
4. **Use sandbox** for testing
5. **Monitor usage** in DHL portal

---

## 📖 DHL Documentation

- **Main Portal**: https://developer.dhl.com/
- **Tracking API Docs**: https://developer.dhl.com/api-reference/tracking
- **Getting Started**: https://developer.dhl.com/get-started
- **Support**: https://developer.dhl.com/support

---

## ✅ Quick Checklist

- [ ] Created DHL developer account
- [ ] Subscribed to "Track and Trace" API
- [ ] Generated API key
- [ ] Found your DHL account number
- [ ] Added credentials to `.env.local`
- [ ] Tested with a real tracking number
- [ ] Verified tracking updates work

---

## 🎉 Result

After adding your DHL credentials:

✅ Orders with DHL tracking will update automatically
✅ Users see real-time package location
✅ No manual admin intervention needed
✅ Works just like FedEx, UPS, USPS tracking

**Your customers will love the automated tracking!** 🚀

