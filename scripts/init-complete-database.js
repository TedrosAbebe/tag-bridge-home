const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const path = require('path')

console.log('🔄 INITIALIZING COMPLETE DATABASE WITH ALL TABLES...\n')

const dbPath = path.join(process.cwd(), 'data', 'broker.db')
console.log('🗄️ Database path:', dbPath)

try {
    const db = new Database(dbPath)
    console.log('✅ Database connection established')
    
    // Drop and recreate users table with new schema
    console.log('\n📊 Creating users table...')
    db.exec('DROP TABLE IF EXISTS users')
    db.exec(`
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT CHECK(role IN ('admin', 'user')) DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `)
    console.log('✅ Users table created')
    
    // Create properties table
    console.log('\n📊 Creating properties table...')
    db.exec(`
        CREATE TABLE IF NOT EXISTS properties (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            currency TEXT DEFAULT 'ETB',
            city TEXT NOT NULL,
            area TEXT,
            latitude REAL,
            longitude REAL,
            type TEXT CHECK(type IN ('rent', 'sale')) NOT NULL,
            bedrooms INTEGER,
            bathrooms INTEGER,
            size REAL,
            features TEXT,
            owner_id TEXT,
            whatsapp_number TEXT,
            phone_number TEXT,
            status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES users (id)
        )
    `)
    console.log('✅ Properties table created')
    
    // Create payments table
    console.log('\n📊 Creating payments table...')
    db.exec(`
        CREATE TABLE IF NOT EXISTS payments (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            property_id TEXT,
            amount REAL NOT NULL,
            currency TEXT DEFAULT 'ETB',
            payment_type TEXT CHECK(payment_type IN ('rent_listing', 'sale_listing')) NOT NULL,
            status TEXT CHECK(status IN ('pending', 'confirmed', 'rejected')) DEFAULT 'pending',
            whatsapp_confirmation TEXT,
            admin_notes TEXT,
            confirmed_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (property_id) REFERENCES properties (id)
        )
    `)
    console.log('✅ Payments table created')
    
    // Create favorites table
    console.log('\n📊 Creating favorites table...')
    db.exec(`
        CREATE TABLE IF NOT EXISTS favorites (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            property_id TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (property_id) REFERENCES properties (id),
            UNIQUE(user_id, property_id)
        )
    `)
    console.log('✅ Favorites table created')
    
    // Create property_images table
    console.log('\n📊 Creating property_images table...')
    db.exec(`
        CREATE TABLE IF NOT EXISTS property_images (
            id TEXT PRIMARY KEY,
            property_id TEXT NOT NULL,
            image_url TEXT NOT NULL,
            is_primary BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (property_id) REFERENCES properties (id)
        )
    `)
    console.log('✅ Property images table created')
    
    // Create system_settings table
    console.log('\n📊 Creating system_settings table...')
    db.exec(`
        CREATE TABLE IF NOT EXISTS system_settings (
            key TEXT PRIMARY KEY,
            value TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `)
    console.log('✅ System settings table created')
    
    // Create whatsapp_confirmations table
    console.log('\n📊 Creating whatsapp_confirmations table...')
    db.exec(`
        CREATE TABLE IF NOT EXISTS whatsapp_confirmations (
            id TEXT PRIMARY KEY,
            payment_id TEXT NOT NULL,
            sender_number TEXT NOT NULL,
            message_content TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (payment_id) REFERENCES payments (id)
        )
    `)
    console.log('✅ WhatsApp confirmations table created')
    
    // Create admin_logs table
    console.log('\n📊 Creating admin_logs table...')
    db.exec(`
        CREATE TABLE IF NOT EXISTS admin_logs (
            id TEXT PRIMARY KEY,
            admin_id TEXT NOT NULL,
            action TEXT NOT NULL,
            target_type TEXT,
            target_id TEXT,
            details TEXT,
            ip_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (admin_id) REFERENCES users (id)
        )
    `)
    console.log('✅ Admin logs table created')
    
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
    
    // Verify all tables exist
    console.log('\n🔍 Verifying all tables exist...')
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
    console.log('📊 Tables in database:')
    tables.forEach((table, i) => {
        console.log(`   ${i + 1}. ${table.name}`)
    })
    
    db.close()
    
    console.log('\n🎉 COMPLETE DATABASE INITIALIZED SUCCESSFULLY!')
    console.log('========================')
    console.log('🧪 TEST CREDENTIALS:')
    console.log('📧 Admin: username="admin", password="admin123"')
    console.log('👤 User: username="testuser", password="user123"')
    console.log('')
    console.log('🚀 NEXT STEPS:')
    console.log('1. Start your server: npm run dev')
    console.log('2. Go to: http://localhost:3001/login')
    console.log('3. Login with either admin or user credentials')
    console.log('4. Admin will redirect to /admin')
    console.log('5. User will redirect to /dashboard')
    
} catch (error) {
    console.error('❌ Database initialization error:', error)
    console.error('Error details:', error.message)
}