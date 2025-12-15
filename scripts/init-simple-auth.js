const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const path = require('path')

console.log('🔄 INITIALIZING SIMPLE USERNAME/PASSWORD AUTH SYSTEM...\n')

const dbPath = path.join(process.cwd(), 'data', 'broker.db')
console.log('🗄️ Database path:', dbPath)

try {
    const db = new Database(dbPath)
    console.log('✅ Database connection established')
    
    // Drop old tables if they exist
    console.log('\n🧹 Cleaning up old tables...')
    try {
        db.exec('DROP TABLE IF EXISTS admin_otp_codes')
        db.exec('DROP TABLE IF EXISTS admins')
        console.log('✅ Removed old admin tables')
    } catch (error) {
        console.log('ℹ️ Old tables did not exist')
    }
    
    // Create new users table with username/password
    console.log('\n📊 Creating new users table...')
    db.exec(`
        CREATE TABLE IF NOT EXISTS users_new (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT CHECK(role IN ('admin', 'user')) DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `)
    
    // Copy existing users if any (this will fail gracefully if old table doesn't exist)
    try {
        const oldUsers = db.prepare('SELECT * FROM users').all()
        console.log(`📋 Found ${oldUsers.length} existing users to migrate`)
        
        if (oldUsers.length > 0) {
            const insertUser = db.prepare(`
                INSERT INTO users_new (id, username, password_hash, role, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
            `)
            
            for (const user of oldUsers) {
                // Use phone as username for migration, or generate one
                const username = user.phone ? user.phone.replace('+251', '') : `user_${Date.now()}`
                insertUser.run(
                    user.id,
                    username,
                    user.password_hash,
                    user.role === 'broker' ? 'user' : user.role, // Convert broker to user
                    user.created_at,
                    user.updated_at
                )
            }
            console.log('✅ Migrated existing users')
        }
    } catch (error) {
        console.log('ℹ️ No existing users to migrate')
    }
    
    // Replace old users table
    db.exec('DROP TABLE IF EXISTS users')
    db.exec('ALTER TABLE users_new RENAME TO users')
    console.log('✅ Users table updated with new schema')
    
    // Create test users
    console.log('\n👤 Creating test users...')
    
    const createUser = db.prepare(`
        INSERT OR REPLACE INTO users (id, username, password_hash, role)
        VALUES (?, ?, ?, ?)
    `)
    
    // Create admin user
    const adminId = 'admin-' + Date.now()
    const adminPassword = bcrypt.hashSync('admin123', 10)
    createUser.run(adminId, 'admin', adminPassword, 'admin')
    console.log('✅ Created admin user: admin / admin123')
    
    // Create regular user
    const userId = 'user-' + Date.now()
    const userPassword = bcrypt.hashSync('user123', 10)
    createUser.run(userId, 'testuser', userPassword, 'user')
    console.log('✅ Created test user: testuser / user123')
    
    // Verify users were created
    console.log('\n🔍 Verifying created users...')
    const users = db.prepare('SELECT * FROM users').all()
    
    console.log(`✅ Total users in database: ${users.length}`)
    users.forEach((user, i) => {
        console.log(`   ${i + 1}. ${user.username} (${user.role}) - ID: ${user.id}`)
    })
    
    db.close()
    
    console.log('\n🎉 SIMPLE AUTH SYSTEM INITIALIZED SUCCESSFULLY!')
    console.log('========================')
    console.log('🧪 TEST CREDENTIALS:')
    console.log('📧 Admin: username="admin", password="admin123"')
    console.log('👤 User: username="testuser", password="user123"')
    console.log('')
    console.log('🚀 NEXT STEPS:')
    console.log('1. Start your server: npm run dev')
    console.log('2. Go to: http://localhost:3000/login')
    console.log('3. Login with either admin or user credentials')
    console.log('4. Admin will redirect to /admin')
    console.log('5. User will redirect to /dashboard')
    
} catch (error) {
    console.error('❌ Database initialization error:', error)
    console.error('Error details:', error.message)
}