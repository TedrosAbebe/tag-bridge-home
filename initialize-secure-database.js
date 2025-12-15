const Database = require('better-sqlite3');
const path = require('path');

console.log('🔧 INITIALIZING SECURE DATABASE');
console.log('===============================');

// Create data directory if it doesn't exist
const fs = require('fs');
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 Created data directory');
}

// Initialize database
const dbPath = path.join(dataDir, 'broker.db');
const db = new Database(dbPath);

console.log('📍 Database path:', dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

try {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'broker', 'user', 'advertiser')) DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Users table created');

  // Create system config table
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ System config table created');

  // Create broker info table
  db.exec(`
    CREATE TABLE IF NOT EXISTS broker_info (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      license_number TEXT,
      experience TEXT NOT NULL,
      specialization TEXT NOT NULL,
      status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Broker info table created');

  // Create other necessary tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      city TEXT NOT NULL,
      area TEXT NOT NULL,
      type TEXT NOT NULL,
      size REAL,
      bedrooms INTEGER,
      bathrooms INTEGER,
      status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
      owner_id TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      owner_role TEXT NOT NULL,
      whatsapp_number TEXT,
      phone_number TEXT,
      images TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);
  console.log('✅ Properties table created');

  // Create banners table
  db.exec(`
    CREATE TABLE IF NOT EXISTS banners (
      id TEXT PRIMARY KEY,
      title_en TEXT NOT NULL,
      title_am TEXT NOT NULL,
      message_en TEXT NOT NULL,
      message_am TEXT NOT NULL,
      type TEXT CHECK(type IN ('promotion', 'announcement', 'feature')) DEFAULT 'promotion',
      color TEXT DEFAULT '#3B82F6',
      gradient TEXT DEFAULT 'from-blue-500 to-purple-600',
      icon TEXT DEFAULT '🎉',
      active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Banners table created');

  // Check current state
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "admin"').get().count;
  
  console.log(`\n📊 DATABASE STATUS:`);
  console.log(`   Total users: ${userCount}`);
  console.log(`   Admin users: ${adminCount}`);
  
  if (adminCount === 0) {
    console.log('\n✅ Database ready for admin setup!');
    console.log('🎯 Next steps:');
    console.log('   1. Start your app: npm run dev');
    console.log('   2. Go to: http://localhost:3000/admin-setup');
    console.log('   3. Use setup secret: tag-bridge-admin-setup-secret-change-this-2024');
  } else {
    console.log('\n⚠️  Admin users already exist');
  }

} catch (error) {
  console.error('❌ Database initialization error:', error.message);
} finally {
  db.close();
  console.log('\n🔒 Database initialization complete');
}