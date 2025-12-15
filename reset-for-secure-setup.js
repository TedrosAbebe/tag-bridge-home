const Database = require('better-sqlite3');

console.log('🔄 RESETTING DATABASE FOR SECURE SETUP');
console.log('=====================================');

const db = new Database('./broker.db');

try {
  // Remove ALL users (including any old admin accounts)
  console.log('🗑️  Removing all existing users...');
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  console.log(`   Found ${userCount} existing users`);
  
  if (userCount > 0) {
    db.prepare('DELETE FROM users').run();
    console.log('✅ All users removed');
  }
  
  // Remove admin setup completion flag
  console.log('🔄 Resetting admin setup status...');
  db.prepare('DELETE FROM system_config WHERE key = ?').run('admin_setup_complete');
  console.log('✅ Admin setup status reset');
  
  // Verify clean state
  const finalUserCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const setupFlag = db.prepare('SELECT value FROM system_config WHERE key = ?').get('admin_setup_complete');
  
  console.log('\n📊 FINAL STATE:');
  console.log(`   Users in database: ${finalUserCount}`);
  console.log(`   Setup complete flag: ${setupFlag ? setupFlag.value : 'not set'}`);
  
  if (finalUserCount === 0 && !setupFlag) {
    console.log('\n✅ SUCCESS! Database is ready for secure admin setup');
    console.log('\n🎯 Next steps:');
    console.log('   1. Restart your server (Ctrl+C then npm run dev)');
    console.log('   2. Go to: http://localhost:3000/admin-setup');
    console.log('   3. Create your admin account');
  } else {
    console.log('\n❌ Something went wrong. Please check the database state.');
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  db.close();
}