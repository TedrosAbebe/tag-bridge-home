const Database = require('better-sqlite3');

console.log('🔄 SYNCING ADMIN ACCOUNT TO LOGIN DATABASE');
console.log('==========================================');

try {
  // Open both databases
  const authDb = new Database('./broker.db');        // Where your admin account is
  const mainDb = new Database('./data/broker.db');   // Where login system looks
  
  console.log('📍 Checking admin account in auth database...');
  const adminAccount = authDb.prepare('SELECT * FROM users WHERE username = ?').get('tedros');
  
  if (!adminAccount) {
    console.log('❌ Admin account "tedros" not found in auth database');
    authDb.close();
    mainDb.close();
    return;
  }
  
  console.log('✅ Found admin account:', adminAccount.username);
  console.log('   Role:', adminAccount.role);
  console.log('   Created:', adminAccount.created_at);
  
  console.log('\n📍 Checking if admin account exists in main database...');
  const existingAdmin = mainDb.prepare('SELECT * FROM users WHERE username = ?').get('tedros');
  
  if (existingAdmin) {
    console.log('✅ Admin account already exists in main database');
  } else {
    console.log('➕ Adding admin account to main database...');
    
    // Check if users table exists in main database
    const tables = mainDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").all();
    if (tables.length === 0) {
      console.log('📋 Creating users table in main database...');
      mainDb.exec(`
        CREATE TABLE users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role TEXT CHECK(role IN ('admin', 'broker', 'user', 'advertiser')) DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
    
    // Insert admin account
    mainDb.prepare(`
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
    
    console.log('✅ Admin account added to main database');
  }
  
  // Verify the account is now in main database
  console.log('\n📍 Verifying admin account in main database...');
  const verifyAdmin = mainDb.prepare('SELECT username, role FROM users WHERE username = ?').get('tedros');
  
  if (verifyAdmin) {
    console.log('✅ SUCCESS! Admin account verified in main database');
    console.log('   Username:', verifyAdmin.username);
    console.log('   Role:', verifyAdmin.role);
  } else {
    console.log('❌ FAILED! Admin account not found in main database');
  }
  
  // Show all users in main database
  console.log('\n👥 All users in main database:');
  const allUsers = mainDb.prepare('SELECT username, role FROM users').all();
  allUsers.forEach(user => {
    console.log(`   - ${user.username} (${user.role})`);
  });
  
  authDb.close();
  mainDb.close();
  
  console.log('\n🎯 TRY LOGIN NOW:');
  console.log('Username: tedros');
  console.log('Password: [your password]');
  console.log('Should work at: http://localhost:3000/login');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}