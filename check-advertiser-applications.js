const Database = require('better-sqlite3')
const { join } = require('path')

const dbPath = join(process.cwd(), 'data', 'broker.db')
const db = new Database(dbPath)

console.log('🔍 Checking advertiser applications in database...')

try {
  // Check if table exists
  const tableExists = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='advertiser_applications'
  `).get()

  if (tableExists) {
    console.log('✅ advertiser_applications table exists')
    
    // Get all applications
    const applications = db.prepare('SELECT * FROM advertiser_applications').all()
    
    console.log(`📊 Found ${applications.length} advertiser applications:`)
    
    applications.forEach((app, index) => {
      console.log(`\n${index + 1}. Application ID: ${app.id}`)
      console.log(`   Business Name: ${app.business_name}`)
      console.log(`   Full Name: ${app.full_name}`)
      console.log(`   Email: ${app.email}`)
      console.log(`   Business Type: ${app.business_type}`)
      console.log(`   City: ${app.city}`)
      console.log(`   Status: ${app.status}`)
      console.log(`   Services: ${app.services}`)
      console.log(`   Created: ${app.created_at}`)
    })
  } else {
    console.log('❌ advertiser_applications table does not exist')
  }

} catch (error) {
  console.error('🚨 Database error:', error)
} finally {
  db.close()
}