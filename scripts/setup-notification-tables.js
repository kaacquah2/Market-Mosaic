import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = 'https://sjhfmoxdxasyachkklru.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqaGZtb3hkeGFzeWFjaGtrbHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODQ0NDYsImV4cCI6MjA3Njc2MDQ0Nn0.3pFBpGifg1JS_7HMnTq9tpYO7AqXBUsUUpfwW9iHBa8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupNotificationTables() {
  console.log('🔔 Setting up notification system tables...\n')
  
  try {
    // Read the SQL file
    const sqlFile = join(__dirname, '018_notification_system_schema.sql')
    const sqlContent = readFileSync(sqlFile, 'utf8')
    
    console.log('📄 SQL file loaded successfully')
    console.log(`📏 File size: ${sqlContent.length} characters`)
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`🔧 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      if (statement.trim()) {
        try {
          console.log(`\n⏳ Executing statement ${i + 1}/${statements.length}...`)
          
          const { data, error } = await supabase.rpc('exec_sql', { 
            sql_query: statement + ';' 
          })
          
          if (error) {
            console.log(`❌ Error in statement ${i + 1}:`, error.message)
            errorCount++
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`)
            successCount++
          }
        } catch (err) {
          console.log(`❌ Exception in statement ${i + 1}:`, err.message)
          errorCount++
        }
      }
    }
    
    console.log(`\n📊 Execution Summary:`)
    console.log(`✅ Successful: ${successCount}`)
    console.log(`❌ Failed: ${errorCount}`)
    
    // Verify tables were created
    console.log('\n🔍 Verifying table creation...')
    const notificationTables = [
      'notification_templates',
      'user_notification_preferences', 
      'notification_campaigns',
      'user_notifications',
      'push_subscriptions'
    ]
    
    for (const table of notificationTables) {
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
    
    // Check if templates were inserted
    console.log('\n📋 Checking notification templates...')
    const { data: templates, error: templateError } = await supabase
      .from('notification_templates')
      .select('name, type')
      .limit(10)
    
    if (templateError) {
      console.log('❌ Error fetching templates:', templateError.message)
    } else {
      console.log(`✅ Found ${templates?.length || 0} notification templates`)
      templates?.forEach(template => {
        console.log(`  - ${template.name} (${template.type})`)
      })
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message)
  }
}

// Alternative approach: Execute SQL directly using Supabase client
async function setupNotificationTablesDirect() {
  console.log('🔔 Setting up notification system tables (direct approach)...\n')
  
  try {
    // Read the SQL file
    const sqlFile = join(__dirname, '018_notification_system_schema.sql')
    const sqlContent = readFileSync(sqlFile, 'utf8')
    
    console.log('📄 SQL file loaded successfully')
    
    // Since we can't execute arbitrary SQL through the client, 
    // we'll create the tables using the Supabase client methods
    
    console.log('🏗️ Creating notification_templates table...')
    // Note: We can't create tables directly through the client
    // This would need to be done through the Supabase dashboard SQL editor
    
    console.log('⚠️ Direct table creation not supported through client')
    console.log('📝 Please run the SQL script manually in Supabase SQL Editor:')
    console.log('   1. Open Supabase Dashboard')
    console.log('   2. Go to SQL Editor')
    console.log('   3. Copy and paste the content of scripts/018_notification_system_schema.sql')
    console.log('   4. Click Run')
    
  } catch (error) {
    console.error('💥 Error:', error.message)
  }
}

// Run the setup
setupNotificationTablesDirect()
