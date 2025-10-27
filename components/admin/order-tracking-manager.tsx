"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, MapPin, Calendar, Package } from "lucide-react"
import { toast } from "sonner"

interface OrderTrackingManagerProps {
  orderId: string
  currentStatus: string
  currentTrackingNumber?: string
  currentCarrier?: string
  currentEstimatedDelivery?: string
  onUpdate?: () => void
}

export function OrderTrackingManager({
  orderId,
  currentStatus,
  currentTrackingNumber,
  currentCarrier,
  currentEstimatedDelivery,
  onUpdate,
}: OrderTrackingManagerProps) {
  const [status, setStatus] = useState(currentStatus)
  const [trackingNumber, setTrackingNumber] = useState(currentTrackingNumber || "")
  const [carrier, setCarrier] = useState(currentCarrier || "")
  const [estimatedDelivery, setEstimatedDelivery] = useState(
    currentEstimatedDelivery ? new Date(currentEstimatedDelivery).toISOString().split("T")[0] : ""
  )
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateTracking = async () => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/tracking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          tracking_number: trackingNumber,
          shipping_carrier: carrier,
          estimated_delivery: estimatedDelivery ? new Date(estimatedDelivery).toISOString() : null,
          tracking_update: description
            ? {
                status,
                location,
                description,
              }
            : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update tracking")
      }

      toast.success("Tracking information updated successfully")
      
      // Clear the update form
      setLocation("")
      setDescription("")
      
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error("Error updating tracking:", error)
      toast.error("Failed to update tracking information")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddTrackingUpdate = async () => {
    if (!description) {
      toast.error("Please provide a description for the tracking update")
      return
    }

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/tracking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tracking_update: {
            status,
            location,
            description,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add tracking update")
      }

      toast.success("Tracking update added successfully")
      
      // Clear the form
      setLocation("")
      setDescription("")
      
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error("Error adding tracking update:", error)
      toast.error("Failed to add tracking update")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Status & Tracking
          </CardTitle>
          <CardDescription>Update order status and tracking information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Order Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="carrier">Shipping Carrier</Label>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger id="carrier">
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ups">UPS</SelectItem>
                  <SelectItem value="fedex">FedEx</SelectItem>
                  <SelectItem value="usps">USPS</SelectItem>
                  <SelectItem value="dhl">DHL</SelectItem>
                  <SelectItem value="amazon">Amazon Logistics</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tracking">Tracking Number</Label>
              <Input
                id="tracking"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated">
                <Calendar className="inline h-4 w-4 mr-1" />
                Estimated Delivery
              </Label>
              <Input
                id="estimated"
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleUpdateTracking} disabled={isUpdating} className="w-full">
            {isUpdating ? "Updating..." : "Update Tracking Information"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Add Tracking Update
          </CardTitle>
          <CardDescription>Add a new tracking event or location update</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">
              <MapPin className="inline h-4 w-4 mr-1" />
              Location (Optional)
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Distribution Center - Los Angeles, CA"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Package arrived at distribution center"
              rows={3}
            />
          </div>

          <Button onClick={handleAddTrackingUpdate} disabled={isUpdating || !description} className="w-full">
            {isUpdating ? "Adding..." : "Add Tracking Update"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

