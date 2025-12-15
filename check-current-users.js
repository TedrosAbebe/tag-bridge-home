const Database = require('better-sqlite3');

console.log('🔍 CHECKING ALL CURRENT USERS');
console.log('=============================');

const db = new Database('./broker.db');

try {
  // Check all users in the database
  const users = db.prepare('SELECT username, role, created_at FROM users').all();
  
  console.log(`👥 Total users found: ${users.length}`);
  console.log('\n📋 User list:');
  
  users.forEach((user, index) => {
    console.log(`   ${index + 1}. ${user.username} (${user.role}) - Created: ${user.created_at}`);
  });
  
  // Check specifically for tedayeerasu
  const tedaUser = db.prepare('SELECT * FROM users WHERE username = ?').get('tedayeerasu');
  if (tedaUser) {
    console.log('\n🚨 SECURITY ALERT: "tedayeerasu" account still exists!');
    console.log('   This is the old hard-coded admin account that should be removed.');
  } else {
    console.log('\n✅ Good: "tedayeerasu" account not found in database');
  }
  
  // Check admin setup status
  const setupComplete = db.prepare('SELECT value FROM system_config WHERE key = ?').get('admin_setup_complete');
  console.log(`\n🔧 Admin setup complete: ${setupComplete ? setupComplete.value : 'not set'}`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  db.close();
}