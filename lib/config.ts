// App configuration - can be fetched from database or environment variables
export const AppConfig = {
  // Tax rate as decimal (10% = 0.1)
  getTaxRate: () => {
    // In production, this could be fetched from a database table
    // For now, using environment variable or default
    return Number.parseFloat(process.env.NEXT_PUBLIC_TAX_RATE || '0.1')
  },

  // Free shipping threshold
  getFreeShippingThreshold: () => {
    return Number.parseFloat(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || '50')
  },

  // New product threshold in days
  getNewProductThresholdDays: () => {
    return Number.parseInt(process.env.NEXT_PUBLIC_NEW_PRODUCT_THRESHOLD_DAYS || '30')
  },

  // Currency code
  getCurrency: () => {
    return process.env.NEXT_PUBLIC_CURRENCY || 'USD'
  }
}

