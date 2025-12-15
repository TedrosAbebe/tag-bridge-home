const Database = require('better-sqlite3');
const db = new Database('./data/broker.db');

console.log('📊 Checking users in database...\n');

try {
  const users = db.prepare('SELECT * FROM users').all();
  
  if (users.length === 0) {
    console.log('❌ No users found in database!');
  } else {
    console.log(`✅ Found ${users.length} users:`);
    users.forEach((user, i) => {
      console.log(`   ${i + 1}. Username: "${user.username}", Role: "${user.role}", ID: ${user.id}`);
    });
  }
  
  console.log('\n🔐 Valid login credentials:');
  users.forEach((user) => {
    if (user.role === 'admin') {
      console.log(`   👑 Admin: username="${user.username}", password="admin123"`);
    } else if (user.role === 'broker') {
      console.log(`   🏢 Broker: username="${user.username}", password="broker123"`);
    } else {
      console.log(`   👤 User: username="${user.username}", password="user123"`);
    }
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
}

db.close();