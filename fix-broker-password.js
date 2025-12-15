const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'broker-clean.db');
const db = new Database(dbPath);

console.log('🔧 Fixing broker passwords...');

// Hash the correct passwords
const adminHash = bcrypt.hashSync('admin123', 10);
const brokerHash = bcrypt.hashSync('broker123', 10);
const userHash = bcrypt.hashSync('user123', 10);

console.log('New hashes generated');

// Update passwords
const updateAdmin = db.prepare('UPDATE users SET password_hash = ? WHERE username = ?');
const updateBroker = db.prepare('UPDATE users SET password_hash = ? WHERE username = ?');
const updateUser = db.prepare('UPDATE users SET password_hash = ? WHERE username = ?');

updateAdmin.run(adminHash, 'admin');
updateBroker.run(brokerHash, 'broker1');
updateUser.run(userHash, 'testuser');

console.log('✅ Passwords updated');

// Verify the updates
const users = db.prepare('SELECT username, role FROM users').all();
console.log('Users in database:', users);

// Test the new passwords
console.log('\nTesting passwords:');
const adminUser = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
const brokerUser = db.prepare('SELECT * FROM users WHERE username = ?').get('broker1');
const testUser = db.prepare('SELECT * FROM users WHERE username = ?').get('testuser');

console.log('Admin password valid:', bcrypt.compareSync('admin123', adminUser.password_hash));
console.log('Broker password valid:', bcrypt.compareSync('broker123', brokerUser.password_hash));
console.log('User password valid:', bcrypt.compareSync('user123', testUser.password_hash));

db.close();
console.log('✅ Database updated and closed');