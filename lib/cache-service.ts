import React from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

export class CacheService {
  private cache = new Map<string, CacheEntry<any>>()
  private maxSize = 50 // Maximum number of entries - reduced to save space

  set<T>(key: string, data: T, ttl: number = 180000): void { // Default 3 minutes - reduced from 5
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return false
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  size(): number {
    return this.cache.size
  }

  // Generate cache key from parameters
  generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&')
    
    return `${prefix}:${sortedParams}`
  }

  // Cache with automatic key generation
  setWithParams<T>(prefix: string, params: Record<string, any>, data: T, ttl?: number): void {
    const key = this.generateKey(prefix, params)
    this.set(key, data, ttl)
  }

  getWithParams<T>(prefix: string, params: Record<string, any>): T | null {
    const key = this.generateKey(prefix, params)
    return this.get<T>(key)
  }
}

export const cacheService = new CacheService()

// React hook for caching API calls
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 180000 // Reduced from 300000 (5 min) to 180000 (3 min)
): { data: T | null; loading: boolean; error: Error | null; refetch: () => void } {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const fetchData = React.useCallback(async () => {
    // Check cache first
    const cachedData = cacheService.get<T>(key)
    if (cachedData) {
      setData(cachedData)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await fetcher()
      cacheService.set(key, result, ttl)
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [key, fetcher, ttl])

  const refetch = React.useCallback(() => {
    cacheService.delete(key)
    fetchData()
  }, [key, fetchData])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}

// Higher-order function for caching API calls
export function withCache<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyGenerator: (...args: T) => string,
  ttl: number = 180000 // Reduced from 300000 (5 min) to 180000 (3 min)
) {
  return async (...args: T): Promise<R> => {
    const key = keyGenerator(...args)
    
    // Check cache first
    const cachedResult = cacheService.get<R>(key)
    if (cachedResult) {
      return cachedResult
    }

    // Execute function and cache result
    const result = await fn(...args)
    cacheService.set(key, result, ttl)
    
    return result
  }
}

// Cache invalidation helpers
export function invalidateCache(pattern: string): void {
  const keys = Array.from(cacheService['cache'].keys())
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cacheService.delete(key)
    }
  })
}

export function invalidateUserCache(userId: string): void {
  invalidateCache(`user:${userId}`)
}

export function invalidateProductCache(productId?: string): void {
  if (productId) {
    invalidateCache(`product:${productId}`)
  } else {
    invalidateCache('product:')
  }
}

export function invalidateOrderCache(userId: string): void {
  invalidateCache(`orders:${userId}`)
}
