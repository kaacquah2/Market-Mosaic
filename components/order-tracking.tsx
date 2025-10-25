"use client"

import { useState, useCallback } from "react"
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api"

interface Location {
  lat: number
  lng: number
}

interface OrderTrackingProps {
  currentLocation?: Location
  destinationAddress?: {
    address: string
    city: string
    state: string
    postalCode: string
    country: string
    location?: Location
  }
  trackingNumber?: string
  status?: string
}

// Default center (San Francisco, CA)
const defaultCenter = { lat: 37.7749, lng: -122.4194 }

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.5rem",
}

export default function OrderTracking({
  currentLocation,
  destinationAddress,
  trackingNumber,
  status,
}: OrderTrackingProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState<Location>(defaultCenter)

  // Calculate center based on markers
  const calculateCenter = useCallback(() => {
    if (currentLocation && destinationAddress?.location) {
      const avgLat = (currentLocation.lat + destinationAddress.location.lat) / 2
      const avgLng = (currentLocation.lng + destinationAddress.location.lng) / 2
      setMapCenter({ lat: avgLat, lng: avgLng })
    } else if (currentLocation) {
      setMapCenter(currentLocation)
    } else if (destinationAddress?.location) {
      setMapCenter(destinationAddress.location)
    }
  }, [currentLocation, destinationAddress])

  useState(() => {
    calculateCenter()
  })

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

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

  return (
    <div className="space-y-4">
      {/* Tracking Info */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trackingNumber && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
              <p className="font-mono font-semibold">{trackingNumber}</p>
            </div>
          )}
          {status && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">
                {status}
              </span>
            </div>
          )}
        </div>

        {destinationAddress && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-1">Delivery Address</p>
            <p className="text-sm">
              {destinationAddress.address}, {destinationAddress.city}, {destinationAddress.state}{" "}
              {destinationAddress.postalCode}
            </p>
          </div>
        )}
      </div>

      {/* Google Map */}
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={10}>
          {/* Current Location Marker */}
          {currentLocation && (
            <Marker
              position={currentLocation}
              title="Current Location"
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
              onClick={() => setSelectedMarker("current")}
            >
              {selectedMarker === "current" && (
                <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                  <div>
                    <p className="font-semibold">Current Location</p>
                    <p className="text-sm text-muted-foreground">Package is here</p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )}

          {/* Destination Marker */}
          {destinationAddress?.location && (
            <Marker
              position={destinationAddress.location}
              title="Destination"
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              }}
              onClick={() => setSelectedMarker("destination")}
            >
              {selectedMarker === "destination" && (
                <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                  <div>
                    <p className="font-semibold">Delivery Address</p>
                    <p className="text-sm text-muted-foreground">
                      {destinationAddress.address}, {destinationAddress.city}, {destinationAddress.state}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Legend */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        {currentLocation && (
          <div className="flex items-center gap-2">
            <img src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" alt="Current" className="w-4 h-4" />
            <span>Current Location</span>
          </div>
        )}
        {destinationAddress?.location && (
          <div className="flex items-center gap-2">
            <img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" alt="Destination" className="w-4 h-4" />
            <span>Destination</span>
          </div>
        )}
      </div>
    </div>
  )
}

