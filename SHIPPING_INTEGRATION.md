# Shipping & Delivery Integration Guide

This guide explains the shipping and delivery options integrated into your ecommerce application.

## Overview

The application now includes a comprehensive shipping and delivery system that allows customers to:
- Enter their shipping address
- Choose from multiple delivery methods (Standard, Express, Overnight, International)
- Select carriers (USPS, FedEx, DHL)
- See real-time shipping costs
- Track their orders

## Database Setup

### Run the Migration

First, you need to run the database migration to add shipping fields:

```bash
# If using Supabase CLI
supabase db push

# Or run the SQL file directly in your Supabase SQL editor
# scripts/017_add_shipping_methods.sql
```

This migration will:
- Add `shipping_method`, `shipping_cost`, and `shipping_carrier` columns to the `orders` table
- Create a `shipping_methods` table with predefined shipping options
- Insert default shipping methods (Standard, Express, Overnight, International)

## Features Implemented

### 1. Shipping Address Form (`components/shipping-address-form.tsx`)
- Full address collection with validation
- Support for multiple countries
- Real-time validation feedback
- Required fields: Full Name, Address, City, State, Postal Code, Country, Phone

### 2. Shipping Method Selector (`components/shipping-method-selector.tsx`)
- Dynamic loading from database
- Display of carrier badges (DHL, FedEx, USPS, etc.)
- Estimated delivery times
- Real-time cost calculation
- Fallback to default methods if database fails

### 3. Updated Checkout Flow
- Multi-step checkout process
- Order review section
- Shipping address collection
- Shipping method selection
- Updated order summary with shipping costs
- Button disabled until shipping info is complete

### 4. Checkout API Integration
- Receives shipping address and method from frontend
- Adds shipping cost as a separate line item in Stripe
- Configures Stripe Checkout to collect shipping address
- Saves shipping information to database
- Calculates total including shipping costs

## Available Shipping Methods

| Method | Carrier | Cost | Delivery Time |
|--------|---------|------|---------------|
| Standard Shipping | USPS | $5.99 | 7 business days |
| Express Shipping | FedEx | $15.99 | 2-3 business days |
| Overnight Shipping | FedEx | $29.99 | 1 business day |
| International Standard | DHL | $24.99 | 14 business days |
| International Express | DHL | $49.99 | 5 business days |

## How It Works

### Customer Flow

1. **Add to Cart**: Customer adds products to cart
2. **Go to Checkout**: Click "Checkout" from cart page
3. **Enter Shipping Address**: Fill out the shipping address form
4. **Select Shipping Method**: Choose preferred delivery method
5. **Review Order**: See order summary with shipping costs
6. **Complete Payment**: Pay via Stripe Checkout

### Technical Flow

1. Frontend sends cart items, shipping address, and shipping method to `/api/checkout`
2. API validates all required information
3. API creates Stripe checkout session with shipping cost line item
4. API saves order to database with shipping information
5. Customer is redirected to Stripe Checkout
6. After payment, customer is redirected back to success page

## Customization

### Adding New Shipping Methods

To add new shipping methods, insert into the `shipping_methods` table:

```sql
INSERT INTO public.shipping_methods 
(name, carrier, description, base_cost, estimated_days) 
VALUES 
('Super Express', 'UPS', 'Same day delivery', 79.99, 1);
```

### Modifying Shipping Costs

Update the `base_cost` field in the `shipping_methods` table:

```sql
UPDATE public.shipping_methods 
SET base_cost = 9.99 
WHERE name = 'Standard Shipping';
```

### Adding More Countries

Update the allowed countries in the checkout API (`app/api/checkout/route.ts`):

```typescript
shipping_address_collection: {
  allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP', 'CN', 'MX', 'BR'],
}
```

## Integration with Third-Party Carriers

### Current Implementation
The current implementation uses static shipping costs. For production, you may want to integrate with carrier APIs:

### DHL Integration (Optional)
```bash
npm install @dhl/dhl-api
```

### FedEx Integration (Optional)
```bash
npm install @fedex/fedex-api
```

### UPS Integration (Optional)
```bash
npm install ups-api-node
```

### Shipping Rate Calculation API

For dynamic shipping rates, create a new API endpoint:

```typescript
// app/api/shipping/calculate/route.ts
export async function POST(request: NextRequest) {
  const { address, cartItems } = await request.json()
  
  // Calculate shipping based on:
  // - Destination address
  // - Weight and dimensions of items
  // - Carrier API rates
  
  const rates = await fetchRatesFromCarriers(address, cartItems)
  return NextResponse.json({ rates })
}
```

## Testing

### Test Shipping Methods
1. Go to checkout
2. Fill out shipping address
3. Select different shipping methods
4. Verify costs update correctly
5. Complete checkout

### Test Database
```sql
-- View all shipping methods
SELECT * FROM public.shipping_methods;

-- View orders with shipping info
SELECT id, shipping_method, shipping_cost, shipping_carrier 
FROM public.orders 
WHERE shipping_method IS NOT NULL;
```

## Future Enhancements

Consider adding:
- Real-time carrier rate calculation
- Multiple shipping addresses per user
- Address validation API integration
- Pickup locations
- Delivery date selection
- Shipping insurance options
- Package tracking integration

## Troubleshooting

### Shipping methods not loading
- Check if `shipping_methods` table exists
- Verify database connection
- Check browser console for errors
- Component falls back to default methods

### Shipping cost not updating
- Clear browser cache
- Check that shipping method is selected
- Verify the shipping method selector is calling `onMethodChange`

### Database errors
- Ensure migration has been run
- Check Supabase logs
- Verify RLS policies allow public read access to `shipping_methods` table

## Support

For issues or questions, refer to:
- Stripe Checkout documentation: https://stripe.com/docs/payments/checkout
- Supabase documentation: https://supabase.com/docs

