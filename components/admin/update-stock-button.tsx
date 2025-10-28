"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { updateAllProductsStock } from "@/app/admin/actions"
import { Package } from "lucide-react"
import { cacheService } from "@/lib/cache-service"

export function UpdateStockButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string } | null>(null)

  const handleUpdateStock = async () => {
    setLoading(true)
    setResult(null)
    
    const response = await updateAllProductsStock()
    
    if (response.success) {
      // Clear all recommendation and product caches
      cacheService.clear()
      
      setResult({ success: true, message: `Successfully updated ${response.updated} products! Cache cleared. Please refresh the page.` })
      
      // Auto-refresh after 2 seconds
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else {
      setResult({ success: false, message: response.error || 'Failed to update stock' })
    }
    
    setLoading(false)
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

