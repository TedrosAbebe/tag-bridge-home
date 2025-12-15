const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Initialize database
const dbPath = path.join(process.cwd(), 'broker.db');
const db = new Database(dbPath);

console.log('🔒 Setting up new admin credentials...\n');

// Function to create new admin user
function createNewAdmin(username, password) {
  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    
    // Check if username already exists
    const existingUser = db.prepare('SELECT username FROM users WHERE username = ?').get(username);
    if (existingUser) {
      console.log(`❌ Username "${username}" already exists. Please choose a different username.`);
      return false;
    }
    
    // Insert new admin user
    const insertUser = db.prepare(`
      INSERT INTO users (username, password_hash, role, created_at) 
      VALUES (?, ?, 'admin', CURRENT_TIMESTAMP)
    `);
    
    insertUser.run(username, hashedPassword);
    console.log(`✅ New admin user "${username}" created successfully!`);
    return true;
    
  } catch (error) {
    console.error('❌ Error creating new admin:', error.message);
    return false;
  }
}

// Function to delete old admin user
function deleteOldAdmin() {
  try {
    // Check if tedayeerasu exists
    const oldAdmin = db.prepare('SELECT username FROM users WHERE username = ?').get('tedayeerasu');
    if (!oldAdmin) {
      console.log('ℹ️  Old admin user "tedayeerasu" not found (already deleted or never existed)');
      return true;
    }
    
    // Delete the old admin user
    const deleteUser = db.prepare('DELETE FROM users WHERE username = ?');
    deleteUser.run('tedayeerasu');
    console.log('✅ Old admin user "tedayeerasu" deleted successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Error deleting old admin:', error.message);
    return false;
  }
}

// Function to list all admin users
function listAdminUsers() {
  try {
    const admins = db.prepare('SELECT username, created_at FROM users WHERE role = "admin"').all();
    console.log('\n👥 Current admin users:');
    if (admins.length === 0) {
      console.log('   No admin users found');
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

// Main execution
console.log('🔐 SECURE ADMIN SETUP');
console.log('====================\n');

// Show current admin users
listAdminUsers();

console.log('\n📋 INSTRUCTIONS:');
console.log('1. First, create your new admin account through the admin dashboard');
console.log('2. Test login with your new credentials');
console.log('3. Then run this script to remove the default admin');
console.log('\n⚠️  IMPORTANT: Make sure you can login with your new admin account before deleting the old one!\n');

// Interactive mode (you can modify this section)
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Do you want to delete the default admin "tedayeerasu" now? (yes/no): ', (answer) => {
  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
    console.log('\n🗑️  Deleting default admin user...');
    
    if (deleteOldAdmin()) {
      console.log('\n✅ SUCCESS! Default admin user has been removed.');
      console.log('🔒 Your system is now more secure.');
      
      // Show updated admin list
      listAdminUsers();
      
      console.log('\n📝 SECURITY CHECKLIST:');
      console.log('✅ Default admin credentials removed');
      console.log('✅ Only your custom admin account remains');
      console.log('✅ System is ready for production deployment');
      
    } else {
      console.log('\n❌ Failed to delete default admin user.');
      console.log('Please check the error messages above.');
    }
  } else {
    console.log('\n⏸️  Operation cancelled. Default admin user remains.');
    console.log('💡 You can run this script again when ready.');
  }
  
  rl.close();
  db.close();
});

// Export functions for manual use
module.exports = {
  createNewAdmin,
  deleteOldAdmin,
  listAdminUsers
};