# Multi-Currency System Implementation

## Overview

This guide shows how to implement a comprehensive multi-currency system for your ecommerce app, including:
- **Real-time Currency Conversion** - Live exchange rates
- **Regional Pricing** - Country-specific pricing
- **Currency Selection** - User preference management
- **Payment Processing** - Multi-currency Stripe integration

## Architecture

### 1. Currency System Components
- **Exchange Rate API** - Real-time currency conversion
- **Currency Preferences** - User-selected currencies
- **Regional Detection** - Automatic currency based on location
- **Price Display** - Formatted prices in user's currency
- **Payment Processing** - Stripe multi-currency support

### 2. Database Schema

```sql
-- Supported currencies
CREATE TABLE currencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(3) NOT NULL UNIQUE, -- USD, EUR, GBP, etc.
  name VARCHAR(100) NOT NULL, -- US Dollar, Euro, etc.
  symbol VARCHAR(10) NOT NULL, -- $, €, £, etc.
  decimal_places INTEGER DEFAULT 2,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Exchange rates (updated daily)
CREATE TABLE exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency VARCHAR(3) NOT NULL,
  to_currency VARCHAR(3) NOT NULL,
  rate DECIMAL(10,6) NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(from_currency, to_currency)
);

-- User currency preferences
CREATE TABLE user_currency_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  currency_code VARCHAR(3) NOT NULL,
  country_code VARCHAR(2), -- Auto-detected country
  is_auto_detected BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Product pricing in different currencies
CREATE TABLE product_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  currency_code VARCHAR(3) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_manual BOOLEAN DEFAULT false, -- Manual pricing vs auto-converted
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, currency_code)
);

-- Currency conversion history (for analytics)
CREATE TABLE currency_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  from_currency VARCHAR(3) NOT NULL,
  to_currency VARCHAR(3) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  converted_amount DECIMAL(10,2) NOT NULL,
  exchange_rate DECIMAL(10,6) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Currency Service Implementation

#### Currency Service (`lib/currency-service.ts`)

```typescript
import { createClient } from '@/lib/supabase/server'

export interface Currency {
  code: string
  name: string
  symbol: string
  decimalPlaces: number
}

export interface ExchangeRate {
  fromCurrency: string
  toCurrency: string
  rate: number
  updatedAt: Date
}

export class CurrencyService {
  private supabase = createClient()
  private exchangeRatesCache = new Map<string, ExchangeRate>()
  private cacheExpiry = 24 * 60 * 60 * 1000 // 24 hours

  // Get all supported currencies
  async getSupportedCurrencies(): Promise<Currency[]> {
    const { data, error } = await this.supabase
      .from('currencies')
      .select('*')
      .eq('is_active', true)
      .order('code')

    if (error) throw error
    return data || []
  }

  // Get user's preferred currency
  async getUserCurrency(userId: string): Promise<string> {
    const { data, error } = await this.supabase
      .from('user_currency_preferences')
      .select('currency_code')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      // Default to USD if no preference
      return 'USD'
    }

