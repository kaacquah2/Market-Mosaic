"use client"

import { ExternalLink } from "lucide-react"
import { getCarrierInfo, getTrackingUrl, formatTrackingNumber } from "@/lib/carrier-tracking"
import { Button } from "@/components/ui/button"

interface CarrierTrackingLinkProps {
  trackingNumber: string
  carrier?: string
  showCarrierName?: boolean
}

export function CarrierTrackingLink({
  trackingNumber,
  carrier,
  showCarrierName = true,
}: CarrierTrackingLinkProps) {
  if (!trackingNumber) {
    return <span className="text-sm text-muted-foreground">No tracking number available</span>
  }

  const carrierInfo = getCarrierInfo(carrier || trackingNumber)
  const trackingUrl = getTrackingUrl(trackingNumber, carrier)
  const formattedNumber = formatTrackingNumber(trackingNumber)

  return (
    <div className="space-y-3">
      {showCarrierName && (
        <div className="flex items-center gap-2 bg-primary/5 p-2 rounded">
          <span className="text-sm font-medium text-muted-foreground">Shipping Carrier:</span>
          <span 
            className="text-sm font-semibold px-2 py-1 rounded"
            style={{ 
              backgroundColor: carrierInfo.color + "20",
              color: carrierInfo.color 
            }}
          >
            {carrierInfo.name}
          </span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tracking Number:</span>
          <code className="text-sm font-mono bg-muted px-3 py-1.5 rounded border">{formattedNumber}</code>
        </div>
        {trackingUrl !== "#" && (
          <Button
            asChild
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <a href={trackingUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Track on {carrierInfo.name}
            </a>
          </Button>
        )}
      </div>
      {trackingUrl === "#" && trackingNumber && (
        <p className="text-xs text-muted-foreground italic">
          Note: Please contact support for tracking assistance
        </p>
      )}
    </div>
  )
}

