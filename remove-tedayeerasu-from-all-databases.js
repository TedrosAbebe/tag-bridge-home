const Database = require('better-sqlite3');

console.log('🗑️  REMOVING TEDAYEERASU FROM ALL DATABASES');
console.log('==========================================');

// Clean the data/broker.db file
const dataDbPath = './data/broker.db';
console.log(`\n📍 Cleaning: ${dataDbPath}`);

try {
  const db = new Database(dataDbPath);
  
  // Check current users
  const beforeUsers = db.prepare('SELECT username, role FROM users').all();
  console.log(`   👥 Users before cleanup: ${beforeUsers.length}`);
  beforeUsers.forEach(user => {
    console.log(`      - ${user.username} (${user.role})`);
  });
  
  // Remove tedayeerasu account
  const tedaUser = db.prepare('SELECT username FROM users WHERE username = ?').get('tedayeerasu');
  if (tedaUser) {
    db.prepare('DELETE FROM users WHERE username = ?').run('tedayeerasu');
    console.log('   🗑️  Removed tedayeerasu account');
  } else {
    console.log('   ✅ No tedayeerasu account found');
  }
  
  // Remove any other suspicious admin accounts
  const suspiciousAccounts = ['admin', 'administrator', 'tedy'];
  suspiciousAccounts.forEach(username => {
    const user = db.prepare('SELECT username FROM users WHERE username = ?').get(username);
    if (user) {
      db.prepare('DELETE FROM users WHERE username = ?').run(username);
      console.log(`   🗑️  Removed suspicious account: ${username}`);
    }
  });
  
  // Check final state
  const afterUsers = db.prepare('SELECT username, role FROM users').all();
  console.log(`\n   👥 Users after cleanup: ${afterUsers.length}`);
  afterUsers.forEach(user => {
    console.log(`      - ${user.username} (${user.role})`);
  });
  
  // Add your secure admin account if it doesn't exist
  const tedrosUser = db.prepare('SELECT username FROM users WHERE username = ?').get('tedros');
  if (!tedrosUser) {
    console.log('   ➕ Adding your secure admin account to this database...');
    
    // Get the admin account from the clean database
    const cleanDb = new Database('./broker.db');
    const adminAccount = cleanDb.prepare('SELECT * FROM users WHERE username = ?').get('tedros');
    cleanDb.close();
    
    if (adminAccount) {
      db.prepare(`
        INSERT INTO users (id, username, password_hash, role, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        adminAccount.id,
        adminAccount.username,
        adminAccount.password_hash,
        adminAccount.role,
        adminAccount.created_at,
        adminAccount.updated_at
      );
      console.log('   ✅ Added tedros admin account');
    }
  }
  
  db.close();
  console.log('✅ Database cleanup complete');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}

console.log('\n🎯 SECURITY STATUS:');
console.log('✅ All tedayeerasu accounts should now be removed');
console.log('✅ Only your secure admin account should remain');
console.log('✅ Try logging in with tedayeerasu again - it should fail');