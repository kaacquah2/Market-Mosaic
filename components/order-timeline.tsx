"use client"

import { CheckCircle2, Circle, Package, Truck, MapPin, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimelineStep {
  id: string
  title: string
  description: string
  timestamp?: string
  status: "completed" | "current" | "upcoming"
  icon: React.ReactNode
}

interface OrderTimelineProps {
  orderStatus: string
  trackingHistory?: Array<{
    status: string
    location?: string
    timestamp: string
    description: string
  }>
  estimatedDelivery?: string
  createdAt: string
  shippedAt?: string
  deliveredAt?: string
}

export function OrderTimeline({
  orderStatus,
  trackingHistory = [],
  estimatedDelivery,
  createdAt,
  shippedAt,
  deliveredAt,
}: OrderTimelineProps) {
  // Define the order stages
  const getTimelineSteps = (): TimelineStep[] => {
    const status = orderStatus.toLowerCase()

    return [
      {
        id: "placed",
        title: "Order Placed",
        description: "We've received your order",
        timestamp: createdAt,
        status: "completed",
        icon: <Package className="h-5 w-5" />,
      },
      {
        id: "processing",
        title: "Processing",
        description: "Your order is being prepared",
        timestamp: status !== "pending" ? createdAt : undefined,
        status:
          status === "pending"
            ? "current"
            : ["processing", "shipped", "out_for_delivery", "delivered"].includes(status)
              ? "completed"
              : "upcoming",
        icon: <Package className="h-5 w-5" />,
      },
      {
        id: "shipped",
        title: "Shipped",
        description: "Your order is on its way",
        timestamp: shippedAt,
        status:
          status === "processing"
            ? "current"
            : ["shipped", "out_for_delivery", "delivered"].includes(status)
              ? "completed"
              : "upcoming",
        icon: <Truck className="h-5 w-5" />,
      },
      {
        id: "out_for_delivery",
        title: "Out for Delivery",
        description: "Your order is out for delivery",
        timestamp: status === "out_for_delivery" || status === "delivered" ? shippedAt : undefined,
        status:
          status === "shipped"
            ? "current"
            : status === "out_for_delivery"
              ? "current"
              : status === "delivered"
                ? "completed"
                : "upcoming",
        icon: <MapPin className="h-5 w-5" />,
      },
      {
        id: "delivered",
        title: "Delivered",
        description: "Your order has been delivered",
        timestamp: deliveredAt,
        status: status === "delivered" ? "completed" : status === "out_for_delivery" ? "current" : "upcoming",
        icon: <Home className="h-5 w-5" />,
      },
    ]
  }

  const steps = getTimelineSteps()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="space-y-8">
      {/* Timeline */}
      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.id} className="relative pb-12 last:pb-0">
            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute left-[19px] top-[40px] h-full w-0.5",
                  step.status === "completed" ? "bg-primary" : "bg-muted-foreground/20",
                )}
              />
            )}

            {/* Step Content */}
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                  step.status === "completed"
                    ? "border-primary bg-primary text-primary-foreground"
                    : step.status === "current"
                      ? "border-primary bg-background text-primary animate-pulse"
                      : "border-muted-foreground/20 bg-muted text-muted-foreground",
                )}
              >
                {step.status === "completed" ? <CheckCircle2 className="h-5 w-5" /> : step.icon}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      className={cn(
                        "font-semibold text-base",
                        step.status === "upcoming" && "text-muted-foreground",
                      )}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm mt-1",
                        step.status === "upcoming" ? "text-muted-foreground/70" : "text-muted-foreground",
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                  {step.timestamp && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {formatDate(step.timestamp)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estimated Delivery */}
      {estimatedDelivery && orderStatus !== "delivered" && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Estimated Delivery</p>
              <p className="text-lg font-bold text-primary">{formatDate(estimatedDelivery)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tracking History */}
      {trackingHistory.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="font-semibold text-lg mb-4">Tracking History</h3>
          <div className="space-y-3">
            {trackingHistory
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((event, index) => (
                <div key={index} className="flex justify-between items-start text-sm border-l-2 border-primary/20 pl-4 py-2">
                  <div>
                    <p className="font-medium">{event.description}</p>
                    {event.location && <p className="text-muted-foreground text-xs mt-1">{event.location}</p>}
                  </div>
                  <span className="text-muted-foreground text-xs whitespace-nowrap ml-4">
                    {formatDate(event.timestamp)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

