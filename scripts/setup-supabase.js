#!/usr/bin/env node

/**
 * Supabase Setup Script for Tag Bridge Home
 * 
 * This script helps you set up your Supabase database for the Tag Bridge Home application.
 * 
 * Prerequisites:
 * 1. Create a Supabase account at https://supabase.com
 * 2. Create a new project in Supabase
 * 3. Get your project URL and anon key from the project settings
 * 4. Update your .env.local file with the Supabase credentials
 * 
 * Usage:
 * npm run setup
 */

const fs = require('fs')
const path = require('path')

console.log('🚀 Tag Bridge Home - Supabase Setup')
console.log('=====================================')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!')
  console.log('Please create .env.local file with your Supabase credentials:')
  console.log('')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key')
  console.log('')
  process.exit(1)
}

// Read .env.local
const envContent = fs.readFileSync(envPath, 'utf8')
const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=') && !envContent.includes('your-supabase-project-url')
const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=') && !envContent.includes('your-supabase-anon-key')

if (!hasSupabaseUrl || !hasSupabaseKey) {
  console.error('❌ Supabase credentials not configured!')
  console.log('')
  console.log('Please update your .env.local file with your actual Supabase credentials:')
  console.log('')
  console.log('1. Go to https://supabase.com/dashboard')
  console.log('2. Create a new project or select existing project')
  console.log('3. Go to Settings > API')
  console.log('4. Copy your Project URL and anon/public key')
  console.log('5. Update .env.local:')
  console.log('')
  console.log('   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co')
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here')
  console.log('')
  process.exit(1)
}

console.log('✅ Supabase credentials found in .env.local')
console.log('')
console.log('📋 Next Steps:')
console.log('==============')
console.log('')
console.log('1. Open your Supabase project dashboard')
console.log('2. Go to SQL Editor')
console.log('3. Copy and paste the contents of supabase-schema.sql')
console.log('4. Run the SQL to create all necessary tables')
console.log('5. Verify tables are created in the Table Editor')
console.log('')
console.log('📁 Schema file location: ./supabase-schema.sql')
console.log('')
console.log('🔧 After running the schema:')
console.log('   npm run dev    # Start development server')
console.log('   npm run build  # Test production build')
console.log('')
console.log('🚀 Ready for Vercel deployment!')
console.log('')

// Check if schema file exists
const schemaPath = path.join(process.cwd(), 'supabase-schema.sql')
if (fs.existsSync(schemaPath)) {
  console.log('✅ Schema file found: supabase-schema.sql')
} else {
  console.log('❌ Schema file not found: supabase-schema.sql')
  console.log('Please ensure the schema file exists before proceeding.')
}

console.log('')
console.log('📚 Documentation:')
console.log('   Supabase: https://supabase.com/docs')
console.log('   Vercel: https://vercel.com/docs')
console.log('')