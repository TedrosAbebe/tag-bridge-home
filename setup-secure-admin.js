const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const { join } = require('path');
const { randomUUID } = require('crypto');

const dbPath = join(process.cwd(), 'data', 'broker.db');
console.log('🔐 Setting up secure admin system:', dbPath);

const db = new Database(dbPath);

try {
  console.log('🗑️ Removing all existing admin accounts...');
  
  // Remove all existing admin accounts
  const adminUsers = db.prepare("SELECT username FROM users WHERE role = 'admin'").all();
  adminUsers.forEach(admin => {
    console.log(`  - Removing admin: ${admin.username}`);
  });
  
  const deletedAdmins = db.prepare("DELETE FROM users WHERE role = 'admin'").run();
  console.log(`✅ Deleted ${deletedAdmins.changes} admin accounts`);

  console.log('\n🔑 Creating secure admin account...');
  
  // Create the secure admin account
  const adminId = randomUUID();
  const adminUsername = 'tedayeerasu';
  const adminPassword = '494841Abc';
  const adminPasswordHash = bcrypt.hashSync(adminPassword, 10);
  
  db.prepare(`
    INSERT INTO users (id, username, password_hash, role)
    VALUES (?, ?, ?, ?)
  `).run(adminId, adminUsername, adminPasswordHash, 'admin');
  
  console.log('✅ Secure admin account created successfully!');
  console.log(`   Username: ${adminUsername}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   ID: ${adminId}`);

  console.log('\n📋 Current admin accounts:');
  const currentAdmins = db.prepare("SELECT username, role, created_at FROM users WHERE role = 'admin'").all();
  if (currentAdmins.length === 0) {
    console.log('  - No admin accounts found');
  } else {
    currentAdmins.forEach(admin => {
      console.log(`  - ${admin.username} (${admin.role}) - ${new Date(admin.created_at).toLocaleDateString()}`);
    });
  }

  console.log('\n📋 All remaining users:');
  const allUsers = db.prepare('SELECT username, role FROM users ORDER BY role, username').all();
  allUsers.forEach(user => {
    console.log(`  - ${user.username} (${user.role})`);
  });

  console.log('\n🎉 Secure admin system setup completed!');
  console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
  console.log('   - Only the "tedayeerasu" account can access admin functions');
  console.log('   - All other admin accounts have been removed');
  console.log('   - Use the admin dashboard to create additional admin accounts if needed');
  console.log('   - Keep these credentials secure and private');
  
} catch (error) {
  console.error('❌ Setup failed:', error);
} finally {
  db.close();
}