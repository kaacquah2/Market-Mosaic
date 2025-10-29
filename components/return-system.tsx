"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, AlertCircle, CheckCircle, Clock, X } from "lucide-react"
import { returnService, ReturnWithItems } from "@/lib/return-service"
import Image from "next/image"

interface ReturnRequestProps {
  orderId: string
  onReturnCreated?: () => void
}

export function ReturnRequest({ orderId, onReturnCreated }: ReturnRequestProps) {
  const [isEligible, setIsEligible] = useState(false)
  const [orderItems, setOrderItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkEligibility()
  }, [orderId])

  const checkEligibility = async () => {
    try {
      const eligible = await returnService.isOrderEligibleForReturn(orderId)
      setIsEligible(eligible)
      
      if (eligible) {
        const items = await returnService.getOrderItemsForReturn(orderId)
        setOrderItems(items)
      }
    } catch (error) {
      console.error("Error checking eligibility:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Checking return eligibility...</p>
        </CardContent>
      </Card>
    )
  }

  if (!isEligible) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This order is not eligible for return. Orders must be completed and within 30 days of purchase.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Request Return
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Return</DialogTitle>
        </DialogHeader>
        <ReturnForm 
          orderId={orderId} 
          orderItems={orderItems}
          onReturnCreated={onReturnCreated}
        />
      </DialogContent>
    </Dialog>
  )
}

