const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'broker-clean.db');
const db = new Database(dbPath);

console.log('🔍 Checking properties table schema...');

// Check the properties table schema
const schema = db.prepare('PRAGMA table_info(properties)').all();
console.log('\nProperties table columns:');
schema.forEach(col => {
  console.log(`- ${col.name}: ${col.type}`);
});

// Check if any properties have descriptions
console.log('\n📝 Sample properties with descriptions:');
const properties = db.prepare('SELECT id, title, description FROM properties LIMIT 5').all();
properties.forEach(prop => {
  console.log(`\nID: ${prop.id}`);
  console.log(`Title: ${prop.title}`);
  console.log(`Description: ${prop.description || 'NULL/EMPTY'}`);
});

db.close();
console.log('\n✅ Database check complete');