const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const db = new Database('./data/broker.db');
const user = db.prepare('SELECT * FROM users WHERE username = ?').get('teda');

if (user) {
  console.log('✅ User found:', user.username, user.role);
  console.log('🔐 Testing passwords...');
  
  const passwords = ['admin123', 'user123', 'teda123', 'password'];
  passwords.forEach(pwd => {
    const isValid = bcrypt.compareSync(pwd, user.password_hash);
    console.log(`   Password '${pwd}': ${isValid ? 'CORRECT ✅' : 'incorrect ❌'}`);
  });
} else {
  console.log('❌ User teda not found');
  
  // Show all users
  const allUsers = db.prepare('SELECT username, role FROM users').all();
  console.log('\n📋 All users in database:');
  allUsers.forEach((u, i) => {
    console.log(`   ${i + 1}. ${u.username} (${u.role})`);
  });
}

db.close();