# Google Maps API Usage in the Ecommerce App

## Overview

The Google Maps API key (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`) is used to provide **real-time order tracking** functionality in your ecommerce application.

## Where It's Used

### 1. Component: `components/order-tracking.tsx`

This is the main component that uses the Google Maps API. It displays an interactive map showing:
- **Current package location** (blue marker)
- **Delivery destination** (red marker)

**Key Features:**
- Automatically centers the map based on available location data
- Shows info windows when clicking on markers
- Displays tracking number and order status
- Shows delivery address information

### 2. Where It's Rendered

The `OrderTracking` component is used in two places:

**a) Customer Order Detail Page** (`app/account/orders/[id]/page.tsx`)
- Lines 274-279: Shows tracking information to customers
- Displayed when an order has tracking data

**b) Admin Order Detail Page** (`app/admin/orders/[id]/page.tsx`)
- Lines 336-341: Shows tracking information to admins
- Allows admins to update tracking information

## How It Works

### Environment Variable
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBAEE2N7tos0fWvJ5XSA94Quf6773S9Iz4
```

### Component Usage
```tsx
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api"

<LoadScript googleMapsApiKey={googleMapsApiKey}>
  <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={10}>
    {/* Current Location Marker */}
    <Marker position={currentLocation} />
    
    {/* Destination Marker */}
    <Marker position={destinationAddress.location} />
  </GoogleMap>
</LoadScript>
```

### Dependencies
- `@react-google-maps/api` (v2.20.7) - React wrapper for Google Maps
- `@types/google.maps` (v3.58.1) - TypeScript types

## Database Schema

The tracking data is stored in the `orders` table with these fields:
- `shipping_address` (JSONB) - Full shipping address
- `tracking_number` (TEXT) - Tracking number
- `current_location` (JSONB) - Current package location `{lat, lng}`
- `destination_address` (JSONB) - Destination address with location

## User Flow

### For Customers:
1. Go to Account → Orders
2. Click on an order
3. If tracking is available, see "Track Your Order" section
4. View interactive map with package location

### For Admins:
1. Go to Admin Dashboard → Orders
2. Click "View" on an order
3. Update tracking information:
   - Add/update tracking number
   - Update current location coordinates
4. Click "Update Tracking"
5. Map automatically updates

## API Key Validation

The component checks if the API key is configured:

```tsx
if (!googleMapsApiKey || googleMapsApiKey === "your_google_maps_api_key_here") {
  return (
    <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">Google Maps API key not configured</p>
        <p className="text-sm text-muted-foreground">
          Please add your Google Maps API key to .env.local
        </p>
      </div>
    </div>
  )
}
```

## Setup Instructions

See `GOOGLE_MAPS_SETUP.md` for complete setup instructions including:
- How to get a Google Maps API key
- Security best practices
- Billing configuration
- Troubleshooting

## Security Notes

⚠️ **Important**: The API key is exposed in the client-side code because it's prefixed with `NEXT_PUBLIC_`. To secure it:

1. **Restrict API Key Usage** in Google Cloud Console:
   - Restrict to "Maps JavaScript API" only
   - Add domain restrictions
   - Set up HTTP referrer restrictions

2. **Set Billing Limits**:
   - Configure budget alerts
   - Set usage quotas

## Current Status

✅ Google Maps API key is configured in `.env.local`
✅ Order tracking component is implemented
✅ Used in both customer and admin order detail pages
✅ Handles missing API key gracefully

## Future Enhancements

Potential improvements:
- Address geocoding integration (convert addresses to coordinates)
- Real-time location updates via webhooks
- Multiple waypoints for complex routes
- Estimated delivery time calculation
- Push notifications for location updates
- Delivery driver tracking integration

