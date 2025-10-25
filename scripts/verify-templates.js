import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sjhfmoxdxasyachkklru.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqaGZtb3hkeGFzeWFjaGtrbHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExODQ0NDYsImV4cCI6MjA3Njc2MDQ0Nn0.3pFBpGifg1JS_7HMnTq9tpYO7AqXBUsUUpfwW9iHBa8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTemplates() {
  console.log('📋 Checking notification templates...\n')
  
  const { data: templates, error } = await supabase
    .from('notification_templates')
    .select('name, type')
    .order('type')
  
  if (error) {
    console.log('❌ Error:', error.message)
  } else {
    console.log(`✅ Found ${templates?.length || 0} templates:\n`)
    templates?.forEach(template => {
      console.log(`  - ${template.name} (${template.type})`)
    })
  }
}

checkTemplates().catch(console.error)

