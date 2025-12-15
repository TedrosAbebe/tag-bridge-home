// Create a test property for approval testing
const Database = require('better-sqlite3');
const path = require('path');

console.log('🏠 CREATING TEST PROPERTY FOR APPROVAL...\n');

const dbPath = path.join(__dirname, 'data', 'broker-clean.db');
const db = new Database(dbPath);

try {
  const testPropertyId = 'test-approval-' + Date.now();
  
  console.log('Creating property with ID:', testPropertyId);
  
  db.prepare(`
    INSERT INTO properties (
      id, title, price, city, area, type, size, 
      owner_id, whatsapp_number, phone_number, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    testPropertyId,
    'Test Property Awaiting Approval',
    250000,
    'Addis Ababa',
    'Kazanchis',
    'house',
    180,
    'broker1', // owner_id
    '+251911111111',
    '+251911111111',
    'pending_payment',
    new Date().toISOString()
  );
  
  console.log('✅ Test property created successfully!');
  console.log('Property ID:', testPropertyId);
  console.log('Status: pending_payment');
  console.log('Owner: broker1');
  
  // Verify creation
  const created = db.prepare('SELECT * FROM properties WHERE id = ?').get(testPropertyId);
  console.log('\nVerification:', created);
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  db.close();
}