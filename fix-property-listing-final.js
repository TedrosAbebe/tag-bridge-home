// FINAL FIX - Complete property listing solution
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

console.log('🔥 FINAL FIX - PROPERTY LISTING SOLUTION\n');

// 1. Create a completely clean database
const dbPath = path.join(__dirname, 'data', 'broker-clean.db');
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);

try {
  console.log('1️⃣ Creating minimal database schema...');
  
  // Users table
  db.exec(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    )
  `);
  
  // Properties table
  db.exec(`
    CREATE TABLE properties (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      city TEXT NOT NULL,
      area TEXT NOT NULL,
      type TEXT NOT NULL,
      size REAL NOT NULL,
      owner_id TEXT NOT NULL,
      whatsapp_number TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      status TEXT DEFAULT 'pending_payment',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Payments table
  db.exec(`
    CREATE TABLE payments (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      amount REAL NOT NULL,
      payment_type TEXT NOT NULL,
      status TEXT DEFAULT 'pending'
    )
  `);
  
  console.log('2️⃣ Creating test users...');
  
  const bcrypt = require('bcryptjs');
  
  // Create users
  const insertUser = db.prepare('INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)');
  insertUser.run('admin-1', 'admin', bcrypt.hashSync('admin123', 10), 'admin');
  insertUser.run('broker-1', 'broker1', bcrypt.hashSync('broker123', 10), 'broker');
  insertUser.run('user-1', 'testuser', bcrypt.hashSync('user123', 10), 'user');
  
  console.log('3️⃣ Testing property creation...');
  
  // Test property creation
  const insertProperty = db.prepare(`
    INSERT INTO properties (id, title, price, city, area, type, size, owner_id, whatsapp_number, phone_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const testResult = insertProperty.run(
    'test-prop-1',
    'Test Property',
    200000,
    'Addis Ababa',
    'Bole',
    'house_sale',
    150,
    'broker-1',
    '+251911234567',
    '+251911234567'
  );
  
  console.log('✅ Property created, changes:', testResult.changes);
  
  // Test payment creation
  const insertPayment = db.prepare(`
    INSERT INTO payments (id, property_id, user_id, amount, payment_type)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const paymentResult = insertPayment.run(
    'test-payment-1',
    'test-prop-1',
    'broker-1',
    50,
    'sale_listing'
  );
  
  console.log('✅ Payment created, changes:', paymentResult.changes);
  
  // Verify data
  const properties = db.prepare('SELECT * FROM properties').all();
  const payments = db.prepare('SELECT * FROM payments').all();
  
  console.log('✅ Properties in DB:', properties.length);
  console.log('✅ Payments in DB:', payments.length);
  
  db.close();
  
  console.log('\n4️⃣ Creating working API file...');
  
  // Create a working API file
  const apiContent = `import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import { join } from 'path'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

function getUserFromToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    }
  } catch (error) {
    return null
  }
}

export async function POST(request: NextRequest) {
  console.log('🏠 WORKING PROPERTY API CALLED')
  
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      console.log('❌ No token')
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = getUserFromToken(token)
    if (!user) {
      console.log('❌ Invalid token')
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    console.log('✅ User authenticated:', user.username)

    const data = await request.json()
    console.log('📝 Property data:', data.title, data.price)

    // Validation
    if (!data.title || !data.price || !data.city || !data.area || !data.type || !data.size || !data.whatsappNumber || !data.phoneNumber) {
      console.log('❌ Missing fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const dbPath = join(process.cwd(), 'data', 'broker-clean.db')
    const db = new Database(dbPath)

    try {
      const propertyId = 'prop-' + Date.now()
      
      console.log('💾 Inserting property...')
      
      const insertProperty = db.prepare(\`
        INSERT INTO properties (id, title, price, city, area, type, size, owner_id, whatsapp_number, phone_number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      \`)
      
      insertProperty.run(
        propertyId,
        data.title,
        parseFloat(data.price),
        data.city,
        data.area,
        data.type,
        parseFloat(data.size),
        user.id,
        data.whatsappNumber,
        data.phoneNumber
      )

      console.log('✅ Property inserted')

      // Create payment
      const paymentId = 'pay-' + Date.now()
      const amount = data.type === 'house_rent' ? 25 : 50
      
      const insertPayment = db.prepare(\`
        INSERT INTO payments (id, property_id, user_id, amount, payment_type)
        VALUES (?, ?, ?, ?, ?)
      \`)
      
      insertPayment.run(
        paymentId,
        propertyId,
        user.id,
        amount,
        data.type === 'house_rent' ? 'rent_listing' : 'sale_listing'
      )

      console.log('✅ Payment created')

      return NextResponse.json({
        success: true,
        property: { id: propertyId, status: 'pending_payment' },
        payment: {
          id: paymentId,
          amount,
          bankAccountPlaceholder: 'Commercial Bank - 1000123456789',
          whatsappContactPlaceholder: '+251911234567'
        }
      })

    } finally {
      db.close()
    }

  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}`;

  fs.writeFileSync(path.join(__dirname, 'app/api/properties-working/route.ts'), apiContent);
  
  console.log('5️⃣ Updating broker page...');
  
  // Update broker add-listing page
  const brokerPagePath = path.join(__dirname, 'app/broker/add-listing/page.tsx');
  let brokerContent = fs.readFileSync(brokerPagePath, 'utf8');
  brokerContent = brokerContent.replace('/api/properties-simple', '/api/properties-working');
  fs.writeFileSync(brokerPagePath, brokerContent);
  
  console.log('\n🎉 FINAL FIX COMPLETE!');
  console.log('================================');
  console.log('✅ Clean database created: broker-clean.db');
  console.log('✅ Working API created: /api/properties-working');
  console.log('✅ Broker page updated');
  console.log('✅ Test data verified');
  
  console.log('\n🚀 TESTING INSTRUCTIONS:');
  console.log('1. Restart the server: npm run dev');
  console.log('2. Login as broker1/broker123');
  console.log('3. Go to /broker/add-listing');
  console.log('4. Fill form and submit');
  console.log('5. Should work now!');
  
} catch (error) {
  console.error('❌ Fix failed:', error.message);
}