const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const dbPath = path.join(process.cwd(), 'data', 'broker.db');
const db = new Database(dbPath);

console.log('🔍 DATABASE STRUCTURE CHECK');
console.log('===========================\n');

try {
  // Check tables
  const tables = db.prepare('SELECT name FROM sqlite_master WHERE type="table"').all();
  console.log('📋 Tables in database:');
  tables.forEach(table => {
    console.log(`   - ${table.name}`);
  });

  // Check users table structure
  if (tables.some(t => t.name === 'users')) {
    console.log('\n👤 Users table structure:');
    const userColumns = db.prepare('PRAGMA table_info(users)').all();
    userColumns.forEach(col => {
      console.log(`   - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
    });

    // Check current users
    console.log('\n👥 Current users:');
    const users = db.prepare('SELECT username, role, created_at FROM users').all();
    if (users.length === 0) {
      console.log('   No users found');
    } else {
      users.forEach(user => {
        console.log(`   - ${user.username} (${user.role}) - ${user.created_at}`);
      });
    }
  } else {
    console.log('\n❌ Users table not found');
  }

  // Check system_config table
  if (tables.some(t => t.name === 'system_config')) {
    console.log('\n⚙️ System config table exists');
    const configs = db.prepare('SELECT key, value FROM system_config').all();
    if (configs.length === 0) {
      console.log('   No configuration entries');
    } else {
      configs.forEach(config => {
        console.log(`   - ${config.key}: ${config.value}`);
      });
    }
  } else {
    console.log('\n❌ System config table not found');
  }

} catch (error) {
  console.error('❌ Error checking database:', error.message);
} finally {
  db.close();
}