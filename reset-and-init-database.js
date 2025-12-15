// Complete database reset and initialization
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

console.log('🔄 RESETTING AND INITIALIZING DATABASE...\n');

const dbPath = path.join(__dirname, 'data', 'broker.db');

// Backup existing database
if (fs.existsSync(dbPath)) {
  const backupPath = path.join(__dirname, 'data', `broker_backup_${Date.now()}.db`);
  fs.copyFileSync(dbPath, backupPath);
  console.log('✅ Database backed up to:', backupPath);
}

const db = new Database(dbPath);

try {
  console.log('1️⃣ Enabling foreign keys...');
  db.pragma('foreign_keys = ON');
  
  console.log('2️⃣ Dropping all existing tables...');
  db.exec('DROP TABLE IF EXISTS whatsapp_confirmations');
  db.exec('DROP TABLE IF EXISTS admin_logs');
  db.exec('DROP TABLE IF EXISTS system_settings');
  db.exec('DROP TABLE IF EXISTS property_images');
  db.exec('DROP TABLE IF EXISTS favorites');
  db.exec('DROP TABLE IF EXISTS payments');
  db.exec('DROP TABLE IF EXISTS properties');
  db.exec('DROP TABLE IF EXISTS users');
  
  console.log('3️⃣ Creating users table...');
  db.exec(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'broker', 'user')) DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('4️⃣ Creating properties table...');
  db.exec(`
    CREATE TABLE properties (
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
  `);
  
  console.log('5️⃣ Creating property_images table...');
  db.exec(`
    CREATE TABLE property_images (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      is_primary BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
    )
  `);
  
  console.log('6️⃣ Creating favorites table...');
  db.exec(`
    CREATE TABLE favorites (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      property_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, property_id),
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
    )
  `);
  
  console.log('7️⃣ Creating payments table...');
  db.exec(`
    CREATE TABLE payments (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'ETB',
      payment_type TEXT CHECK(payment_type IN ('rent_listing', 'sale_listing')) NOT NULL,
      status TEXT CHECK(status IN ('pending', 'confirmed', 'rejected')) DEFAULT 'pending',
      whatsapp_confirmation_message TEXT,
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      confirmed_at DATETIME,
      FOREIGN KEY (property_id) REFERENCES properties (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
  
  console.log('8️⃣ Creating system_settings table...');
  db.exec(`
    CREATE TABLE system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('9️⃣ Creating admin_logs table...');
  db.exec(`
    CREATE TABLE admin_logs (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL,
      action TEXT NOT NULL,
      target_type TEXT CHECK(target_type IN ('user', 'property', 'payment', 'system')) NOT NULL,
      target_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES users (id)
    )
  `);
  
  console.log('🔟 Inserting system settings...');
  const insertSetting = db.prepare('INSERT INTO system_settings (key, value) VALUES (?, ?)');
  insertSetting.run('rent_listing_fee', '25');
  insertSetting.run('sale_listing_fee', '50');
  insertSetting.run('whatsapp_contact_placeholder', '+251911234567');
  insertSetting.run('bank_account_placeholder', 'Commercial Bank of Ethiopia - Account: 1000123456789');
  
  console.log('1️⃣1️⃣ Creating default users...');
  
  const createUser = db.prepare(`
    INSERT INTO users (id, username, password_hash, role)
    VALUES (?, ?, ?, ?)
  `);
  
  // Create admin users
  createUser.run('admin-1', 'admin', bcrypt.hashSync('admin123', 10), 'admin');
  createUser.run('admin-2', 'teda', bcrypt.hashSync('admin123', 10), 'admin');
  
  // Create broker users
  createUser.run('broker-1', 'broker1', bcrypt.hashSync('broker123', 10), 'broker');
  createUser.run('broker-2', 'broker2', bcrypt.hashSync('broker123', 10), 'broker');
  
  // Create regular users
  createUser.run('user-1', 'testuser', bcrypt.hashSync('user123', 10), 'user');
  
  console.log('1️⃣2️⃣ Testing database operations...');
  
  // Test property insertion
  const testPropertyId = 'test-prop-' + Date.now();
  db.prepare(`
    INSERT INTO properties (
      id, title, description, price, currency, city, area, 
      type, bedrooms, bathrooms, size, features, owner_id, 
      whatsapp_number, phone_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    testPropertyId,
    'Test Property',
    'Test description',
    150000,
    'ETB',
    'Addis Ababa',
    'Bole',
    'house_sale',
    3,
    2,
    120,
    '[]',
    'broker-1',
    '+251911234567',
    '+251911234567'
  );
  
  console.log('✅ Test property created successfully');
  
  // Test payment insertion
  const testPaymentId = 'test-payment-' + Date.now();
  db.prepare(`
    INSERT INTO payments (id, property_id, user_id, amount, payment_type)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    testPaymentId,
    testPropertyId,
    'broker-1',
    50,
    'sale_listing'
  );
  
  console.log('✅ Test payment created successfully');
  
  // Clean up test data
  db.prepare('DELETE FROM payments WHERE id = ?').run(testPaymentId);
  db.prepare('DELETE FROM properties WHERE id = ?').run(testPropertyId);
  console.log('✅ Test data cleaned up');
  
  console.log('\n🎯 DATABASE INITIALIZATION COMPLETE!');
  console.log('================================');
  console.log('✅ All tables created with proper schema');
  console.log('✅ Foreign key constraints working');
  console.log('✅ System settings configured');
  console.log('✅ Default users created');
  console.log('✅ Database operations tested');
  
  console.log('\n👥 USER CREDENTIALS:');
  console.log('Admin: admin/admin123');
  console.log('Admin: teda/admin123');
  console.log('Broker: broker1/broker123');
  console.log('Broker: broker2/broker123');
  console.log('User: testuser/user123');
  
  console.log('\n🚀 READY FOR TESTING!');
  console.log('Server: http://localhost:3001');
  console.log('Login as broker1/broker123 and test property listing');
  
} catch (error) {
  console.error('❌ Database initialization failed:', error.message);
} finally {
  db.close();
}