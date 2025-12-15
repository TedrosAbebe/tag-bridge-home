const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const path = require('path')

console.log('🔧 MANUALLY INITIALIZING DATABASE...\n')

const dbPath = path.join(process.cwd(), 'data', 'broker.db')
console.log('🗄️ Database path:', dbPath)

try {
    const db = new Database(dbPath)
    console.log('✅ Database connection established')
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON')
    console.log('✅ Foreign keys enabled')
    
    // Create users table
    console.log('📊 Creating users table...')
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            whatsapp_number TEXT,
            password_hash TEXT,
            role TEXT CHECK(role IN ('user', 'broker')) DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `)
    console.log('✅ Users table created')
    
    // Create admins table
    console.log('📊 Creating admins table...')
    db.exec(`
        CREATE TABLE IF NOT EXISTS admins (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            phone TEXT,
            whatsapp_number TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `)
    console.log('✅ Admins table created')
    
    // Create admin OTP table
    console.log('📊 Creating admin_otp_codes table...')
    db.exec(`
        CREATE TABLE IF NOT EXISTS admin_otp_codes (
            id TEXT PRIMARY KEY,
            admin_id TEXT NOT NULL,
            email TEXT NOT NULL,
            otp_code TEXT NOT NULL,
            expires_at DATETIME NOT NULL,
            verified BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (admin_id) REFERENCES admins (id)
        )
    `)
    console.log('✅ Admin OTP table created')
    
    // Create properties table
    console.log('📊 Creating properties table...')
    db.exec(`
        CREATE TABLE IF NOT EXISTS properties (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            currency TEXT DEFAULT 'ETB',
            city TEXT NOT NULL,
            area TEXT NOT NULL,
            latitude REAL,
            longitude REAL,
            type TEXT CHECK(type IN ('house_sale', 'house_rent', 'apartment', 'land')) NOT NULL,
            bedrooms INTEGER,
            bathrooms INTEGER,
            size REAL NOT NULL,
            features TEXT,
            status TEXT CHECK(status IN ('pending_payment', 'pending', 'approved', 'sold', 'rejected')) DEFAULT 'pending_payment',
            owner_id TEXT NOT NULL,
            broker_id TEXT,
            whatsapp_number TEXT NOT NULL,
            phone_number TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES users (id),
            FOREIGN KEY (broker_id) REFERENCES users (id)
        )
    `)
    console.log('✅ Properties table created')
    
    // Create test user
    console.log('👤 Creating test user...')
    const testUserId = 'user-test-' + Date.now()
    const testPassword = bcrypt.hashSync('123456', 10)
    
    const createUser = db.prepare(`
        INSERT OR IGNORE INTO users (id, name, phone, whatsapp_number, password_hash, role)
        VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    createUser.run(
        testUserId,
        'Test User',
        '+251911111111',
        '+251911111111',
        testPassword,
        'broker'
    )
    console.log('✅ Test user created: +251911111111 / 123456')
    
    // Create admin user
    console.log('👤 Creating admin user...')
    const adminId = 'admin-' + Date.now()
    const adminPassword = bcrypt.hashSync('admin123', 10)
    
    const createAdmin = db.prepare(`
        INSERT OR IGNORE INTO admins (id, name, email, password_hash, phone, whatsapp_number)
        VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    createAdmin.run(
        adminId,
        'Admin User',
        'tedayeerasu@gmail.com',
        adminPassword,
        '+251991856292',
        '+251991856292'
    )
    console.log('✅ Admin user created: tedayeerasu@gmail.com / admin123')
    
    // Check what was created
    console.log('\n📊 VERIFICATION:')
    const users = db.prepare('SELECT * FROM users').all()
    const admins = db.prepare('SELECT * FROM admins').all()
    
    console.log(`✅ Users in database: ${users.length}`)
    users.forEach((user, i) => {
        console.log(`   ${i + 1}. ${user.name} (${user.phone}) - ${user.role}`)
    })
    
    console.log(`✅ Admins in database: ${admins.length}`)
    admins.forEach((admin, i) => {
        console.log(`   ${i + 1}. ${admin.name} (${admin.email})`)
    })
    
    db.close()
    console.log('\n🎉 DATABASE INITIALIZATION COMPLETE!')
    console.log('\n🧪 TEST CREDENTIALS:')
    console.log('User/Broker: +251911111111 / 123456')
    console.log('Admin: tedayeerasu@gmail.com / admin123')
    
} catch (error) {
    console.error('❌ Database initialization failed:', error)
    console.error('Error details:', error.message)
}