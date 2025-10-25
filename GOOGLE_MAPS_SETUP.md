# Google Maps Order Tracking Setup

This guide explains how to set up and use Google Maps API for order tracking in the ecommerce app.

## Features

- Real-time order tracking on an interactive Google Map
- Admin panel to update tracking information
- Customer-facing order tracking page
- Display of current location and destination on map
- Support for tracking numbers

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API (optional, for address geocoding)
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

### 2. Configure Environment Variables

Add your Google Maps API key to `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. Run Database Migration

Execute the SQL script to add tracking fields to the orders table:

```bash
# In your Supabase SQL editor or via psql
# Run the script: scripts/014_add_tracking_to_orders.sql
```

This adds the following columns to the `orders` table:
- `shipping_address` (JSONB)
- `tracking_number` (TEXT)
- `current_location` (JSONB)
- `destination_address` (JSONB)

### 4. Restart Development Server

After adding the environment variable, restart your Next.js development server:

```bash
npm run dev
```

## Usage

### For Customers

1. Navigate to "Account" → "Orders"
2. Click on any order to view details
3. If tracking information is available, you'll see a "Track Your Order" section with:
   - Tracking number
   - Order status
   - Interactive Google Map showing:
     - Blue marker: Current package location
     - Red marker: Delivery destination

### For Admins

1. Navigate to Admin Dashboard
2. View orders in the "Recent Orders" table
3. Click "View" on any order to access order details
4. In the order detail page, you can:
   - Update order status (pending, processing, shipped, in_transit, delivered, cancelled)
   - Add/update tracking number
   - Update current location coordinates (latitude/longitude)
5. Click "Update Tracking" to save changes
6. The map will automatically update to show the new location

## API Security

### Restrict API Key Usage

For security, restrict your Google Maps API key:

1. Go to Google Cloud Console → Credentials
2. Click on your API key
3. Under "API restrictions":
   - Select "Restrict key"
   - Choose only "Maps JavaScript API"
4. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add your domains:
     - `http://localhost:3000/*` (for development)
     - `https://yourdomain.com/*` (for production)

### Set Billing Limits

Google Maps API has usage limits. Set up billing alerts:

1. Go to Google Cloud Console → Billing
2. Set up budget alerts
3. Configure quota limits for Maps JavaScript API

## Example: Adding Tracking to an Order

As an admin, you can add tracking information:

```javascript
// Example: Update order with tracking
const updateData = {
  status: 'shipped',
  tracking_number: 'TRACK123456789',
  current_location: {
    lat: 37.7749,
    lng: -122.4194
  },
  destination_address: {
    address: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94102',
    country: 'US',
    location: {
      lat: 37.7849,
      lng: -122.4094
    }
  }
}
```

## Troubleshooting

### Map Not Loading

- Check that `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in `.env.local`
- Verify the API key is valid in Google Cloud Console
- Check browser console for errors
- Ensure Maps JavaScript API is enabled

### Location Not Showing

- Verify `current_location` contains valid `lat` and `lng` properties
- Ensure coordinates are valid numbers (latitude: -90 to 90, longitude: -180 to 180)

### API Quota Exceeded

- Check your Google Cloud billing account
- Review usage in Google Cloud Console
- Consider implementing caching for repeated map views

## Components

### OrderTracking Component

Location: `components/order-tracking.tsx`

Props:
- `currentLocation`: `{ lat: number, lng: number }` - Current package location
- `destinationAddress`: Object with address details and optional location
- `trackingNumber`: String - Tracking number
- `status`: String - Order status

### Order Detail Pages

- Customer: `app/account/orders/[id]/page.tsx`
- Admin: `app/admin/orders/[id]/page.tsx`

## Future Enhancements

- Real-time location updates via webhooks
- Address geocoding integration
- Multiple waypoints for complex routes
- Estimated delivery time calculation
- Push notifications for location updates
- Delivery driver tracking integration
