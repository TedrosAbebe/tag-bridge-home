const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

console.log('🔧 Fixing teda user password...');

const db = new Database('./data/broker.db');

// Hash the new password
const newPassword = 'admin123';
const hashedPassword = bcrypt.hashSync(newPassword, 10);

// Update teda's password
const updatePassword = db.prepare('UPDATE users SET password_hash = ? WHERE username = ?');
const result = updatePassword.run(hashedPassword, 'teda');

if (result.changes > 0) {
  console.log('✅ Password updated successfully for user "teda"');
  console.log(`🔐 New password: ${newPassword}`);
  
  // Verify the update
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get('teda');
  const isValid = bcrypt.compareSync(newPassword, user.password_hash);
  console.log(`🧪 Password verification: ${isValid ? 'SUCCESS ✅' : 'FAILED ❌'}`);
} else {
  console.log('❌ Failed to update password - user not found');
}

db.close();