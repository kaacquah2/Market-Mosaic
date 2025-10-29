/**
 * Carrier tracking utilities for generating tracking URLs
 * and identifying carriers from tracking numbers
 */

export type Carrier = "ups" | "fedex" | "usps" | "dhl" | "amazon" | "other"

export interface CarrierInfo {
  name: string
  logo?: string
  trackingUrl: (trackingNumber: string) => string
  color: string
}

export const CARRIERS: Record<Carrier, CarrierInfo> = {
  ups: {
    name: "UPS",
    trackingUrl: (trackingNumber) => `https://www.ups.com/track?tracknum=${trackingNumber}`,
    color: "#351C15",
  },
  fedex: {
    name: "FedEx",
    trackingUrl: (trackingNumber) => `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    color: "#4D148C",
  },
  usps: {
    name: "USPS",
    trackingUrl: (trackingNumber) => `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
    color: "#333366",
  },
  dhl: {
    name: "DHL",
    trackingUrl: (trackingNumber) => `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
    color: "#FFCC00",
  },
  amazon: {
    name: "Amazon Logistics",
    trackingUrl: (trackingNumber) => `https://www.amazon.com/progress-tracker/package/ref=oh_aui_hz_pt?_encoding=UTF8&itemId=${trackingNumber}`,
    color: "#FF9900",
  },
  other: {
    name: "Carrier",
    trackingUrl: (_trackingNumber) => `#`,
    color: "#666666",
  },
}

/**
 * Detect carrier from tracking number format
 */
export function detectCarrier(trackingNumber: string): Carrier {
  if (!trackingNumber) return "other"

  const cleaned = trackingNumber.replace(/\s/g, "").toUpperCase()

  // UPS: 1Z followed by 16 characters
  if (/^1Z[A-Z0-9]{16}$/.test(cleaned)) {
    return "ups"
  }

  // FedEx: 12-15 digits
  if (/^\d{12,15}$/.test(cleaned)) {
    return "fedex"
  }

  // USPS: 20-22 digits or 9420 prefix
  if (/^\d{20,22}$/.test(cleaned) || /^(9[0-9]{3}|94|93|92|91|82|81|71)\d{16,20}$/.test(cleaned)) {
    return "usps"
  }

  // DHL: 10-11 digits
  if (/^\d{10,11}$/.test(cleaned)) {
    return "dhl"
  }

  // Amazon: TBA followed by 11 digits
  if (/^TBA\d{11}$/.test(cleaned)) {
    return "amazon"
  }

  return "other"
}

/**
 * Get carrier information from carrier code or tracking number
 */
export function getCarrierInfo(carrierOrTrackingNumber: string): CarrierInfo {
  // Check if it's a carrier code
  if (carrierOrTrackingNumber.toLowerCase() in CARRIERS) {
    return CARRIERS[carrierOrTrackingNumber.toLowerCase() as Carrier]
  }

  // Try to detect carrier from tracking number
  const carrier = detectCarrier(carrierOrTrackingNumber)
  return CARRIERS[carrier]
}

/**
 * Generate tracking URL for a given carrier and tracking number
 */
export function getTrackingUrl(trackingNumber: string, carrier?: string): string {
  if (!trackingNumber) return "#"

  const carrierInfo = carrier ? getCarrierInfo(carrier) : getCarrierInfo(trackingNumber)
  return carrierInfo.trackingUrl(trackingNumber)
}

/**
 * Format tracking number for display
 */
export function formatTrackingNumber(trackingNumber: string): string {
  if (!trackingNumber) return ""

  // Add spaces for readability
  const cleaned = trackingNumber.replace(/\s/g, "")

  // UPS format: 1Z XXX XXX XX XXXX XXX X
  if (cleaned.startsWith("1Z") && cleaned.length === 18) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 14)} ${cleaned.slice(14, 17)} ${cleaned.slice(17)}`
  }

  // Add space every 4 characters for other formats
  return cleaned.match(/.{1,4}/g)?.join(" ") || cleaned
}

