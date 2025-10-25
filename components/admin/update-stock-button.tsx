"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { updateAllProductsStock } from "@/app/admin/actions"
import { Package } from "lucide-react"

export function UpdateStockButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string } | null>(null)

  const handleUpdateStock = async () => {
    setLoading(true)
    setResult(null)
    
    const response = await updateAllProductsStock()
    
    if (response.success) {
      setResult({ success: true, message: `Successfully updated ${response.updated} products with stock!` })
    } else {
      setResult({ success: false, message: response.error || 'Failed to update stock' })
    }
    
    setLoading(false)
    
    // Clear the message after 5 seconds
    setTimeout(() => setResult(null), 5000)
  }

  return (
    <div className="flex flex-col gap-2">
      <Button 
        onClick={handleUpdateStock}
        disabled={loading}
        variant="outline"
        className="bg-transparent border-primary/20 hover:bg-primary/10"
      >
        <Package className="h-4 w-4 mr-2" />
        {loading ? "Updating..." : "Update All Stock"}
      </Button>
      {result && (
        <div className={`text-sm ${result.success ? 'text-green-500' : 'text-red-500'}`}>
          {result.message}
        </div>
      )}
    </div>
  )
}