function ReturnForm({ orderId, orderItems, onReturnCreated }: { 
  orderId: string
  orderItems: any[]
  onReturnCreated?: () => void 
}) {
  const [reason, setReason] = useState<string>("")
  const [description, setDescription] = useState("")
  const [refundMethod, setRefundMethod] = useState<string>("original_payment")
  const [selectedItems, setSelectedItems] = useState<Record<string, { quantity: number; condition: string }>>({})
  const [creating, setCreating] = useState(false)

  const handleItemSelect = (itemId: string, quantity: number, condition: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: { quantity, condition }
    }))
  }

  const handleItemDeselect = (itemId: string) => {
    setSelectedItems(prev => {
      const newItems = { ...prev }
      delete newItems[itemId]
      return newItems
    })
  }

  const handleSubmit = async () => {
    if (!reason || Object.keys(selectedItems).length === 0) {
      alert("Please select a reason and at least one item to return")
      return
    }

    setCreating(true)
    try {
      // Create the return request
      const returnId = await returnService.createReturn(
        orderId,
        reason as any,
        description || undefined,
        refundMethod as any
      )

      if (!returnId) {
        throw new Error("Failed to create return request")
      }

      // Add selected items to the return
      for (const [itemId, details] of Object.entries(selectedItems)) {
        await returnService.addReturnItem(
          returnId,
          itemId,
          details.quantity,
          details.condition as any
        )
      }

      alert("Return request submitted successfully!")
      onReturnCreated?.()
    } catch (error) {
      console.error("Error creating return:", error)
      alert("Failed to create return request. Please try again.")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Return Reason */}
      <div>
        <Label htmlFor="reason">Reason for Return *</Label>
        <Select value={reason} onValueChange={setReason}>
          <SelectTrigger>
            <SelectValue placeholder="Select a reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="defective">Defective Product</SelectItem>
            <SelectItem value="wrong_item">Wrong Item Received</SelectItem>
            <SelectItem value="not_as_described">Not as Described</SelectItem>
            <SelectItem value="changed_mind">Changed Mind</SelectItem>
            <SelectItem value="damaged_shipping">Damaged During Shipping</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Additional Details</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please provide additional details about your return..."
          rows={3}
        />
      </div>

      {/* Refund Method */}
      <div>
        <Label htmlFor="refund-method">Refund Method</Label>
        <Select value={refundMethod} onValueChange={setRefundMethod}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="original_payment">Original Payment Method</SelectItem>
            <SelectItem value="store_credit">Store Credit</SelectItem>
            <SelectItem value="exchange">Exchange for Different Item</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Items to Return */}
      <div>
        <Label>Items to Return *</Label>
        <div className="space-y-4 mt-2">
          {orderItems.map((item) => (
            <ItemReturnSelector
              key={item.id}
              item={item}
              onSelect={handleItemSelect}
              onDeselect={handleItemDeselect}
              selected={selectedItems[item.id]}
            />
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={creating || !reason || Object.keys(selectedItems).length === 0}
        >
          {creating ? "Submitting..." : "Submit Return Request"}
        </Button>
      </div>
    </div>
  )
}

function ItemReturnSelector({ 
  item, 
  onSelect, 
  onDeselect, 
  selected 
}: { 
  item: any
  onSelect: (itemId: string, quantity: number, condition: string) => void
  onDeselect: (itemId: string) => void
  selected?: { quantity: number; condition: string }
}) {
  const [quantity, setQuantity] = useState(1)
  const [condition, setCondition] = useState("good")

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      onSelect(item.id, quantity, condition)
    } else {
      onDeselect(item.id)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
    if (selected) {
      onSelect(item.id, newQuantity, condition)
    }
  }

  const handleConditionChange = (newCondition: string) => {
    setCondition(newCondition)
    if (selected) {
      onSelect(item.id, quantity, newCondition)
    }
  }

  return (
    <Card className={selected ? "border-primary" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Checkbox
            checked={!!selected}
            onCheckedChange={handleCheckboxChange}
          />
          
          <Image
            src={item.products.image_url}
            alt={item.products.name}
            width={60}
            height={60}
            className="rounded-lg object-cover"
          />
          
          <div className="flex-1">
            <h4 className="font-semibold">{item.products.name}</h4>
            <p className="text-sm text-muted-foreground">
              Quantity: {item.quantity} • ${item.products.price.toFixed(2)} each
            </p>
            
            {selected && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center space-x-4">
                  <div>
                    <Label className="text-xs">Return Quantity</Label>
                    <Select 
                      value={quantity.toString()} 
                      onValueChange={(value) => handleQuantityChange(parseInt(value))}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: item.quantity }, (_, i) => i + 1).map(num => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Condition</Label>
                    <Select 
                      value={condition} 
                      onValueChange={handleConditionChange}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="damaged">Damaged</SelectItem>
                        <SelectItem value="defective">Defective</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Refund Amount: ${(item.products.price * quantity).toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ReturnStatus({ returnData }: { returnData: ReturnWithItems }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <X className="h-4 w-4 text-red-500" />
      case 'processing':
        return <Package className="h-4 w-4 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled':
        return <X className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(returnData.status)}
            Return #{returnData.id.slice(-8)}
          </CardTitle>
          <Badge className={getStatusColor(returnData.status)}>
            {returnData.status.charAt(0).toUpperCase() + returnData.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Return Details</h4>
            <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
              <div>
                <span className="text-muted-foreground">Reason:</span>
                <span className="ml-2 capitalize">{returnData.reason.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Refund Amount:</span>
                <span className="ml-2 font-semibold">${returnData.refund_amount.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Refund Method:</span>
                <span className="ml-2 capitalize">{returnData.refund_method.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Created:</span>
                <span className="ml-2">{new Date(returnData.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {returnData.description && (
            <div>
              <h4 className="font-semibold">Description</h4>
              <p className="text-sm text-muted-foreground mt-1">{returnData.description}</p>
            </div>
          )}

          {returnData.admin_notes && (
            <div>
              <h4 className="font-semibold">Admin Notes</h4>
              <p className="text-sm text-muted-foreground mt-1">{returnData.admin_notes}</p>
            </div>
          )}

          <div>
            <h4 className="font-semibold">Items</h4>
            <div className="space-y-2 mt-2">
              {returnData.return_items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-2 bg-muted rounded-lg">
                  <Image
                    src={item.order_items?.products.image_url || "/placeholder.svg"}
                    alt={item.order_items?.products.name || "Product"}
                    width={40}
                    height={40}
                    className="rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.order_items?.products.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} • Condition: {item.condition}
                    </p>
                  </div>
                  <div className="text-sm font-semibold">
                    ${item.refund_amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
