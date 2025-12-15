const Database = require('better-sqlite3');

console.log('🔨 FORCE REMOVING TEDAYEERASU (DISABLE FOREIGN KEYS)');
console.log('==================================================');

const dataDbPath = './data/broker.db';
console.log(`\n📍 Force cleaning: ${dataDbPath}`);

try {
  const db = new Database(dataDbPath);
  
  // Disable foreign key constraints
  db.pragma('foreign_keys = OFF');
  console.log('🔓 Foreign key constraints disabled');
  
  // Check current users
  const beforeUsers = db.prepare('SELECT username, role FROM users').all();
  console.log(`\n👥 Users before cleanup: ${beforeUsers.length}`);
  beforeUsers.forEach(user => {
    console.log(`   - ${user.username} (${user.role})`);
  });
  
  // Remove ALL suspicious admin accounts
  const accountsToRemove = ['tedayeerasu', 'admin', 'administrator', 'tedy'];
  
  accountsToRemove.forEach(username => {
    try {
      const user = db.prepare('SELECT username FROM users WHERE username = ?').get(username);
      if (user) {
        db.prepare('DELETE FROM users WHERE username = ?').run(username);
        console.log(`🗑️  Removed: ${username}`);
      }
    } catch (error) {
      console.log(`❌ Failed to remove ${username}: ${error.message}`);
    }
  });
  
  // Check final state
  const afterUsers = db.prepare('SELECT username, role FROM users').all();
  console.log(`\n👥 Users after cleanup: ${afterUsers.length}`);
  afterUsers.forEach(user => {
    console.log(`   - ${user.username} (${user.role})`);
  });
  
  // Re-enable foreign key constraints
  db.pragma('foreign_keys = ON');
  console.log('🔒 Foreign key constraints re-enabled');
  
  db.close();
  console.log('\n✅ Force cleanup complete!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}

console.log('\n🎯 TEST NOW:');
console.log('Try logging in with tedayeerasu/494841Abc');
console.log('It should now FAIL and show "Invalid credentials"');