    return data.currency_code
  }

  // Set user's preferred currency
  async setUserCurrency(userId: string, currencyCode: string, countryCode?: string) {
    const { error } = await this.supabase
      .from('user_currency_preferences')
      .upsert({
        user_id: userId,
        currency_code: currencyCode,
        country_code: countryCode,
        is_auto_detected: !!countryCode
      })

    if (error) throw error
  }

  // Get exchange rate between two currencies
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) return 1

    const cacheKey = `${fromCurrency}_${toCurrency}`
    const cached = this.exchangeRatesCache.get(cacheKey)
    
    if (cached && Date.now() - cached.updatedAt.getTime() < this.cacheExpiry) {
      return cached.rate
    }

    // Try to get from database first
    const { data: dbRate } = await this.supabase
      .from('exchange_rates')
      .select('rate, updated_at')
      .eq('from_currency', fromCurrency)
      .eq('to_currency', toCurrency)
      .single()

    if (dbRate && Date.now() - new Date(dbRate.updated_at).getTime() < this.cacheExpiry) {
      const rate = parseFloat(dbRate.rate)
      this.exchangeRatesCache.set(cacheKey, {
        fromCurrency,
        toCurrency,
        rate,
        updatedAt: new Date(dbRate.updated_at)
      })
      return rate
    }

    // Fetch from external API if not in cache or expired
    const rate = await this.fetchExchangeRate(fromCurrency, toCurrency)
    
    // Cache the rate
    this.exchangeRatesCache.set(cacheKey, {
      fromCurrency,
      toCurrency,
      rate,
      updatedAt: new Date()
    })

    // Save to database
    await this.supabase
      .from('exchange_rates')
      .upsert({
        from_currency: fromCurrency,
        to_currency: toCurrency,
        rate: rate.toString(),
        updated_at: new Date().toISOString()
      })

    return rate
  }

  // Convert amount from one currency to another
  async convertCurrency(
    amount: number, 
    fromCurrency: string, 
    toCurrency: string
  ): Promise<number> {
    const rate = await this.getExchangeRate(fromCurrency, toCurrency)
    return amount * rate
  }

  // Get product price in specific currency
  async getProductPrice(productId: string, currencyCode: string): Promise<number> {
    // Check if there's a manual price for this currency
    const { data: manualPrice } = await this.supabase
      .from('product_prices')
      .select('price')
      .eq('product_id', productId)
      .eq('currency_code', currencyCode)
      .eq('is_manual', true)
      .single()

    if (manualPrice) {
      return parseFloat(manualPrice.price)
    }

    // Get base price (USD)
    const { data: product } = await this.supabase
      .from('products')
      .select('price')
      .eq('id', productId)
      .single()

    if (!product) throw new Error('Product not found')

    // Convert from USD to target currency
    return await this.convertCurrency(parseFloat(product.price), 'USD', currencyCode)
  }

  // Format price for display
  formatPrice(amount: number, currencyCode: string): string {
    const currency = this.getCurrencyInfo(currencyCode)
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currency.decimalPlaces,
      maximumFractionDigits: currency.decimalPlaces
    }).format(amount)
  }

  // Detect user's currency based on country
  async detectCurrencyByCountry(countryCode: string): Promise<string> {
    const countryCurrencyMap: Record<string, string> = {
      'US': 'USD',
      'CA': 'CAD',
      'GB': 'GBP',
      'DE': 'EUR',
      'FR': 'EUR',
      'IT': 'EUR',
      'ES': 'EUR',
      'NL': 'EUR',
      'AU': 'AUD',
      'JP': 'JPY',
      'CN': 'CNY',
      'IN': 'INR',
      'BR': 'BRL',
      'MX': 'MXN',
      'RU': 'RUB',
      'KR': 'KRW',
      'SG': 'SGD',
      'HK': 'HKD',
      'NZ': 'NZD',
      'CH': 'CHF',
      'SE': 'SEK',
      'NO': 'NOK',
      'DK': 'DKK'
    }

    return countryCurrencyMap[countryCode] || 'USD'
  }

  // Update exchange rates from external API
  async updateExchangeRates(): Promise<void> {
    try {
      // Using exchangerate-api.com (free tier: 1000 requests/month)
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/USD`
      )
      
      if (!response.ok) throw new Error('Failed to fetch exchange rates')
      
      const data = await response.json()
      
      // Insert/update exchange rates
      const rates = Object.entries(data.rates).map(([currency, rate]) => ({
        from_currency: 'USD',
        to_currency: currency,
        rate: rate as number,
        updated_at: new Date().toISOString()
      }))

      await this.supabase
        .from('exchange_rates')
        .upsert(rates)

      console.log('Exchange rates updated successfully')
    } catch (error) {
      console.error('Error updating exchange rates:', error)
    }
  }

  private async fetchExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    try {
      // Using exchangerate-api.com
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      )
      
      if (!response.ok) throw new Error('Failed to fetch exchange rate')
      
      const data = await response.json()
      return data.rates[toCurrency] || 1
    } catch (error) {
      console.error('Error fetching exchange rate:', error)
      return 1 // Fallback to 1:1 ratio
    }
  }

  private getCurrencyInfo(currencyCode: string): Currency {
    const currencyMap: Record<string, Currency> = {
      'USD': { code: 'USD', name: 'US Dollar', symbol: '$', decimalPlaces: 2 },
      'EUR': { code: 'EUR', name: 'Euro', symbol: '€', decimalPlaces: 2 },
      'GBP': { code: 'GBP', name: 'British Pound', symbol: '£', decimalPlaces: 2 },
      'JPY': { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimalPlaces: 0 },
      'CAD': { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', decimalPlaces: 2 },
      'AUD': { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimalPlaces: 2 },
      'CHF': { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimalPlaces: 2 },
      'CNY': { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', decimalPlaces: 2 },
      'INR': { code: 'INR', name: 'Indian Rupee', symbol: '₹', decimalPlaces: 2 },
      'BRL': { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', decimalPlaces: 2 },
      'MXN': { code: 'MXN', name: 'Mexican Peso', symbol: '$', decimalPlaces: 2 },
      'RUB': { code: 'RUB', name: 'Russian Ruble', symbol: '₽', decimalPlaces: 2 },
      'KRW': { code: 'KRW', name: 'South Korean Won', symbol: '₩', decimalPlaces: 0 },
      'SGD': { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', decimalPlaces: 2 },
      'HKD': { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', decimalPlaces: 2 },
      'NZD': { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', decimalPlaces: 2 },
      'SEK': { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', decimalPlaces: 2 },
      'NOK': { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', decimalPlaces: 2 },
      'DKK': { code: 'DKK', name: 'Danish Krone', symbol: 'kr', decimalPlaces: 2 }
    }

    return currencyMap[currencyCode] || currencyMap['USD']
  }
}
```

### 4. Frontend Components

#### Currency Selector (`components/currency-selector.tsx`)

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { CurrencyService } from '@/lib/currency-service'

interface Currency {
  code: string
  name: string
  symbol: string
}

export function CurrencySelector() {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCurrencies()
    fetchUserCurrency()
  }, [])

  const fetchCurrencies = async () => {
    try {
      const response = await fetch('/api/currencies')
      const data = await response.json()
      setCurrencies(data)
    } catch (error) {
      console.error('Error fetching currencies:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserCurrency = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      try {
        const response = await fetch('/api/user-currency')
        const data = await response.json()
        setSelectedCurrency(data.currency || 'USD')
      } catch (error) {
        console.error('Error fetching user currency:', error)
      }
    }
  }

  const handleCurrencyChange = async (currencyCode: string) => {
    setSelectedCurrency(currencyCode)
    
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      try {
        await fetch('/api/user-currency', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currency: currencyCode })
        })
        
        // Refresh page to update all prices
        window.location.reload()
      } catch (error) {
        console.error('Error updating currency:', error)
      }
    }
  }

  if (loading) {
    return <div className="w-32 h-10 bg-muted animate-pulse rounded" />
  }

  return (
    <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {currency.symbol} {currency.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

#### Price Display Component (`components/price-display.tsx`)

```typescript
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface PriceDisplayProps {
  productId: string
  basePrice: number
  baseCurrency?: string
  className?: string
}

export function PriceDisplay({ 
  productId, 
  basePrice, 
  baseCurrency = 'USD',
  className = '' 
}: PriceDisplayProps) {
  const [displayPrice, setDisplayPrice] = useState(basePrice)
  const [currency, setCurrency] = useState(baseCurrency)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserCurrencyAndConvert()
  }, [productId])

  const fetchUserCurrencyAndConvert = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setLoading(false)
      return
    }

    try {
      // Get user's preferred currency
      const currencyResponse = await fetch('/api/user-currency')
      const { currency: userCurrency } = await currencyResponse.json()
      
      if (userCurrency && userCurrency !== baseCurrency) {
        // Convert price to user's currency
        const conversionResponse = await fetch('/api/convert-price', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: basePrice,
            fromCurrency: baseCurrency,
            toCurrency: userCurrency
          })
        })
        
        const { convertedAmount } = await conversionResponse.json()
        setDisplayPrice(convertedAmount)
        setCurrency(userCurrency)
      }
    } catch (error) {
      console.error('Error converting price:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className={`h-6 bg-muted animate-pulse rounded ${className}`} />
  }

  const formatPrice = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
      maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2
    }).format(amount)
  }

  return (
    <span className={className}>
      {formatPrice(displayPrice, currency)}
    </span>
  )
}
```

### 5. API Routes

#### Currency API (`app/api/currencies/route.ts`)

```typescript
import { NextResponse } from 'next/server'
import { CurrencyService } from '@/lib/currency-service'

export async function GET() {
  try {
    const currencyService = new CurrencyService()
    const currencies = await currencyService.getSupportedCurrencies()
    
    return NextResponse.json(currencies)
  } catch (error) {
    console.error('Error fetching currencies:', error)
    return NextResponse.json({ error: 'Failed to fetch currencies' }, { status: 500 })
  }
}
```

#### User Currency API (`app/api/user-currency/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CurrencyService } from '@/lib/currency-service'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ currency: 'USD' })
    }

    const currencyService = new CurrencyService()
    const currency = await currencyService.getUserCurrency(user.id)
    
    return NextResponse.json({ currency })
  } catch (error) {
    console.error('Error fetching user currency:', error)
    return NextResponse.json({ currency: 'USD' })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { currency, country } = await request.json()
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currencyService = new CurrencyService()
    await currencyService.setUserCurrency(user.id, currency, country)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user currency:', error)
    return NextResponse.json({ error: 'Failed to update currency' }, { status: 500 })
  }
}
```

#### Price Conversion API (`app/api/convert-price/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { CurrencyService } from '@/lib/currency-service'

