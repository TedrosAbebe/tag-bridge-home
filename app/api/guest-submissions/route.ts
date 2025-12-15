import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import { join } from 'path'

export async function POST(request: NextRequest) {
  console.log('🏠 GUEST SUBMISSION API CALLED')
  
  try {
    const data = await request.json()
    console.log('📝 Guest submission data:', data.guestName, data.title)

    // Validation
    const requiredFields = [
      'guestName', 'guestPhone', 'guestWhatsapp', 
      'title', 'description', 'price', 'city', 'area', 'type', 'size'
    ]
    
    for (const field of requiredFields) {
      if (!data[field]) {
        console.log(`❌ Missing required field: ${field}`)
        return NextResponse.json({ 
          error: `Missing required field: ${field}` 
        }, { status: 400 })
      }
    }

    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)

    try {
      const propertyId = 'guest-prop-' + Date.now()
      const submissionId = 'sub-' + Date.now()
      
      console.log('💾 Inserting guest property submission...')
      
      // Ensure properties table has images column
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
          status TEXT DEFAULT 'pending',
          submitted_by TEXT,
          guest_name TEXT,
          guest_phone TEXT,
          guest_whatsapp TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Ensure guest_submissions table exists
      db.exec(`
        CREATE TABLE IF NOT EXISTS guest_submissions (
          id TEXT PRIMARY KEY,
          property_id TEXT NOT NULL,
          guest_name TEXT NOT NULL,
          guest_phone TEXT NOT NULL,
          guest_whatsapp TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
        )
      `)

      // Insert property with guest information
      const insertProperty = db.prepare(`
        INSERT INTO properties (
          id, title, description, price, currency, city, area, type, 
          bedrooms, bathrooms, size, features, images, status, submitted_by, 
          guest_name, guest_phone, guest_whatsapp, whatsapp_number, phone_number, owner_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      
      insertProperty.run(
        propertyId,
        data.title,
        data.description,
        parseFloat(data.price),
        data.currency || 'ETB',
        data.city,
        data.area,
        data.type,
        data.bedrooms ? parseInt(data.bedrooms) : null,
        data.bathrooms ? parseInt(data.bathrooms) : null,
        parseFloat(data.size),
        JSON.stringify(data.features || []),
        JSON.stringify(data.images || []),
        'pending', // Status is pending for guest submissions
        'guest',   // Submitted by guest
        data.guestName,
        data.guestPhone,
        data.guestWhatsapp,
        data.guestWhatsapp, // Use guest WhatsApp as property contact
        data.guestPhone,    // Use guest phone as property contact
        'guest-' + Date.now() // Temporary owner ID
      )

      console.log('✅ Property inserted')

      // Insert guest submission record
      const insertSubmission = db.prepare(`
        INSERT INTO guest_submissions (
          id, property_id, guest_name, guest_phone, guest_whatsapp, status
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      
      insertSubmission.run(
        submissionId,
        propertyId,
        data.guestName,
        data.guestPhone,
        data.guestWhatsapp,
        'pending'
      )

      console.log('✅ Guest submission record created')

      return NextResponse.json({
        success: true,
        message: 'Property submitted successfully for review',
        submissionId: submissionId,
        propertyId: propertyId,
        status: 'pending'
      })

    } finally {
      db.close()
    }

  } catch (error) {
    console.error('❌ Guest submission error:', error)
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}

// GET - Fetch guest submissions (admin only)
export async function GET(request: NextRequest) {
  console.log('📋 GUEST SUBMISSIONS LIST API CALLED')
  
  try {
    // This endpoint should be protected by admin authentication
    // For now, we'll implement basic functionality
    
    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)

    try {
      // Get all guest submissions with property details
      const submissions = db.prepare(`
        SELECT 
          gs.*,
          p.title,
          p.description,
          p.price,
          p.city,
          p.area,
          p.type,
          p.size,
          p.status as property_status,
          p.created_at as property_created_at
        FROM guest_submissions gs
        JOIN properties p ON gs.property_id = p.id
        WHERE p.submitted_by = 'guest'
        ORDER BY gs.submission_date DESC
      `).all()

      console.log(`✅ Found ${submissions.length} guest submissions`)

      return NextResponse.json({
        success: true,
        submissions: submissions
      })

    } finally {
      db.close()
    }

  } catch (error) {
    console.error('❌ Guest submissions list error:', error)
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}