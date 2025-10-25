"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { ReturnStatus } from "@/components/return-system"
import { returnService, ReturnWithItems } from "@/lib/return-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Package, RefreshCw } from "lucide-react"

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnWithItems[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReturns()
  }, [])

  const fetchReturns = async () => {
    try {
      const data = await returnService.getUserReturns()
      setReturns(data)
    } catch (error) {
      console.error("Error fetching returns:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Loading your returns...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Returns</h1>
              <p className="text-muted-foreground">
                Track and manage your return requests
              </p>
            </div>
            <Button onClick={fetchReturns} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {returns.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Returns Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't requested any returns yet. Visit your orders to start a return.
              </p>
              <Button asChild>
                <a href="/account/orders">View Orders</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {returns.map((returnData) => (
              <ReturnStatus key={returnData.id} returnData={returnData} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
