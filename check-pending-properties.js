const Database = require('better-sqlite3')
const { join } = require('path')

const dbPath = join(process.cwd(), 'data', 'broker.db')
const db = new Database(dbPath)

console.log('📋 Checking Pending Properties for Admin Dashboard...')

try {
  // Check pending properties
  const pendingProperties = db.prepare(`
    SELECT id, title, status, payment_amount, payment_method, created_at 
    FROM properties 
    WHERE status = 'pending'
    ORDER BY created_at DESC
  `).all()

  console.log('\n🏠 Pending Properties in Admin Dashboard:')
  if (pendingProperties.length === 0) {
    console.log('   No pending properties found.')
  } else {
    pendingProperties.forEach((prop, index) => {
      console.log(`   ${index + 1}. ${prop.title}`)
      console.log(`      Status: ${prop.status}`)
      console.log(`      Payment: ${prop.payment_amount} ETB (${prop.payment_method})`)
      console.log(`      Created: ${prop.created_at}`)
      console.log('')
    })
  }

  console.log(`✅ Total pending properties: ${pendingProperties.length}`)

  // Check all properties
  const allProperties = db.prepare('SELECT status, COUNT(*) as count FROM properties GROUP BY status').all()
  console.log('\n📊 All Properties by Status:')
  allProperties.forEach(stat => {
    console.log(`   ${stat.status}: ${stat.count}`)
  })

} catch (error) {
  console.error('❌ Error:', error)
} finally {
  db.close()
}