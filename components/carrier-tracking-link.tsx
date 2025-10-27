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
    <div className="space-y-2">
      {showCarrierName && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Carrier:</span>
          <span className="text-sm font-semibold" style={{ color: carrierInfo.color }}>
            {carrierInfo.name}
          </span>
        </div>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Tracking Number:</span>
        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{formattedNumber}</code>
        {trackingUrl !== "#" && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-7"
          >
            <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
              Track on {carrierInfo.name}
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}

