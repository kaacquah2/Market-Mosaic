"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

interface ShippingMethod {
  id: string
  name: string
  carrier: string
  description: string
  base_cost: number
  estimated_days: number
}

interface ShippingMethodSelectorProps {
  onMethodChange: (method: ShippingMethod | null) => void
  selectedCountry?: string
}

export function ShippingMethodSelector({ onMethodChange, selectedCountry: _selectedCountry = "US" }: ShippingMethodSelectorProps) {
  const [methods, setMethods] = useState<ShippingMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchShippingMethods = async () => {
      setIsLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("shipping_methods")
          .select("*")
          .eq("is_active", true)
          .order("base_cost", { ascending: true })

        if (error) throw error
        setMethods(data || [])
        
        // Auto-select the first method if available
        if (data && data.length > 0) {
          const firstMethod = data[0]
          setSelectedMethod(firstMethod.id)
          onMethodChange(firstMethod)
        }
      } catch (error) {
        console.error("Error fetching shipping methods:", error)
        // Fallback to default methods if database fails
        setMethods([
          {
            id: "standard",
            name: "Standard Shipping",
            carrier: "USPS",
            description: "Standard ground shipping",
            base_cost: 5.99,
            estimated_days: 7,
          },
          {
            id: "express",
            name: "Express Shipping",
            carrier: "FedEx",
            description: "2-3 business days",
            base_cost: 15.99,
            estimated_days: 3,
          },
          {
            id: "overnight",
            name: "Overnight Shipping",
            carrier: "FedEx",
            description: "Next business day delivery",
            base_cost: 29.99,
            estimated_days: 1,
          },
        ])
        setSelectedMethod("standard")
        onMethodChange({
          id: "standard",
          name: "Standard Shipping",
          carrier: "USPS",
          description: "Standard ground shipping",
          base_cost: 5.99,
          estimated_days: 7,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchShippingMethods()
  }, [])

  const handleMethodChange = (methodId: string) => {
    setSelectedMethod(methodId)
    const method = methods.find(m => m.id === methodId)
    onMethodChange(method || null)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shipping Method</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading shipping options...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Method</CardTitle>
        <CardDescription>Choose your preferred delivery method</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedMethod} onValueChange={handleMethodChange}>
          {methods.map((method) => (
            <div key={method.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
              <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{method.name}</span>
                      <Badge variant="secondary">{method.carrier}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{method.description}</p>
                    <p className="text-xs text-muted-foreground">Estimated delivery: {method.estimated_days} business day{method.estimated_days !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-bold text-lg">${method.base_cost.toFixed(2)}</p>
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

