const Database = require('better-sqlite3');

try {
  const db = new Database('./broker.db');
  
  console.log('🔍 CHECKING ADMIN STATUS');
  console.log('========================');
  
  // Check if users table exists
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").all();
  if (tables.length === 0) {
    console.log('❌ Users table does not exist');
    db.close();
    process.exit(1);
  }
  
  // Check admin users
  const adminUsers = db.prepare('SELECT username, role FROM users WHERE role = ?').all('admin');
  console.log(`👥 Admin users found: ${adminUsers.length}`);
  adminUsers.forEach(user => {
    console.log(`   - ${user.username}`);
  });
  
  // Check system config
  const configExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='system_config'").all();
  if (configExists.length > 0) {
    const setupComplete = db.prepare('SELECT value FROM system_config WHERE key = ?').get('admin_setup_complete');
    console.log(`🔧 Setup complete flag: ${setupComplete ? setupComplete.value : 'not set'}`);
  } else {
    console.log('🔧 System config table does not exist');
  }
  
  // Check environment
  console.log(`🌍 ADMIN_SETUP_ENABLED: ${process.env.ADMIN_SETUP_ENABLED || 'not set'}`);
  console.log(`🔑 ADMIN_SETUP_SECRET: ${process.env.ADMIN_SETUP_SECRET ? 'set' : 'not set'}`);
  
  db.close();
  
} catch (error) {
  console.error('❌ Error:', error.message);
}