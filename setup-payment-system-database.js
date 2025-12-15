const Database = require('better-sqlite3')
const { join } = require('path')

const dbPath = join(process.cwd(), 'data', 'broker.db')
const db = new Database(dbPath)

console.log('🏦 Setting up payment system database...')

try {
  // Update properties table with payment columns
  console.log('📋 Updating properties table...')
  
  // First, let's see what columns exist
  const tableInfo = db.prepare("PRAGMA table_info(properties)").all()
  console.log('Current properties table columns:', tableInfo.map(col => col.name))
  
  // Add missing columns if they don't exist
  const existingColumns = tableInfo.map(col => col.name)
  
  if (!existingColumns.includes('currency')) {
    db.exec('ALTER TABLE properties ADD COLUMN currency TEXT DEFAULT "ETB"')
    console.log('✅ Added currency column')
  }
  
  if (!existingColumns.includes('bedrooms')) {
    db.exec('ALTER TABLE properties ADD COLUMN bedrooms INTEGER')
    console.log('✅ Added bedrooms column')
  }
  
  if (!existingColumns.includes('bathrooms')) {
    db.exec('ALTER TABLE properties ADD COLUMN bathrooms INTEGER')
    console.log('✅ Added bathrooms column')
  }
  
  if (!existingColumns.includes('features')) {
    db.exec('ALTER TABLE properties ADD COLUMN features TEXT')
    console.log('✅ Added features column')
  }
  
  if (!existingColumns.includes('images')) {
    db.exec('ALTER TABLE properties ADD COLUMN images TEXT')
    console.log('✅ Added images column')
  }
  
  if (!existingColumns.includes('is_premium')) {
    db.exec('ALTER TABLE properties ADD COLUMN is_premium BOOLEAN DEFAULT 0')
    console.log('✅ Added is_premium column')
  }
  
  if (!existingColumns.includes('payment_amount')) {
    db.exec('ALTER TABLE properties ADD COLUMN payment_amount REAL')
    console.log('✅ Added payment_amount column')
  }
  
  if (!existingColumns.includes('payment_method')) {
    db.exec('ALTER TABLE properties ADD COLUMN payment_method TEXT')
    console.log('✅ Added payment_method column')
  }
  
  if (!existingColumns.includes('payment_status')) {
    db.exec('ALTER TABLE properties ADD COLUMN payment_status TEXT DEFAULT "pending"')
    console.log('✅ Added payment_status column')
  }
  
  if (!existingColumns.includes('updated_at')) {
    db.exec('ALTER TABLE properties ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP')
    console.log('✅ Added updated_at column')
  }

  // Create payments table
  console.log('💳 Creating payments table...')
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      amount REAL NOT NULL,
      payment_type TEXT NOT NULL,
      payment_method TEXT,
      status TEXT DEFAULT 'pending_confirmation',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)
  console.log('✅ Payments table ready')

  // Check current data
  const propertiesCount = db.prepare('SELECT COUNT(*) as count FROM properties').get().count
  const paymentsCount = db.prepare('SELECT COUNT(*) as count FROM payments').get().count
  const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count

  console.log(`\n📊 Database Status:`)
  console.log(`   Properties: ${propertiesCount}`)
  console.log(`   Payments: ${paymentsCount}`)
  console.log(`   Users: ${usersCount}`)

  // Show sample properties
  const sampleProperties = db.prepare('SELECT id, title, price, status, is_premium, payment_amount FROM properties LIMIT 5').all()
  console.log(`\n🏠 Sample Properties:`)
  sampleProperties.forEach((prop, index) => {
    console.log(`   ${index + 1}. ${prop.title} - ${prop.price} ETB (${prop.status}) ${prop.is_premium ? '⭐' : ''}`)
  })

  console.log('\n🎉 Payment system database setup complete!')

} catch (error) {
  console.error('❌ Database setup error:', error)
} finally {
  db.close()
}