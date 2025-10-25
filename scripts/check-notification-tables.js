#!/usr/bin/env node

/**
 * Notification System Database Setup
 * 
 * This script provides instructions and verification for setting up
 * the notification system database tables.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Supabase configuration
const supabaseUrl = 'https://sjhfmoxdxasyachkklru.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqaGZtb3hkeGFzeWFjaGtrbHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODQ0NDYsImV4cCI6MjA3Njc2MDQ0Nn0.3pFBpGifg1JS_7HMnTq9tpYO7AqXBUsUUpfwW9iHBa8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkNotificationTables() {
  console.log('🔍 Checking notification system tables...\n')
  
  const notificationTables = [
    'notification_templates',
    'user_notification_preferences', 
    'notification_campaigns',
    'user_notifications',
    'push_subscriptions'
  ]
  
  let existingTables = []
  let missingTables = []
  
  for (const table of notificationTables) {
    const { data, error } = await supabase
      .from(table)
      .select('count')
      .limit(1)
    
    if (error) {
      console.log(`❌ Table '${table}' does not exist`)
      missingTables.push(table)
    } else {
      console.log(`✅ Table '${table}' exists`)
      existingTables.push(table)
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`✅ Existing tables: ${existingTables.length}`)
  console.log(`❌ Missing tables: ${missingTables.length}`)
  
  if (missingTables.length > 0) {
    console.log(`\n🚨 Missing tables: ${missingTables.join(', ')}`)
    console.log(`\n📝 To fix this, run the following SQL in Supabase SQL Editor:`)
    console.log(`\n${'='.repeat(60)}`)
    
    try {
      const sqlFile = join(__dirname, '018_notification_system_schema.sql')
      const sqlContent = readFileSync(sqlFile, 'utf8')
      console.log(sqlContent)
    } catch (error) {
      console.log('❌ Could not read SQL file:', error.message)
    }
    
    console.log(`${'='.repeat(60)}`)
    console.log(`\n🔧 Instructions:`)
    console.log(`1. Open Supabase Dashboard`)
    console.log(`2. Go to SQL Editor`)
    console.log(`3. Copy and paste the SQL above`)
    console.log(`4. Click "Run"`)
    console.log(`5. Re-run this script to verify`)
  } else {
    console.log(`\n🎉 All notification tables exist!`)
    
    // Check if templates are populated
    console.log(`\n📋 Checking notification templates...`)
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
  }
}

// Run the check
checkNotificationTables().catch(console.error)
