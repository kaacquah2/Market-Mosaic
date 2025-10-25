import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { orderId, userEmail, userName } = await request.json()

    if (!orderId || !userEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Initialize Supabase client
    const supabase = await createClient()
    
    // Fetch order details with related data
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            price,
            image_url
          )
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('Order not found:', orderError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Create email HTML
    const emailHtml = createOrderConfirmationEmail(order, userName)

    // Send email using Resend
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.log('RESEND_API_KEY not found, skipping email send')
      return NextResponse.json({ 
        success: true, 
        message: 'Order confirmation prepared (email service not configured)' 
      })
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Market Mosaic <noreply@marketmosaic.com>',
        to: [userEmail],
        subject: `Order Confirmation #${order.id.slice(-8)}`,
        html: emailHtml,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text()
      console.error('Email send failed:', errorData)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    const emailResult = await emailResponse.json()
    console.log('Email sent successfully:', emailResult.id)

    return NextResponse.json({ 
      success: true, 
      message: 'Order confirmation sent',
      emailId: emailResult.id 
    })

  } catch (error) {
    console.error('Error sending order confirmation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function createOrderConfirmationEmail(order: any, userName: string): string {
  const orderItems = order.order_items || []
  const subtotal = orderItems.reduce((sum: number, item: any) => sum + (item.products.price * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% tax rate
  const shipping = order.shipping_cost || 0
  const total = subtotal + tax + shipping

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .item { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #eee; }
        .item:last-child { border-bottom: none; }
        .item-image { width: 60px; height: 60px; object-fit: cover; border-radius: 8px; }
        .item-details { flex: 1; margin-left: 15px; }
        .item-name { font-weight: bold; margin-bottom: 5px; }
        .item-price { color: #666; }
        .totals { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .total-row { display: flex; justify-content: space-between; margin: 10px 0; }
        .total-final { font-size: 18px; font-weight: bold; border-top: 2px solid #667eea; padding-top: 10px; }
        .shipping-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Order Confirmed!</h1>
        <p>Thank you for your purchase, ${userName}!</p>
      </div>
      
      <div class="content">
        <div class="order-info">
          <h2>Order Details</h2>
          <p><strong>Order Number:</strong> #${order.id.slice(-8)}</p>
          <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${order.status}</p>
        </div>

        <div class="order-info">
          <h2>Items Ordered</h2>
          ${orderItems.map((item: any) => `
            <div class="item">
              <img src="${item.products.image_url}" alt="${item.products.name}" class="item-image">
              <div class="item-details">
                <div class="item-name">${item.products.name}</div>
                <div class="item-price">Quantity: ${item.quantity}</div>
              </div>
              <div class="item-price">$${(item.products.price * item.quantity).toFixed(2)}</div>
            </div>
          `).join('')}
        </div>

        <div class="totals">
          <h2>Order Summary</h2>
          <div class="total-row">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Tax:</span>
            <span>$${tax.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Shipping:</span>
            <span>$${shipping.toFixed(2)}</span>
          </div>
          <div class="total-row total-final">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
          </div>
        </div>

        ${order.shipping_address ? `
        <div class="shipping-info">
          <h2>Shipping Address</h2>
          <p>${order.shipping_address.full_name}</p>
          <p>${order.shipping_address.address_line1}</p>
          ${order.shipping_address.address_line2 ? `<p>${order.shipping_address.address_line2}</p>` : ''}
          <p>${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}</p>
          <p>${order.shipping_address.country}</p>
        </div>
        ` : ''}

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/orders/${order.id}" class="button">
            Track Your Order
          </a>
        </div>
      </div>

      <div class="footer">
        <p>Questions about your order? Contact us at support@marketmosaic.com</p>
        <p>© 2024 Market Mosaic. All rights reserved.</p>
      </div>
    </body>
    </html>
  `
}