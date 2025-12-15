const fs = require('fs');

console.log('🔧 Fixing database queries...');

// Read the database file
let content = fs.readFileSync('lib/database.ts', 'utf8');

// Replace all remaining instances of u.name with u.username
content = content.replace(/u\.name/g, 'u.username');

// Also fix u.phone references since we don't have phone column anymore
content = content.replace(/u\.phone/g, 'u.username');

// Write back to file
fs.writeFileSync('lib/database.ts', content);

console.log('✅ Fixed all database queries');
console.log('📝 Replaced u.name -> u.username');
console.log('📝 Replaced u.phone -> u.username');