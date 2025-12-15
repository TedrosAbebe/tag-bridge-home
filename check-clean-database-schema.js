// Check clean database schema
const Database = require('better-sqlite3');
const path = require('path');

console.log('🔍 CHECKING CLEAN DATABASE SCHEMA...\n');

const dbPath = path.join(__dirname, 'data', 'broker-clean.db');
const db = new Database(dbPath);

try {
  console.log('1️⃣ Properties table schema:');
  const propertiesSchema = db.prepare("PRAGMA table_info(properties)").all();
  propertiesSchema.forEach(col => {
    console.log(`   ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
  });
  
  console.log('\n2️⃣ Users table schema:');
  const usersSchema = db.prepare("PRAGMA table_info(users)").all();
  usersSchema.forEach(col => {
    console.log(`   ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
  });
  
  console.log('\n3️⃣ Payments table schema:');
  const paymentsSchema = db.prepare("PRAGMA table_info(payments)").all();
  paymentsSchema.forEach(col => {
    console.log(`   ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
  });
  
  console.log('\n4️⃣ Sample data:');
  const properties = db.prepare('SELECT id, title, status, created_at FROM properties LIMIT 3').all();
  console.log('Properties:', properties);
  
} catch (error) {
  console.error('❌ Error checking schema:', error.message);
} finally {
  db.close();
}