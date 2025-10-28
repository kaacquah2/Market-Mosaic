# 🚚 Carrier API Credentials Setup Guide

## Overview

To enable **automated live tracking** for your orders, you need to obtain API credentials from the shipping carriers you use (FedEx, UPS, DHL, USPS).

## 📋 Quick Setup Checklist

- [ ] Determine which carriers you use (FedEx, UPS, DHL, USPS)
- [ ] Sign up for carrier developer accounts
- [ ] Get API credentials from each carrier
- [ ] Add credentials to `.env.local` file
- [ ] Test the integration
- [ ] Set up automated tracking updates

## 🔐 Required Credentials by Carrier

### 1. FedEx API

**Sign Up**: https://developer.fedex.com/

**Required Credentials**:
```
FEDEX_API_KEY=your_api_key
FEDEX_API_SECRET=your_api_secret
FEDEX_ACCOUNT_NUMBER=your_account_number
```

**How to Get**:
1. Go to https://developer.fedex.com/
2. Create an account and log in
3. Navigate to "My Apps" → "Create App"
4. Select "Track API"
5. Get your Client ID (API Key) and Client Secret
6. Copy your FedEx Account Number from your shipping account

**API Documentation**: https://developer.fedex.com/api/en-us/docs/track/v1/index.html

---

### 2. UPS API

**Sign Up**: https://developer.ups.com/

**Required Credentials**:
```
UPS_CLIENT_ID=your_client_id
UPS_CLIENT_SECRET=your_client_secret
UPS_MERCHANT_ID=your_merchant_id
```

**How to Get**:
1. Go to https://developer.ups.com/
2. Create an account
3. Create a new app in the Developer Kit
4. Select "Track API" or "Tracking API"
5. Generate OAuth Client ID and Client Secret
6. Get your Shipper Number (Merchant ID) from your UPS account

**API Documentation**: https://developer.ups.com/api/track

---

### 3. DHL API

**Sign Up**: https://developer.dhl.com/

**Required Credentials**:
```
DHL_API_KEY=your_api_key
DHL_ACCOUNT_NUMBER=your_account_number
```

**How to Get**:
1. Go to https://developer.dhl.com/
2. Create a developer account
3. Subscribe to "Tracking API" or "MyDHL API"
4. Get your API key from the dashboard
5. Copy your DHL Account Number from your shipping account

**API Documentation**: https://developer.dhl.com/documentation

---

### 4. USPS API

**Sign Up**: https://www.usps.com/business/web-tools-apis/

**Required Credentials**:
```
USPS_USER_ID=your_user_id
USPS_PASSWORD=your_password
```

**How to Get**:
1. Go to https://www.usps.com/business/web-tools-apis/
2. Register for Web Tools API access
3. Request Tracking API access
4. You'll receive a User ID via email
5. Use your existing USPS password or request a new API password

**API Documentation**: https://www.usps.com/business/web-tools-apis/

---

## ⚙️ Adding Credentials to Your App

### Step 1: Open `.env.local` File

Your `.env.local` file should already have placeholders for these credentials at the bottom.

### Step 2: Add Your Credentials

Replace the placeholder values with your actual credentials:

```bash
# Example - FedEx
FEDEX_API_KEY=l76a9c8d2e3f4g5h6
FEDEX_API_SECRET=9a8b7c6d5e4f3g2h1
FEDEX_ACCOUNT_NUMBER=123456789

# Example - UPS
UPS_CLIENT_ID=abc123def456ghi789
UPS_CLIENT_SECRET=xyz789uvw456rst123
UPS_MERCHANT_ID=MERCH123

# Example - DHL
DHL_API_KEY=dhl_api_key_here
DHL_ACCOUNT_NUMBER=DHL123456

# Example - USPS
USPS_USER_ID=username
USPS_PASSWORD=password123
```

### Step 3: Restart Your Development Server

After adding credentials, restart your server:

```bash
npm run dev
```

---

