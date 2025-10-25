"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Zap, Database, Globe } from "lucide-react"

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  networkRequests: number
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkRequests: 0
  })

  useEffect(() => {
    // Measure page load time
    const loadTime = performance.now()
    
    // Measure memory usage (if available)
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0
    
    // Count network requests
    const networkRequests = performance.getEntriesByType('resource').length
    
    // Measure render time
    const renderStart = performance.now()
    requestAnimationFrame(() => {
      const renderTime = performance.now() - renderStart
      
      setMetrics({
        loadTime: Math.round(loadTime),
        renderTime: Math.round(renderTime),
        memoryUsage: Math.round(memoryUsage / 1024 / 1024), // Convert to MB
        networkRequests
      })
    })

    // Set up performance observer for long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn('Long task detected:', entry.duration, 'ms')
          }
        })
      })
      
      observer.observe({ entryTypes: ['longtask'] })
      
      return () => observer.disconnect()
    }
  }, [])

  const getPerformanceGrade = (loadTime: number) => {
    if (loadTime < 1000) return { grade: 'A', color: 'bg-green-100 text-green-800' }
    if (loadTime < 2000) return { grade: 'B', color: 'bg-yellow-100 text-yellow-800' }
    if (loadTime < 3000) return { grade: 'C', color: 'bg-orange-100 text-orange-800' }
    return { grade: 'D', color: 'bg-red-100 text-red-800' }
  }

  const performanceGrade = getPerformanceGrade(metrics.loadTime)

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Load Time</span>
          <div className="flex items-center gap-2">
            <span className="text-sm">{metrics.loadTime}ms</span>
            <Badge className={performanceGrade.color}>
              Grade {performanceGrade.grade}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Render Time</span>
          <span className="text-sm">{metrics.renderTime}ms</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Memory Usage</span>
          <span className="text-sm">{metrics.memoryUsage}MB</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Network Requests</span>
          <span className="text-sm">{metrics.networkRequests}</span>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="h-3 w-3" />
            <span>Optimized for speed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PerformanceOptimizations() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance Optimizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Database className="h-4 w-4" />
                Database
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Row Level Security (RLS) enabled</li>
                <li>• Optimized indexes on frequently queried columns</li>
                <li>• Connection pooling configured</li>
                <li>• Query optimization implemented</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4" />
                CDN & Caching
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Static assets cached for 1 year</li>
                <li>• Images optimized with WebP/AVIF</li>
                <li>• API responses cached for 5 minutes</li>
                <li>• Browser caching headers configured</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Frontend
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Code splitting implemented</li>
                <li>• Tree shaking enabled</li>
                <li>• Bundle optimization configured</li>
                <li>• Lazy loading for images</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Security
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• HTTPS enforced</li>
                <li>• Security headers configured</li>
                <li>• XSS protection enabled</li>
                <li>• Content Security Policy set</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <PerformanceMonitor />
    </div>
  )
}
