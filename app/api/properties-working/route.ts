import { NextRequest, NextResponse } from 'next/server'
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

export async function GET(request: NextRequest) {
  console.log('🏠 GET PROPERTIES API CALLED')
  
  try {
    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)

    try {
      const properties = db.prepare(`
        SELECT 
          p.*,
          u.username as owner_name,
          u.role as owner_role
        FROM properties p
        LEFT JOIN users u ON p.owner_id = u.id
        WHERE p.status = 'approved'
        ORDER BY p.is_premium DESC, p.created_at DESC
        LIMIT 50
      `).all()

      console.log(`✅ Found ${properties.length} approved properties`)

      const formattedProperties = properties.map((prop: any) => ({
        id: prop.id,
        title: prop.title,
        description: prop.description || 'No description available',
        price: prop.price,
        currency: prop.currency || 'ETB',
        location: {
          city: prop.city,
          area: prop.area
        },
        type: prop.type,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        size: prop.size,
        images: prop.images ? JSON.parse(prop.images) : ['/api/placeholder/400/300'],
        features: prop.features ? JSON.parse(prop.features) : [],
        status: prop.status,
        whatsappNumber: prop.whatsapp_number,
        phoneNumber: prop.phone_number,
        owner_name: prop.owner_name,
        owner_role: prop.owner_role,
        isPremium: Boolean(prop.is_premium),
        created_at: prop.created_at
      }))

      return NextResponse.json({
        success: true,
        properties: formattedProperties
      })

    } finally {
      db.close()
    }

  } catch (error) {
    console.error('❌ GET Properties Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
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
    console.log('📝 Property data:', data.title, data.price, 'Payment:', data.paymentAmount)

    // Validation
    if (!data.title || !data.price || !data.city || !data.area || !data.type || !data.size || !data.whatsappNumber || !data.phoneNumber) {
      console.log('❌ Missing fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)

    try {
      // Ensure properties table has the new columns
      db.exec(`
        CREATE TABLE IF NOT EXISTS properties (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          currency TEXT DEFAULT 'ETB',
          city TEXT NOT NULL,
          area TEXT NOT NULL,
          type TEXT NOT NULL,
          bedrooms INTEGER,
          bathrooms INTEGER,
          size REAL NOT NULL,
          features TEXT,
          owner_id TEXT NOT NULL,
          whatsapp_number TEXT NOT NULL,
          phone_number TEXT NOT NULL,
          images TEXT,
          status TEXT DEFAULT 'pending_payment',
          is_premium BOOLEAN DEFAULT 0,
          payment_amount REAL,
          payment_method TEXT,
          payment_status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      const propertyId = 'prop-' + Date.now()
      
      console.log('💾 Inserting property with payment info...')
      
      const insertProperty = db.prepare(`
        INSERT INTO properties (
          id, title, description, price, currency, city, area, type, 
          bedrooms, bathrooms, size, features, owner_id, whatsapp_number, 
          phone_number, images, status, is_premium, payment_amount, payment_method, payment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      
      try {
        insertProperty.run(
          propertyId,
          data.title,
          data.description || '',
          parseFloat(data.price),
          data.currency || 'ETB',
          data.city,
          data.area,
          data.type,
          data.bedrooms ? parseInt(data.bedrooms) : null,
          data.bathrooms ? parseInt(data.bathrooms) : null,
          parseFloat(data.size),
          JSON.stringify(data.features || []),
          user.id,
          data.whatsappNumber,
          data.phoneNumber,
          JSON.stringify(data.images || []),
          'pending',
          data.isPremium ? 1 : 0,
          data.paymentAmount || 0,
          data.paymentMethod || 'cbe',
          'pending_confirmation'
        )
      } catch (insertError) {
        console.error('❌ Property insert error:', insertError)
        console.error('Data being inserted:', {
          propertyId,
          title: data.title,
          price: parseFloat(data.price),
          currency: data.currency || 'ETB',
          city: data.city,
          area: data.area,
          type: data.type,
          bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
          bathrooms: data.bathrooms ? parseInt(data.bathrooms) : null,
          size: parseFloat(data.size),
          features: JSON.stringify(data.features || []),
          userId: user.id,
          whatsappNumber: data.whatsappNumber,
          phoneNumber: data.phoneNumber,
          isPremium: data.isPremium ? 1 : 0,
          paymentAmount: data.paymentAmount || 0,
          paymentMethod: data.paymentMethod || 'cbe'
        })
        throw insertError
      }

      console.log('✅ Property inserted with payment info')

      // Create payment record
      db.exec(`
        CREATE TABLE IF NOT EXISTS payments (
          id TEXT PRIMARY KEY,
          property_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          amount REAL NOT NULL,
          payment_type TEXT NOT NULL,
          payment_method TEXT,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      const paymentId = 'pay-' + Date.now()
      
      const insertPayment = db.prepare(`
        INSERT INTO payments (id, property_id, user_id, amount, payment_type, payment_method, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      
      insertPayment.run(
        paymentId,
        propertyId,
        user.id,
        data.paymentAmount || 0,
        data.listingType === 'premium' ? 'premium_listing' : 'basic_listing',
        data.paymentMethod || 'cbe',
        'awaiting_payment'
      )

      console.log('✅ Payment record created')

      return NextResponse.json({
        success: true,
        property: { 
          id: propertyId, 
          status: 'pending',
          isPremium: data.isPremium || false
        },
        payment: {
          id: paymentId,
          amount: data.paymentAmount || 0,
          method: data.paymentMethod || 'cbe',
          accountInfo: data.paymentMethod === 'telebirr' ? '0991856292' : '1000200450705'
        }
      })

    } finally {
      db.close()
    }

  } catch (error) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}