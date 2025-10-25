import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sjhfmoxdxasyachkklru.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqaGZtb3hkeGFzeWFjaGtrbHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODQ0NDYsImV4cCI6MjA3Njc2MDQ0Nn0.3pFBpGifg1JS_7HMnTq9tpYO7AqXBUsUUpfwW9iHBa8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
  console.log('🔍 Checking database schema...\n')
  
  // Check if key tables exist
  const tables = ['products', 'orders', 'order_items', 'user_profiles', 'cart_items', 'product_reviews', 'wishlist_items', 'user_roles']
  
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('count')
      .limit(1)
    
    if (error) {
      console.log(`❌ Table '${table}' does not exist or not accessible`)
    } else {
      console.log(`✅ Table '${table}' exists`)
    }
  }
  
  // Check products table columns
  console.log('\n📦 Checking products table structure...')
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .limit(1)
  
  if (products && products.length > 0) {
    const columns = Object.keys(products[0])
    console.log('Columns in products table:', columns.join(', '))
    
    // Check if stock_quantity exists
    if ('stock_quantity' in products[0]) {
      console.log('✅ stock_quantity column exists')
      
      // Check stock values
      const { data: sampleProducts } = await supabase
        .from('products')
        .select('name, stock_quantity')
        .limit(5)
      
      console.log('\nSample products with stock:')
      sampleProducts?.forEach(p => {
        console.log(`  - ${p.name}: ${p.stock_quantity}`)
      })
    } else {
      console.log('❌ stock_quantity column missing')
    }
  }
  
  // Check for user_roles table
  console.log('\n👥 Checking user roles...')
  const { data: roles } = await supabase
    .from('user_roles')
    .select('*')
    .limit(1)
  
  if (roles) {
    console.log('✅ user_roles table exists')
  } else {
    console.log('❌ user_roles table missing or empty')
  }
}

checkDatabase()


