// Add sample properties for admin testing
const Database = require('better-sqlite3');
const path = require('path');

console.log('🏠 ADDING SAMPLE PROPERTIES FOR ADMIN TESTING...\n');

const dbPath = path.join(__dirname, 'data', 'broker-clean.db');
const db = new Database(dbPath);

try {
  // Get broker user ID
  const broker = db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get('broker');
  
  if (!broker) {
    console.log('❌ No broker user found');
    return;
  }
  
  console.log('✅ Using broker ID:', broker.id);
  
  // Sample properties
  const sampleProperties = [
    {
      id: 'sample-1-' + Date.now(),
      title: 'Modern 3BR House in Bole',
      price: 2500000,
      city: 'Addis Ababa',
      area: 'Bole',
      type: 'house_sale',
      size: 200,
      status: 'pending_payment'
    },
    {
      id: 'sample-2-' + Date.now(),
      title: 'Luxury Apartment for Rent',
      price: 15000,
      city: 'Addis Ababa',
      area: 'Kazanchis',
      type: 'house_rent',
      size: 120,
      status: 'pending'
    },
    {
      id: 'sample-3-' + Date.now(),
      title: 'Commercial Land in CMC',
      price: 5000000,
      city: 'Addis Ababa',
      area: 'CMC',
      type: 'land',
      size: 500,
      status: 'pending_payment'
    },
    {
      id: 'sample-4-' + Date.now(),
      title: 'Family House in Megenagna',
      price: 1800000,
      city: 'Addis Ababa',
      area: 'Megenagna',
      type: 'house_sale',
      size: 180,
      status: 'pending'
    }
  ];
  
  const insertProperty = db.prepare(`
    INSERT INTO properties (
      id, title, price, city, area, type, size, owner_id, 
      whatsapp_number, phone_number, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);
  
  console.log('📝 Adding sample properties...');
  
  sampleProperties.forEach((prop, index) => {
    insertProperty.run(
      prop.id,
      prop.title,
      prop.price,
      prop.city,
      prop.area,
      prop.type,
      prop.size,
      broker.id,
      '+251911234567',
      '+251911234567',
      prop.status
    );
    
    console.log(`✅ Added: ${prop.title} (${prop.status})`);
  });
  
  // Also create corresponding payments
  const insertPayment = db.prepare(`
    INSERT INTO payments (id, property_id, user_id, amount, payment_type, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  console.log('\n💳 Adding sample payments...');
  
  sampleProperties.forEach((prop, index) => {
    const paymentId = 'payment-' + prop.id;
    const amount = prop.type === 'house_rent' ? 25 : 50;
    const paymentType = prop.type === 'house_rent' ? 'rent_listing' : 'sale_listing';
    
    insertPayment.run(
      paymentId,
      prop.id,
      broker.id,
      amount,
      paymentType,
      'pending'
    );
    
    console.log(`✅ Payment created for: ${prop.title} (${amount} ETB)`);
  });
  
  // Verify data
  const totalProperties = db.prepare('SELECT COUNT(*) as count FROM properties').get();
  const pendingProperties = db.prepare('SELECT COUNT(*) as count FROM properties WHERE status IN (?, ?)').get('pending', 'pending_payment');
  
  console.log('\n🎯 SAMPLE DATA ADDED SUCCESSFULLY!');
  console.log('================================');
  console.log('✅ Total properties in database:', totalProperties.count);
  console.log('✅ Pending properties for admin review:', pendingProperties.count);
  
  console.log('\n🚀 TESTING INSTRUCTIONS:');
  console.log('1. Login as admin/admin123');
  console.log('2. Go to Admin Dashboard');
  console.log('3. You should see', pendingProperties.count, 'properties pending approval');
  console.log('4. Click Approve or Reject buttons to test functionality');
  
} catch (error) {
  console.error('❌ Error adding sample properties:', error.message);
} finally {
  db.close();
}