## 🧪 Testing Your API Credentials

### Test FedEx

```bash
curl -X POST http://localhost:3000/api/tracking/update \
  -H "Content-Type: application/json" \
  -d '{"orderId":"test-order-id"}'
```

### Test UPS

```bash
curl -X POST http://localhost:3000/api/tracking/update \
  -H "Content-Type: application/json" \
  -d '{"orderId":"test-order-id"}'
```

### Test All Carriers

```bash
curl -X POST http://localhost:3000/api/tracking/update \
  -H "Content-Type: application/json" \
  -d '{"updateAll":true}'
```

---

## 🚀 Enable Automated Tracking

Once credentials are added:

### Option 1: Use Mock Data (For Testing)

The system currently works with **mock data** for testing. You can test the tracking UI without real API credentials.

### Option 2: Use Real Carrier APIs

After adding credentials:

1. **Update the service** (`lib/automated-tracking-service.ts`)
2. **Uncomment the real API calls** in the carrier functions
3. **Remove mock data returns**
4. **Test with real tracking numbers**

### Option 3: Set Up Automated Updates

Create a cron job to update tracking every 15 minutes:

```bash
# Run every 15 minutes
*/15 * * * * curl -X POST https://your-domain.com/api/tracking/update -d '{"updateAll":true}' -H "Content-Type: application/json"
```

---

## 💰 Pricing & Limits

### FedEx
- **Free Tier**: Limited API calls per month
- **Paid Plans**: Available for higher volume
- **Documentation**: https://developer.fedex.com/pricing

### UPS
- **Free Tier**: Limited API calls
- **Commercial Plans**: Available for businesses
- **Documentation**: https://developer.ups.com/pricing

### DHL
- **Free Tier**: Limited API calls
- **Commercial Plans**: Contact DHL for pricing
- **Documentation**: https://developer.dhl.com/pricing

### USPS
- **Free**: Web Tools API is free
- **Rate Limits**: Check USPS documentation for limits
- **Documentation**: https://www.usps.com/business/web-tools-apis/

---

## 🔒 Security Best Practices

1. **Never commit** `.env.local` to git
2. **Rotate credentials** periodically
3. **Use environment-specific** credentials (dev/staging/prod)
4. **Monitor API usage** to detect abuse
5. **Set up webhooks** for real-time updates instead of polling

---

## 📝 Quick Reference

| Carrier | Developer Portal | API Type | Required Credentials |
|---------|-----------------|----------|---------------------|
| **FedEx** | https://developer.fedex.com/ | REST/OAuth | API Key, Secret, Account # |
| **UPS** | https://developer.ups.com/ | REST/OAuth | Client ID, Secret, Merchant ID |
| **DHL** | https://developer.dhl.com/ | REST | API Key, Account # |
| **USPS** | https://www.usps.com/business/ | SOAP | User ID, Password |

---

## 🆘 Need Help?

### Common Issues

**Issue**: API returns 401 Unauthorized
- **Solution**: Check your credentials are correct
- **Solution**: Ensure you're using production credentials, not sandbox

**Issue**: Rate limit exceeded
- **Solution**: Implement request caching
- **Solution**: Reduce polling frequency

**Issue**: Tracking number not found
- **Solution**: Verify the tracking number format
- **Solution**: Check if carrier supports the tracking number format

### Support Resources

- **FedEx**: https://developer.fedex.com/support
- **UPS**: https://developer.ups.com/support
- **DHL**: https://developer.dhl.com/support
- **USPS**: https://www.usps.com/business/web-tools-apis/contact-us

---

## ✅ Next Steps

After adding credentials:

1. ✅ Update `lib/automated-tracking-service.ts` with real API calls
2. ✅ Test with a real tracking number
3. ✅ Set up cron job for automatic updates
4. ✅ Monitor API usage and costs
5. ✅ Enable live tracking for users

For detailed setup instructions, see `AUTOMATED_TRACKING_SETUP.md`

