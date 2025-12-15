import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import { join } from 'path'
import { getUserFromToken } from '../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🏠 Simple property creation API called')
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      console.log('❌ No token provided')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.log('🔐 Verifying token...')
    const user = getUserFromToken(token)
    if (!user) {
      console.log('❌ Invalid token')
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    console.log('✅ User authenticated:', user.username, '(' + user.role + ')')

    const {
      title,
      description,
      price,
      currency = 'ETB',
      city,
      area,
      type,
      bedrooms,
      bathrooms,
      size,
      features,
      whatsappNumber,
      phoneNumber
    } = await request.json()

    console.log('📝 Property data received:', { title, price, city, area, type })

    // Validation
    if (!title || !price || !city || !area || !type || !size || !whatsappNumber || !phoneNumber) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('💾 Creating database connection...')
    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)

    try {
      const propertyId = 'property-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
      
      console.log('🏠 Inserting property with ID:', propertyId)
      
      // Direct SQL insert
      const insertProperty = db.prepare(`
        INSERT INTO properties (
          id, title, description, price, currency, city, area, 
          type, bedrooms, bathrooms, size, features, owner_id, 
          whatsapp_number, phone_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      
      const result = insertProperty.run(
        propertyId,
        title,
        description || '',
        parseFloat(price),
        currency,
        city,
        area,
        type,
        bedrooms ? parseInt(bedrooms) : null,
        bathrooms ? parseInt(bathrooms) : null,
        parseFloat(size),
        JSON.stringify(features || []),
        user.id,
        whatsappNumber,
        phoneNumber
      )

      console.log('✅ Property inserted successfully, changes:', result.changes)

      // Create simple payment record
      const paymentId = 'payment-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
      const amount = type === 'house_rent' ? 25 : 50
      const paymentType = type === 'house_rent' ? 'rent_listing' : 'sale_listing'

      console.log('💳 Creating payment record...')
      
      const insertPayment = db.prepare(`
        INSERT INTO payments (id, property_id, user_id, amount, payment_type)
        VALUES (?, ?, ?, ?, ?)
      `)
      
      const paymentResult = insertPayment.run(
        paymentId,
        propertyId,
        user.id,
        amount,
        paymentType
      )

      console.log('✅ Payment record created, changes:', paymentResult.changes)

      db.close()

      const paymentInfo = {
        id: paymentId,
        propertyId,
        userId: user.id,
        amount,
        paymentType,
        status: 'pending',
        bankAccountPlaceholder: 'Commercial Bank of Ethiopia - Account: 1000123456789',
        whatsappContactPlaceholder: '+251911234567'
      }

      console.log('🎉 Property creation completed successfully!')

      return NextResponse.json({
        success: true,
        property: {
          id: propertyId,
          status: 'pending_payment'
        },
        payment: paymentInfo
      })

    } finally {
      db.close()
    }

  } catch (error) {
    console.error('❌ Error creating property:', error)
    console.error('❌ Error message:', error.message)
    console.error('❌ Error code:', error.code)
    console.error('❌ Error stack:', error.stack)
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    )
  }
}