const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'broker-clean.db');
const db = new Database(dbPath);

console.log('🔧 Setting up Guest Property Submission Schema...');

try {
  // Add guest submission fields to properties table
  console.log('\n1️⃣ Adding guest submission columns...');
  
  const columnsToAdd = [
    'submitted_by TEXT DEFAULT "user"',
    'guest_name TEXT',
    'guest_phone TEXT',
    'guest_whatsapp TEXT',
    'rejection_reason TEXT',
    'admin_notes TEXT'
  ];
  
  columnsToAdd.forEach(column => {
    try {
      db.exec(`ALTER TABLE properties ADD COLUMN ${column}`);
      console.log(`✅ Added column: ${column.split(' ')[0]}`);
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log(`ℹ️  Column already exists: ${column.split(' ')[0]}`);
      } else {
        console.error(`❌ Error adding ${column}:`, error.message);
      }
    }
  });
  
  // Create guest_submissions table for better tracking
  console.log('\n2️⃣ Creating guest_submissions table...');
  
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS guest_submissions (
        id TEXT PRIMARY KEY,
        property_id TEXT,
        guest_name TEXT NOT NULL,
        guest_phone TEXT NOT NULL,
        guest_whatsapp TEXT NOT NULL,
        submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        admin_contacted BOOLEAN DEFAULT FALSE,
        admin_contact_date DATETIME,
        admin_notes TEXT,
        status TEXT DEFAULT 'pending',
        FOREIGN KEY (property_id) REFERENCES properties (id)
      )
    `);
    console.log('✅ Guest submissions table created');
  } catch (error) {
    console.log('ℹ️  Guest submissions table already exists');
  }
  
  // Update existing properties to have proper submitted_by values
  console.log('\n3️⃣ Updating existing properties...');
  
  const updateExisting = db.prepare(`
    UPDATE properties 
    SET submitted_by = 'user' 
    WHERE submitted_by IS NULL OR submitted_by = ''
  `);
  
  const result = updateExisting.run();
  console.log(`✅ Updated ${result.changes} existing properties`);
  
  // Show updated schema
  console.log('\n4️⃣ Updated properties table schema:');
  const schema = db.prepare('PRAGMA table_info(properties)').all();
  schema.forEach(col => {
    console.log(`- ${col.name}: ${col.type} ${col.dflt_value ? `(default: ${col.dflt_value})` : ''}`);
  });
  
  console.log('\n5️⃣ Guest submissions table schema:');
  const guestSchema = db.prepare('PRAGMA table_info(guest_submissions)').all();
  guestSchema.forEach(col => {
    console.log(`- ${col.name}: ${col.type} ${col.dflt_value ? `(default: ${col.dflt_value})` : ''}`);
  });
  
  console.log('\n🎉 Guest submission schema setup complete!');
  
} catch (error) {
  console.error('❌ Schema setup error:', error.message);
} finally {
  db.close();
}