export async function POST(request: NextRequest) {
  try {
    const { amount, fromCurrency, toCurrency } = await request.json()
    
    const currencyService = new CurrencyService()
    const convertedAmount = await currencyService.convertCurrency(
      amount, 
      fromCurrency, 
      toCurrency
    )
    
    return NextResponse.json({ 
      originalAmount: amount,
      convertedAmount,
      fromCurrency,
      toCurrency
    })
  } catch (error) {
    console.error('Error converting price:', error)
    return NextResponse.json({ error: 'Failed to convert price' }, { status: 500 })
  }
}
```

### 6. Integration with Existing Components

#### Update Product Card (`components/product-card.tsx`)

```typescript
import { PriceDisplay } from '@/components/price-display'

export function ProductCard({ product }: { product: any }) {
  return (
    <div className="product-card">
      {/* Other product info */}
      <PriceDisplay 
        productId={product.id}
        basePrice={product.price}
        baseCurrency="USD"
        className="text-lg font-bold"
      />
    </div>
  )
}
```

#### Update Checkout Process (`app/api/checkout/route.ts`)

```typescript
// In your existing checkout route
export async function POST(request: NextRequest) {
  // ... existing code ...
  
  // Get user's preferred currency
  const currencyService = new CurrencyService()
  const userCurrency = await currencyService.getUserCurrency(user.id)
  
  // Convert prices to user's currency
  const convertedLineItems = await Promise.all(
    line_items.map(async (item) => {
      if (userCurrency !== 'USD') {
        const convertedPrice = await currencyService.convertCurrency(
          item.price_data.unit_amount / 100,
          'USD',
          userCurrency
        )
        
        return {
          ...item,
          price_data: {
            ...item.price_data,
            currency: userCurrency.toLowerCase(),
            unit_amount: Math.round(convertedPrice * 100)
          }
        }
      }
      return item
    })
  )

  // Create Stripe session with converted prices
  const session = await stripe.checkout.sessions.create({
    line_items: convertedLineItems,
    // ... rest of session config
  })
}
```

### 7. Environment Variables

Add to `.env.local`:

```env
# Currency Exchange API
EXCHANGE_RATE_API_KEY=your_api_key_here
EXCHANGE_RATE_API_URL=https://api.exchangerate-api.com/v4/latest

