const Database = require('better-sqlite3');
const fs = require('fs');

console.log('🔍 SEARCHING FOR TEDAYEERASU ACCOUNT');
console.log('===================================');

// List of possible database locations
const dbPaths = [
  './broker.db',
  './data/broker.db',
  './data/broker-clean.db',
  './data/broker_backup_1765565996796.db',
  './data/broker_backup_1765566934586.db'
];

dbPaths.forEach(dbPath => {
  console.log(`\n📍 Checking: ${dbPath}`);
  
  if (!fs.existsSync(dbPath)) {
    console.log('   ❌ File does not exist');
    return;
  }
  
  try {
    const db = new Database(dbPath);
    
    // Check if users table exists
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").all();
    if (tables.length === 0) {
      console.log('   ❌ No users table');
      db.close();
      return;
    }
    
    // Check for tedayeerasu
    const tedaUser = db.prepare('SELECT username, role, created_at FROM users WHERE username = ?').get('tedayeerasu');
    if (tedaUser) {
      console.log('   🚨 FOUND TEDAYEERASU ACCOUNT!');
      console.log(`      Role: ${tedaUser.role}`);
      console.log(`      Created: ${tedaUser.created_at}`);
    } else {
      console.log('   ✅ No tedayeerasu account');
    }
    
    // List all users
    const allUsers = db.prepare('SELECT username, role FROM users').all();
    console.log(`   👥 Total users: ${allUsers.length}`);
    allUsers.forEach(user => {
      console.log(`      - ${user.username} (${user.role})`);
    });
    
    db.close();
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
});

console.log('\n🎯 NEXT STEPS:');
console.log('If tedayeerasu was found in any database:');
console.log('1. We need to remove it from ALL databases');
console.log('2. Check which database the app is actually using');
console.log('3. Ensure only your secure admin account exists');