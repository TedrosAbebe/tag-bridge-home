const Database = require('better-sqlite3')
const { join } = require('path')

const dbPath = join(process.cwd(), 'data', 'broker.db')
const db = new Database(dbPath)

console.log('💳 Fixing payments table schema...')

try {
  // Check current payments table structure
  const paymentsTableInfo = db.prepare("PRAGMA table_info(payments)").all()
  console.log('Current payments table columns:', paymentsTableInfo.map(col => col.name))
  
  // Drop and recreate payments table with correct schema
  console.log('🔄 Recreating payments table...')
  
  db.exec('DROP TABLE IF EXISTS payments')
  
  db.exec(`
    CREATE TABLE payments (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      amount REAL NOT NULL,
      payment_type TEXT NOT NULL,
      payment_method TEXT DEFAULT 'cbe',
      status TEXT DEFAULT 'pending_confirmation',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  console.log('✅ Payments table recreated with payment_method column')
  
  // Verify the new structure
  const newTableInfo = db.prepare("PRAGMA table_info(payments)").all()
  console.log('New payments table columns:', newTableInfo.map(col => col.name))
  
  console.log('\n🎉 Payments table fixed successfully!')

} catch (error) {
  console.error('❌ Error fixing payments table:', error)
} finally {
  db.close()
}