# Default Currency
DEFAULT_CURRENCY=USD
SUPPORTED_CURRENCIES=USD,EUR,GBP,CAD,AUD,JPY,CHF,CNY,INR,BRL,MXN,RUB,KRW,SGD,HKD,NZD,SEK,NOK,DKK
```

### 8. Database Seeding

#### Initial Currencies (`scripts/seed-currencies.sql`)

```sql
-- Insert supported currencies
INSERT INTO currencies (code, name, symbol, decimal_places) VALUES
('USD', 'US Dollar', '$', 2),
('EUR', 'Euro', '€', 2),
('GBP', 'British Pound', '£', 2),
('JPY', 'Japanese Yen', '¥', 0),
('CAD', 'Canadian Dollar', 'C$', 2),
('AUD', 'Australian Dollar', 'A$', 2),
('CHF', 'Swiss Franc', 'CHF', 2),
('CNY', 'Chinese Yuan', '¥', 2),
('INR', 'Indian Rupee', '₹', 2),
('BRL', 'Brazilian Real', 'R$', 2),
('MXN', 'Mexican Peso', '$', 2),
('RUB', 'Russian Ruble', '₽', 2),
('KRW', 'South Korean Won', '₩', 0),
('SGD', 'Singapore Dollar', 'S$', 2),
('HKD', 'Hong Kong Dollar', 'HK$', 2),
('NZD', 'New Zealand Dollar', 'NZ$', 2),
('SEK', 'Swedish Krona', 'kr', 2),
('NOK', 'Norwegian Krone', 'kr', 2),
('DKK', 'Danish Krone', 'kr', 2);
```

### 9. Scheduled Exchange Rate Updates

#### Cron Job (`scripts/update-exchange-rates.js`)

```javascript
// Run this daily to update exchange rates
const { CurrencyService } = require('../lib/currency-service')

async function updateRates() {
  const currencyService = new CurrencyService()
  await currencyService.updateExchangeRates()
  console.log('Exchange rates updated successfully')
}

updateRates().catch(console.error)
```

## Usage Examples

### Basic Currency Conversion
```typescript
const currencyService = new CurrencyService()

// Convert $100 USD to EUR
const eurAmount = await currencyService.convertCurrency(100, 'USD', 'EUR')
console.log(`$100 USD = €${eurAmount.toFixed(2)} EUR`)

// Get product price in user's currency
const price = await currencyService.getProductPrice('product-id', 'EUR')
console.log(`Product price: €${price.toFixed(2)}`)
```

### User Currency Preference
```typescript
// Set user's preferred currency
await currencyService.setUserCurrency(userId, 'EUR', 'DE')

// Get user's currency
const userCurrency = await currencyService.getUserCurrency(userId)
console.log(`User prefers: ${userCurrency}`)
```

### Regional Detection
```typescript
// Detect currency based on country
const currency = await currencyService.detectCurrencyByCountry('DE')
console.log(`Germany uses: ${currency}`) // EUR
```

This multi-currency system provides a complete solution for international ecommerce, with real-time conversion, user preferences, and seamless integration with your existing payment system!
