const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'broker-clean.db');
const db = new Database(dbPath);

console.log('🔧 Manually approving recent properties...');

try {
  // Get recent properties that are pending
  const pendingProperties = db.prepare(`
    SELECT id, title, status, created_at 
    FROM properties 
    WHERE status = 'pending_payment' 
    ORDER BY created_at DESC 
    LIMIT 5
  `).all();
  
  console.log(`Found ${pendingProperties.length} pending properties:`);
  pendingProperties.forEach(prop => {
    console.log(`- ${prop.id}: ${prop.title} (${prop.status})`);
  });
  
  if (pendingProperties.length > 0) {
    // Approve the most recent property
    const propertyToApprove = pendingProperties[0];
    
    const updateStatus = db.prepare('UPDATE properties SET status = ? WHERE id = ?');
    updateStatus.run('approved', propertyToApprove.id);
    
    console.log(`\n✅ Approved property: ${propertyToApprove.id}`);
    console.log(`Title: ${propertyToApprove.title}`);
    
    // Check the description
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(propertyToApprove.id);
    console.log(`Description: ${property.description || 'No description'}`);
    
    console.log(`\n🔗 You can now view this property at:`);
    console.log(`http://localhost:3000/property/${propertyToApprove.id}`);
    
    return propertyToApprove.id;
  } else {
    console.log('No pending properties found');
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  db.close();
}