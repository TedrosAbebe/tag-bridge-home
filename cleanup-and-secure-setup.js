const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const dbPath = path.join(process.cwd(), 'data', 'broker.db');
const db = new Database(dbPath);

console.log('🔒 SECURE ADMIN SETUP - CLEANUP SCRIPT');
console.log('=====================================\n');

// Function to check current admin users
function listCurrentAdmins() {
  try {
    const admins = db.prepare('SELECT username, created_at FROM users WHERE role = "admin"').all();
    console.log('👥 Current admin users:');
    if (admins.length === 0) {
      console.log('   ✅ No admin users found');
    } else {
      admins.forEach(admin => {
        console.log(`   - ${admin.username} (created: ${admin.created_at})`);
      });
    }
    return admins;
  } catch (error) {
    console.error('❌ Error listing admin users:', error.message);
    return [];
  }
}

// Function to remove hard-coded admin accounts
function removeHardCodedAdmins() {
  try {
    const hardCodedUsernames = ['tedayeerasu', 'admin', 'administrator'];
    let removedCount = 0;
    
    hardCodedUsernames.forEach(username => {
      const user = db.prepare('SELECT username FROM users WHERE username = ?').get(username);
      if (user) {
        db.prepare('DELETE FROM users WHERE username = ?').run(username);
        console.log(`🗑️  Removed hard-coded admin: ${username}`);
        removedCount++;
      }
    });
    
    if (removedCount === 0) {
      console.log('✅ No hard-coded admin accounts found to remove');
    } else {
      console.log(`✅ Removed ${removedCount} hard-coded admin account(s)`);
    }
    
    return removedCount;
  } catch (error) {
    console.error('❌ Error removing hard-coded admins:', error.message);
    return 0;
  }
}

// Function to reset admin setup status
function resetAdminSetup() {
  try {
    // Remove admin setup completion flag
    db.prepare('DELETE FROM system_config WHERE key = "admin_setup_complete"').run();
    console.log('🔄 Reset admin setup status - setup is now available');
    return true;
  } catch (error) {
    console.error('❌ Error resetting admin setup:', error.message);
    return false;
  }
}

// Function to check system configuration table exists
function ensureSystemConfigTable() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS system_config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ System configuration table ready');
    return true;
  } catch (error) {
    console.error('❌ Error creating system config table:', error.message);
    return false;
  }
}

// Main execution
console.log('🔍 Checking current system state...\n');

// Ensure system config table exists
ensureSystemConfigTable();

// List current admins
const currentAdmins = listCurrentAdmins();

console.log('\n🧹 CLEANUP PROCESS');
console.log('==================');

// Remove hard-coded admin accounts
const removedCount = removeHardCodedAdmins();

// Reset admin setup status
const resetSuccess = resetAdminSetup();

console.log('\n📊 CLEANUP SUMMARY');
console.log('==================');
console.log(`✅ Hard-coded admins removed: ${removedCount}`);
console.log(`✅ Admin setup reset: ${resetSuccess ? 'Yes' : 'No'}`);

// Show final state
console.log('\n👥 Final admin user state:');
listCurrentAdmins();

console.log('\n🎯 NEXT STEPS');
console.log('=============');
console.log('1. Update your .env file with secure values:');
console.log('   - JWT_SECRET=your-super-secure-random-string');
console.log('   - ADMIN_SETUP_SECRET=your-admin-setup-secret-key');
console.log('   - ADMIN_SETUP_ENABLED=true');
console.log('');
console.log('2. Start your application:');
console.log('   npm run dev');
console.log('');
console.log('3. Navigate to admin setup:');
console.log('   http://localhost:3000/admin-setup');
console.log('');
console.log('4. Create your secure admin account using the setup secret');
console.log('');
console.log('⚠️  SECURITY NOTES:');
console.log('- Admin setup can only be done once');
console.log('- Keep your setup secret secure');
console.log('- After setup, the setup page will be disabled');
console.log('- No more hard-coded credentials in the system');

// Close database
db.close();

console.log('\n🔒 Cleanup complete! Your system is now secure.');