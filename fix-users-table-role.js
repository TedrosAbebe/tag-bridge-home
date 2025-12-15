// Fix users table to allow broker role
const Database = require('better-sqlite3');
const path = require('path');

console.log('🔧 FIXING USERS TABLE ROLE CONSTRAINT...\n');

const dbPath = path.join(__dirname, 'data', 'broker.db');
const db = new Database(dbPath);

try {
  console.log('1️⃣ Backing up existing users...');
  
  // Get all existing users
  const existingUsers = db.prepare('SELECT * FROM users').all();
  console.log('✅ Found', existingUsers.length, 'existing users');
  
  console.log('2️⃣ Recreating users table with broker role...');
  
  // Drop and recreate users table with correct role constraint
  db.exec('DROP TABLE IF EXISTS users');
  
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
  
  console.log('✅ Users table recreated with broker role support');
  
  console.log('3️⃣ Restoring existing users...');
  
  const insertUser = db.prepare(`
    INSERT INTO users (id, username, password_hash, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  existingUsers.forEach(user => {
    insertUser.run(
      user.id,
      user.username,
      user.password_hash,
      user.role,
      user.created_at,
      user.updated_at
    );
  });
  
  console.log('✅ Restored', existingUsers.length, 'users');
  
  console.log('4️⃣ Verifying users by role...');
  
  const adminUsers = db.prepare('SELECT username FROM users WHERE role = ?').all('admin');
  const brokerUsers = db.prepare('SELECT username FROM users WHERE role = ?').all('broker');
  const regularUsers = db.prepare('SELECT username FROM users WHERE role = ?').all('user');
  
  console.log('✅ Admin users:', adminUsers.length, adminUsers.map(u => u.username));
  console.log('✅ Broker users:', brokerUsers.length, brokerUsers.map(u => u.username));
  console.log('✅ Regular users:', regularUsers.length, regularUsers.map(u => u.username));
  
  console.log('\n🎯 USERS TABLE FIX COMPLETE!');
  console.log('✅ Role constraint updated to support admin, broker, user');
  console.log('✅ All existing users preserved');
  console.log('✅ Broker functionality should now work');
  
} catch (error) {
  console.error('❌ Error fixing users table:', error.message);
} finally {
  db.close();
}