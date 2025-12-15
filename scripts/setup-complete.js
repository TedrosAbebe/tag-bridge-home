#!/usr/bin/env node

/**
 * Complete Supabase Setup Script
 * This script verifies everything is working correctly
 */

const { createClient } = require('@supabase/supabase-js')

console.log('🚀 Complete Supabase Setup Verification')
console.log('=======================================')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('✅ Environment Variables:')
console.log(`   URL: ${supabaseUrl}`)
console.log(`   Key: ${supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'Not found'}`)

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables')
  process.exit(1)
}

// Test Supabase connection
async function testConnection() {
  try {
    console.log('\n🔗 Testing Supabase connection...')
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test basic connection
    const { data, error } = await supabase
      .from('todos')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.log('❌ Connection failed:', error.message)
      console.log('\n📋 Next steps:')
      console.log('1. Go to your Supabase dashboard')
      console.log('2. Navigate to SQL Editor')
      console.log('3. Run the setup-todos-database.sql file')
      return false
    }
    
    console.log('✅ Connection successful!')
    console.log(`   Found ${data || 0} todos in database`)
    
    // Test data fetch
    const { data: todos, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .limit(5)
    
    if (fetchError) {
      console.log('❌ Data fetch failed:', fetchError.message)
      return false
    }
    
    console.log('✅ Sample data:')
    todos.forEach((todo, index) => {
      console.log(`   ${index + 1}. ${todo.task} (${todo.status})`)
    })
    
    return true
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
    return false
  }
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('\n🎉 SUCCESS! Your Supabase setup is complete!')
    console.log('\n🚀 Ready to run:')
    console.log('   npm run dev')
    console.log('   Visit: http://localhost:3000/todos')
  } else {
    console.log('\n❌ Setup incomplete. Please follow the next steps above.')
  }
})