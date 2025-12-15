const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'broker-clean.db');
const db = new Database(dbPath);

console.log('🔧 Adding description column to properties table...');

try {
  // Add description column to properties table
  db.exec('ALTER TABLE properties ADD COLUMN description TEXT');
  console.log('✅ Description column added successfully');
  
  // Verify the column was added
  const schema = db.prepare('PRAGMA table_info(properties)').all();
  console.log('\nUpdated properties table columns:');
  schema.forEach(col => {
    console.log(`- ${col.name}: ${col.type}`);
  });
  
  // Update existing properties with sample descriptions
  const properties = db.prepare('SELECT id, title FROM properties').all();
  console.log(`\n📝 Updating ${properties.length} existing properties with descriptions...`);
  
  const updateDescription = db.prepare('UPDATE properties SET description = ? WHERE id = ?');
  
  properties.forEach(prop => {
    const sampleDescription = `This is a beautiful ${prop.title.toLowerCase()}. Located in a prime area with excellent amenities and easy access to transportation. Perfect for families or professionals looking for quality accommodation.`;
    updateDescription.run(sampleDescription, prop.id);
    console.log(`✅ Updated ${prop.id}: ${prop.title}`);
  });
  
  console.log('\n🎉 All properties now have descriptions!');
  
} catch (error) {
  if (error.message.includes('duplicate column name')) {
    console.log('ℹ️  Description column already exists');
  } else {
    console.error('❌ Error:', error.message);
  }
} finally {
  db.close();
}