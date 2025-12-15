const Database = require('better-sqlite3');
const path = require('path');

console.log('🔧 FIXING DATABASE LOCATION');
console.log('===========================');

// Initialize database in root directory (where the app expects it)
const dbPath = path.join(process.cwd(), 'broker.db');
const db = new Database(dbPath);

console.log('📍 Database path:', dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

try {
  // Drop existing tables if they have issues
  console.log('🧹 Cleaning up existing tables...');
  
  // Create users table
  db.exec(`
    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
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
    DROP TABLE IF EXISTS system_config;
    CREATE TABLE system_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ System config table created');

  // Create broker info table
  db.exec(`
    DROP TABLE IF EXISTS broker_info;
    CREATE TABLE broker_info (
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

  // Verify tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('\n📋 Tables created:');
  tables.forEach(table => {
    console.log(`   - ${table.name}`);
  });

  // Check users table structure
  const userColumns = db.prepare('PRAGMA table_info(users)').all();
  console.log('\n👤 Users table columns:');
  userColumns.forEach(col => {
    console.log(`   - ${col.name}: ${col.type}`);
  });

  console.log('\n✅ Database is ready for admin setup!');
  console.log('🎯 Next steps:');
  console.log('   1. Start your app: npm run dev');
  console.log('   2. Go to: http://localhost:3000/admin-setup');
  console.log('   3. Create your admin account');

} catch (error) {
  console.error('❌ Database setup error:', error.message);
} finally {
  db.close();
  console.log('\n🔒 Database setup complete');
}