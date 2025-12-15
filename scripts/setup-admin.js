const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const { join } = require('path')

// Database setup
const dbPath = join(process.cwd(), 'data', 'broker.db')
const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

console.log('🔧 Setting up admin account for Ethiopia Home Broker App...')

// Create admin account with your credentials
function setupAdminAccount() {
  try {
    // Check if admin already exists
    const existingAdmin = db.prepare('SELECT id FROM users WHERE phone = ?').get('+251991856292')
    
    const hashedPassword = bcrypt.hashSync('admin123', 12)
    const adminId = existingAdmin ? existingAdmin.id : 'admin-tedaye-' + Date.now()
    
    if (existingAdmin) {
      // Update existing admin
      db.prepare(`
        UPDATE users 
        SET name = ?, password_hash = ?, role = ?, whatsapp_number = ?, updated_at = CURRENT_TIMESTAMP
        WHERE phone = ?
      `).run(
        'Tedaye Erasu',
        hashedPassword,
        'admin',
        '+251991856292',
        '+251991856292'
      )
      
      console.log('✅ Admin account updated successfully!')
    } else {
      // Create new admin
      db.prepare(`
        INSERT INTO users (id, name, phone, password_hash, role, whatsapp_number)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        adminId,
        'Tedaye Erasu',
        '+251991856292',
        hashedPassword,
        'admin',
        '+251991856292'
      )
      
      console.log('✅ Admin account created successfully!')
    }
    
    // Verify admin account
    const admin = db.prepare('SELECT * FROM users WHERE phone = ?').get('+251991856292')
    
    if (admin && admin.role === 'admin') {
      console.log('\n📋 Admin Account Details:')
      console.log('   Name: Tedaye Erasu')
      console.log('   Phone: +251991856292')
      console.log('   Email: tedayeerasu@gmail.com')
      console.log('   Password: admin123')
      console.log('   Role: admin')
      console.log('   WhatsApp: +251991856292')
      console.log('\n🌐 Access URLs:')
      console.log('   Login: http://localhost:3000/login')
      console.log('   Admin Dashboard: http://localhost:3000/admin')
      
      // Test password verification
      const passwordValid = bcrypt.compareSync('admin123', admin.password_hash)
      console.log('\n🔐 Password Verification:', passwordValid ? '✅ Valid' : '❌ Invalid')
      
      return true
    } else {
      console.error('❌ Failed to create/update admin account')
      return false
    }
    
  } catch (error) {
    console.error('❌ Error setting up admin account:', error.message)
    return false
  }
}

// Run setup
const success = setupAdminAccount()

if (success) {
  console.log('\n🎉 Admin setup complete! You can now:')
  console.log('1. Start the app: npm run dev')
  console.log('2. Login at /login with phone +251991856292 and password admin123')
  console.log('3. Access admin dashboard at /admin')
} else {
  console.log('\n❌ Admin setup failed. Please check the error messages above.')
  process.exit(1)
}

// Close database connection
db.close()